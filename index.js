const { execSync } = require("child_process");

const commits = execSync(
  'git log --since="1 day ago" --pretty=format:"%s"'
).toString();

console.log(commits);