// setup connection to mongo
const mongoose = require('mongoose');
const DB_URL = (process.env.DB_URL || 'mongodb+srv://loscangripayos:pCyjGMTX326IeYKE@books-service.lsehjih.mongodb.net/?retryWrites=true&w=majority&writeConcern=majority')
console.log("Conneting to database: %s", DB_URL);

mongoose.connect(DB_URL);
const db = mongoose.connection;

//recover from errors
db.on('error', console.error.bind(console, 'db connection error'));

module.exports = db;