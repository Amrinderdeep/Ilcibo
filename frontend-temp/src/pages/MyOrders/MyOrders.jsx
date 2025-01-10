import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import axios from 'axios'
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import {jwtDecode} from 'jwt-decode';

const MyOrders = () => {
  
  const [data,setData] =  useState(null);
  const {url,currency} = useContext(StoreContext);

  const loadOrdersFromToken = () => {
    const orders = [];
    // const token = localStorage.getItem('orderToken'); // Fetch the token

    // if (token) {
    //   try {
    //     const decodedToken = jwtDecode(token);
    //     console.log(decodedToken)
    //     setData(decodedToken)
    //   } catch (error) {
    //     console.error('Error decoding token:', error);
    //   }
    // } else {
    //   console.error('No token found in storage');
    // }
  };

  useEffect(() => {
    loadOrdersFromToken(); // Load orders on component mount
  }, []);

  // const fetchOrders = async () => {
  //   const response = await axios.post(url+"/api/order/userorders",{},{headers:{token}});
  //   setData(response.data.data)
  // }

  // useEffect(()=>{
  //   if (token) {
  //     fetchOrders();
  //   }
  // },[token])
  if (!data) {
    return (
      <div className="my-orders">
        <h2>My Orders</h2>
        <p>No orders found.</p>
      </div>
    );
  }
  return (
    <div className='my-orders'>
      <h2>My Order</h2>
      <div className="container">
        <div className='my-orders-order'>
          <img src={assets.parcel_icon} alt="Parcel Icon" />
          <p>Order ID: {data.orderId}</p>
          <p>
            Amount:{" "}
            {currency}
            {data.items.reduce((total, item) => total + item.price * item.quantity, 0)}
          </p>
          <p>Name: {data.address.fullName}</p>
          <p>Contact No: {data.address.phone}</p>

          <p>Items:</p>
            <ul>
              {data.items.map((item, index) => (
                <li key={index}>
                  {item.name} x {item.quantity} @ {currency}{item.price} each
                </li>
              ))}
            </ul>
          <button onClick={() => console.log(`Track order for ${data.orderID}`)}>
            Track Order
          </button>
        </div>
      </div>
    </div>
  )
}

export default MyOrders
