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
            phoneNumberInput = prompt("Now enter your Phone Number:", "Ex: 07xxxxxxxx");
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

            sessionStorage.setItem("loggedUserId", response.id);
            sessionStorage.setItem("loggedUserIsDoctor", response.doctor);
            sessionStorage.setItem("loggedEmail", response.email);

            if (response.id == null) {
                userIsLoggedIn = false;
                sessionStorage.setItem("userIsLoggedIn", userIsLoggedIn);
                document.getElementById("output5").innerHTML = "Login unsuccessfully! Try again."
            } else if (response.doctor) {
                Login.getLoggedInDoctor();
            } else Login.getLoggedInProfile()

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

    getLoggedInDoctor: function () {
        $.ajax({
            url: Login.API_URL + "/doctors/" + parseInt(sessionStorage.getItem("loggedUserId")),
            method: "GET"
        }).done(function (loggedDoctor) {
            console.log(loggedDoctor);

            sessionStorage.setItem("loggedFirstName", loggedDoctor.firstName);
            sessionStorage.setItem("loggedLastName", loggedDoctor.lastName);
            sessionStorage.setItem("loggedPhoneNumber", loggedDoctor.phoneNumber);

            if (loggedDoctor.id != null) {
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

    editEmail: function () {

        let editedEmail = $("#email-editSection").val();

        if (editedEmail.length === 0) {
            editedEmail = sessionStorage.getItem("loggedEmail");
        } else sessionStorage.setItem("loggedEmail", editedEmail);

        $.ajax({
            url: Login.API_URL + "/profiles/" + parseInt(sessionStorage.getItem("loggedUserId")),
        }).done(function (profile) {
            let username = profile.userName;
            let password = profile.password;

            let requestBody = {
                doctor: sessionStorage.getItem("loggedUserIsDoctor"),
                email: editedEmail,
                password: password,
                userName: username
            };

            $.ajax({
                url: Login.API_URL + "/profiles/" + parseInt(sessionStorage.getItem("loggedUserId")),
                method: "PUT",
                contentType: "application/json",
                data: JSON.stringify(requestBody)
            }).done(function () {
                console.log(requestBody);
            })
        });
    },

    editProfile: function () {

        let editedFirstName = $("#firstName-editSection").val();
        let editedLastName = $("#lastName-editSection").val();
        let editedBirthdayInput = $("#birthday-editSection").val();
        let editedBirthday = new Date();
        let editedPhone = $("#phone-editSection").val();
        let profileId = sessionStorage.getItem("loggedUserId");

        if (editedFirstName.length === 0) {
            editedFirstName = sessionStorage.getItem("loggedFirstName");
        } else sessionStorage.setItem("loggedFirstName", editedFirstName);

        if (editedLastName.length === 0) {
            editedLastName = sessionStorage.getItem("loggedLastName");
        } else sessionStorage.setItem("loggedLastName", editedLastName);

        if (editedPhone.length === 0) {
            editedPhone = sessionStorage.getItem("loggedPhoneNumber");
        } else sessionStorage.setItem("loggedPhoneNumber", editedPhone);

        if (editedBirthdayInput.length === 0) {
            editedBirthday = sessionStorage.getItem("loggedBirthDay");
        } else {
            editedBirthday = editedBirthdayInput;
            sessionStorage.setItem("loggedBirthDay", editedBirthdayInput)
        }

        let requestBody = {
            birthDate: editedBirthday,
            firstName: editedFirstName,
            lastName: editedLastName,
            phoneNumber: editedPhone,
            profileId: profileId
        };

        $.ajax({
            url: Login.API_URL + "/patients/" + parseInt(sessionStorage.getItem("loggedUserId")),
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify(requestBody)
        }).done(function () {
            console.log(requestBody);
        })
    },

    changePass: function () {

        let oldPassword = $('#oldPass-editSection').val();
        let newPassword = $('#newPass-editSection').val();
        let newPassword2 = $('#newPass2-editSection').val();

        if (newPassword !== newPassword2) {
            alert("The new entered passwords are not identical! Try again.");
            location.reload(true);
        } else {

            $.ajax({
                url: Login.API_URL + "/profiles/" + parseInt(sessionStorage.getItem("loggedUserId")),
            }).done(function (profile) {
                let username = profile.userName;
                let email = profile.email;

                if (oldPassword !== profile.password) {
                    alert("Old password is wrong! Try again.");
                    location.reload(true);
                } else {

                    let requestBody = {
                        doctor: sessionStorage.getItem("loggedUserIsDoctor"),
                        email: email,
                        password: newPassword,
                        userName: username
                    };

                    $.ajax({
                        url: Login.API_URL + "/profiles/" + parseInt(sessionStorage.getItem("loggedUserId")),
                        method: "PUT",
                        contentType: "application/json",
                        data: JSON.stringify(requestBody)
                    }).done(function () {
                        console.log(requestBody);
                    })
                }
            });
        }
    },

    cancelEdit: function () {
        document.forms["firstName-editSection", "lastName-editSection", "birthday-editSection",
            "phone-editSection", "email-editSection"].reset();
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
        });

        $('#saveButton-editSection').click(function () {
            Login.editProfile();
            Login.editEmail();
        });

        $('#savePass-editSection').click(function () {
            Login.changePass();
        })
    }
};
Login.bindEvents();
