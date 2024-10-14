import React, { useState } from 'react';
import axios from 'axios';
import './MyOrders.css';

const OrderList = () => {
  const [username, setUsername] = useState('');
  const [userOrders, setUserOrders] = useState([]);
  const [error, setError] = useState(null);
  const [cancelMessages, setCancelMessages] = useState({});
  const [filterType, setFilterType] = useState(''); // State for filtering orders

  // Function to format date as YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/order');
      const allOrders = response.data;

      const today = formatDate(new Date());

      // Filter orders by username and today's date
      const filteredOrders = allOrders.filter((order) => {
        const orderDate = formatDate(new Date(order.date));
        return (
          order.username &&
          order.username.toLowerCase() === username.toLowerCase() &&
          orderDate === today
        );
      });

      let displayedOrders = filteredOrders;

      // Filter orders based on the filterType
      if (filterType === 'received') {
        displayedOrders = filteredOrders.filter(
          (order) => order.orderStatus === 'Completed'
        );
      } else if (filterType === 'cancelled') {
        displayedOrders = filteredOrders.filter(
          (order) => order.orderStatus === 'Cancelled'
        );
      } else if (filterType === 'all') {
        displayedOrders = filteredOrders;
      }

      // Set user orders and handle error messages
      if (displayedOrders.length > 0) {
        setUserOrders(displayedOrders);
        setError(null); // Clear previous errors
      } else {
        setError('No matching orders for today or the selected filter.');
        setUserOrders([]); // Clear previous results
      }
    } catch (error) {
      setError('Error fetching orders for the username.');
      console.error(error);
    }
  };

  const handleCancelOrder = async (orderId, orderDate) => {
    const currentTime = new Date();
    const orderTime = new Date(orderDate);
    const currentTimeUTC = currentTime.getTime();
    const orderTimeUTC = orderTime.getTime();
    const timeDifference = currentTimeUTC - orderTimeUTC;
    const hoursDifference = timeDifference / (1000 * 60 * 60); // Calculate the time difference in hours

    let updatedCancelMessages = { ...cancelMessages };

    if (hoursDifference > 12) {
      // If the order was placed more than 12 hours ago, show an error message
      updatedCancelMessages[orderId] =
        'Sorry, you cannot cancel the order as more than 12 hours have passed since it was placed.';
    } else {
      try {
        await axios.put(`http://localhost:3001/api/order/cancel/${orderId}`);
        updatedCancelMessages[orderId] = 'Order has been successfully canceled.';
        handleSearch(); // Optionally, refresh the orders list
      } catch (error) {
        console.error('Error canceling the order:', error);
        updatedCancelMessages[orderId] = 'Error canceling the order.';
      }
    }

    setCancelMessages(updatedCancelMessages);
  };

  return (
    <div className="order-list">
      <h2>Search Orders by Username and Filter</h2>
      <div className="search-container">
        {/* Username input field */}
        <input
          type="text"
          placeholder="Please enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Dropdown for filtering orders */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="filter-select"
        >
          <option value="">Select a filter type</option>
          <option value="all">All Orders</option>
          <option value="received">Received (Completed Orders)</option>
          <option value="cancelled">Cancelled Orders</option>
        </select>

        {/* Search button */}
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Display error messages if any */}
      {error && <p className="error-message">{error}</p>}

      {/* Display the orders in cards */}
      <div className="order-cards">
        {userOrders.length > 0 ? (
          userOrders.map((order) => (
            <div key={order._id} className="order-card">
              <h3>Order Number: {order.orderNumber}</h3>
              <p><strong>Item Name:</strong> {order.itemName}</p>
              <p><strong>Quantity:</strong> {order.quantity}</p>
              <p><strong>Total Amount:</strong> ${order.totAmount}</p>
              <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
              <p><strong>Order Status:</strong> {order.orderStatus || 'Pending'}</p>

              {/* Cancel Order Button */}
              {order.orderStatus !== 'Cancelled' && (
                <button
                  className="cancel-button"
                  onClick={() => handleCancelOrder(order._id, order.date)}
                >
                  Cancel Order
                </button>
              )}

              {/* Error or success message specific to this order */}
              {cancelMessages[order._id] && (
                <p className="cancel-message">{cancelMessages[order._id]}</p>
              )}
            </div>
          ))
        ) : (
          <p>No orders available</p>
        )}
      </div>
    </div>
  );
};

export default OrderList;
