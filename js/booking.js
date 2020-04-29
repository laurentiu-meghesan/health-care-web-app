window.Booking = {

    API_URL: "http://localhost:8084",

    getAppointments: function () {
        $.ajax({
            url: Booking.API_URL + "/appointments/patientId=13",
            method: "GET"
        }).done(function (response) {
            console.log(response);
            Booking.displayAppointments((response).content);
        })
    },

    displayAppointments: function (appointments) {
        let appointmentsHtml = '';

        appointments.forEach(appointment => appointmentsHtml += Booking.getHtmlForOneAppointment(appointment))

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
    }
};

Booking.getAppointments();