import express from "express";
import cors from "cors";
import multer from "multer";
import connectDB from "./config/db.js";
import "dotenv/config";


const app = express()
const PORT = process.env.PORT || 4000;

//Middleware
app.use(cors())
app.use(express.json())
app.use(multer().none())

//Routes
app.get("/", (req, res)=> res.send("Server is running"))


const startServer = async () => {
  await connectDB();

  app.listen(PORT, () =>
    console.log(`Server is running on port ${PORT}`)
  );
};

startServer();