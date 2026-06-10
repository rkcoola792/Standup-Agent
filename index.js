const { getMyTickets } = require("./jira");
const { generateStandup } = require("./standup");
const { sendToTeams } = require("./teams");

(async () => {
  try {
    const tickets = await getMyTickets();

    const standup = await generateStandup(tickets);

    console.log("\n===== STANDUP =====\n");
    console.log(standup);

    await sendToTeams(standup);

    console.log("✅ Sent to Teams");
  } catch (error) {
    console.error(error.response?.data || error.message);
  }
})();