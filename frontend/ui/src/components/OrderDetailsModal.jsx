import React from 'react';
import './OrderDetailsModal.css'; // Import the CSS file for styling

const OrderDetailsModal = ({ isOpen, onClose, order }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Order Submitted Successfully!</h2>
        <div className="order-details-grid">
          <div className="detail-label">Order Number:</div>
          <div className="detail-value">{order.orderNumber}</div>

          <div className="detail-label">Username:</div>
          <div className="detail-value">{order.username}</div>

          <div className="detail-label">Email:</div>
          <div className="detail-value">{order.email}</div>

          <div className="detail-label">Address:</div>
          <div className="detail-value">{order.address}</div>

          <div className="detail-label">Phone Number:</div>
          <div className="detail-value">{order.phoneNumber}</div>

          <div className="detail-label">Item Name:</div>
          <div className="detail-value">{order.itemName}</div>

          <div className="detail-label">Quantity:</div>
          <div className="detail-value">{order.quantity}</div>

          <div className="detail-label">Total Amount:</div>
          <div className="detail-value">${order.totAmount}</div>

          <div className="detail-label">Payment Type:</div>
          <div className="detail-value">{order.paymentType}</div>
        </div>
        <button className="modal-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
