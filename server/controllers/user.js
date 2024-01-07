console.log("user.js/controllers","top")
const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {ObjectId} = require("mongodb");

// create handler function
exports.createUser = async (requestObject,responseObject)=>{
    try {
        const { email, phone, name, profileImage, password } = requestObject.body;
    
        // Check if email or phone is provided
        if (!email && !phone) {
            responseObject.status(400)
            responseObject.send({err:'Email or phone is required for signup'});
        }
    
        // Encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Create a new user and save to the database
        const user = await User.create({
            email,
            phone,
            name,
            profileImage,
            password: hashedPassword
        });
        responseObject.status(201)
        responseObject.send(user);
      } catch (error) {
        console.log(error.message);
        responseObject.status(500)
        responseObject.send(error.message);
      }   
}



console.log("user.js/controllers")