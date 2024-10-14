import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; // Assuming you have some CSS styling

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Handle form submission
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (searchTerm.toLowerCase() === 'myorders') {
      // Navigate to /myOrders if "myorders" is searched
      navigate('/myOrders');
    } else {
      console.log('No matching suggestion');
      // Handle other search logic if needed
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        {/* Logo and brand name */}
        <Link to="/" className="navbar-brand">
          <img
            src="https://media.istockphoto.com/id/1384532150/vector/recycle-symbol-inside-circle-with-leaves-zero-waste-concept.jpg?s=612x612&w=0&k=20&c=lQPT8cj_dpkQBxa1G4Y6RzDz5vLog6OmWERx-vGpF_Y="
            alt="System Logo"
            width="100"
            height="80"
            className="me-2"
          />
          <span><b>Smart Bin</b></span>
        </Link>

        {/* Hamburger button for mobile view */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/myOrders" className="nav-link active" aria-current="page">
                My Orders
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/orders" className="nav-link">
                Orders
              </Link>
            </li>
          </ul>

          {/* Search form */}
          <form className="d-flex" role="search" onSubmit={handleSearch}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={searchTerm} // Bind input value to state
              onChange={(e) => setSearchTerm(e.target.value)} // Update state on input change
            />
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>

          {/* Profile picture */}
          <img
            src="https://t3.ftcdn.net/jpg/06/19/26/46/360_F_619264680_x2PBdGLF54sFe7kTBtAvZnPyXgvaRw0Y.jpg"
            alt="profile"
            width="80"
            height="80"
            className="ms-3"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
