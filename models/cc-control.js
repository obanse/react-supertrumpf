const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const ccControlSchema = new Schema({
  bnrId:        {type: Schema.Types.ObjectId, required: true, ref: "Company"},
  firma:        {type: String},
  dateFrom:     {type: Date, required: true},
  dateTo:       {type: Date},
  hasInventory: {type: Boolean, default: false},
  isStarted:    {type: Boolean, default: false},
  isFinished:   {type: Boolean, default: false}
});

ccControlSchema.plugin(uniqueValidator);

module.exports = mongoose.model("CcControl", ccControlSchema);
