module.exports = {
    config: {
        name: 'help',
        version: '1.0.0',
        author: 'Admin',
        cooldown: 3,
        category: 'Hệ thống',
        description: 'Hiển thị thông tin trợ giúp',
        adminOnly: false
    },
    run: async ({ api, event, args, commands }) => {
        const { threadID } = event;
        
        if (args[0]) {
            const cmdName = args[0].toLowerCase();
            const cmd = commands.get(cmdName);
            
            if (!cmd) {
                return api.sendMessage(`❌ Không tìm thấy lệnh "${cmdName}"`, threadID);
            }
            
            let msg = `╔════════════════════════╗\n`;
            msg += `║   📖 THÔNG TIN LỆNH   ║\n`;
            msg += `╚════════════════════════╝\n\n`;
            msg += `📌 Tên: ${cmd.config.name}\n`;
            msg += `📝 Mô tả: ${cmd.config.description}\n`;
            msg += `📂 Danh mục: ${cmd.config.category}\n`;
            msg += `⏱️ Cooldown: ${cmd.config.cooldown}s\n`;
            msg += `👤 Tác giả: ${cmd.config.author}\n`;
            if (cmd.config.adminOnly) msg += `👑 Chỉ Admin: Có\n`;
            
            return api.sendMessage(msg, threadID);
        }
        
        let msg = `╔════════════════════════╗\n`;
        msg += `║   📖 HƯỚNG DẪN SỬ DỤNG   ║\n`;
        msg += `╚════════════════════════╝\n\n`;
        msg += `💡 Prefix: %\n\n`;
        msg += `📋 Lệnh cơ bản:\n`;
        msg += `• %menu - Xem menu danh mục\n`;
        msg += `• %menu all - Xem tất cả lệnh\n`;
        msg += `• %help <tên lệnh> - Xem chi tiết lệnh\n`;
        msg += `• %admin - Kiểm tra quyền admin\n\n`;
        msg += `📊 Tổng số lệnh: ${commands.size}`;
        
        api.sendMessage(msg, threadID);
    }
};
