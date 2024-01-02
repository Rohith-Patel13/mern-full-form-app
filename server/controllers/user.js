console.log("user.js/controllers","top")
const User = require("../models/user");

const {ObjectId} = require("mongodb");

// create handler function
exports.createUser = async (requestObject,responseObject)=>{
    const { userName, email, age,role } = requestObject.body;
    try {
        const newUser = await User.create({
            userName, email, age,role
        })
        console.log(newUser)
        responseObject.status(201) // Respond with status 201 for successful creation
        responseObject.send(newUser); 
    } catch (error) {
        console.log(error.message)
        responseObject.status(500)// server error
        responseObject.send(error.message)
    }
}

console.log("user.js/controllers")