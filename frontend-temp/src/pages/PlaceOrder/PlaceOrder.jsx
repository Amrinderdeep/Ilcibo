import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../Context/StoreContext'
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import jwt from 'jsonwebtoken';
import axios from 'axios';

const PlaceOrder = () => {

    const [payment, setPayment] = useState("cod")
    const [data, setData] = useState({
        fullName: "",
        phone: "",
        email: "",
        carNo: "",
      
       
    })

    const { getTotalCartAmount, token, food_list, cartItems, url, setCartItems,currency,deliveryCharge } = useContext(StoreContext);

    const navigate = useNavigate();

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setData(data => ({ ...data, [name]: value }))
    }

    const placeOrder = async (e) => {
        e.preventDefault()
        let orderItems = [];
        food_list.map(((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = item;
                itemInfo["quantity"] = cartItems[item._id];
                orderItems.push(itemInfo)
            }
        }))
        let orderData = {
            address:data,
            items: orderItems,
            amount: getTotalCartAmount() + deliveryCharge,
            payment: true
        }
        if (payment === "stripe") {
            let response = await axios.post(url + "/api/order/place", orderData, { headers: { token }, withCredentials: true });
            if (response.data.success) {
                const { session_url } = response.data;
                window.location.replace(session_url);
            }
            else {
                toast.error("Something Went Wrong")
            }
        }
        else{
            let response = await axios.post(url + "/api/order/placecod", 
              orderData, 
            );            
            if (response.data.success) {
                // Create a JWT token using the order ID
                const orderToken = jwt.sign(
                  { orderId: response.data.orderId,
                    address:data,
                    items: orderItems,
                    amount: getTotalCartAmount() + deliveryCharge,
                    payment: true
                  }, // Use the order ID from the response
                  "random#secret", // Replace with your JWT secret key
                  { expiresIn: '2h' }
                );
        
                // Store the token in localStorage
                localStorage.setItem('orderToken', orderToken);
        
                // Navigate and display success message
                navigate("/myorders");
                toast.success(response.data.message);
        
                // Clear the cart items
                setCartItems({});
            } else {
                toast.error("Something Went Wrong");
                console.log(response, "response");
            }
    }

    }

    // useEffect(() => {
    //     if (!token) {
    //         toast.error("to place an order sign in first")
    //         navigate('/cart')
    //     }
    //     else if (getTotalCartAmount() === 0) {
    //         navigate('/cart')
    //     }
    // }, [token])

    return (
        <form onSubmit={placeOrder} className='place-order'>
            <div className="place-order-left">
                <p className='title'>Delivery Information</p>
                <div className="multi-field">
                    <input type="text" name='fullName' onChange={onChangeHandler} value={data.fullName} placeholder='First name' required />
                 
                </div>
                <input type="email" name='email' onChange={onChangeHandler} value={data.email} placeholder='Email address' required />
                <input type="text" name='carNo' onChange={onChangeHandler} value={data.carNo} placeholder='Car Number' required />
            
             
                <input type="text" name='phone' onChange={onChangeHandler} value={data.phone} placeholder='Phone' required />
            </div>
            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Cart Totals</h2>
                    <div>
                        <div className="cart-total-details"><p>Subtotal</p><p>{currency}{getTotalCartAmount()}</p></div>
                        <hr />
                        <div className="cart-total-details"><p>Delivery Fee</p><p>{currency}{getTotalCartAmount() === 0 ? 0 : deliveryCharge}</p></div>
                        <hr />
                        <div className="cart-total-details"><b>Total</b><b>{currency}{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + deliveryCharge}</b></div>
                    </div>
                </div>
                <div className="payment">
                    <h2>Payment Method</h2>
                    <div onClick={() => setPayment("cod")} className="payment-option">
                        <img src={payment === "cod" ? assets.checked : assets.un_checked} alt="" />
                        <p>COD ( Cash on delivery )</p>
                    </div>
                {/*    <div onClick={() => setPayment("stripe")} className="payment-option">
                        <img src={payment === "stripe" ? assets.checked : assets.un_checked} alt="" />
                        <p>Stripe ( Credit / Debit )</p>
                    </div>*/}
                </div>
                <button className='place-order-submit' type='submit'>{payment==="cod"?"Place Order":"Proceed To Payment"}</button>
            </div>
        </form>
    )
}

export default PlaceOrder
