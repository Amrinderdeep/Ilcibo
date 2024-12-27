import express  from "express"
const cors = require('cors');
import { connectDB } from "./config/db.js"
import userRouter from "./routes/userRoute.js"
import foodRouter from "./routes/foodRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import orderModel from "../models/orderModel.js";
import jwt from 'jsonwebtoken'

// app config
const app = express()
const port = process.env.PORT || 4000;

// middlewares
app.use(express.json())
app.use(cors());

// db connection
connectDB()

app.post("/api/order/placecod", async (req, res) => {
  try {
    console.log("Route reached");

    // Save the order to the database
    const newOrder = new orderModel({
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      payment: true,
    });

    console.log(newOrder, "newOrder Backend");
    await newOrder.save();

    // Clear the user's cart
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    // Generate a JWT with the order details
    const tokenPayload = {
      orderId: newOrder._id,
      items: newOrder.items,
      amount: newOrder.amount,
      address: newOrder.address,
      payment: newOrder.payment,
    };

    const orderToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '2h' });
      
    // Send the response
    res.status(200).json({
      success: true,
      message: "Order Placed",
      token: orderToken, // Optionally include this for frontend debugging
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error placing the order", error: error.message });
  }
});

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/food", foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/cart", cartRouter)
app.use("/api/order",orderRouter)



app.get("/", (req, res) => {
    res.send("API Working")
});

app.listen(port, () => console.log(`Server started on http://localhost:${port}`))