var doctorID = null;

//variables for create profile method
var userId = null;
var firstNameInput = null;
var lastNameInput = null;
var phoneNumberInput = null;
var birthDateInput = null;

//variables for logged in user

var userIsLoggedIn = sessionStorage.getItem("userIsLoggedIn");
var loggedUserId = sessionStorage.getItem("loggedUserId");
var loggedUserIsDoctor = sessionStorage.getItem("loggedUserIsDoctor");
var loggedFirstName = sessionStorage.getItem("loggedFirstName");
var loggedLastName = sessionStorage.getItem("loggedLastName");
var loggedPhoneNumber = sessionStorage.getItem("loggedPhoneNumber");
var loggedBirthDay = sessionStorage.getItem("loggedBirthDay");
var loggedEmail = sessionStorage.getItem("loggedEmail");

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

            sessionStorage.setItem("loggedUserId", response.id);
            sessionStorage.setItem("loggedUserIsDoctor", response.doctor);
            sessionStorage.setItem("loggedEmail", response.email);

            Login.getLoggedInProfile();
        })
    },

    getLoggedInProfile: function () {
        $.ajax({
            url: Login.API_URL + "/patients/" + parseInt(sessionStorage.getItem("loggedUserId")),
            method: "GET"
        }).done(function (loggedUser) {
            console.log(loggedUser);

            sessionStorage.setItem("loggedFirstName", loggedUser.firstName);
            sessionStorage.setItem("loggedLastName", loggedUser.lastName);
            sessionStorage.setItem("loggedPhoneNumber", loggedUser.phoneNumber);
            sessionStorage.setItem("loggedBirthDay", loggedUser.birthDate);

            if (loggedUser.id != null) {
                userIsLoggedIn = true;
                sessionStorage.setItem("userIsLoggedIn", userIsLoggedIn);
                document.getElementById("output5").innerHTML = "Login successfully!";
            }
        })
    },

    buttonFunction: function () {
        document.getElementById("buttonAppear").innerHTML = '<button onclick="secondFunction()">Logout</button>';
    },

    secondFunction: function () {

        sessionStorage.removeItem("loggedUserId");
        sessionStorage.removeItem("loggedUserIsDoctor");
        sessionStorage.removeItem("loggedEmail");
        sessionStorage.removeItem("loggedFirstName");
        sessionStorage.removeItem("loggedLastName");
        sessionStorage.removeItem("loggedPhoneNumber");
        sessionStorage.removeItem("loggedBirthDay");

        sessionStorage.clear();
    },

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
            console.log(loggedUserId);
            // Login.buttonFunction()
        });

        $('#buttonAppear').on('click', function (event) {
            event.preventDefault();

            sessionStorage.removeItem("loggedUserId");
            sessionStorage.removeItem("loggedUserIsDoctor");
            sessionStorage.removeItem("loggedEmail");
            sessionStorage.removeItem("loggedFirstName");
            sessionStorage.removeItem("loggedLastName");
            sessionStorage.removeItem("loggedPhoneNumber");
            sessionStorage.removeItem("loggedBirthDay");

            Login.buttonFunction();

            sessionStorage.clear();

            location.reload(true)
        })
    }
};
Login.bindEvents();
