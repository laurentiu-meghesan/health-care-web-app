var patientId = null;
var doctorID = null;

window.Login = {
    API_URL: "http://localhost:8084",

    createProfile: function () {

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
            alert("Profile created")
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
                Login.createProfile();
            }
        })
    }
};
Login.bindEvents();
