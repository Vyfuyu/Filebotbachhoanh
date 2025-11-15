const fs = require('fs');
const path = require('path');

const pendingReplies = new Map();

module.exports = {
    config: {
        name: 'menu',
        version: '2.0.0',
        author: 'Admin',
        cooldown: 3,
        category: 'Hệ thống',
        description: 'Hiển thị menu lệnh theo danh mục',
        adminOnly: false
    },

    run: async ({ api, event, args, commands }) => {
        const { threadID, messageID, senderID } = event;

        if (args[0] === 'all') {
            return showAllCommands(api, threadID, commands);
        }

        if (args[0] === 'addvideo' || args[0] === 'addimage') {
            return handleAddMedia(api, event, args);
        }

        if (args[0] === 'delvideo' || args[0] === 'delimage') {
            return handleDeleteMedia(api, event, args);
        }

        if (args[0] === 'listmedia') {
            return handleListMedia(api, threadID);
        }

        const categories = getCategories(commands);
        const media = loadMedia();
        
        let msg = '╔════════════════════════╗\n';
        msg += '║      📋 MENU DANH MỤC     ║\n';
        msg += '╚════════════════════════╝\n\n';
        
        const categoryList = Object.keys(categories);
        categoryList.forEach((cat, index) => {
            const count = categories[cat].length;
            msg += `${index + 1}. ${getCategoryIcon(cat)} ${cat} (${count} lệnh)\n`;
        });
        
        msg += '\n━━━━━━━━━━━━━━━━━━━━━━\n';
        msg += '💡 Reply số để xem chi tiết danh mục\n';
        msg += `📌 Dùng %menu all để xem tất cả\n`;
        msg += `🎬 Dùng %menu addvideo <link> để thêm video\n`;
        msg += `🖼️ Dùng %menu addimage <link> để thêm ảnh\n`;
        msg += `🗑️ Dùng %menu delvideo <số> để xóa video\n`;
        msg += `📊 Dùng %menu listmedia để xem media\n`;
        msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
        msg += `📊 Tổng: ${commands.size} lệnh | ${categoryList.length} danh mục`;

        const attachment = await getRandomMedia(api, media);
        
        api.sendMessage({
            body: msg,
            attachment: attachment
        }, threadID, (err, info) => {
            if (!err) {
                pendingReplies.set(senderID, {
                    type: 'category_select',
                    categories: categoryList,
                    menuMessageID: info.messageID,
                    timestamp: Date.now()
                });
            }
        });
    },

    handleReply: async ({ api, event, commands }) => {
        const { senderID, threadID, body, messageID, messageReply } = event;
        
        if (!pendingReplies.has(senderID)) return;
        
        const replyData = pendingReplies.get(senderID);
        
        if (Date.now() - replyData.timestamp > 60000) {
            pendingReplies.delete(senderID);
            return;
        }

        if (replyData.type === 'category_select') {
            const choice = parseInt(body);
            
            if (isNaN(choice) || choice < 1 || choice > replyData.categories.length) {
                return api.sendMessage('❌ Số không hợp lệ! Vui lòng chọn lại.', threadID);
            }

            const selectedCategory = replyData.categories[choice - 1];
            const menuMessageID = replyData.menuMessageID;
            pendingReplies.delete(senderID);
            
            if (menuMessageID) {
                api.unsendMessage(menuMessageID);
            }
            api.unsendMessage(messageID);
            
            showCategoryCommands(api, threadID, selectedCategory, commands);
        } else if (replyData.type === 'media_delete') {
            const choice = parseInt(body);
            const mediaType = replyData.mediaType;
            const promptMessageID = replyData.promptMessageID;
            
            pendingReplies.delete(senderID);
            
            const media = loadMedia();
            const list = media[mediaType];
            
            if (isNaN(choice) || choice < 1 || choice > list.length) {
                return api.sendMessage('❌ Số không hợp lệ!', threadID);
            }
            
            if (promptMessageID) {
                api.unsendMessage(promptMessageID);
            }
            api.unsendMessage(messageID);
            
            list.splice(choice - 1, 1);
            saveMedia(media);
            
            api.sendMessage(`✅ Đã xóa ${mediaType === 'videos' ? 'video' : 'ảnh'} thành công!`, threadID);
        }
    }
};

function getCategories(commands) {
    const categories = {};
    
    commands.forEach(cmd => {
        const category = cmd.config.category || 'Khác';
        if (!categories[category]) {
            categories[category] = [];
        }
        categories[category].push(cmd);
    });
    
    return categories;
}

function getCategoryIcon(category) {
    const icons = {
        'Hệ thống': '⚙️',
        'Trò chơi': '🎮',
        'Giải trí': '🎉',
        'Công cụ': '🔧',
        'Thông tin': 'ℹ️',
        'Media': '🎬',
        'AI': '🤖',
        'Kinh tế': '💰',
        'Nhóm': '👥',
        'Admin': '👑'
    };
    return icons[category] || '📌';
}

