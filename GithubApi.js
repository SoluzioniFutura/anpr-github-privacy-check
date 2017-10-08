const GitHub = require('github-api');
const config = require('./config.json');

const gh = new GitHub(config.credentials);

function sendIssueWarnComment(issue, repository, user) {
  const issues = gh.getIssues(repository.owner.login, repository.name);
  return issues.createIssueComment(issue.id, `${user.login} fai attenzione a non pubblicare dati sensibili quali codici fiscali/numeri di telefono/nomi e cognomi. Per questa volta dovrei aver rimediato alla svista per te.`);
}

function updateIssueBody(issue, repository, body) {
  const issues = gh.getIssues(repository.owner.login, repository.name);
  return issues.editIssue(issue.id, { body });
}

function updateIssueCommentBody(issue, repository, body) {
  const issues = gh.getIssues(repository.owner.login, repository.name);
  return issues.editIssueComment(issue.id, { body });
}

module.exports = { sendIssueWarnComment, updateIssueBody, updateIssueCommentBody };
