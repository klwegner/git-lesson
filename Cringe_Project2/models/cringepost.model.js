const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const pictureSchema = new Schema (
{
  title: String, 
  imageUrl: String,
}, 
{
    timestamps: true
}
);

module.exports = model('Cringepost', pictureSchema);
