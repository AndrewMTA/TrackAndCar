const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');


const CarSchema = new mongoose.Schema({
  listUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

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
    type: String,
    default: 10000
  },
  pic: {
    type: Array,
  },

  Youtube: {
    type: String
  },

  description: {
    type: String,
  },
  miles: {
    type: String,
  },

  specs: {
    type: Number,
  },

}, {minimize: false});


const Car = mongoose.model('Car', CarSchema);

module.exports = Car
