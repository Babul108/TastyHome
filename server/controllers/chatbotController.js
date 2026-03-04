const chatbotResponses = require('../utils/chatbotResponses');

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message is required' });

    const lowerMsg = message.toLowerCase();
    let matched = null;

    for (const [key, value] of Object.entries(chatbotResponses)) {
      if (key === 'default') continue;
      if (value.keywords && value.keywords.some((kw) => lowerMsg.includes(kw))) {
        matched = value;
        break;
      }
    }

    const response = matched ? matched.response : chatbotResponses.default.response;
    res.json({ success: true, response });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { sendMessage };
