// Cart.js
import React, { useContext } from 'react';
import { CartContext } from './CartContext';

const Cart = () => {
  const { cartItems, removeFromCart } = useContext(CartContext);

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cartItems.length > 0 ? (
        cartItems.map((item, index) => (
          <div key={index} className="cart-item">
            <h3>{item.name}</h3>
            <p>Price: Rs. {item.price}</p>
            <button onClick={() => removeFromCart(item)}>Remove</button>
          </div>
        ))
      ) : (
        <p>No items in the cart.</p>
      )}
    </div>
  );
};

export default Cart;
