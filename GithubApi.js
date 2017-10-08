const GitHub = require('github-api');
const { credentials } = require('./credentials.json');
const { warningMessage } = require('./config.json');

const gh = new GitHub(credentials);

function sendIssueWarnComment(issue, repository, user) {
  const issues = gh.getIssues(repository.owner.login, repository.name);
  return issues.createIssueComment(issue.number, warningMessage.replace('{user}', `@${user.login}`));
}

function updateIssueBody(issue, repository, body) {
  const issues = gh.getIssues(repository.owner.login, repository.name);
  return issues.editIssue(issue.number, { body });
}

function updateIssueCommentBody(comment, repository, body) {
  const issues = gh.getIssues(repository.owner.login, repository.name);
  return issues.editIssueComment(comment.id, body);
}

module.exports = { sendIssueWarnComment, updateIssueBody, updateIssueCommentBody };
