import React from 'react';
import { Bar } from 'react-chartjs-2';
import './OrderItemsChart.css'; // Ensure CSS is imported

const OrderItemsChart = ({ orders }) => {
  const itemCounts = orders.reduce((acc, order) => {
    const { itemName, quantity } = order;
    acc[itemName] = (acc[itemName] || 0) + quantity;
    return acc;
  }, {});

  const labels = Object.keys(itemCounts);
  const data = Object.values(itemCounts);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Number of Items Ordered',
        data: data,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="order-items-chart-container">
      <h2>Order Items Report</h2>
      <div className="chart">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default OrderItemsChart;
