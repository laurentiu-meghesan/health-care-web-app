window.Booking = {

    API_URL: "http://localhost:8084",

    getAppointments: function () {
        let patientId = sessionStorage.getItem("loggedUserId");
        userIsLoggedIn = sessionStorage.getItem("userIsLoggedIn");

        if (userIsLoggedIn) {

            $.ajax({
                url: Booking.API_URL + "/appointments/patientId=" + patientId,
                method: "GET"
            }).done(function (response) {
                console.log(response);

                if (response.content != 0) {
                    Booking.displayAppointments((response).content);
                } else document.getElementById('output-booking').innerHTML = "You don't have any appointments yet.";
            })
        } else document.getElementById('output-booking').innerHTML = "You must log in first!";
    },

    displayAppointments: function (appointments) {
        let appointmentsHtml = '';

        appointments.forEach(appointment => appointmentsHtml += Booking.getHtmlForOneAppointment(appointment));

        $("#appointments-table tbody").html(appointmentsHtml);
    },

    getHtmlForOneAppointment: function (appointment) {
        let formattedDate = new Date(appointment.appointmentDate).toLocaleString();

        return `<tr>
            <td>${formattedDate}</td>
            <td>${appointment.doctorId}</td>
            <td>${appointment.patientId}</td>
            <td>${appointment.symptoms}</td>
            <td>${appointment.diagnostic}</td>
            <td>${appointment.treatment}</td>
            <td>${appointment.recommendations}</td>
        </tr>`;
    },

    createAppointment: function () {

        let patientId = parseInt(sessionStorage.getItem("loggedUserId"));
        console.log(patientId);

        if (patientId == null) {
            alert("You need to update your profile first.")
            location.reload(true);
        } else {

            let dateValue = new Date($("#date").val());
            let year = dateValue.getFullYear();
            let month = dateValue.getMonth();
            let day = dateValue.getDate();

            let timeValue = $("#time").val();
            let time = timeValue.split(':');
            let hours = parseInt(time[0]);
            let minutes = parseInt(time[1]);

            let timeDate = new Date(year, month, day, hours + 3, minutes);

            let requestBody = {
                doctorId: 7,
                patientId: patientId,
                appointmentDate: timeDate,
                symptoms: "insomnia"
            };

            $.ajax({
                url: Booking.API_URL + "/appointments",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(requestBody)
            }).done(function () {
                Booking.getAppointments();
            })

        }
    },

    bindEvents: function () {
        $("#submit-button").on("click", function (event) {
            // let dateValue = ($("#date").val());
            // let timeValue = ($("#time").val());
            // console.log(dateValue," ", timeValue);
            // if (dateValue != null && timeValue != null) {
            Booking.createAppointment();
            console.log(event);
            alert('Appointment request created.');
            // location.reload(true);
            // Booking.getAppointments();
            // } else {
            //
            // alert("You entered invalid date.");
            //
            // }
        });
    }
};

Booking.getAppointments();
Booking.bindEvents();