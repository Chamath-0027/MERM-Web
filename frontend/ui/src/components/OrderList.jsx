import React, { useState, useEffect } from "react";
import axios from "axios";
import OrderCard from "./OrderCard"; // Assuming you have an OrderCard component
import "./OrderList.css"; // Make sure to create a corresponding CSS file

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();

    const filtered = orders.filter((order) =>
      order.productName.toLowerCase().includes(lowerCaseQuery) // Change this according to your order data structure
    );
    setFilteredOrders(filtered);
  }, [searchQuery, orders]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/orders") // Adjust the endpoint if necessary
      .then((res) => {
        setOrders(res.data);
        setFilteredOrders(res.data);
      })
      .catch(() => {
        console.log("Error while getting data");
      });
  }, []);

  const onDeleteClick = (id) => {
    axios
      .delete(`http://localhost:3000/api/orders/${id}`) // Adjust the endpoint if necessary
      .then(() => {
        setOrders(orders.filter((order) => order._id !== id));
      })
      .catch((err) => {
        console.log("Delete error", err);
      });
  };

  const ordersList =
    filteredOrders.length === 0
      ? "No orders found!"
      : filteredOrders.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            onDelete={onDeleteClick}
          />
        ));

  return (
    <div className="Show_OrderList">
      <div className="container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search orders ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="list">{ordersList}</div>
      </div>
    </div>
  );
};

export default OrderList;
