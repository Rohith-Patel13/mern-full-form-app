console.log("user.js/models","top");
const {Schema,model} = require("mongoose");

const userSchema = new Schema({
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    profileImage: String,
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['Admin', 'User'],
      default: 'User',
    },
  },{timestamps:true});
  
const User = model("User",userSchema);

module.exports = User;

console.log("user.js/models");
