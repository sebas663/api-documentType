var mongoose = require('mongoose');
//Define a schema
var Schema = mongoose.Schema;

var DocumentTypeSchema = new Schema({
        code :            String,
        description :     String,
        enable :          { type: Boolean, default: true }
});
// the schema is useless so far
// we need to create a model using it
var DocumentType = mongoose.model('DocumentType', DocumentTypeSchema);

// make this available to our users in our Node applications
module.exports = DocumentType;