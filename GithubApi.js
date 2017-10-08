const GitHubApi = require('github-api');

function sendIssueWarnComment(issue, user) {
  return GitHubApi.issues.createIssueComment(issue.id, `${user.login} fai attenzione a non pubblicare dati sensibili quali codici fiscali/numeri di telefono/nomi e cognomi. Per questa volta dovrei aver rimediato alla svista per te.`);
}

function updateIssueBody(issue, body) {
  return GitHubApi.issues.editIssue(issue.id, { body });
}

function updateIssueCommentBody(issue, body) {
  return GitHubApi.issues.editIssueComment(issue.id, { body });
}

export { sendIssueWarnComment, updateIssueBody, updateIssueCommentBody };
