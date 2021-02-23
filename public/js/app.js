///////| CONSTANTS DECLARATIONS |////////////////////////////////////////////////
// constants to idenfify what is the action we are doing
const CREATE = 0;
const UPDATE = 1;
const DELETE = 2;
// constant to access data from localStorage
const DATA = 'crudData';
///////| GLOBAL VARIABLES |/////////////////////////////////////////////////////

// keep track of the action we are currently working on
let action;
// keep track of the selected message index
let selectedId;
/* messages object
// {
        lastId: {number}, // this field will always exist and only keeps track of the last id that was used
        id: message,
        id2: message2
        .
        .
        .
    }
*/
let messages = {};

///////| FORM FUNCTIONS |//////////////////////////////////////////////////////

// Show or hides the form
//  params: 
//        show boolean (true or false)
function showForm(show) {
    // get element that contains the form
    let form = document.getElementById('formContainer');
    // https://www.w3schools.com/js/js_if_else.asp
    // if condition to see if we should show or hide the form
    if( show == true) { // if parameter show is true
        // removingt he class d-none makes the form visible and pushes the list down
        form.classList.remove('d-none');
    } else { // if parameter show is false
        // adding the class d-none hides the form
        form.classList.add('d-none');
    }    
}

function checkValidation() {
    return true;
}

// clears the form inputs
function clearForm() {
    // we get the first element of the Form into a variable to make the screen focus on it
    let input = document.getElementById('firstName');
    input.value = '';
    // the rest we can equals to empty directly
    document.getElementById('lastName').value = '';
    document.getElementById('email').value = '';
   // document.getElementById('program').selectedIndex = 0;    
    // set the focus of the input on the firstName
    input.focus();
    // in case the page has been scrolled down too much this would return it into view
    input.scrollIntoView();
}

// opens the form to create a new item
function createItem() {
    // change form title
    document.getElementById('formTitle').innerText = 'New Student';
    // call to show the form
    showForm(true);
    // we assign the action to create
    action = CREATE;
    // clear values
    clearForm();    
    //
    //document.getElementById('simpleMessage').focus();
}

// opens the form to edit an existing item
function updateItem(id){
    // change form title
    document.getElementById('formTitle').innerText = 'Edit Student';    
    // call to show the form
    showForm(true);
    // we assign the action to update
    action = UPDATE;
    // clear values
    clearForm();
    // populate the form with the information to edit
    // get the textarea HTML element and set the value
    document.getElementById('simpleMessage').value = messages[id];        
    // set selected id
    selectedId = id;
}

// removes item from the list
function removeItem(id) {
    // executes the browser confirm window that gives the option of yes or no, the answer is boolean and pass onto variable response
    let response = confirm('Do you want to remove the message "' + messages[id] + '" ?');
    // we check for the response
    if(response === true) { // if answer was yes or ok
        // remove the message from the object
        // https://www.w3schools.com/howto/howto_js_remove_property_object.asp
        delete messages[id];
        // remove row from table
        removeRow(id);
        // update storage
        updateStorage();
    } else { 
        // if not we do nothing
        // this block of code doesn't need to exist, added to make it more explanatory 
    }    
}

// save changes for the new student or updates the existing student
function saveChanges() {
    // we create a json object with the data we need to save
    let data = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        program: document.getElementById('program').value
    }    
    // https://www.w3schools.com/js/js_switch.asp
    // check if the action as a new item or update item
    switch(action) {
        case CREATE:
                    post(data); // we send the data of the student  we want to create
                    break;
        case UPDATE: 
                    // update message in the list of messages                    
                    messages[selectedId] = message; // updates key[selectedId]:value[message] in messages                    
                    // calls for update on the message of the selected index
                    updateRow(selectedId, message);
                    break;
    }
    // hide the form
    showForm(false);    
    // set action to creation by default
    action = CREATE;

    // we return false for the Form to not redirect the page
    return false;
}


// hides the form without affecting the data
function cancelChanges() {
    // hide the form
    showForm(false);    
}

///////| DOM MANIPULATION |//////////////////////////////////////////////////////

