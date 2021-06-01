const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const companySchema = new mongoose.Schema({
  bnr:       {type: String, unique: true, index: true, required: true},
  firma:     {type: String, required: true},
  plz:       {type: Number},
  ort:       {type: String},
  ortsteil:  {type: String},
  str:       {type: String},
  telefon:   {type: String}
});

companySchema.plugin(uniqueValidator);

module.exports = mongoose.model("Company", companySchema);