function showCategoryCommands(api, threadID, category, commands) {
    const categories = getCategories(commands);
    const cmds = categories[category];
    
    if (!cmds || cmds.length === 0) {
        return api.sendMessage('❌ Danh mục này chưa có lệnh nào!', threadID);
    }
    
    let msg = `╔════════════════════════╗\n`;
    msg += `║  ${getCategoryIcon(category)} ${category.toUpperCase()}  ║\n`;
    msg += `╚════════════════════════╝\n\n`;
    
    cmds.forEach((cmd, index) => {
        msg += `${index + 1}. %${cmd.config.name}\n`;
        msg += `   📝 ${cmd.config.description || 'Không có mô tả'}\n`;
        if (cmd.config.adminOnly) msg += `   👑 Chỉ Admin\n`;
        msg += '\n';
    });
    
    msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `📊 Tổng: ${cmds.length} lệnh trong danh mục ${category}`;
    
    api.sendMessage(msg, threadID);
}

function showAllCommands(api, threadID, commands) {
    const categories = getCategories(commands);
    
    let msg = '╔════════════════════════╗\n';
    msg += '║   📋 TẤT CẢ LỆNH BOT   ║\n';
    msg += '╚════════════════════════╝\n\n';
    
    Object.keys(categories).forEach(category => {
        msg += `${getCategoryIcon(category)} ${category}:\n`;
        categories[category].forEach(cmd => {
            msg += `  • %${cmd.config.name}`;
            if (cmd.config.adminOnly) msg += ' 👑';
            msg += '\n';
        });
        msg += '\n';
    });
    
    msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `📊 Tổng: ${commands.size} lệnh`;
    
    api.sendMessage(msg, threadID);
}

function loadMedia() {
    try {
        return JSON.parse(fs.readFileSync('./data/menuMedia.json', 'utf8'));
    } catch {
        return { images: [], videos: [] };
    }
}

function saveMedia(media) {
    fs.writeFileSync('./data/menuMedia.json', JSON.stringify(media, null, 2));
}

async function getRandomMedia(api, media) {
    const allMedia = [...media.images, ...media.videos];
    
    if (allMedia.length === 0) return null;
    
    const randomUrl = allMedia[Math.floor(Math.random() * allMedia.length)];
    
    try {
        const axios = require('axios');
        const response = await axios.get(randomUrl, { responseType: 'stream' });
        return response.data;
    } catch {
        return null;
    }
}

function handleAddMedia(api, event, args) {
    const { threadID, senderID } = event;
    const config = JSON.parse(fs.readFileSync('./data/config.json', 'utf8'));
    
    if (senderID !== config.adminID) {
        return api.sendMessage('❌ Chỉ admin mới có thể thêm media!', threadID);
    }
    
    const url = args[1];
    if (!url) {
        return api.sendMessage('❌ Vui lòng nhập link ảnh/video!\nVí dụ: %menu addvideo <link>', threadID);
    }
    
    const media = loadMedia();
    const type = args[0] === 'addvideo' ? 'videos' : 'images';
    
    media[type].push(url);
    saveMedia(media);
    
    api.sendMessage(`✅ Đã thêm ${type === 'videos' ? 'video' : 'ảnh'} vào menu!\nTổng: ${media[type].length} ${type === 'videos' ? 'video' : 'ảnh'}`, threadID);
}

function handleDeleteMedia(api, event, args) {
    const { threadID, senderID, messageID } = event;
    const config = JSON.parse(fs.readFileSync('./data/config.json', 'utf8'));
    
    if (senderID !== config.adminID) {
        return api.sendMessage('❌ Chỉ admin mới có thể xóa media!', threadID);
    }
    
    const media = loadMedia();
    const type = args[0] === 'delvideo' ? 'videos' : 'images';
    const list = media[type];
    
    if (list.length === 0) {
        return api.sendMessage(`❌ Chưa có ${type === 'videos' ? 'video' : 'ảnh'} nào!`, threadID);
    }
    
    let msg = `📋 Danh sách ${type === 'videos' ? 'video' : 'ảnh'}:\n\n`;
    list.forEach((url, index) => {
        msg += `${index + 1}. ${url.substring(0, 50)}...\n`;
    });
    msg += '\n💡 Reply số để xóa';
    
    api.sendMessage(msg, threadID, (err, info) => {
        if (!err) {
            pendingReplies.set(senderID, {
                type: 'media_delete',
                mediaType: type,
                promptMessageID: info.messageID,
                timestamp: Date.now()
            });
        }
    });
}

function handleListMedia(api, threadID) {
    const media = loadMedia();
    
    let msg = '╔════════════════════════╗\n';
    msg += '║   📊 DANH SÁCH MEDIA   ║\n';
    msg += '╚════════════════════════╝\n\n';
    
    msg += `🎬 Video: ${media.videos.length}\n`;
    media.videos.forEach((url, index) => {
        msg += `  ${index + 1}. ${url.substring(0, 40)}...\n`;
    });
    
    msg += `\n🖼️ Ảnh: ${media.images.length}\n`;
    media.images.forEach((url, index) => {
        msg += `  ${index + 1}. ${url.substring(0, 40)}...\n`;
    });
    
    api.sendMessage(msg, threadID);
}
