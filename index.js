const express = require('express');
const bodyParser = require('body-parser');
const GithubApi = require('./GithubApi');
const securityChecks = require('./securityChecks').map(check => Object.assign(check, { regexp: new RegExp(check.regexp, 'g') }));
const credentials = require('./credentials.json');
const crypto = require('crypto');

const app = new express();

app.use(bodyParser.json());

app.post('/github', (req, res) => {
  const { body } = req;
  const event = req.header('X-GitHub-Event');
  const signature = req.header('X-Hub-Signature');

  if(!validateGithubSignature(signature, body)) {
    return res.sendStatus(401);
  }
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
    if(body.action !== 'opened' && body.action !== 'edited') {
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

const port = 8000
const server = app.listen(port, () => console.log(`anpr-github-privacy-check has just started listening for github webhooks calls on port ${port}`));

function validateGithubSignature(signature, body) {
  const secret = credentials.secret;
  if(secret) {
    const hash = crypto.createHmac('sha1', credentials.secret).update(JSON.stringify(body)).digest('hex');
    return `sha1=${hash}` === signature;
  }
  return true;
}

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
      GithubApi.updateIssueCommentBody(comment, repository, newMessage)
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
