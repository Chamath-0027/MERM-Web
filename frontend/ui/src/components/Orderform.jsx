import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './Orderform.css';

function Orderform({ selectedItem }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    address: '',
    phoneNumber: '',
    date: '',
    time: '',
    itemName: selectedItem ? selectedItem.name : '',
    quantity: 1,
    totAmount: selectedItem ? selectedItem.price : 0,
    paymentType: '',
  });

  const [error, setError] = useState({});
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    if (formData.itemName && formData.quantity) {
      const price = selectedItem ? selectedItem.price : 0;
      setFormData((prevData) => ({
        ...prevData,
        totAmount: price * formData.quantity,
      }));
    }
  }, [formData.itemName, formData.quantity, selectedItem]);

  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    setFormData((prevData) => ({
      ...prevData,
      date: currentDate,
      time: currentTime,
    }));
  }, []);

  const handleValidation = () => {
    const errors = {};
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailPattern.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }

    const phonePattern = /^[0-9]{10}$/;
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!phonePattern.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Phone number should be exactly 10 digits';
    }

    if (!formData.paymentType.trim()) {
      errors.paymentType = 'Please select a payment type';
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'quantity' ? Number(value) : value,
    }));

    setError((prevError) => ({
      ...prevError,
      [name]: '',
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    const newErrors = handleValidation();

    if (newErrors[name]) {
      setError((prevError) => ({
        ...prevError,
        [name]: newErrors[name],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const newErrors = handleValidation();

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      setShowErrorPopup(true);
      return;
    }

    setIsLoading(true);

    try {
      await axios.post('http://localhost:3001/api/order', formData);
      setSuccess('Order submitted successfully!');
      setShowSuccessPopup(true);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred";
      setError({ general: `Error: ${errorMessage}` });
      setShowErrorPopup(true);
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDF = () => {
    const input = document.getElementById('order-summary');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 0, 0);
      pdf.save('order-summary.pdf');
    });
  };

  const closeErrorPopup = () => {
    setShowErrorPopup(false);
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
    setFormData({
      username: '',
      email: '',
      address: '',
      phoneNumber: '',
      date: '',
      time: '',
      itemName: selectedItem ? selectedItem.name : '',
      quantity: 1,
      totAmount: selectedItem ? selectedItem.price : 0,
      paymentType: '',
    });
    navigate('/');
  };

  return (
    <div className="order-form-container">
      {error.general && <p className="error-message">{error.general}</p>}
      {success && <p className="success-message">{success}</p>}

      {showErrorPopup && (
        <div className="popup-container">
          <div className="popup">
            <h2>Error!</h2>
            <p>{error.general}</p>
            <button onClick={closeErrorPopup} className="close-popup-btn">Close</button>
          </div>
        </div>
      )}

      {showSuccessPopup && (
        <div className="popup-container">
          <div className="popup">
            <h2>Order Submitted Successfully!</h2>
            <div id="order-summary">
              <p><strong>Username:</strong> {formData.username}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Address:</strong> {formData.address}</p>
              <p><strong>Phone Number:</strong> {formData.phoneNumber}</p>
              <p><strong>Date:</strong> {formData.date}</p>
              <p><strong>Time:</strong> {formData.time}</p>
              <p><strong>Item Name:</strong> {formData.itemName}</p>
              <p><strong>Quantity:</strong> {formData.quantity}</p>
              <p><strong>Total Amount:</strong> {formData.totAmount}</p>
              <p><strong>Payment Type:</strong> {formData.paymentType}</p>
            </div>
            <button onClick={generatePDF} className="generate-pdf-btn">Generate PDF</button>
            <button onClick={closeSuccessPopup} className="close-popup-btn">Close</button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="order-form">
        <div className="form-field">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {error.username && <span className="error-text">{error.username}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {error.email && <span className="error-text">{error.email}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {error.address && <span className="error-text">{error.address}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {error.phoneNumber && <span className="error-text">{error.phoneNumber}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            readOnly
          />
        </div>

        <div className="form-field">
          <label htmlFor="time">Time:</label>
          <input
            type="text"
            id="time"
            name="time"
            value={formData.time}
            readOnly
          />
        </div>

        <div className="form-field">
          <label htmlFor="itemName">Item Name:</label>
          <input
            type="text"
            id="itemName"
            name="itemName"
            value={formData.itemName}
            readOnly
          />
        </div>

        <div className="form-field">
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="1"
          />
        </div>

        <div className="form-field">
          <label htmlFor="totAmount">Total Amount:</label>
          <input
            type="text"
            id="totAmount"
            name="totAmount"
            value={formData.totAmount}
            readOnly
          />
        </div>

        <div className="form-field">
          <label htmlFor="paymentType">Payment Type:</label>
          <select
            id="paymentType"
            name="paymentType"
            value={formData.paymentType}
            onChange={handleChange}
            required
          >
            <option value="">Select Payment Type</option>
            <option value="Cash">Cash</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
          {error.paymentType && <span className="error-text">{error.paymentType}</span>}
        </div>

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit Order'}
        </button>
      </form>
    </div>
  );
}

export default Orderform;
