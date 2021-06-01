const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const cattleSchema = new Schema({
  lom:        {type: String, required: true},
  lom5:       {type: String, required: true},
  cccId:      {type: Schema.Types.ObjectId, required: true, ref: "CcControl"},
  dateGeb:    {type: Date, required: true},
  gender:     {type: String, required: true},
  breed:      {type: String, required: true},
  omCcc:      {type: Number, default: 0, required: true, max: 3, min: 0},
  ageCcc:     {type: Number, default: 0, required: true, max: 3, min: 0},
  genderCcc:  {type: Number, default: 0, required: true, max: 3, min: 0},
  breedCcc:   {type: Number, default: 0, required: true, max: 2, min: 0},
  checked:    {type: Boolean, default: false, required: true},
  checkDate:  {type: Date, default: null}
});

cattleSchema.index({ lom: 1, cccId: 1 }, { unique: true });
cattleSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Cattle", cattleSchema);
