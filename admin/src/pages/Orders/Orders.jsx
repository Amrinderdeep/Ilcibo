import React, { useEffect, useState } from 'react';
import './Orders.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets, url, currency } from '../../assets/assets';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  // Fetch all orders
  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        const reversedOrders = [...response.data.data].reverse(); // Clone and reverse
        setOrders(reversedOrders);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Handle status change
  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: event.target.value,
      });
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };


 // Filter orders by selected date
const filterByDate = (date) => {
  setSelectedDate(date);
  if (date) {
    const filtered = orders.filter(order => {
      if (!order.createdAt) return false; // Skip orders with missing createdAt
      const orderDate = new Date(order.createdAt);
      if (isNaN(orderDate.getTime())) return false; // Skip invalid dates
      return orderDate.toISOString().split("T")[0] === date;
    });
    setFilteredOrders(filtered);
  } else {
    setFilteredOrders(orders);
  }
};


  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className='order-page'>
      <h3>Order Page</h3>
      <div className="date-filter">
        <label htmlFor="order-date">Filter by Date:</label>
        <input
          type="date"
          id="order-date"
          value={selectedDate}
          onChange={(e) => filterByDate(e.target.value)}
        />
      </div>
      <div className="order-list">
        {(selectedDate ? filteredOrders : orders).map((order, index) => (
          <div key={index} className='order-item'>
            <img src={assets.parcel_icon} alt="Parcel Icon" />
            <div>
              <p className='order-item-food'>
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + " x " + item.quantity;
                  } else {
                    return item.name + " x " + item.quantity + ", ";
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
            <p>Items: {order.items.length}</p>
            <p>{currency}{order.amount}</p>
            <select onChange={(e) => statusHandler(e, order._id)} value={order.status}>
              <option value="Food Processing">Food Processing</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
