console.log("user.js/routes","top");

const express = require("express")

const router = express.Router();
const usersController = require("../controllers/user");

// signUp
router.post("/signup",usersController.createUser);

//Login
router.post("/login",usersController.loginUser)

//modify own user details
router.patch('/users/:id',usersController.modifyUserDetails)

// delete own account
router.delete('/users/:id',usersController.deleteUser)

// Admin Access - View all users
router.get('/admin/users',usersController.allAdminVal)

// Admin Access - Modify User Details
router.patch('/admin/users/:id',usersController.modifyUserDetailsAdmin)

// Admin Access - Delete User
router.delete('/admin/users/:id', usersController.deleteAdminUser)

// Create Admin
router.post('/admin/signup', usersController.createAdmin)



module.exports= router;

console.log("user.js/routes");
