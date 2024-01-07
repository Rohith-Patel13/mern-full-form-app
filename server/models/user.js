console.log("user.js/models","top");
const {Schema,model} = require("mongoose");

const emailRegex=  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;


const userSchema = new Schema({
    email: {
        type:String,
        unique:true,
        
        validate:{
            validator:(email)=>emailRegex.test(email),
            message:(props)=>`${props.value} is not a valid email`
        }
    },
    phone: {
      type: String,
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
