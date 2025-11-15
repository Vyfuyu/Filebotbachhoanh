const fs = require('fs');

module.exports = {
    config: {
        name: 'setprefix',
        version: '1.0.0',
        author: 'Admin',
        cooldown: 3,
        category: 'Hệ thống',
        description: 'Thay đổi prefix của bot',
        adminOnly: true
    },
    run: async ({ api, event, args, config }) => {
        const { threadID } = event;
        
        if (!args[0]) {
            return api.sendMessage(`⚙️ Prefix hiện tại: ${config.prefix}\n\n💡 Cách dùng: %setprefix <prefix mới>\nVí dụ: %setprefix !`, threadID);
        }
        
        const newPrefix = args[0];
        
        if (newPrefix.length > 5) {
            return api.sendMessage('❌ Prefix không được dài quá 5 ký tự!', threadID);
        }
        
        const configPath = './data/config.json';
        const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        
        const oldPrefix = configData.prefix;
        configData.prefix = newPrefix;
        
        fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
        
        config.prefix = newPrefix;
        
        api.sendMessage(`✅ Đã thay đổi prefix!\n\n📌 Prefix cũ: ${oldPrefix}\n✨ Prefix mới: ${newPrefix}\n\n💡 Bây giờ dùng lệnh: ${newPrefix}menu`, threadID);
    }
};
