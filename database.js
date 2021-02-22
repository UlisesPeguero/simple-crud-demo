const mongoose = require('mongoose');

// Get your own mongodb "connection to application" string from cloud.mongodb.com
// and assign it to DB_CONNECTION IN .env
const DB_CONNECTION = process.env.DB_CONNECTION || 'mongodb://localhost:27017/students'; 
    // <password>: your password
    // <dbname>: students
// connect to the database
mongoose.connect(DB_CONNECTION, { // attemp to connect to the database
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => console.log(`MongoDB database connection established - ${DB_CONNECTION}.`)) // if connected

const connection = mongoose.connection; // we get the connection object from mongoose

// everytime there is an error on mongoose it will log on the console
connection.on('error', error => console.log(`Mongo error: ${error}`));
