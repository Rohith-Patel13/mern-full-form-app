console.log("app.js","top")

const express = require("express");
const app = express();


const usersRoutes = require("./routes/user")

app.use(express.json());

const cors = require("cors");
app.use(cors());

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

app.listen(6009,()=>{
    console.log('server starts at given port Successfully');
    mongoose.connect(process.env.MONGO_URL)
            .then(()=>console.log("Database Connected Successfully"))
            .catch((error)=>{
                console.log(error.message,"database error");
            })
})

app.use("/users",usersRoutes);

console.log("app.js")
