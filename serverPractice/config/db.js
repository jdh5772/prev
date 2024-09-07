const {MongoClient} = require('mongodb');

const connectDB = new MongoClient(process.env.URL).connect();

module.exports = connectDB; 