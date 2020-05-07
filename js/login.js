var patientId = null;
var doctorID = null;

var userId = null;
var firstNameInput = null;
var lastNameInput = null;
var phoneNumberInput = null;
var birthDateInput = null;

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
        })
    }
};
Login.bindEvents();
