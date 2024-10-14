import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OrderSummary.css';
import EditOrderModal from './EditOrderModal'; // Import the modal component
import { jsPDF } from 'jspdf'; // Import jsPDF
import 'jspdf-autotable'; // Import the autoTable plugin
import { Bar } from 'react-chartjs-2'; // Import Bar chart component from Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const OrderSummary = () => {
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Single search query state

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/order');

        // Auto-generate order numbers and format them to three digits
        const ordersWithNumbers = response.data.map((order, index) => ({
          ...order,
          orderNumber: String(index + 1).padStart(3, '0'), // Format order number to three digits
        }));

        setOrders(ordersWithNumbers);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleDelete = async (orderId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this order?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3001/api/order/${orderId}`);
        setOrders(orders.filter(order => order._id !== orderId)); // Update state
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true); // Open the modal
  };

  const handleSave = async (updatedOrder) => {
    try {
      await axios.put(`http://localhost:3001/api/order/${updatedOrder._id}`, updatedOrder);
      setOrders(orders.map(order => (order._id === updatedOrder._id ? updatedOrder : order)));
      setIsModalOpen(false); // Close the modal
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  // Function to format date to 'YYYY-MM-DD'
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Function to generate PDF data from the orders
  const generatePDF = () => {
    if (orders.length === 0) {
      alert("No orders to generate a report");
      return;
    }

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [350, 210],
      putOnlyUsedFonts: true,
      floatPrecision: 16,
    });

    doc.setFontSize(16);
    doc.text("Order Report", 14, 22);

    const headers = ["Order Number", "Username", "Email", "Address", "Phone Number", "Date", "Time", "Item Name", "Quantity", "Total Amount", "Payment Type", "Order Status"];
    const rows = orders.map(order => [
      order.orderNumber, // Add order number to the rows
      order.username,
      order.email,
      order.address,
      order.phoneNumber,
      formatDate(order.date),
      order.time,
      order.itemName,
      order.quantity,
      order.totAmount,
      order.paymentType,
      order.orderStatus || 'Pending', // Include order status in PDF
    ]);

    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 30,
      theme: 'grid',
      margin: { right: 10 },
    });

    doc.save('order_report.pdf'); // Save the generated PDF
  };

  // Filter orders based on the single search query, including orderNumber
  const filteredOrders = orders.filter(order => {
    const searchLower = searchQuery.toLowerCase();

    // Check if searchQuery matches any relevant field (orderNumber, username, itemName, etc.)
    return (
      order.orderNumber.includes(searchQuery) || // Check if orderNumber matches the search query
      order.username?.toLowerCase().includes(searchLower) ||
      order.email?.toLowerCase().includes(searchLower) ||
      order.address?.toLowerCase().includes(searchLower) ||
      order.phoneNumber?.toLowerCase().includes(searchLower) ||
      order.itemName?.toLowerCase().includes(searchLower) ||
      (order.orderStatus?.toLowerCase() || 'pending').includes(searchLower)
    );
  });

  // Data for the order status chart
  const orderCounts = orders.reduce((acc, order) => {
    const status = order.orderStatus || 'Pending';
    acc[status] = (acc[status] || 0) + 1; // Count the orders by status
    return acc;
  }, {});

  const orderStatusChartData = {
    labels: Object.keys(orderCounts), // Order statuses
    datasets: [
      {
        label: 'Number of Orders',
        data: Object.values(orderCounts), // Count of orders per status
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const orderStatusChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Order Status Distribution',
      },
    },
  };

  // Data for the item sold chart
  const itemCounts = orders.reduce((acc, order) => {
    acc[order.itemName] = (acc[order.itemName] || 0) + order.quantity; // Count items sold by name
    return acc;
  }, {});

  const itemSoldChartData = {
    labels: Object.keys(itemCounts), // Item names
    datasets: [
      {
        label: 'Items Sold',
        data: Object.values(itemCounts), // Count of items sold
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const itemSoldChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Items Sold',
      },
    },
  };

  return (
    <div className="order-summary">
      <h1>Order Summary</h1>
      <div className="header">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by order number, item name, order status, etc..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="generate-report-btn" onClick={generatePDF}>Generate Report as PDF</button>
      </div>
      <div className="charts-container">
        <div className="chart">
          <Bar data={orderStatusChartData} options={orderStatusChartOptions} /> {/* Order Status Chart */}
        </div>
        <div className="chart">
          <Bar data={itemSoldChartData} options={itemSoldChartOptions} /> {/* Item Sold Chart */}
        </div>
      </div>
      <table className="order-table">
        <thead>
          <tr>
            <th>Order Number</th>
            <th>Username</th>
            <th>Email</th>
            <th>Address</th>
            <th>Phone Number</th>
            <th>Date</th>
            <th>Time</th>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Total Amount</th>
            <th>Payment Type</th>
            <th>Order Status</th> {/* New column for order status */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <tr key={order._id}>
                <td>{order.orderNumber}</td> {/* Display the formatted order number */}
                <td>{order.username}</td>
                <td>{order.email}</td>
                <td>{order.address}</td>
                <td>{order.phoneNumber}</td>
                <td>{formatDate(order.date)}</td>
                <td>{order.time}</td>
                <td>{order.itemName}</td>
                <td>{order.quantity}</td>
                <td>{order.totAmount}</td>
                <td>{order.paymentType}</td>
                <td>{order.orderStatus || 'Pending'}</td> {/* Display the order status */}
                <td>
                  <button className="edit-button" onClick={() => handleEdit(order)}>Edit</button>
                  <button className="delete-button" onClick={() => handleDelete(order._id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="12">No orders found</td>
            </tr>
          )}
        </tbody>
      </table>
      {isModalOpen && (
        <EditOrderModal
          order={selectedOrder}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default OrderSummary;
