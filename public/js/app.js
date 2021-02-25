///////| CONSTANTS DECLARATIONS |////////////////////////////////////////////////
// constants to idenfify what is the action we are doing
const NONE = 0;
const CREATE = 1;
const UPDATE = 2;
///////| GLOBAL VARIABLES |/////////////////////////////////////////////////////

// keep track of the action we are currently working on
let action;
let selectedStudent;
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

// clears the form inputs
function clearForm() {
    // we get the form DOM Element
    let form = document.getElementById('formContainer');
    // we use the method reset() from Form to reset to default the elements(Input, Select, TextArea, etc..) in the form
    form.reset();
    // we get the first element of the Form into a variable to make the screen focus on it
    let input = document.getElementById('firstName');
    // set the focus of the input on the firstName
    //input.focus();
    // in case the page has been scrolled down too much this would return it into view
    //input.scrollIntoView();
    setFocus(input);
}

function getStudent(id) {
    let tr = document.getElementById(id);
    if (tr) { // if tr was found in the document
        let data = {
            _id: id,
            firstName: tr.querySelector('.firstName').innerText, // this looks for the class .firstName in the <td> inside the <tr>
            lastName: tr.querySelector('.lastName').innerText,
            email: tr.querySelector('.email').innerText,
            program: tr.querySelector('.program').innerText
        }   
        return data; // return JSON object
    }
    return false; // if tr wasnt found we return false
}

// opens the form to create a new item
function createItem() {
    // change form title
    document.getElementById('formTitle').innerText = 'New Student';
    // we assign the action to create
    action = CREATE;
    // call to show the form
    showForm(true);
    // clear values
    clearForm();        
        
}

// opens the form to edit an existing item
function updateItem(id){
    // change form title
    document.getElementById('formTitle').innerText = 'Edit Student';        
    // we assign the action to update
    action = UPDATE;
    // call to show the form
    showForm(true);
    // clear values
    clearForm();    
    // get JSON object from Students    
    let student = getStudent(id);
    if (!student) {
        alert('The student to edit was not found.');
        return; // if nothing is found the execution will end here
    }
    selectedStudent = student; // selectStudent is our global variable to keep track on what student we are working
    // populate the form with the information to edit
    // get the elements and set the value
    let form = document.getElementById('formContainer'); 
    // when using the attribute name in a form element like input, you can access their value directly like this        
    form.firstName.value = selectedStudent.firstName;           
    form.lastName.value = selectedStudent.lastName;           
    form.email.value = selectedStudent.email;           
    form.program.value = selectedStudent.program;           
   
    // set the focus into firstName
    setFocus(form.firstName);
}

function setFocus(input) {
    // brings the cursor and the focus to the input
    input.focus();
    // in case the page has been scrolled down too much this would return it into view
    input.scrollIntoView(true);
}

// removes item from the list
function removeItem(id) {
    // get student to show the name
    let student = getStudent(id);
    if (!student) {
        alert('The student to edit was not found.');
        return; // if nothing is found the execution will end here
    }
    // executes the browser confirm window that gives the option of yes or no, the answer is boolean and pass onto variable response
    let response = confirm('Do you want to delete student ' + student.firstName + ' ' + student.laststName + '?');
    // we check for the response
    if(response === true) { // if answer was yes or ok
        remove(id);
    } else { 
        // if not we do nothing
        // this block of code doesn't need to exist, added to make it more explanatory 
    }    
}

// save changes for the new student or updates the existing student
function saveChanges() {
    // first we need to check if our form values are correct and valid
    // get form DOM element
    let form = document.getElementById('formContainer');
    // .checkValidity() is part of javascript forms methods and checks the form if there is empy fields that
    // are required or the format is not proper like in the case of email will return false and highlights the
    // errors
    if (!form.reportValidity()) return; // if false we stop the execution so the user can correct
    // we create a json object with the data we need to save
    let data = {
        // when using the attribute name in a form element like input, you can access their value directly like this
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        email: form.email.value,
        program: form.program.value
    }    
    console.log(data);
    // https://www.w3schools.com/js/js_switch.asp
    // check if the action as a new item or update item
    switch(action) {
        case CREATE:
                    post(data); // we send the data of the student  we want to create
                    break;
        case UPDATE:                     
                    put(selectedStudent._id, data); // send selected student id with the new data to be updated
                    break;
    }
   
    // set action to NONE by default
    action = NONE;
}

