window.onload = function () {

    userIsLoggedIn = sessionStorage.getItem("userIsLoggedIn");
    loggedUserIsDoctor = sessionStorage.getItem("loggedUserIsDoctor");
    loggedFirstName = sessionStorage.getItem("loggedFirstName");
    loggedLastName = sessionStorage.getItem("loggedLastName");
    loggedPhoneNumber = sessionStorage.getItem("loggedPhoneNumber");
    loggedBirthDay = sessionStorage.getItem("loggedBirthDay");
    loggedEmail = sessionStorage.getItem("loggedEmail");
    officeAddress = sessionStorage.getItem("officeAddress");

    console.log(userIsLoggedIn, loggedUserIsDoctor, loggedFirstName, loggedBirthDay, officeAddress);

    if (userIsLoggedIn) {
        document.getElementById('output').innerHTML = loggedFirstName + " " + loggedLastName;
        if (loggedUserIsDoctor == 'false') {
            document.getElementById('output2').innerHTML = "Your Birthday: " + loggedBirthDay;
        } else document.getElementById('output2').innerHTML = "Address: " + officeAddress;
        document.getElementById('output3').innerHTML = "Phone number: " + loggedPhoneNumber;
        document.getElementById('output4').innerHTML = "Email address: " + loggedEmail;
    } else document.getElementById('output').innerHTML = "You must log in first";

    if (loggedUserIsDoctor == 'true'){

        $.ajax({
            url: "http://localhost:8084/patients"
        }).done(function(allPatients){
            retrievingAllPatients(allPatients.content)
        })
    }
    
    function retrievingAllPatients(patients) {
        let htmlContent = '<h3 style="text-align: center; padding-top: 30px">Patients Table</h3>' +
            '           <table id="patients-table" style="text-align: center">\n' +
            '                <thead>\n' +
            '                <tr">\n' +
            '                    <th>Profile Id</th>\n' +
            '                    <th style="padding-left: 50px">First Name</th>\n' +
            '                    <th style="padding-left: 50px">Last Name</th>\n' +
            '                    <th style="padding-left: 50px">Phone number</th>\n' +
            '                    <th style="padding-left: 50px">Birth date</th>\n' +
            '                </tr>\n' +
            '                </thead>\n' +
            '\n' +
            '                <tbody>\n' +
            '\n' +
            '                </tbody>\n' +
            '            </table>';

        patients.forEach(patient => htmlContent += getHtmlForOnePatient(patient));

        $('#edit-section').html(htmlContent);
    }

    function getHtmlForOnePatient(patient) {
        return`<tr>
            <td>&emsp;${patient.id}&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</td>
            <td>${patient.firstName}&emsp;&emsp;</td>
            <td>${patient.lastName}&emsp;&emsp;</td>
            <td>${patient.phoneNumber}&emsp;&emsp;</td>
            <td>${patient.birthDate}</td>
            </tr>
            <p></p> `
    }
};