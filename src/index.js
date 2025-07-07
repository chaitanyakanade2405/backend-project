import dotenv from "dotenv";
import connectDB from "./db/index.js";
import {app} from "./app.js";


dotenv.config({
    path: "./.env"
});

connectDB()
.then(() => { 
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})
.catch((err) => {
    console.error("Failed connecting to MongoDB:", err);
})




/*
import express from "express";
const app = express();
( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on("error", () => {
            console.error("Error connecting to MongoDB");
            throw error;
        })
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running on port ${process.env.PORT || 8000}`);
        });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
})()
*/