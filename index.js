const login = require('@dongdev/fca-unofficial');
const fs = require('fs');
const path = require('path');

const config = JSON.parse(fs.readFileSync('./data/config.json', 'utf8'));
const commands = new Map();
const cooldowns = new Map();

console.log('┌────────────────────────────────────┐');
console.log('│   MESSENGER BOT ĐANG KHỞI ĐỘNG    │');
console.log('└────────────────────────────────────┘');

function loadModules() {
    const modulesPath = path.join(__dirname, 'modules');
    const moduleFiles = fs.readdirSync(modulesPath).filter(file => file.endsWith('.js'));
    
    console.log(`\n[MODULES] Đang tải ${moduleFiles.length} modules...`);
    
    for (const file of moduleFiles) {
        try {
            const modulePath = path.join(modulesPath, file);
            delete require.cache[require.resolve(modulePath)];
            const module = require(modulePath);
            
            if (module.config && module.config.name) {
                commands.set(module.config.name.toLowerCase(), module);
                console.log(`  ✓ ${module.config.name} - ${module.config.description || 'Không có mô tả'}`);
            }
        } catch (error) {
            console.error(`  ✗ Lỗi khi tải ${file}:`, error.message);
        }
    }
    
    console.log(`[MODULES] Đã tải thành công ${commands.size} modules\n`);
}

function getLoginCredentials() {
    const appstatePath = './appstate.json';
    const cookiePath = './cookie.txt';
    
    if (fs.existsSync(appstatePath)) {
        try {
            const appState = JSON.parse(fs.readFileSync(appstatePath, 'utf8'));
            if (appState && appState.length > 0) {
                console.log('[LOGIN] Sử dụng appstate.json để đăng nhập...');
                return { appState };
            }
        } catch (error) {
            console.log('[LOGIN] Không thể đọc appstate.json:', error.message);
        }
    }
    
    if (fs.existsSync(cookiePath)) {
        const cookie = fs.readFileSync(cookiePath, 'utf8').trim();
        if (cookie && !cookie.startsWith('#')) {
            console.log('[LOGIN] Sử dụng cookie.txt để đăng nhập...');
            return { email: cookie };
        }
    }
    
    console.error('[LOGIN] Không tìm thấy appstate.json hoặc cookie.txt hợp lệ!');
    console.log('\n📌 Hướng dẫn:');
    console.log('1. Thêm appstate.json vào thư mục gốc, hoặc');
    console.log('2. Thêm cookie Facebook vào file cookie.txt\n');
    process.exit(1);
}

loadModules();

const credentials = getLoginCredentials();

login(credentials, (err, api) => {
    if (err) {
        console.error('[LOGIN] Lỗi đăng nhập:', err);
        return process.exit(1);
    }

    console.log('┌────────────────────────────────────┐');
    console.log('│     BOT ĐÃ ĐĂNG NHẬP THÀNH CÔNG   │');
    console.log('└────────────────────────────────────┘\n');

    if (credentials.appState) {
        fs.writeFileSync('./appstate.json', JSON.stringify(api.getAppState(), null, 2));
        console.log('[APPSTATE] Đã cập nhật appstate.json');
    }

    api.setOptions({
        listenEvents: true,
        selfListen: false,
        updatePresence: false,
        autoMarkRead: false,
        autoMarkDelivery: false,
        forceLogin: true,
        online: false,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    
    console.log('[ANTI-CHECKPOINT] Đã kích hoạt chế độ chống checkpoint');
    console.log('[ANTI-CHECKPOINT] • Auto Mark Read: OFF');
    console.log('[ANTI-CHECKPOINT] • Auto Mark Delivery: OFF');
    console.log('[ANTI-CHECKPOINT] • Update Presence: OFF');
    console.log('[ANTI-CHECKPOINT] • Force Login: ON\n');

    const listenEmitter = api.listenMqtt((err, event) => {
        if (err) {
            console.error('[LISTEN] Lỗi:', err);
            return;
        }

        handleEvent(api, event);
    });

    console.log(`[BOT] Prefix: ${config.prefix}`);
    console.log(`[BOT] Admin ID: ${config.adminID}`);
    console.log('[BOT] Đang lắng nghe tin nhắn...\n');
});

function handleEvent(api, event) {
    if (event.type === 'message' || event.type === 'message_reply') {
        const message = event.body || '';
        const senderID = event.senderID;
        const threadID = event.threadID;
        const messageID = event.messageID;

        if (!event.isGroup && senderID === api.getCurrentUserID()) return;

        if (message.startsWith(config.prefix)) {
            const args = message.slice(config.prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();
            const command = commands.get(commandName);

            if (command) {
                try {
                    const now = Date.now();
                    const cooldownKey = `${senderID}_${commandName}`;
                    const cooldownAmount = (command.config.cooldown || 3) * 1000;

                    if (cooldowns.has(cooldownKey)) {
                        const expirationTime = cooldowns.get(cooldownKey) + cooldownAmount;
                        if (now < expirationTime) {
                            const timeLeft = ((expirationTime - now) / 1000).toFixed(1);
                            return api.sendMessage(`⏱️ Vui lòng đợi ${timeLeft}s trước khi dùng lệnh này.`, threadID);
                        }
                    }

                    cooldowns.set(cooldownKey, now);
                    setTimeout(() => cooldowns.delete(cooldownKey), cooldownAmount);

                    if (command.config.adminOnly && senderID !== config.adminID) {
                        return api.sendMessage('❌ Chỉ admin mới có thể sử dụng lệnh này!', threadID);
                    }

                    console.log(`[CMD] ${commandName} - User: ${senderID} - Thread: ${threadID}`);

                    command.run({ api, event, args, config, commands });
                } catch (error) {
                    console.error(`[ERROR] Lỗi khi chạy lệnh ${commandName}:`, error);
                    api.sendMessage('❌ Đã xảy ra lỗi khi thực hiện lệnh!', threadID);
                }
            }
        }

        const messageReplyHandlers = Array.from(commands.values()).filter(cmd => cmd.handleReply);
        for (const handler of messageReplyHandlers) {
            try {
                handler.handleReply({ api, event, config, commands });
            } catch (error) {
                console.error('[ERROR] Lỗi handleReply:', error);
            }
        }
    }
}

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});
