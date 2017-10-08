process.env.NODE_ENV = 'test';

const createIssueEvent = require('./createIssueEvent.json');
const createIssueCommentEvent = require('./createIssueCommentEvent.json');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

describe('/POST github create issue event', () => {
  it('it should POST a github test create issue event', (done) => {
    const server = require('../index');
    chai.request(server)
      .post('/github')
      .set('X-GitHub-Event', 'issues')
      .send(createIssueEvent)
      .end((err, res) => {
        res.should.have.status(200);
        server.close(() => {
          done();
        });
      });
  });
});

describe('/POST github create issue comment event', () => {
  it('it should POST a github test create issue comment event', (done) => {
    const server = require('../index');
    chai.request(server)
      .post('/github')
      .set('X-GitHub-Event', 'issue_comment')
      .send(createIssueCommentEvent)
      .end((err, res) => {
        res.should.have.status(200);
        server.close(() => {
          done();
        });
      });
  });
});
