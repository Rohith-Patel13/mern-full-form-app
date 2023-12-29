const express = require("express");
const app = express();

app.use(express.json());

const cors = require("cors");
app.use(cors());

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

app.listen(process.env.PORT || 6009,()=>{
    console.log('server starts at given port Successfully');
    mongoose.connect(process.env.MONGO_URL)
            .then(()=>console.log("Database Connected Successfully"))
            .catch((error)=>{
                console.log(error.message);
            })
})

