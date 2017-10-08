const express = require('express');
const bodyParser = require('body-parser');
const GithubApi = require('./GithubApi');
const securityChecks = require('./securityCheck').map(check => Object.assign(check, { regexp: new RegExp(check.regexp, 'g') }));

const app = new express();

app.use(bodyParser.json());

app.post('/github', (req, res) => {
  const { body } = req;
  const event = req.header('X-GitHub-Event');
  //Pubblicazione di un commento a una issue
  if(event === 'issue_comment') {
    if(body.action === 'deleted') {
      //Nothing to do if issue comment is deleted
      return res.sendStatus(200);
    }
    return issueCommentPublishedOrUpdated(body)
      .then(() => {
        res.sendStatus(200);
      })
      .catch((err) => {
        console.error('Message validations on issueCommentPublishedOrUpdated failed with exception: ', err);
        res.sendStatus(500);
      });
  }

  //Pubblicazione issue
  if(event === 'issues') {
    if(body.action !== 'opened') {
      //Nothing to for other events
      return res.sendStatus(200);
    }

    return issueCreated(body)
      .then(() => res.sendStatus(200))
      .catch((err) => {
        console.error('Message validations on issueCommentPublishedOrUpdated failed with exception: ', err);
        res.sendStatus(500);
      });
  }

  //Ping event. Called on webhook registration
  if(event === 'ping') {
    return res.sendStatus(200);
  }

  console.log('anpr-github-privacy-check has been subscribed to a wrong event. Please only select issue_comment and issues');
  return res.sendStatus(400);
});

const server = app.listen(8000, () => console.log('anpr-github-privacy-check has just started to listen for github webhooks calls'));

function issueCreated(body) {
  const { issue, repository } = body;
  const messagge = issue.body;
  const newMessage = processIssueText(messagge);
  if(newMessage !== messagge) {
    return Promise.all([
      GithubApi.sendIssueWarnComment(issue, repository, issue.user),
      GithubApi.updateIssueBody(issue, repository, newMessage)
    ]);
  } else {
    return Promise.resolve(null);
  }
}

function issueCommentPublishedOrUpdated(body) {
  const { comment, repository, issue, sender } = body;
  const messagge = comment.body;
  const newMessage = processIssueText(messagge);
  if(newMessage !== messagge) {
    return Promise.all([
      GithubApi.sendIssueWarnComment(issue, repository, sender),
      GithubApi.updateIssueCommentBody(issue, repository, newMessage)
    ]);
  } else {
    return Promise.resolve(null);
  }
}

function processIssueText(message) {
  securityChecks.forEach(check => {
    message = message.replace(check.regexp, check.replaceWith, 'g');
  });
  return message;
}

module.exports = server;
