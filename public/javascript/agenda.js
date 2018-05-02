function Agenda(){
    "use strict";

    let operation = "CREATE";
    let selected_index = -1; // contact selected Id
    Object.defineProperty(this,'selected_index',{
        get: ()=>{
            return selected_index;
        },
        set: (value)=>{
            selected_index = value;
        }
    });
    
    const contactForm = document.getElementById('contactForm');
    const inputsArr = contactForm.querySelectorAll('input, select');
    const errorMessage = document.querySelector(".ui.error.message");
    const successMessage = document.querySelector(".ui.success.message");
    const btnClear = document.getElementById('btnClear');
    const btnSave= document.getElementById('btnSave');
    const counter = document.getElementById('counterContacts');
    const tableList = document.getElementById('tableList');
    const txtFirstName = document.getElementById('txtFirstName')
    const txtSurname = document.getElementById('txtSurname')
    const txtEmail = document.getElementById('txtEmail')
    const selectCountry = document.getElementById('selectCountry')

    let contactList = JSON.parse(localStorage.getItem("agendaGIG")); //List of contacts from localStorage
  
    if (contactList === null) // Init contactList if no data in localStorage
        contactList = [];

    // Initialite the Agenda
    let init = () =>{
        loadCountries(function(response){
            sessionStorage.setItem("countries", response);
            populateSelect(response,selectCountry.id)
        })
        listContactTable()

    }

    // Load the list of countries from loacl file
    let loadCountries = (callback)=> {
        var xobj = new XMLHttpRequest();
        //xobj.overrideMimeType("application/json");
        xobj.open('GET', '/country-list', true);
        xobj.onreadystatechange = function() {
            if (xobj.readyState == 4 && xobj.status == "200") {
                // .open will NOT return a value but simply 
                // returns undefined in async mode so use a callback
                callback(xobj.responseText);
            }
        }
        xobj.send(null);
    }   
    // Populate select from json
    let populateSelect = (response,selectid)=>{
        try{
            newHTMLElement('option',selectid,'Select One',{'value':''})
            JSON.parse(response).forEach(element => {
            newHTMLElement('option',selectid,element.name,{'value':element.code})
            });
        }catch(e){
            console.log(e);
        }   
    }

    // Create new contact 
    let create = ()=>{
        let contact = JSON.stringify({
            firstName: txtFirstName.value,
            surname: txtSurname.value,
            email: txtEmail.value,
            country: selectCountry.value
        }); 
        contactList.push(contact);
        localStorage.setItem("agendaGIG", JSON.stringify(contactList));
        setCounter(contactList.length);
        addRow(JSON.parse(contact),contactList.length);
        return true;
    }

    // Updates contacts number counter
    let setCounter = (items) =>{
        let ret = '';
        if(items > 0){
            (items>1)?ret = items + ' contacts': ret = items + ' contact';
        }
        counter.innerHTML = ret;
    }

    // Save contact in localStorage a refresh the table
    let save = () => {
        contactList[selected_index] = JSON.stringify({
            firstName: txtFirstName.value,
            surname: txtSurname.value,
            email: txtEmail.value,
            country: selectCountry.value
        });
        localStorage.setItem("agendaGIG", JSON.stringify(contactList)); 
        setCounter(contactList.length);
        listContactTable();
        cleanForm();
        return true;
    }

    // display the list of contact in a table
    let listContactTable = ()=> {
        tableList.innerHTML = '';
        newHTMLElement('thead','tableList',null,{'id':'tableHead','className':'thead-dark'})
        newHTMLElement('tr','tableHead',null,{'id':'trHead','className':'thead-dark'})
        newHTMLElement('td','trHead','First Name')
        newHTMLElement('td','trHead','Surname')
        newHTMLElement('td','trHead','Email')
        newHTMLElement('td','trHead','Country')
        newHTMLElement('td','trHead')
        newHTMLElement('tbody','tableList',null,{'id':'contactTbody'})
        setCounter(contactList.length);
        for (var i in contactList) {
            var contact = JSON.parse(contactList[i]);
            addRow(contact, i)
        } 
    }

    // Add a new row to the contact Table 
    let addRow = (contact, i)=>{
        newHTMLElement('tr','contactTbody',null,{'id':'contactRow_' + i})
        newHTMLElement('td','contactRow_' + i,contact.firstName)
        newHTMLElement('td','contactRow_' + i,contact.surname)
        newHTMLElement('td','contactRow_' + i,contact.email)
        newHTMLElement('td','contactRow_' + i, getCountryByCode(contact.country))
        newHTMLElement('td','contactRow_' + i, null,{'id':'contactAction_' + i})
        newHTMLElement('button','contactAction_' + i,'Edit',{'id':'editBtn_'+i,'className':'btn btn-warning'},{'click':editContact})
        newHTMLElement('button','contactAction_' + i,'Delete',{'id':'delBtn_'+i,'className':'btn btn-danger'},{'click':delContact})
    }

    // Create an append an HTML element 
    let newHTMLElement = (element, parentNodeId, content, props, events) =>{
        const objHTML = document.createElement(element);
        if(props){
            Object.keys(props).forEach(function(k){
                objHTML.setAttribute(k.replace('className','class'), props[k]);
            });
        }
        if(events){
            Object.keys(events).forEach(function(k){
                objHTML.addEventListener(k, events[k]);
            });
        }
        if(content)objHTML.innerHTML = content;
        document.getElementById(parentNodeId).appendChild(objHTML);
    }
    
    // Reset form fields
    let cleanForm = () =>{
        txtFirstName.value = ''
        txtSurname.value = ''
        txtEmail.value = ''
        selectCountry.value = ''
        txtFirstName.focus();
    }
    
    txtFirstName

    // Load contactForm with the contact to edit
    let editContact = (event)=>{
        var eventbtnClear = new Event('click');
        btnClear.dispatchEvent(eventbtnClear);
        operation = "EDIT"; 
        selected_index = event.currentTarget.id.split('_')[1];
        var contact = JSON.parse(contactList[selected_index]); 
        firstName: txtFirstName.value = contact.firstName;
        surname: txtSurname.value = contact.surname;
        email: txtEmail.value = contact.email;
        country: selectCountry.value = contact.country;
        txtFirstName.focus();
        btnSave.value = 'Save';
    }

    // Delete contact from the list and refresh the table
    let delContact = (event)=>{
        selected_index = event.currentTarget.id.split('_')[1];
        contactList.splice(selected_index, 1); 
        localStorage.setItem("agendaGIG", JSON.stringify(contactList)); 
        // var contactTbody = document.getElementById("contactTbody");   // Get the <ul> element with id="myList"
        // contactTbody.removeChild(document.getElementById('contactRow_' + selected_index)); 
        setCounter(contactList.length);
        listContactTable();
    }

    // Get country Name from the country list by Code
    let getCountryByCode = (code)=> {
        let countryName = '';
        JSON.parse(sessionStorage.getItem("countries")).forEach(element => {
            if(element.code == code){
                countryName = element.name;
            }
            });
            return countryName;
    }

    // Check if the email exists
    let emailExists = (email,selected_index) =>{
        let ret = false;
        let counterEmail = 0;
        let indexInCollection = false;
        contactList.some(function (value, index, _arr) {       
            if(JSON.parse(value).email === email) {
                if(index != selected_index){
                    indexInCollection = true;
                }
                counterEmail++;
            }
        });
        if((counterEmail>=1) && (indexInCollection))ret= true;
        return ret;
    }
   
    // events 
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        if(validate(selected_index)){
            if (operation === "CREATE"){
                create();
            }
            else{
                save();
            }
        }
    });

    // Reset the form
    btnClear.addEventListener('click', function(event) {
        cleanForm();
        operation = "CREATE";
        selected_index = -1; 
        btnSave.value = 'Add';
        successMessage.className = "ui success message hidden";
        errorMessage.className = "ui error message hidden"
        inputsArr.forEach(element =>{
            element.className = element.className.replace('error',' ');
            //element.parentElement.className = element.parentElement.className.replace('error',' ');
        })
    });

    // Form validation
    let validations = {
        required: function(value){
            return value !== '';
        },
        unique: function(value,selected_index){
            return !emailExists(value,selected_index);
        },
        email: function(value){
            return value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        }
    }

    const messagesError = (rule, element) =>{
        switch(rule){
            case "required": return element + ' is ' + rule + '!';break;
            case "email": return element + ' must be a valid ' + rule + ' address!';break;
            case "unique": return 'A contact with this ' + element + ' is already in the agenda, it must be ' + rule + '!';break;
            default: return "";
        }
    };


    let validate = (selected_index) =>{
        
        var i = 0;
        while (i < inputsArr.length) {
            var attr = inputsArr[i].getAttribute('data-validation'),
                rules = attr ? attr.split(' ') : '',
                parent = inputsArr[i].closest(".field"),
                j = 0;
                while (j < rules.length) {
                    if(!validations[rules[j]](inputsArr[i].value,selected_index)) {
                      errorMessage.className = "ui error message";
                      errorMessage.innerHTML = messagesError(rules[j],inputsArr[i].name); // "Invalid rule '" + rules[j] + "' for input '" + inputsArr[i].name + "'";
                      inputsArr[i].className = inputsArr[i].className + ' error';
                      inputsArr[i].focus();
                      inputsArr[i].addEventListener('keyup',cleanInputError);
                      return false;
                    }
                    errorMessage.className = 'ui error message hidden';
                    inputsArr[i].className = inputsArr[i].className.replace('error',' ');
                    j++;
                }
                i++;
        }
        successMessage.className = "ui success message";
        return true;
    }

    let cleanInputError = (event)=>{
        if(event.key != 'Enter'){
            event.target.parentElement.className = "col-sm-4 field";
            event.target.className = "form-control";
            errorMessage.className = "ui error message hidden";
        }
    }

    init();
};
// some browsers don't accept .closest function
// testing in Visual Code didn´t accet closest
if (window.Element && !Element.prototype.closest) {
    Element.prototype.closest = 
    function(s) {
        var matches = (this.document || this.ownerDocument).querySelectorAll(s),
            i,
            el = this;
        do {
            i = matches.length;
            while (--i >= 0 && matches.item(i) !== el) {};
        } while ((i < 0) && (el = el.parentElement)); 
        return el;
    };
}
document.addEventListener("DOMContentLoaded", Agenda);