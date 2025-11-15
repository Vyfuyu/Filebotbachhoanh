module.exports = {
    config: {
        name: 'taixiu',
        version: '1.0.0',
        author: 'Admin',
        cooldown: 5,
        category: 'Trò chơi',
        description: 'Chơi tài xỉu với bot',
        adminOnly: false
    },
    run: async ({ api, event, args }) => {
        const { threadID } = event;
        
        const choice = args[0]?.toLowerCase();
        
        if (!choice || !['tai', 'xiu'].includes(choice)) {
            return api.sendMessage('🎲 Cách dùng: %taixiu <tai/xiu>\nVí dụ: %taixiu tai', threadID);
        }
        
        const dice1 = Math.floor(Math.random() * 6) + 1;
        const dice2 = Math.floor(Math.random() * 6) + 1;
        const dice3 = Math.floor(Math.random() * 6) + 1;
        const total = dice1 + dice2 + dice3;
        
        const result = total >= 11 ? 'tai' : 'xiu';
        const win = choice === result;
        
        let msg = `🎲 KẾT QUẢ TÀI XỈU 🎲\n\n`;
        msg += `🎲 Xúc xắc: [${dice1}] [${dice2}] [${dice3}]\n`;
        msg += `📊 Tổng: ${total} điểm\n`;
        msg += `🎯 Kết quả: ${result.toUpperCase()}\n\n`;
        msg += `👤 Bạn chọn: ${choice.toUpperCase()}\n`;
        msg += win ? '🎉 CHIẾN THẮNG!' : '😢 THUA RỒI!';
        
        api.sendMessage(msg, threadID);
    }
};
