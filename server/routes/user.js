console.log("user.js/routes","top");

const express = require("express")

const router = express.Router();
const usersController = require("../controllers/user");


router.post("/create",usersController.createUser);

module.exports= router;

console.log("user.js/routes");