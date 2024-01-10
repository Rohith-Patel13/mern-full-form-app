console.log("user.js/controllers","top")
const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// const {ObjectId} = require("mongodb");

// signUp handler function
exports.createUser = async (requestObject,responseObject)=>{
    try {
        const { email, phone, name, profileImage, password ,role} = requestObject.body;
    
        // Check if email or phone is provided
        if (!email && !phone) {
            responseObject.status(400)
            responseObject.send({err:'Email or phone is required for signup'});
        }
        else{
            // Encrypt the password
            const hashedPassword = await bcrypt.hash(password, 10);
    
            // Create a new user and save to the database
            const user = await User.create({
            email: email || null,  // Set to null if empty
            phone: phone || null,  // Set to null if empty
            name,
            profileImage,
            password: hashedPassword,
            
            });
            responseObject.status(201)
            responseObject.send(user);
        }
    } catch (error) {
        console.log(error.message);
        responseObject.status(500)
        responseObject.send({e:error.message,err:"createUser handler function"});
    }   
}


// login handler function
exports.loginUser = async (requestObject, responseObject) => {
    try {
      const { email, phone, password } = requestObject.body;
  
      // Check if email or phone is provided
      if (!email && !phone) {
        responseObject.status(400)
        responseObject.send({ error: 'Email or phone is required for login' });
      }else{
        // Find the user by email or phone
        const user = await User.findOne({ $or: [{ email }, { phone }] });
        console.log(user)
        
        // Check if the user exists
        if (user === null) { // The !user condition checks if the variable user is falsy, meaning it's null, undefined, 0, false, or an empty string.
            responseObject.status(403)
            responseObject.send({ error: 'user does not registered' });
        }else{
            // Check if the password is correct
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                responseObject.status(401)
                responseObject.send({ error: 'Invalid Password' });
            }else{
                const payload = { userId: user._id,name:user.name, role: user.role }
                // console.log(payload)
                // Generate JWT token
                const token = jwt.sign(payload, process.env.SECRET_JWT_KEY);
                responseObject.status(200)
                responseObject.send({jwtToken: token,payload });
            }
        }
      }
    } catch (error) {
      console.error(error);
      responseObject.status(500)
      responseObject.send({ error: 'loginUser handler function' });
    }
}


//API 1 Modify Own User Details 
exports.modifyUserDetails=  async (requestObject, responseObject) => {
    try {
      const { name, profileImage } = requestObject.body;
  
      // Check if the user is modifying their own details
      if (requestObject.userId.toString() !== requestObject.params.id) {
        return responseObject.status(403).send({ error: 'Permission denied' });
      }
  
      // Update user details
      const updatedUser = await User.findByIdAndUpdate(requestObject.params.id, { name, profileImage }, { new: true });
  
      responseObject.status(200).send(updatedUser);
    } catch (error) {
      console.log(error.message,"modifyUserDetails in controllers");
      responseObject.status(500).send({ error: `${error.message} in modifyUserDetails in controllers` });
    }
}


// API 2 Delete own user account
exports.deleteUser = async(requestObject, responseObject) => {
    try {
      const userId = requestObject.params.id;
  
      // Check if the user is deleting their own account
      if (requestObject.userId.toString() !== userId) {
        return responseObject.status(403).send({ error: 'Permission denied' });
      }
  
      // Delete user account
      await User.findByIdAndDelete(userId);
  
      responseObject.status(204).send({message:"deleted his own account successfully"});
    } catch (error) {
      console.log(error.message);
      responseObject.status(500).send({ error: 'Internal Server Error' });
    }
}
  


// API3 Admin Access - View all users
exports.allAdminVal= async (requestObject, responseObject) => {
    try {
      // Check if the user is an admin
      if (requestObject.UserRole !== 'Admin') {
        return responseObject.status(403).send({ error: 'Permission denied' });
      }
  
      // Fetch all users
      const users = await User.find();
      responseObject.status(200).send(users);
    } catch (error) {
      console.log(error.message);
      responseObject.status(500).send({ error: 'Internal Server Error' });
    }
}
  

// API 4 Admin Access - Modify User Details
exports.modifyUserDetailsAdmin=  async (requestObject, responseObject) => {
    try {
      const { name, profileImage } = requestObject.body;
      const userId = requestObject.params.id;
  
      // Check if the user is an admin
      if (requestObject.UserRole !== 'Admin') {
        return responseObject.status(403).send({ error: 'Only Admin can Modify details of others or his own' });
      }
  
      // Update user details
      const updatedUser = await User.findByIdAndUpdate(userId, { name, profileImage }, { new: true });
  
      responseObject.status(200).send(updatedUser);
    } catch (error) {
      console.log(error.message);
      responseObject.status(500).send({ error: 'Internal Server Error' });
    }
}


// Admin Access - Delete User
exports.deleteAdminUser =  async (requestObject, responseObject) => {
    try {
      const userId = requestObject.params.id;
  
      // Check if the user is an admin
      if (requestObject.UserRole !== 'Admin') {
        return responseObject.status(403).send({ error: 'Permission denied' });
      }
  
      // Delete user account
      await User.findByIdAndDelete(userId);
  
      responseObject.status(204).send({message:"deleted account successfully"});
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }


// create admin
exports.createAdmin= async (requestObject, responseObject) => {
    try {
      const { email, phone, name, password } = requestObject.body;
      const isAdmin = true;
  
      if (!isAdmin) {
        return responseObject.status(403).send({ error: 'Permission denied' });
      }
  
      // Encrypt the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new admin user
      const adminUser = new User({ email, phone, name, password: hashedPassword, role: 'Admin' });
      
      // Save the admin user to the database
      await adminUser.save();
  
      responseObject.status(201).send({ message: 'Admin user created successfully' });
    } catch (error) {
      console.log(error.message);
      responseObject.status(500).send({ error: 'Internal Server Error' });
    }
}
  
  




console.log("user.js/controllers")