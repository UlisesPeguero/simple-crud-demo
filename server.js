require('dotenv').config(); // loads all the key pairs from .env into process.env
const express = require('express'); // get express from modules
const app = express(); // create application from express
const cors = require('cors');
const mongoose = require('mongoose'); // get mongoose from modules
const PORT = process.env.PORT || 8080; // port for express to listen on
// || makes so that in case that the file .env is not created it defaults to 8080
// connect to the database
require('./database');
// get the Student model
const Student = require('./models/student');

// template express server
//app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json()); // specify that we are using json objects to request and response

// define public folder
app.use('/' /* route */ , 
        express.static('public') /* folder to expose */);

// routes 
/*        
    /students/      get post
    /students/:id   get put delete   
*/
// GET localhost:PORT/students
// model.find -> mongoose model method
//  model.find(callback(error, result));
app.get('/students', (request, response) => {
    Student.find((error /* error message if there was an error*/
                , result /* result from search */) => {
        if(error) { // if error is not empty send error message
            response.status(400).json({
                message: 'Data was not found',
                error: error.message
            });
        } else { // if there was no error return result
            response.json(result);
        }
    });
});

// POST localhost:PORT/students
// model.save -> mongoose model method
// save is a promise and uses then-catch
app.post('/students', (request, response) =>  {
    // new instance of model Student
    let student = new Student(request.body);  // body is teh data we sent from the request
    // insert document into the collection
    student.save()// attempts to save into the database
        .then( newStudent => { // successful saving, newStudent gives us the new student created
            response.json({ // respond to the client with a success message
                success: true, // this can be anything
                student: newStudent // we send the new created student back
            });
        })
        .catch(error => { // couldn't be save
            console.log(error); // log in the console
            response.status(400).json({ // respond to the client with a failure message
                success: false, // this can be anything
                message: 'There was an error trying to create the Student.',
                error: error.message
            });
        });
});

// GET /students/:id
// model.findById -> mongoose model method
// model.findById(search, callback(error, result) )
app.get('/students/:id', (request, response) => {
    const id = request.params.id; // get parameter id from request
    Student.findById( // search by id in model Student
        id, // id to search for
        (error, result) => { // callback with error or result
            if(error) { // there is an error
                response.status(400); // status = 400
                response.json({ // Display error message
                    message: 'Data was not found.',
                    error: error.message
                });
            } else {
                response.json(result); // Display document found
            }
        }
    )
});

// PUT /students/:id
// model.findById
// model.save
app.put('/students/:id', (request, response) => {
    const id = request.params.id; // get id form request params
    const data = request.body; // body is the data we sent from the request
    // get the document to update
    Student.findByIdAndUpdate(
        id, // the id to search for
        data, // the new data for the document
        { new: true }) // {new: true} tells mongoose to return the new modified student
        .then((updatedStudent) => {
            if (!updatedStudent) { // if the updatedStudent doesn't have data, the ticket couldn't be found
                response.status(400); // status = 400
                response.json({ // respond to client with an error message
                    message: 'Data was not found.',
                    success: false,
                });
            } else { // if updatedStudent has data, means that it was found and updated
                response.json({ // respond to client with a success message and the updatedStudent
                    success: true,
                    student: updatedStudent
                });
            }
        })
        .catch(error => { // there was an error while trying to search and update it
            console.log(error); // log in the console
            response.status(500); // status = 500
            response.json({ // respond to the client with a failure message
                success: false,
                message: "Could not update user ",
                error: error.message || 'An error has ocurred'
            });
        });
});

// DELETE /students/:id
// model.deleteOne -> mongoose model method
// model.deleteOne(search, callback(error, result))
app.delete('/students/:id', (request, response) => {
    const id = request.params.id; // id = request.params.id
    Student.findByIdAndRemove(id)
    .then((deletedStudent) => {
        if (!deletedStudent) { // if the deletedStudent doesn't have data, it couldn't be found
            response.status(400); // status = 400
            response.json({ // respond to client with an error message
                message: 'Data was not found.',
                success: false,
            });
        } else {// if updatedTicket has data, means that it was found and updated
            response.json({ // respond to client with a success message 
                success: true
            });
        }
    })
    .catch(error => { // there was an error while trying to search and delete it
        console.log(error); // log in the console
        response.status(500); // status = 500
        response.json({ // respond to the client with a failure message
            success: false,
            message: "Could not delete user ",
            error: error.message || 'An error has ocurred'
        });
    });
});

// start server
// last method to execute
app.listen(PORT, () => console.log(`Express server listening on port ${PORT}`));