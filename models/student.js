const mongoose = require('mongoose');

/*
Students
    - first name
    - last name
    - email
*/
// instantiate object Schema
let Student = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: String        
});

// allows to require this file
module.exports = mongoose.model('Student' /* Mongoose identifier */, Student /* Object Schema*/);