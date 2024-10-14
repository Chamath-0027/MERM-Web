
//app.jsx

import { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Import router components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import OrderSummary from './components/OrderSummary';
import Orderform from './components/Orderform';
import ItemsMenu from './components/ItemsMenu';
import MyOrders from './components/MyOrders';
import OrderItemsChart from './components/OrderItemsChart';

function App() {
  // State to track the selected item
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ItemsMenu setSelectedItem={setSelectedItem} />} />
        <Route path="/chart" element={<OrderItemsChart />} />
        <Route path="/orderform" element={<Orderform selectedItem={selectedItem} />} />
        <Route path="/orders" element={<OrderSummary />} />
        <Route path="/myOrders" element={<MyOrders/>} />

        
        
        {/* Add more routes as needed */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;




