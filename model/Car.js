const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');


const CarSchema = new mongoose.Schema({

  firstName: {
    type: String
  },
  lastName: {
    type: String
  },

  make: { 
    type: String
  },
  model: {
    type: String
  },
  year: {
    type: Number
  },
 price: {
    type: Number,
    default: 10000
  },
  pic: {
    type: String,
  },

  Youtube: {
    type: String
  },

  description: {
    type: String,
  },
  miles: {
    type: Number,
  },

  specs: {
    type: Number,
  },

}, );


const Car = mongoose.model('Car', CarSchema);

module.exports = Car
