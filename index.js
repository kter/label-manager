const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  const myToken = core.getInput('github_token');
  const octokit = new github.GitHub(myToken);
  const ReadyToMergeLabel = 'Ready To Merge';
  const LeaderReviewLabel = 'Leader Review';
  const DeveloperReviewLabel = 'Developer Review';
  // TODO: 分割代入？で変数を短くする
  const context = github.context;
  // console.log(`context: ${JSON.stringify(context)}`);

  if (github.context.payload.pull_request.state !== 'open') {
    return;
  }

  const approvalCount = core.getInput('approval_count');
  const leaderName = core.getInput('leader_name');
  console.log(`Approval Count: ${approvalCount}`);
  console.log(`Leader Name: ${leaderName}`);

  const { data: reviews } = await octokit.pulls.listReviews({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    pull_number: github.context.payload.pull_request.number
  });
  console.log(`Reviews: ${JSON.stringify(reviews)}`);
  const reviewCount = reviews.length;
  console.log(`reviewCount: ${reviewCount}`);

  const approved = reviews.filter(review => {
    return review.state === 'APPROVED';
  });

  let hasLeader = false;
  for (const review of approved) {
    const { user: user } = review;
    if (user.login === leaderName) {
      hasLeader = true;
      break;
    }
  } 
  console.log(`hasLeader: ${hasLeader}`);
  if (context.actor === leaderName) {
    hasLeader = true;
  }
  console.log(`hasLeader: ${hasLeader}`);

  const hasLeaderReviewLabel = github.context.payload.pull_request.labels.find(label => {
    return label.name === LeaderReviewLabel;
  });
  const hasDeveloperReviewLabel = github.context.payload.pull_request.labels.find(label => {
    return label.name === DeveloperReviewLabel;
  });
  const hasReadyToMergeLabel = github.context.payload.pull_request.labels.find(label => {
    return label.name === ReadyToMergeLabel;
  });
  if (approvalCount < reviewCount && hasLeader) {
    console.log('Ready To Merge');
    if (hasLeaderReviewLabel) {
      await octokit.issues.removeLabel({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: github.context.payload.pull_request.number,
        name: LeaderReviewLabel,
      });
    }
    if (hasDeveloperReviewLabel) {
      await octokit.issues.removeLabel({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: github.context.payload.pull_request.number,
        name: DeveloperReviewLabel,
      });
    }
    await octokit.issues.addLabels({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issue_number: github.context.payload.pull_request.number,
      labels: [ReadyToMergeLabel],
    });
  } else if (approvalCount < reviewCount) {
    console.log('Leader Review');
    if (hasReadyToMergeLabel) {
      await octokit.issues.removeLabel({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: github.context.payload.pull_request.number,
        name: ReadyToMergeLabel,
      });
    }
    if (hasDeveloperReviewLabel) {
      await octokit.issues.removeLabel({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: github.context.payload.pull_request.number,
        name: DeveloperReviewLabel,
      });
    }
    await octokit.issues.addLabels({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issue_number: github.context.payload.pull_request.number,
      labels: [LeaderReviewLabel],
    });
  } else {
    console.log('Developer Review');
    if (hasReadyToMergeLabel) {
      await octokit.issues.removeLabel({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: github.context.payload.pull_request.number,
        name: ReadyToMergeLabel,
      });
    }
    if (hasLeaderReviewLabel) {
      await octokit.issues.removeLabel({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: github.context.payload.pull_request.number,
        name: LeaderReviewLabel,
      });
    }
    await octokit.issues.addLabels({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issue_number: github.context.payload.pull_request.number,
      labels: [DeveloperReviewLabel],
    });
  }

  // Get the JSON webhook payload for the event that triggered the workflow

  // const payload = JSON.stringify(github.context.payload, undefined, 2)
  // console.log(`The event payload: ${payload}`);
}


run().catch(error => {
  core.setFailed(error.message);
});