// creates a new row for the content grid
function createRow(student) {    
    // get element #content from simple.html
    let content = document.getElementById('content');
    // the += operator in strings works as an append function: "string" += "new" ...  "stringnew"
    // we add more HTML inside the grid, the browser will interprete it as we add it
    content.innerHTML += 
        // creates a new row in the table <tr> with id = Student._id (unique)
        '<tr id="' + student._id +'" data-id="' + student._id + '">' +
            // First name "
            '<td class="p-2 border">' + student.firstName + '</td>' +
            // Last name "
            '<td class="p-2 border">' + student.lastName + '</td>' +
            // Email "
            '<td class="p-2 border">' + student.email + '</td>' +
            // Program "
            '<td class="p-2 border">' + student.program + '</td>' +
            // creates cell for the options' buttons
            '<td class="text-center p-2 border">' + 
                // create edit button that points to updateItem(student._id)
                '<button class="btn btn-info btn-block" onclick="updateItem(' + student._id + ')">' +
                    'Edit' + 
                '</button>' + 
                // create edit button that points to removeItem(student._id)
                '<button class="btn btn-danger btn-block" onclick="removeItem(' + student._id + ')">' + 
                    'Delete' + 
                '</button>' + 
            '</td>' +
        '</tr>';
}

// updates the message 
function updateRow(id, message) {
    // get element that holds message
    let messageElement = document.getElementById(id);
    // overwrites the text displayed with the updated version
    messageElement.innerText = message;    
}

// removes the <tr> that pertains to the message
function removeRow(id) {
    // get the row element, the rows have unique ids 
    let row = document.getElementById(id);
    // remove the element from the DOM
    row.remove();
}

// load messages from the API
function loadMessages() {
    // we empty the previous content if already exists to prepare
    // 'content' is the data of the html table
    let content = document.getElementById('content');
    // set innerHTML to empty space to empty it
    content.innerHTML = '';

    // API GET
    get();
    // this function is at the bottom of the file
}

/// API CALLS ///////////////////////////////
// I have separated this functions from the rest to have all the functions that call the API in one place

// API Url
const apiUrl = './students';
// code and api are in the same express server, this is equal to "localhost:8080/students" if on localhost


// GET /students
function get() {
    // we use jquery to make an ajax call for GET, $.ajax = jQuery.ajax
    // https://api.jquery.com/jQuery.ajax/
    $.ajax({
        method: 'get',
        url: apiUrl
    }).then(function (response) { // handle succesful response
            // variable response contains the data sent back by the API            
            // populate the HTML table
            // forEach https://www.w3schools.com/jsref/jsref_foreach.asp
            response.forEach(student => { // this for assigns one value of the array at the time to student
                // we create a new row inside the table per value from the response
                // one row per student
                createRow(student);
            });
        })
        .catch(function (error) { // handle error            
            // send error to console
            console.log(error);
            // we show a error message that the API sent us back
            // the json the API sent back will be in error.jsonResponse
            // our API sents an atribute called 'message'
            alert("Error while loading: " + error.jsonResponse);
        });
}
 
// POST /students
function post(studentData) {   // studentData is the data I will send to the API as req.body
    // we use jquery to make an ajax call for GET, $.ajax = jQuery.ajax
    // https://api.jquery.com/jQuery.ajax/
    $.ajax({
        method: 'post',
        url: apiUrl,
        data: studentData // this would be req.body on the API
    }).then(function (response) { // handle succesful response
            /*  variable response contains the data sent back by the API                        
                according to the API on succes we get
                {
                    success: true,
                    student: newStudent
                }            
                we create a new row inside the table per value from the new student */
            createRow(response.student);            
        })
        .catch(function (error) { // handle error            
            // send error to console
            console.log(error);
            // we show a error message that the API sent us back
            // the json the API sent back will be in error.jsonResponse
            // our API sents an atribute called 'message'
            alert("Error while posting: " + error.jsonResponse);
        });
}

// PUT /students/:id
function put(id, studentData) {   // id is the :id for the url, studentData is the data I will send to the API as req.body
    // we use jquery to make an ajax call for GET, $.ajax = jQuery.ajax
    // https://api.jquery.com/jQuery.ajax/
    $.ajax({
        method: 'post',
        url: apiUrl + '/' + id, // /students/:id
        data: studentData // this would be req.body on the API
    }).then(function (response) { // handle succesful response
            /*  variable response contains the data sent back by the API                        
                according to the API on succes we get
                {
                    success: true,
                    student: updatedStudent
                }            
                we update the existing row with the updated student */
            createRow(response.student);            
        })
        .catch(function (error) { // handle error            
            // send error to console
            console.log(error);
            // we show a error message that the API sent us back
            // the json the API sent back will be in error.jsonResponse
            // our API sents an atribute called 'message'
            alert("Error while posting: " + error.jsonResponse);
        });
}