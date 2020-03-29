const core = require('@actions/core');
const github = require('@actions/github');

try {
  const myToken = core.getInput('github_token');
  const octokit = new github.GitHub(myToken);
  const context = github.context;
  // console.log(`context: ${JSON.stringify(context)}`);


  const approvalCount = core.getInput('approval_count');
  const leaderName = core.getInput('leader_name');
  console.log(`Approval Count: ${approvalCount}`);
  console.log(`Leader Name: ${leaderName}`);

  const reviews = octokit.pulls.listReviews({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    pull_number: github.context.payload.pull_request.number
  });
  console.log(`Reviews: ${reviews}`);
  const reviewCount = reviews.length;
  console.log(`reviewCount: ${reviewCount}`);

  // Get the JSON webhook payload for the event that triggered the workflow

  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
