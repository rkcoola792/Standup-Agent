const axios = require("axios");
require("dotenv").config();

const auth = {
  username: process.env.JIRA_EMAIL,
  password: process.env.JIRA_TOKEN,
};

async function getLatestComment(issueKey) {
  try {
    const response = await axios.get(
      `${process.env.JIRA_URL}/rest/api/3/issue/${issueKey}/comment`,
      {
        auth,
      }
    );

    const comments = response.data.comments || [];

    if (!comments.length) {
      return "No comments found";
    }

    const latestComment = comments[comments.length - 1];

    const commentText =
      latestComment?.body?.content
        ?.flatMap((item) => item.content || [])
        ?.map((item) => item.text)
        ?.join(" ") || "Unable to parse comment";

    return commentText;
  } catch (error) {
    console.log(
      `Failed to fetch comments for ${issueKey}:`,
      error.response?.data || error.message
    );

    return "Failed to fetch comments";
  }
}

async function getMyTickets() {
  try {
    const searchResponse = await axios.get(
      `${process.env.JIRA_URL}/rest/api/3/search/jql`,
      {
        params: {
          jql: `
            assignee = currentUser()
            AND updated >= -1d
            AND statusCategory != Done
            ORDER BY updated DESC
          `,
          maxResults: 50,
        },
        auth,
      }
    );

    const issueIds = searchResponse.data.issues.map(
      (issue) => issue.id
    );

    const detailedIssues = await Promise.all(
      issueIds.map(async (id) => {
        try {
          const issueResponse = await axios.get(
            `${process.env.JIRA_URL}/rest/api/3/issue/${id}`,
            {
              auth,
            }
          );

          const issueKey = issueResponse.data.key;

          const latestComment = await getLatestComment(issueKey);

          return {
            key: issueKey,
            summary: issueResponse.data.fields.summary,
            status: issueResponse.data.fields.status.name,
            updated: issueResponse.data.fields.updated,
            latestComment,
          };
        } catch (error) {
          console.log(
            `Failed to fetch issue ${id}:`,
            error.response?.data || error.message
          );

          return null;
        }
      })
    );

    return detailedIssues.filter(Boolean);
  } catch (error) {
    console.error(
      "Failed to fetch tickets:",
      error.response?.data || error.message
    );

    return [];
  }
}

module.exports = {
  getMyTickets,
};