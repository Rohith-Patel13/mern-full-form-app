console.log("user.js/models","top");
const {Schema,model} = require("mongoose");

const emailRegex=  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const userSchema = new Schema({
    "userName":{
        type:String,
        required:[true,"name must not be empty"]
    },
    "email":{
        type:String,
        required:[true,"email must not be empty"],
        validate:{
            validator:(email)=>emailRegex.test(email),
            message:(props)=>`${props.value} is not a valid email`
        }     
    },
    password: { type: String, required: true }
},{timestamps:true});

const User = model("User",userSchema);

module.exports = User;

console.log("user.js/models");
