module.exports = {
    config: {
        name: 'admin',
        version: '1.0.0',
        author: 'Admin',
        cooldown: 5,
        category: 'Hệ thống',
        description: 'Kiểm tra quyền admin',
        adminOnly: false
    },
    run: async ({ api, event, config }) => {
        const { threadID, senderID } = event;
        
        if (senderID === config.adminID) {
            api.sendMessage('✅ Bạn là admin của bot!', threadID);
        } else {
            api.sendMessage(`❌ Bạn không phải admin!\n👑 Admin ID: ${config.adminID}`, threadID);
        }
    }
};
