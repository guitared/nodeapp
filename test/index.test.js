const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/index');

chai.use(chaiHttp);
chai.should();

describe("index.js", () => {
  describe("GET /", () => {
    it("should return something", (done) => {
      chai.request(app).get('/').end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      }); 
    });
  });
});