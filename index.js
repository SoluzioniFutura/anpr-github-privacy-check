const express = require('express');
const bodyParser = require('body-parser');
const GithubApi = require('./GithubApi');

const codiceFiscaleRegexp = /(?:[B-DF-HJ-NP-TV-Z](?:[AEIOU]{2}|[AEIOU]X)|[AEIOU]{2}X|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[1256LMRS][\dLMNP-V])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[\dLMNP-V][1-9MNP-V]|[1-9MNP-V][0L]))[A-Z]/g;
const numeroDiTelefonoRegexp = /(\((00|\+)39\)|(00|\+)39)?(38[890]|34[7-90]|36[680]|33[3-90]|32[89])\d{7}/g;

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

  if(event === 'ping') {
    return res.sendStatus(200);
  }

  console.log('anpr-github-privacy-check has been subscribed to a wrong event. Please only select issue_comment and issues');
  return res.sendStatus(400);
});

const server = app.listen(8000, () => console.log('anpr-github-privacy-check has just started to listen for github webhooks calls'));

function issueCreated(body) {
  return processIssueText(body.issue.body, body.repository, body.issue, body.issue.user)
    .then(newMessage => {
      if(newMessage) {
        return GithubApi.updateIssueBody(body.issue, body.repository, newMessage);
      }
    });
}

function issueCommentPublishedOrUpdated(body) {
  return processIssueText(body.comment.body, body.repository, body.issue, body.sender)
    .then(newMessage => {
      if(newMessage) {
        return GithubApi.updateIssueCommentBody(body.issue, body.repository, newMessage);
      }
    });
}

function processIssueText(message, repository, issue, user) {
  const codiceFiscaleMatches = codiceFiscaleRegexp.test(message);
  const numeroDiTelefonoMatches = numeroDiTelefonoRegexp.test(message);

  if(codiceFiscaleMatches) message = message.replace(codiceFiscaleRegexp, '[Codice Fiscale privato]');
  if(numeroDiTelefonoMatches) message = message.replace(numeroDiTelefonoRegexp, '[Numero di telefono privato]');

  if(numeroDiTelefonoMatches || codiceFiscaleMatches) {
    return GithubApi.sendIssueWarnComment(issue, repository, user).then(() => message);
  } else {
    return Promise.resolve(null);
  }
}

module.exports = server;
