const core = require('@actions/core');
const github = require('@actions/github');

try {
  const myToken = core.getInput('github_token');
  const octokit = new github.GitHub(myToken);
  const context = github.context;
  console.log(`context: ${context}`);


  const approvalCount = core.getInput('approval_count');
  const leaderName = core.getInput('leader_name');
  const githubToken = core.getInput('github_token');
  console.log(`Approval Count: ${approvalCount}`);
  console.log(`Leader Name: ${leaderName}`);
  console.log(`Github Count: ${approvalCount}`);

  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow

  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
