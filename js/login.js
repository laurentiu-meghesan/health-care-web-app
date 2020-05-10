var doctorID = null;

//variables for create profile method
var userId = null;
var firstNameInput = null;
var lastNameInput = null;
var phoneNumberInput = null;
var birthDateInput = null;

//variables for loggen in user
var loggedUserId = localStorage.getItem("loggedUserId");
var loggedUserIsDoctor = localStorage.getItem("loggedUserIsDoctor");
var loggedFirstName = localStorage.getItem("loggedFirstName");
var loggedLastName = localStorage.getItem("loggedLastName");
var loggedPhoneNumber = localStorage.getItem("loggedPhoneNumber");
var loggedBirthDay = localStorage.getItem("loggedBirthDay");

window.Login = {
    API_URL: "http://localhost:8084",

    createUser: function () {

        let userName = $('#username-signup').val();
        let email = $('#email-signup').val();
        let password = $('#pass-signup').val();

        let requestBody = {
            userName: userName,
            password: password,
            email: email
        };

        $.ajax({
            url: Login.API_URL + "/profiles",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(requestBody)
        }).done(function (event) {
            alert("User created. Now we need a few more information to complete your profile.");
            userId = event.id;

            firstNameInput = prompt("Please enter your First Name:");
            lastNameInput = prompt("Please enter your Last Name:");
            phoneNumberInput = prompt("Now enter your Phone Number:", "Ex: 074xxxxxxx");
            birthDateInput = prompt("Enter your birthday:", "Ex: MM.DD.YYYY");

            Login.createProfile();
            alert("Profile Updated! Now try to Sign In.");
            location.reload(true)
        });
    },

    createProfile: function () {

        let birthday = new Date(birthDateInput);
        birthday.setDate(birthday.getDate() + 1);

        let requestBody = {
            profileId: userId,
            firstName: firstNameInput,
            lastName: lastNameInput,
            phoneNumber: phoneNumberInput,
            birthDate: birthday
        };

        console.log(requestBody);

        $.ajax({
            url: Login.API_URL + "/patients",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(requestBody)
        }).done(function () {

        })
    },

    getLoggedInUser: function () {

        let loggedUserName = $('#username-login').val();
        let loggedPassword = $('#pass-login').val();

        $.ajax({
            url: Login.API_URL + "/profiles/userName&password?password=" + loggedPassword + "&userName=" + loggedUserName,
            method: "GET"
        }).done(function (response) {
            console.log(response);
            loggedUserId = parseInt(response.id);
            loggedUserIsDoctor = response.doctor;

            localStorage.setItem("loggedUserId", loggedUserId);
            localStorage.setItem("loggedUserIsDoctor", loggedUserIsDoctor);
        })
    },

    getLoggedInProfile: function () {
        $.ajax({
            url: Login.API_URL + "/patients/" + loggedUserId,
            method: "GET"
        }).done(function (loggedUser) {
            console.log(loggedUser);
            localStorage.setItem("loggedFirstName",loggedUser.firstName);
            localStorage.setItem("loggedLastName",loggedUser.lastName);
            localStorage.setItem("loggedPhoneNumber",loggedUser.phoneNumber);
            localStorage.setItem("loggedBirthDay",loggedUser.birthDate);
        })
    }
    ,

    bindEvents: function () {
        $('#sign-up').on('click', function (event) {

            event.preventDefault();
            let password = $('#pass-signup').val();
            let password2 = $('#pass2-signup').val();

            if (password2 != password) {
                alert("Password did not match! Try again.");
                location.reload(true)
            } else {
                Login.createUser();
            }
        });

        $('#log-in').on('click', function (event) {

            event.preventDefault();
            Login.getLoggedInUser();
            // location.reload(true);
            Login.getLoggedInProfile();
        })
    }
};
Login.bindEvents();
