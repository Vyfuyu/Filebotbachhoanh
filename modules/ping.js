module.exports = {
    config: {
        name: 'ping',
        version: '1.0.0',
        author: 'Admin',
        cooldown: 3,
        category: 'Hệ thống',
        description: 'Kiểm tra tốc độ phản hồi của bot',
        adminOnly: false
    },
    run: async ({ api, event }) => {
        const { threadID } = event;
        const startTime = Date.now();
        
        api.sendMessage('🏓 Pong!', threadID, () => {
            const endTime = Date.now();
            const ping = endTime - startTime;
            
            api.sendMessage(`⚡ Tốc độ phản hồi: ${ping}ms`, threadID);
        });
    }
};
