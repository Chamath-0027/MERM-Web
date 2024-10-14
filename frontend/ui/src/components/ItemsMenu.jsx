import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ItemsMenu.css';  // Assuming you have a CSS file for styling

const items = [
  { name: 'Pot', price: '500', image: '/Images/pots.jpg', description: 'A durable pot for various uses.' },
  { name: 'Basket', price: '350', image: '/Images/basket.png', description: 'A woven basket for storage.' },
  { name: 'Bottle', price: '650', image: '/Images/bottle.png', description: 'A plastic bottle for liquids.' },
  { name: 'Carpet', price: '900', image: '/Images/carpet.jpg', description: 'A decorative carpet for your home.' },
  { name: 'Trash Bags', price: '200', image: '/Images/trashbag.jpeg', description: 'Heavy-duty trash bags.' },
  { name: 'Toys', price: '1500', image: '/Images/toys.jpg', description: 'Various toys for children.' },
  { name: 'Chair', price: '5000', image: '/Images/chairs.jpg', description: 'High-quality coffins for burial.' },
  { name: 'Recycled Outdoor Seatingset', price: '20,000', image: '/Images/Recycled-Outdoor-Seating.jpg', description: 'High-quality coffins for burial.' },
  { name: 'ECO Board Planter ', price: '2500', image: '/Images/ECO-BOARD-PLANTER2 .jpg ', description: 'High-quality coffins for burial.' },
  { name: 'Eco Board Tray', price: '50000', image: '/Images/ECO-BOARD-TRAY.jpg', description: 'High-quality coffins for burial.' },
  { name: 'Neck Pillow', price: '50000', image: '/Images/neck pillow.jpg', description: 'High-quality coffins for burial.' },
  { name: 'Eco Board Coaster', price: '50000', image: '/Images/ECO-BOARDS-COASTER.jpg', description: 'High-quality coffins for burial.' },
  { name: 'Hat', price: '50000', image: '/Images/hat.jpg', description: 'High-quality coffins for burial.' },
  { name: 'Eco Board Roofing Sheets', price: '10000', image: '/Images/sheet.jpeg', description: 'High-quality coffins for burial.' },
  { name: 'Laptop Bag', price: '50000', image: '/Images/Laptop Sleeve.jpg', description: 'High-quality coffins for burial.' },
  { name: 'Recycle M FOLD Tissue Papers (PACK OF 10)', price: '500', image: '/Images/M_Fold_1.jpg', description: 'High-quality coffins for burial.' },
  { name: 'hand bag', price: '50000', image: '/Images/Pan-Bag-BRN1.jpg', description: 'High-quality coffins for burial.' },
  { name: 'Photo frame', price: '50000', image: '/Images/Photo_frame_side.jpg', description: 'High-quality coffins for burial.' },
  { name: 'Table Mat', price: '3500', image: '/Images/table mat.jpg', description: 'High-quality coffins for burial.' },
  { name: 'Toilet Roll', price: '1000', image: '/Images/Toilet_roll_1.jpg', description: 'High-quality coffins for burial.' },





  
];

const ItemsMenu = ({ setSelectedItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showPopup, setShowPopup] = useState(true);  // State for showing the popup
  const navigate = useNavigate();

  // Handle search term input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase()); // Convert to lowercase to make search case-insensitive
  };

  // Close the popup
  const closePopup = () => {
    setShowPopup(false);
  };

  // Filter items based on search term
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm) // Filter by item name
  );

  const handleSelect = (item) => {
    setSelectedItem(item);  // Set the selected item object
    navigate('/orderform'); // Navigate to the order form page
  };

  return (
    <div className="items-menu-container">
      {/* Popup Modal */}
      {showPopup && (
        <div className="popup-container">
          <div className="popup">

            <img src="/Images/recycle products.jpg" alt="Welcome" className="popup-image" />
            <h2>Welcome  to our store!</h2>

            <p>Explore our eco-friendly range of products designed for sustainable living. From durable pots and baskets to high-quality trash bags and more, every item contributes to reducing waste and promoting a greener environment. Let's recycle, reuse, and make a positive impact on the planet!</p>
            <button onClick={closePopup} className="close-popup-btn">Close</button>
          </div>
        </div>
      )}

      {/* Search input */}
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search products..."
          className="search-input"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Items menu */}
      <div className="items-menu">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <div key={index} className="item-card" onClick={() => handleSelect(item)}>
              <img src={item.image} alt={item.name} className="item-image" />
              <h3 className="item-name">{item.name}</h3>
              <p className="item-price">Rs. {item.price}</p>
            </div>
          ))
        ) : (
          <p className="no-results">No items found.</p>
        )}
      </div>
    </div>
  );
};

export default ItemsMenu;







