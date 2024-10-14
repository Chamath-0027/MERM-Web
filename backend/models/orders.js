const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    
    username: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true },
    totAmount: { type: Number, required: true },
    paymentType: { type: String, required: true },
    orderStatus: { type: String, default: 'pending' }, // Default order status to 'pending'
});

module.exports = mongoose.model('Order', orderSchema);
