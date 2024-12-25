import express  from "express"
import cors from 'cors'
import { connectDB } from "./config/db.js"
import userRouter from "./routes/userRoute.js"
import foodRouter from "./routes/foodRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"

// app config
const app = express()
const port = process.env.PORT || 4000;

// middlewares
app.use(express.json())
app.use(cors({
  origin: 'https://ilcibo-lovat.vercel.app', // Allow requests only from this origin
  credentials: true, // Allow credentials to be sent
}));

app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow credentials
  res.setHeader('Access-Control-Allow-Origin', 'https://ilcibo-lovat.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200); // Send HTTP 200 status to the preflight request
});

// db connection
connectDB()

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