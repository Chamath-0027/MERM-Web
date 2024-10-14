
  const express = require('express');
  const dbConnection = require("./config/db");
  const routes = require("./routes/order");
  const bodyParser = require("body-parser");
  const cors = require("cors");
  const mongoose = require("mongoose");
  

  
  const app = express();
  
  app.use(cors({ origin: true, credentials: true }));
  
  dbConnection(); // connecting to the database
  
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.get("/", (req, res) => res.send("hello"));
  app.use("/api/order", routes);
  
  const PORT = 3001; // define the port here
  
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  

