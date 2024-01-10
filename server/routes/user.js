console.log("user.js/routes","top");

const express = require("express")

const router = express.Router();
const usersController = require("../controllers/user");

const middlewareLogic = require("../middlewares/user")


// signUp
router.post("/signup",usersController.createUser);

//Login
router.post("/login",usersController.loginUser)

//modify own user details
router.patch('/modify/:id',middlewareLogic.authenticateUser,usersController.modifyUserDetails)

// delete own account
router.delete('/deleteOwn/:id',middlewareLogic.authenticateUser,usersController.deleteUser)

// Admin Access - View all users
router.get('/admin/AllUsers',middlewareLogic.authenticateUser,usersController.allAdminVal)

// Admin Access - Modify User Details
router.patch('/admin/modify/:id',middlewareLogic.authenticateUser,usersController.modifyUserDetailsAdmin)

// Admin Access - Delete User
router.delete('/admin/delete/:id',middlewareLogic.authenticateUser, usersController.deleteAdminUser)

// Create Admin
router.post('/admin/signup', usersController.createAdmin)



module.exports= router;

console.log("user.js/routes");

/*
PATCH is used to apply partial updates to a resource, meaning that only the fields 
that need to be changed are sent in the request body. PUT is used to replace the 
entire resource with a new representation, meaning that all the fields of the resource 
are sent in the request body, even if they are not modified.
*/