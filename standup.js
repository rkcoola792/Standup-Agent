const OpenAI = require("openai");
require("dotenv").config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateStandup(tickets) {
  const prompt = `
Generate a daily standup update.

Tickets worked on:

${JSON.stringify(tickets, null, 2)}

Format:

Yesterday:
- ...

Today:
- ...

Blockers:
- ...

Keep it concise and professional.
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return response.choices[0].message.content;
}

module.exports = { generateStandup };