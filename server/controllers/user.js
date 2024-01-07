console.log("user.js/controllers","top")
const User = require("../models/user");
const {authenticateUser, validateUserUpdate} = require("../middlewares/user")

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// const {ObjectId} = require("mongodb");

// signUp handler function
exports.createUser = async (requestObject,responseObject)=>{
    try {
        const { email, phone, name, profileImage, password } = requestObject.body;
    
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
            email,
            phone,
            name,
            profileImage,
            password: hashedPassword
            });
            responseObject.status(201)
            responseObject.send(user);
        }
    } catch (error) {
        console.log(error.message);
        responseObject.status(500)
        responseObject.send(error.message);
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
                const payload = { userId: user._id, role: user.role }
                // Generate JWT token
                const token = jwt.sign(payload, process.env.SECRET_JWT_KEY);
                responseObject.status(200)
                responseObject.send({ token });
            }
        }
      }
    } catch (error) {
      console.error(error);
      responseObject.status(500)
      responseObject.send({ error: 'Internal Server Error' });
    }
}



// Modify Own User Details 
exports.modifyUserDetails=(authenticateUser, validateUserUpdate, async (requestObject, responseObject) => {
    try {
      const { name, profileImage } = requestObject.body;
      const userId = requestObject.params.id;
  
      // Check if the user is modifying their own details
      if (requestObject.user._id.toString() !== userId) {
        return responseObject.status(403).send({ error: 'Permission denied' });
      }
  
      // Update user details
      const updatedUser = await User.findByIdAndUpdate(userId, { name, profileImage }, { new: true });
  
      responseObject.status(200).send(updatedUser);
    } catch (error) {
      console.log(error.message);
      responseObject.status(500).send({ error: 'Internal Server Error' });
    }
});


// Delete own user account
exports.deleteUser = (authenticateUser,async(requestObject, responseObject) => {
    try {
      const userId = requestObject.params.id;
  
      // Check if the user is deleting their own account
      if (requestObject.user._id.toString() !== userId) {
        return responseObject.status(403).send({ error: 'Permission denied' });
      }
  
      // Delete user account
      await User.findByIdAndDelete(userId);
  
      responseObject.status(204).send({message:"deleted his own account successfully"});
    } catch (error) {
      console.log(error.message);
      responseObject.status(500).send({ error: 'Internal Server Error' });
    }
})
  


// Admin Access - View all users
exports.allAdminVal=(authenticateUser, async (requestObject, responseObject) => {
    try {
      // Check if the user is an admin
      if (requestObject.user.role !== 'Admin') {
        return responseObject.status(403).send({ error: 'Permission denied' });
      }
  
      // Fetch all users
      const users = await User.find();
      responseObject.status(200).send(users);
    } catch (error) {
      console.log(error.message);
      responseObject.status(500).send({ error: 'Internal Server Error' });
    }
});
  

// Admin Access - Modify User Details
exports.modifyUserDetailsAdmin= (authenticateUser, validateUserUpdate, async (requestObject, responseObject) => {
    try {
      const { name, profileImage } = requestObject.body;
      const userId = requestObject.params.id;
  
      // Check if the user is an admin
      if (requestObject.user.role !== 'Admin') {
        return responseObject.status(403).send({ error: 'Permission denied' });
      }
  
      // Update user details
      const updatedUser = await User.findByIdAndUpdate(userId, { name, profileImage }, { new: true });
  
      responseObject.status(200).send(updatedUser);
    } catch (error) {
      console.log(error.message);
      responseObject.status(500).send({ error: 'Internal Server Error' });
    }
});


// Admin Access - Delete User
exports.deleteAdminUser = (authenticateUser, async (requestObject, responseObject) => {
    try {
      const userId = requestObject.params.id;
  
      // Check if the user is an admin
      if (requestObject.user.role !== 'Admin') {
        return responseObject.status(403).send({ error: 'Permission denied' });
      }
  
      // Delete user account
      await User.findByIdAndDelete(userId);
  
      responseObject.status(204).send({message:"deleted account successfully"});
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  });


// create admin
exports.createAdmin= (authenticateUser,async (requestObject, responseObject) => {
    try {
      const { email, phone, name, password } = requestObject.body;
  
      // Check if the user is an admin (for illustration purposes)
      // In a real application, you might have a more secure method to create admin accounts
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
});
  
  




console.log("user.js/controllers")