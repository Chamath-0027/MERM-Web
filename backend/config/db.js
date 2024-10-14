
   /* const mongoose = require('mongoose');
    const connection = require('./config/db');


const dbUrl = 'mongodb+srv://chamath:1234@cluster2.xna45.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2';

const connection = async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log('MongoDB connected');
  } catch (e) {
    console.error(e.message);
    process.exit();
  }
};

module.exports = connection;
*/

/*const mongoose = require('mongoose');

const dbUrl = 'mongodb+srv://chamath:1234@cluster2.xna45.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2';

const connectDB = async () => {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1); // Exit the process with failure if there's an error
  }
};

module.exports = connectDB;
*/

const mongoose = require('mongoose');

const dbUrl = 'mongodb+srv://chamath:1234@cluster2.xna45.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2';

const connectDB = async () => {
  try {
    await mongoose.connect(dbUrl); // No need to pass options
    console.log('MongoDB connected successfully');
  } catch (e) {
    console.error(e.message);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;
