var express      = require("express");
var mongoose     = require('mongoose');
// set Promise provider to bluebird
mongoose.Promise = require('bluebird');
var DocumentType = require('../models/documentType');
var validator    = require('express-route-validator')

// API routes
var router = express.Router();

router.route('/documentTypes')
  .get(function (req, res) {
        var promise = DocumentType.find().exec();
        promise.then(function(documentTypes) {
           response(res,documentTypes);
        })
        .catch(function(err){
            // just need one of these
            //console.log('error:', err);
            res.status(500).send(err.message);
        });
    })
  .post(validator.validate({
         body: {
                code:             { isRequired: true },
                description:      { isRequired: true }
              },
              headers: {
                'content-type': { isRequired: true, equals: 'application/json' }
              }
        }),
        function(req, res) {
            //console.log('POST');
            //console.log(req.body);
            var documentType = new DocumentType({
                  code: req.body.code,
                  description: req.body.description
            });
            var promise = documentType.save();
            promise.then(function(documentType) {
              response(res,documentType);
            })
            .catch(function(err){
              // just need one of these
              //console.log('error:', err);
              res.status(500).send(err.message);
            });
        }
  );

router.route('/documentType/:idDocumentType')
  .get(validator.validate({
          params: {
            idDocumentType: { isRequired: true , isMongoId: true }
          }
      }),
      function(req, res) {
          var promise = DocumentType.findById(req.params.idDocumentType).exec();
          promise.then(function(documentType) {
            //console.log('GET /documentTypes/' + req.params.idDocumentType);
             response(res,documentType);
          })
          .catch(function(err){
            // just need one of these
            //console.log('error:', err);
            res.status(500).send(err.message);
          });
       }
  )
  .put(validator.validate({
          params: {
            idDocumentType: { isRequired: true , isMongoId: true }
          }
      }),
      function(req, res) {
          //console.log('PUT');
          //console.log(req.body);
          var promise = DocumentType.findById(req.params.idDocumentType).exec();
          promise.then(function(documentType) {
            if(documentType){
                documentType.code = req.body.code,
                documentType.description = req.body.description
                return documentType.save(); // returns a promise
            }
          })
          .then(function(documentType) {
              var message = "DocumentType successfully updated.";                
              response(res,documentType,message);
          })
          .catch(function(err){
              // just need one of these
              //console.log('error:', err);
              res.status(500).send(err.message);
          }); 
      }
  )
  .delete(validator.validate({
              params: {
                idDocumentType: { isRequired: true, isMongoId: true }
              }
          }),
          function(req, res) {
              DocumentType.findByIdAndRemove(req.params.idDocumentType, function (err, documentType) {  
                 if(err)
                    res.status(500).send(err.message);
                 var message = "DocumentType successfully deleted.";                
                 response(res,documentType,message);
              });
          }
  );
var response = function(res,documentType,messageOK,messageNotOK){
    if(documentType) {
      var resp = {
                  message: messageOK,
                  id:documentType._id
                };
      if(messageOK){
        res.status(200).jsonp(resp);
      }else{
        res.status(200).jsonp(documentType);
      }
    }else{
      var dfault =  "DocumentType Not Found";
      if(messageNotOK){
        res.status(400).send(messageNotOK);
      }else{
        res.status(400).send(dfault);
      }
    }
};
module.exports = router