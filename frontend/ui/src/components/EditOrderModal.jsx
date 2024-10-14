import React, { useState, useEffect } from 'react';
import './EditOrderModal.css'; // Import your CSS for modal styling

const EditOrderModal = ({ order, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    address: '',
    phoneNumber: '',
    date: '',
    time: '',
    itemName: '',
    quantity: 0,
    totAmount: 0,
    paymentType: '',
    orderStatus: 'Pending',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (order) {
      setFormData({
        username: order.username || '',
        email: order.email || '',
        address: order.address || '',
        phoneNumber: order.phoneNumber || '',
        date: order.date ? order.date.split('T')[0] : '',
        time: order.time || '',
        itemName: order.itemName || '',
        quantity: order.quantity || 0,
        totAmount: order.totAmount || 0,
        paymentType: order.paymentType || '',
        orderStatus: order.orderStatus || 'Pending',
      });
    }
  }, [order]);

  const validate = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username.trim()) newErrors.username = 'Username is required.';

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) newErrors.email = 'Email is required.';
    else if (!emailPattern.test(formData.email)) newErrors.email = 'Enter a valid email address.';

    // Address validation
    if (!formData.address.trim()) newErrors.address = 'Address is required.';

    // Phone number validation
    const phonePattern = /^\d{10}$/;
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required.';
    else if (!phonePattern.test(formData.phoneNumber)) newErrors.phoneNumber = 'Enter a valid 10-digit phone number.';

    // Date validation
    if (!formData.date) newErrors.date = 'Date is required.';

    // Time validation
    if (!formData.time) newErrors.time = 'Time is required.';

    // Item name validation
    if (!formData.itemName.trim()) newErrors.itemName = 'Item name is required.';

    // Quantity validation
    if (formData.quantity <= 0) newErrors.quantity = 'Quantity must be greater than 0.';

    // Total amount validation
    if (formData.totAmount <= 0) newErrors.totAmount = 'Total amount must be greater than 0.';

    // Payment type validation
    if (!formData.paymentType.trim()) newErrors.paymentType = 'Payment type is required.';

    // Order status validation
    if (!formData.orderStatus) newErrors.orderStatus = 'Order status is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'quantity' || name === 'totAmount' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({ ...order, ...formData }); // Combine the updated form data with existing order data
      onClose(); // Close the modal after saving
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Order</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
            {errors.address && <span className="error-message">{errors.address}</span>}
          </div>
          <div className="form-group">
            <label>Phone Number:</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
            {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
          </div>
          <div className="form-group">
            <label>Date:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
            {errors.date && <span className="error-message">{errors.date}</span>}
          </div>
          <div className="form-group">
            <label>Time:</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
            />
            {errors.time && <span className="error-message">{errors.time}</span>}
          </div>
          <div className="form-group">
            <label>Item Name:</label>
            <input
              type="text"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
            />
            {errors.itemName && <span className="error-message">{errors.itemName}</span>}
          </div>
          <div className="form-group">
            <label>Quantity:</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
            />
            {errors.quantity && <span className="error-message">{errors.quantity}</span>}
          </div>
          <div className="form-group">
            <label>Total Amount:</label>
            <input
              type="number"
              name="totAmount"
              value={formData.totAmount}
              onChange={handleChange}
            />
            {errors.totAmount && <span className="error-message">{errors.totAmount}</span>}
          </div>
          <div className="form-group">
            <label>Payment Type:</label>
            <input
              type="text"
              name="paymentType"
              value={formData.paymentType}
              onChange={handleChange}
            />
            {errors.paymentType && <span className="error-message">{errors.paymentType}</span>}
          </div>
          <div className="form-group">
            <label>Order Status:</label>
            <select
              name="orderStatus"
              value={formData.orderStatus}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            {errors.orderStatus && <span className="error-message">{errors.orderStatus}</span>}
          </div>
          <div className="modal-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOrderModal;
