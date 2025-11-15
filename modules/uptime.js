const startTime = Date.now();

module.exports = {
    config: {
        name: 'uptime',
        version: '1.0.0',
        author: 'Admin',
        cooldown: 3,
        category: 'Hệ thống',
        description: 'Xem thời gian bot đã hoạt động',
        adminOnly: false
    },
    run: async ({ api, event }) => {
        const { threadID } = event;
        
        const uptime = Date.now() - startTime;
        const seconds = Math.floor(uptime / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        let msg = `⏱️ THỜI GIAN HOẠT ĐỘNG\n\n`;
        msg += `📊 Bot đã chạy:\n`;
        msg += `• ${days} ngày\n`;
        msg += `• ${hours % 24} giờ\n`;
        msg += `• ${minutes % 60} phút\n`;
        msg += `• ${seconds % 60} giây\n\n`;
        msg += `✅ Trạng thái: Đang hoạt động`;
        
        api.sendMessage(msg, threadID);
    }
};
