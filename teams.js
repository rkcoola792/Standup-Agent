const axios = require("axios");
require("dotenv").config();

async function sendToTeams(message) {
  try {
    const payload = {
      type: "message",
      attachments: [
        {
          contentType: "application/vnd.microsoft.card.adaptive",
          content: {
            $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
            type: "AdaptiveCard",
            version: "1.4",
            body: [
              {
                type: "TextBlock",
                text: "🚀 Daily Standup",
                weight: "Bolder",
                size: "Large",
              },
              {
                type: "TextBlock",
                text: message,
                wrap: true,
              },
            ],
          },
        },
      ],
    };

    const response = await axios.post(
      process.env.TEAMS_CHANNEL_WEBHOOK_URL,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Status:", response.status);
    console.log("Response:", response.data);
    console.log("✅ Message sent to Teams");
  } catch (error) {
    console.error(
      "❌ Teams Error:",
      error.response?.data || error.message
    );
  }
}

module.exports = { sendToTeams };