module.exports = {
    config: {
        name: 'slot',
        version: '1.0.0',
        author: 'Admin',
        cooldown: 5,
        category: 'Trò chơi',
        description: 'Chơi game quay slot',
        adminOnly: false
    },
    run: async ({ api, event }) => {
        const { threadID } = event;
        
        const symbols = ['🍒', '🍋', '🍊', '🍇', '💎', '⭐', '7️⃣'];
        
        const slot1 = symbols[Math.floor(Math.random() * symbols.length)];
        const slot2 = symbols[Math.floor(Math.random() * symbols.length)];
        const slot3 = symbols[Math.floor(Math.random() * symbols.length)];
        
        let msg = `🎰 SLOT GAME 🎰\n\n`;
        msg += `┌─────────┐\n`;
        msg += `│ ${slot1} │ ${slot2} │ ${slot3} │\n`;
        msg += `└─────────┘\n\n`;
        
        if (slot1 === slot2 && slot2 === slot3) {
            msg += `🎉 JACKPOT! Ba ${slot1} giống nhau!\n💰 Bạn thắng lớn!`;
        } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
            msg += `✨ Hai ô giống nhau!\n💵 Bạn thắng nhỏ!`;
        } else {
            msg += `😢 Không trúng!\n🔄 Thử lại lần sau!`;
        }
        
        api.sendMessage(msg, threadID);
    }
};