// hides the form without affecting the data
function cancelChanges() {
    clearForm();
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
    let row = 
        // creates a new row in the table <tr> with id = Student._id (unique)
        // I recommed to check the html generated from the development tools/inspect
        // attribute data-student will hold  a string version of the whole student JSON object
        '<tr id="'+ student._id +'">' +
            // First name "
            '<td class="p-2 border firstName">' + student.firstName + '</td>' +
            // Last name "
            '<td class="p-2 border lastName">' + student.lastName + '</td>' +
            // Email "
            '<td class="p-2 border email">' + student.email + '</td>' +
            // Program "
            '<td class="p-2 border program">' + student.program + '</td>' +
            // creates cell for the options' buttons
            '<td class="text-center p-2 border">' + 
                // create edit button that points to updateItem(student._id)
                '<button class="btn btn-info btn-block" onclick="updateItem(\'' + student._id + '\')">' +
                    'Edit' + 
                '</button>' + 
                // create edit button that points to removeItem(student._id)
                '<button class="btn btn-danger btn-block" onclick="removeItem(\'' + student._id + '\')">' + 
                    'Delete' + 
                '</button>' + 
            '</td>' +
        '</tr>';
    /*
        <table>
            <thead>
                <tr>
                    <th> First name </th>
                    ...
                    <th> Action </th>                    
                </tr>
            </thead>
            <tbody id="content">
                <tr> -> create this part
                    <td> first name here </td>
                    ...                        
                    <td> actions here </td>
                </tr>
            </tbody>
        </table>
    */
    content.innerHTML += row;
}

// updates the message 
function updateRow(id, data) {
    console.log(id, data);
    // get <tr> that holds the student data
    let tr = document.getElementById(id); 
    // we update the cells one by one using their classes names
    tr.querySelector('.firstName').innerText = data.firstName;    
    tr.querySelector('.lastName').innerText = data.lastName;    
    tr.querySelector('.email').innerText = data.email;    
    tr.querySelector('.program').innerText = data.program;    
}

// removes the <tr> that pertains to the message
function removeRow(id) {
    // get the row element, the rows have unique ids 
    let tr = document.getElementById(id);
    // remove the element from the DOM
    tr.remove();
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
        alert('New student added ' + response.student.firstName + ' ' + response.student.lastName);
    })
        .catch(function (error) { // handle error            
            // send error to console
            console.log(error);
            // we show a error message that the API sent us back
            // the json the API sent back will be in error.jsonResponse
            // our API sents an atribute called 'message'
            alert("Error while posting: " + error.jsonResponse);
        }).then(function () { // this second "then" will always execute after the first then or catch, has no parameters
            // hide the form
            showForm(false);
        });
        
}

// PUT /students/:id
function put(id, studentData) {   // id is the :id for the url, studentData is the data I will send to the API as req.body
    // we use jquery to make an ajax call for GET, $.ajax = jQuery.ajax
    // https://api.jquery.com/jQuery.ajax/
    $.ajax({
        method: 'put',
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
            
            updateRow(id, response.student);            
            alert('Student updated ' + response.student.firstName + ' ' + response.student.lastName);    
        })
        .catch(function (error) { // handle error            
            // send error to console
            console.log(error);
            // we show a error message that the API sent us back
            // the json the API sent back will be in error.jsonResponse
            // our API sents an atribute called 'message'
            alert("Error while updating: " + error.jsonResponse);
        }).then(function () {
            // hide the form
            showForm(false);
        });
}

// DELETE /students/:id
function remove(id) {   // id is the :id for the url, I called remove instead of delete because 'delete' is reserved by javascript
    // we use jquery to make an ajax call for GET, $.ajax = jQuery.ajax
    // https://api.jquery.com/jQuery.ajax/
    $.ajax({
        method: 'delete',
        url: apiUrl + '/' + id, // /students/:id        
    }).then(function (response) { // handle succesful response
            /*  variable response contains the data sent back by the API                        
                according to the API on succes we get
                {
                    success: true,
                }            
            we remove the existing row  */
            removeRow(id);            
            alert('The student was removed from the database');
        })
        .catch(function (error) { // handle error            
            // send error to console
            console.log(error);
            // we show a error message that the API sent us back
            // the json the API sent back will be in error.jsonResponse
            // our API sents an atribute called 'message'
            alert("Error while deleting: " + error.jsonResponse);
        });
}