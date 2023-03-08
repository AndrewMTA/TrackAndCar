const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "Can't be blank"],
    validate: [isEmail, "invalid email"],
  },
  password: {
    type: String,
    // required: [true, "Can't be blank"]
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
 
  Private: {
    type: Boolean
  },
  bio: { 
    type: String
  },
dealerName: {
    type: String
  },
  location: {
    type: String
  },
  profilePic: {
    type: String
  },

  website: {
    type: String
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, { minimize: false });

UserSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
 
      user.password = hash
      next();
    })
 
  })

})

UserSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
		expiresIn: "7d",
	});
	return token;
};


UserSchema.methods.getSignedToken = function() {
   return jwt.sign({ id: this._id}, 
    process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE,
    }   )
} 
UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
}

UserSchema.statics.findByCredentials = async function (email, password) {
   const user = await User.findOne({ email });
  if (!user) throw new Error('invalid email or password');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('invalid email or password')
  return user
}


UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token (private key) and save to database
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set token expire date
  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000); // Ten Minutes

  return resetToken;
}; 

const User = mongoose.model('User', UserSchema);

module.exports = User
