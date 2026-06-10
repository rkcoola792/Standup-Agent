const { getMyTickets } = require("./jira");
const { generateStandup } = require("./standup");

(async () => {
  try {
    const tickets = await getMyTickets();

    const standup = await generateStandup(tickets);

    console.log("\n===== STANDUP =====\n");
    console.log(standup);
  } catch (error) {
    console.error(error.response?.data || error.message);
  }
})();