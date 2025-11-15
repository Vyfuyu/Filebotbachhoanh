module.exports = {
    config: {
        name: 'avatar',
        version: '1.0.0',
        author: 'Admin',
        cooldown: 5,
        category: 'Công cụ',
        description: 'Lấy avatar Facebook của người dùng',
        adminOnly: false
    },
    run: async ({ api, event }) => {
        const { threadID, senderID, messageReply } = event;
        
        const targetID = messageReply ? messageReply.senderID : senderID;
        
        api.sendMessage({
            body: `📸 Avatar của người dùng:`,
            attachment: await api.getStreamFromURL(`https://graph.facebook.com/${targetID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)
        }, threadID);
    }
};
