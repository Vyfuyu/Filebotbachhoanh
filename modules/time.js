module.exports = {
    config: {
        name: 'time',
        version: '1.0.0',
        author: 'Admin',
        cooldown: 3,
        category: 'Công cụ',
        description: 'Xem thời gian hiện tại',
        adminOnly: false
    },
    run: async ({ api, event }) => {
        const { threadID } = event;
        
        const now = new Date();
        const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
        
        let msg = `⏰ THỜI GIAN HIỆN TẠI\n\n`;
        msg += `📅 Ngày: ${days[now.getDay()]}, ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}\n`;
        msg += `🕐 Giờ: ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}\n`;
        msg += `🌍 Múi giờ: UTC+7 (Việt Nam)`;
        
        api.sendMessage(msg, threadID);
    }
};
