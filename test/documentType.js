var mongoose     =   require("mongoose");
// set Promise provider to bluebird
mongoose.Promise =   require('bluebird');
var DocumentType =   require('../models/documentType');
//Require the dev-dependencies
var chai         =   require('chai');
var chaiHttp     =   require('chai-http');
//var chaiAsPromised = require("chai-as-promised");
//var server      =   require('../server');
var server       = 'http://localhost:4200';
// Add promise support if this does not exist natively.

//chai.use(chaiAsPromised);
chai.use(chaiHttp);

var should = chai.should();

//For work whit environment variable.
require('dotenv').config();

describe('DocumentTypes', () => {
    beforeEach(() => {
        DocumentType.remove({}, (err) => { 
           done();         
        });
    });
  describe('/GET documentTypes', () => {
      it('it should GET all the documentTypes', () => {
             chai.request(server)
            .get('/api/' + process.env.API_VERSION + '/documentTypes')
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.eql(0);
            })
            .catch(function (err) {
                console.log("Promise Rejected");
            });
      });
  });

  describe('/POST documentType', () => {
      it('when missing item in payload, should return a 400 ok response and a single error', () => {
        var documentType = {
                code: "DNI"
            }
            chai.request(server)
            .post('/api/' + process.env.API_VERSION + '/documentTypes')
            .send(documentType)
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('errors');
                expect(res.body.errors).to.have.property('description');
            })
            .catch(function (err) {
                console.log("Promise Rejected");
            })
      });
      it('it should POST a documentType ', () => {
        var documentType = {
                code: "DNI",
                description: "Documento Nacional de Identidad"
            }
            chai.request(server)
            .post('/api/' + process.env.API_VERSION + '/documentTypes')
            .send(documentType)
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('message').eql('DocumentType successfully added!');
                expect(res.body.documentType).to.have.property('code');
                expect(res.body.documentType).to.have.property('description');
                expect(res.body.documentType).to.have.property('enabled');
            })
            .catch(function (err) {
                console.log("Promise Rejected");
            });
      });
  });
  describe('/GET/:id documentType', () => {
      it('it should GET a documentType by the given id', () => {
        var documentType = new DocumentType({ 
                              code: "CI",
                              description: "Cedula de identidad"
                            });
        documentType.save((err, documentType) => {
            chai.request(server)
            .get('/api/' + process.env.API_VERSION + '/documentTypes/' + documentType.id)
            .send(documentType)
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.documentType).to.have.property('code');
                expect(res.body.documentType).to.have.property('description');
                expect(res.body.documentType).to.have.property('enabled');
                expect(res.body).to.have.property('_id').eql(documentType.id);
            })
            .catch(function (err) {
                console.log("Promise Rejected");
            });
        });

      });
  });
  describe('/PUT/:id documentType', () => {
      it('it should UPDATE a documentType given the id', () => {
        var documentType = new DocumentType({ 
                            code: "LE",
                            description: "Libreta de estado"
                            })
        documentType.save((err, documentType) => {
                chai.request(server)
                .put('/api/' + process.env.API_VERSION + '/documentTypes/' + documentType.id)
                .send({ code: "LE",
                        description: "Libreta de enrolamiento"
                    })
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('message').eql('DocumentType successfully updated.');
                    expect(res.body.documentType).to.have.property('description').eql("Libreta de enrolamiento");
                })
                .catch(function (err) {
                    console.log("Promise Rejected");
                });
          });
      });
  });
  /*
  * Test the /DELETE/:id route
  */
  describe('/DELETE/:id documentType', () => {
      it('it should DELETE a documentType given the id', () => {
        var documentType = new DocumentType({  
                            code: "MAS",
                            description: "Masajista"
                            })
        documentType.save((err, documentType) => {
                chai.request(server)
                .DELETE('/api/' + process.env.API_VERSION + '/documentTypes/' + documentType.id)
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('message').eql('DocumentType successfully deleted.');
                    expect(res.body.result).to.have.property('ok').eql(1);
                })
                .catch(function (err) {
                    console.log("Promise Rejected");
                });
          });
      });
  });
});