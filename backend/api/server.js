import express from "express";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import foodRouter from "./routes/foodRoute.js";
import 'dotenv/config';
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import orderModel from "../models/orderModel.js";
import jwt from 'jsonwebtoken';


// app config
const app = express();
const port = process.env.PORT || 4000;
const cors = require('cors');
app.options('*', cors()); // Enable pre-flight for all routes

// CORS configuration
app.use(cors({
  origin:true,
  credentials:true,
  preflightContinue:true
}));
app.use(express.json()); // Middleware to parse JSON requests

// db connection
connectDB();

// API routes
app.use("/api/user", userRouter);
app.use("/api/food", foodRouter);
app.use("/images", express.static('uploads'));
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);


app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => console.log(`Server started on http://localhost:${port}`));