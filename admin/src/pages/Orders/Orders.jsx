import React, { useEffect, useState } from 'react'
import './Orders.css'
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets, url, currency } from '../../assets/assets';

const Order = () => {

  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        console.log(response,"risponse order admin");
        console.log(response,"risponse order dataaaa");

        
        const reversedOrders = [...response.data.data].reverse(); // Clone and reverse
        setOrders(reversedOrders); // Set reversed data to state
        // console.log(reversedOrders, "Orders reverseddd");
        console.log(orders, "Orderss ");

      } else {
        toast.error("Error");
        console.log(response, "API Error");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  

  const statusHandler = async (event, orderId) => {
    console.log(event, orderId);
    const response = await axios.post(`${url}/api/order/status`, {
      orderId,
      status: event.target.value
    })
    console.log(orders,"ordersssss");

    console.log(response,"admin orders response");
    if (response.data.success) {
      await fetchAllOrders();
    }
    console.log(orders,"orderssss");
  }


  useEffect(() => {
    fetchAllOrders();
  }, [])

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className='order-item'>
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className='order-item-food'>
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + " x " + item.quantity
                  }
                  else {
                    return item.name + " x " + item.quantity + ", "
                  }
                })}
              </p>
              <p className='order-item-name'>{order.address?.fullName}</p>
              <div className='order-item-address'>
             
              <p className='order-item-name'>{order.address?.carNo}</p>
              <p className='order-item-name'>{order.address?.phone}</p>

             
              </div>
              <p className='order-item-phone'>{order.fullName}</p>
            </div>
            <p>Items : {order.items.length}</p>
            <p>{currency}{order.amount}</p>
            <select onChange={(e) => statusHandler(e, order._id)} value={order.status} name="" id="">
              <option value="Food Processing">Food Processing</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Order
