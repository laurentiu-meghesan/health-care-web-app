window.onload = function () {

    userIsLoggedIn = sessionStorage.getItem("userIsLoggedIn");
    loggedUserIsDoctor = sessionStorage.getItem("loggedUserIsDoctor");
    loggedFirstName = sessionStorage.getItem("loggedFirstName");
    loggedLastName = sessionStorage.getItem("loggedLastName");
    loggedPhoneNumber = sessionStorage.getItem("loggedPhoneNumber");
    loggedBirthDay = sessionStorage.getItem("loggedBirthDay");
    loggedEmail = sessionStorage.getItem("loggedEmail");

    console.log(userIsLoggedIn, loggedUserIsDoctor, loggedFirstName, loggedBirthDay);

    if (userIsLoggedIn) {
        document.getElementById('output').innerHTML = loggedFirstName + " " + loggedLastName;
        document.getElementById('output2').innerHTML = "Your Birthday: " + loggedBirthDay;
        document.getElementById('output3').innerHTML = "Phone number: " + loggedPhoneNumber;
        document.getElementById('output4').innerHTML = "Email address: " + loggedEmail;
    } else document.getElementById('output').innerHTML = "You must log in first";
};