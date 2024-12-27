import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js"
import Stripe from 'stripe';
import jwt from 'jsonwebtoken';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//config variables
const currency = "inr";
const deliveryCharge = 0;
const frontend_URL = 'https://ilcibo-pizzeria.onrender.com';


// Placing User Order for Frontend using stripe
const placeOrder = async (req, res) => {

    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
         address:req.body.address
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100 
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: "Delivery Charge"
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${frontend_URL}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_URL}/verify?success=false&orderId=${newOrder._id}`,
            line_items: line_items,
            mode: 'payment',
        });

        res.json({ success: true, session_url: session.url });
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,  Accept, x-client-key, x-client-token, x-client-secret, Authorization");
          next();
        console.log(res,"res ordercontroller");
        
        console.log(session,"session");
        

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })

    }
}

  
const placeOrderCod = async (req, res) => {
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
        
      // Set the cookie for the token
    //   res.cookie('orderToken', orderToken, {
    //     httpOnly: true, // Ensures the cookie is not accessible via JavaScript
    //     secure: true, // Ensures the cookie is sent only over HTTPS
    //     sameSite: 'None', // Required for cross-origin requests
    //     maxAge: 2 * 60 * 60 * 1000, // 2 hours
    //   });
  
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
  };


// Listing Order for Admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders })
        console.log(res,"orders response in order controller");
        
       
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// User Orders for Frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

const updateStatus = async (req, res) => {
    console.log(req.body);
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated" })
    } catch (error) {
        res.json({ success: false, message: "Error" })
    }

}

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Paid" })
        }
        else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({ success: false, message: "Not Paid" })
        }
    } catch (error) {
        res.json({ success: false, message: "Not  Verified" })
    }

}

export { placeOrder, listOrders, userOrders, updateStatus, verifyOrder, placeOrderCod }