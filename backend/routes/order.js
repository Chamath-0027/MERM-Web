

//3
const express = require("express");
const router = express.Router();
const Order = require("../models/orders");  // Ensure consistent naming


// Test route to verify the route works
router.get("/test", (req, res) => res.send("Order route is working"));

// POST: Create a new order
router.post("/", (req, res) => {
    console.log("Request Body:", req.body); // Log the incoming request body
    Order.create(req.body)
        .then(() => res.status(201).json({ msg: "Order created successfully!" }))
        .catch((err) => {
            console.error("Error creating order:", err); // Log the error
            res.status(400).json({ msg: "Order creation failed", error: err.message });
        });
});

// GET: Fetch all orders
router.get("/", (req, res) => {
    Order.find()
        .then((orders) => res.status(200).json(orders))  // Return list of orders with 200 status
        .catch(() => res.status(400).json({ msg: "Orders not found" }));
});

// GET: Fetch one order by ID
router.get("/:id", (req, res) => {
    Order.findById(req.params.id)
        .then((order) => {
            if (order) {
                res.status(200).json(order);  // If order found, return it
            } else {
                res.status(404).json({ msg: "Order not found" });  // Return 404 if not found
            }
        })
        .catch(() => res.status(400).json({ msg: "Error retrieving order" }));
});

// PUT: Update an existing order by ID
router.put("/:id", (req, res) => {
    Order.findByIdAndUpdate(req.params.id, req.body, { new: true })  // { new: true } returns the updated document
        .then((updatedOrder) => {
            if (updatedOrder) {
                res.status(200).json({ msg: "Order updated successfully!", order: updatedOrder });
            } else {
                res.status(404).json({ msg: "Order not found" });
            }
        })
        .catch((err) => res.status(400).json({ msg: "Order update failed", error: err.message }));
});

// DELETE: Delete an order by ID
router.delete("/:id", (req, res) => {
    Order.findByIdAndDelete(req.params.id)
        .then((deletedOrder) => {
            if (deletedOrder) {
                res.status(200).json({ msg: "Order deleted successfully!" });
            } else {
                res.status(404).json({ msg: "Order not found" });
            }
        })
        .catch((err) => res.status(400).json({ msg: "Order deletion failed", error: err.message }));
});

module.exports = router;


