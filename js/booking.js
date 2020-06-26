window.Booking = {

    API_URL: "http://localhost:8084",

    getAppointments: function () {
        let patientId = sessionStorage.getItem("loggedUserId");
        userIsLoggedIn = sessionStorage.getItem("userIsLoggedIn");
        loggedUserIsDoctor = sessionStorage.getItem("loggedUserIsDoctor");

        if (userIsLoggedIn) {

            if (loggedUserIsDoctor == 'false') {
                $.ajax({
                    url: Booking.API_URL + "/appointments/patientId=" + patientId,
                    method: "GET"
                }).done(function (patientAppointments) {
                    if (patientAppointments.content != 0) {
                        Booking.displayAppointments(patientAppointments.content);
                    } else document.getElementById('output-booking').innerHTML = "You don't have any appointments yet.";
                })
            } else {
                $.ajax({
                    url: Booking.API_URL + "/appointments"
                }).done(function (allAppointments) {
                    if (allAppointments.content != 0) {
                        Booking.displayAppointments(allAppointments.content);
                    } else document.getElementById('output-booking').innerHTML = "You don't have any appointments yet.";
                })
            }
        } else document.getElementById('output-booking').innerHTML = "You must log in first!";
    },

    displayAppointments: function (appointments) {
        let appointmentsHtml = '';

        if (loggedUserIsDoctor == 'false') {
            appointments.forEach(appointment => appointmentsHtml += Booking.getHtmlForOneAppointment(appointment));
        } else appointments.forEach(appointment => appointmentsHtml += Booking.getHtmlForOneAppointmentWithEdit(appointment));

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
            <td><a href="#" data-id=${appointment.id} class="delete-appointment">
                <i class="fas fa-trash-alt" style="display: flex; align-items: center;justify-content: center; size: 180px" title="Delete appointment"></i>
            </a></td>
        </tr>`;
    },

    getHtmlForOneAppointmentWithEdit: function (appointment) {
        let formattedDate = new Date(appointment.appointmentDate).toLocaleString();

        return `<tr>
            <td>${formattedDate}</td>
            <td>${appointment.doctorId}</td>
            <td>${appointment.patientId}</td>
            <td>${appointment.symptoms}</td>
            <td>${appointment.diagnostic}</td>
            <td>${appointment.treatment}</td>
            <td>${appointment.recommendations}</td>
            <td style="text-align: center">
            <a href="#" data-id=${appointment.id} class="update-appointment">
                <i class="fas fa-edit" title="Update appointment"></i>
            </a>
            
            <a href="#" data-id=${appointment.id} class="delete-appointment">
                <i class="fas fa-trash-alt"  title="Delete appointment"></i>
            </a></td>
        </tr>`;
    },

    createAppointment: function () {

        let patientId = parseInt(sessionStorage.getItem("loggedUserId"));
        console.log(patientId);

        if (patientId == null) {
            alert("You need to update your profile first.");
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
                doctorId: 1,
                patientId: patientId,
                appointmentDate: timeDate,
                symptoms: "Available after consultation.",
                diagnostic: "Available after consultation.",
                treatment: "Available after consultation.",
                recommendations: "Available after consultation."
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

    updateAppointment: function (id) {

        let editedSymptoms = $('#symptoms-editSection').val();
        let editedDiagnostic = $('#diagnostic-editSection').val();
        let editedTreatment = $('#treatment-editSection').val();
        let editedRecommendations = $('#recommendations-editSection').val();
        let appointmentDate;
        let doctorId;
        let patientId;

        $.ajax({
            url: Booking.API_URL + "/appointments/" + id,
        }).done(function (currentAppointment) {
            console.log(currentAppointment);
            appointmentDate = currentAppointment.appointmentDate;
            doctorId = currentAppointment.doctorId;
            patientId = currentAppointment.patientId;

            let requestBody = {
                doctorId: doctorId,
                patientId: patientId,
                appointmentDate: appointmentDate,
                symptoms: editedSymptoms,
                diagnostic: editedDiagnostic,
                treatment: editedTreatment,
                recommendations: editedRecommendations
            };
            console.log(requestBody);

            $.ajax({
                url: Booking.API_URL + "/appointments/" + id,
                method: "PUT",
                contentType: "application/json",
                data: JSON.stringify(requestBody)
            }).done(function () {
                Booking.getAppointments();
            })
        });
    },

    deleteAppointment: function (id) {
        $.ajax({
            url: Booking.API_URL + "/appointments/" + id,
            method: "DELETE"
        }).done(function () {
            Booking.getAppointments();
        })
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

        $("#appointments-table").delegate(".delete-appointment", "click", function (event) {
            event.preventDefault();

            let answer = confirm("Are you sure you want to delete this appointment?");
            if (answer == true) {
                let appointmentId = $(this).data("id");
                Booking.deleteAppointment(appointmentId);
            }
        });

        $("#appointments-table").delegate(".update-appointment", "click", function (event) {
            event.preventDefault();
            let appointmentId = $(this).data("id");

            document.getElementById('update-appointment-details').insertAdjacentHTML("afterend",

                "<p style='text-align: center'>Editing section: &nbsp;&nbsp;&nbsp;\n" +
                "      <input type=\"text\" size=\'70\' id=\"symptoms-editSection\" placeholder=\"Update symptoms\">\n </p>" +
                "      <p style='text-align: center'> <input type=\"text\" size=\'87\' id=\"diagnostic-editSection\"" +
                " placeholder=\"Update diagnostic\">\n </p>" +
                "      <p style='text-align: center'> <input type=\"text\" size=\'87\' id=\"treatment-editSection\" " +
                "placeholder=\"Update treatment\">\n </p>" +
                "      <p style='text-align: center'> <input type=\"text\" size=\'87\' id=\"recommendations-editSection\" " +
                "placeholder=\"Update recommendations\">\n </p>" +
                "      <p style='text-align: center'> " +
                "<i class=\"fas fa-save\" id=\"saveButton-editAppointment\" role=\'button\' title=\'Save\' " +
                "style=\'width: 40px; height: 40px; background-size: 40% 40%; font-size: 40px; color: green\'></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n" +
                "      <i class=\"fas fa-window-close\" role=\'button\' onclick=\"Booking.cancelEdit()\" title='\Cancel\' " +
                "style=\'width: 40px; height: 40px; background-size: 40% 40%; font-size: 40px; color: red\'></i>\n</p>"
            );

            document.getElementById('update-appointment-details').scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "nearest"
            });

            $("#saveButton-editAppointment").on("click", function () {
                Booking.updateAppointment(appointmentId);
                alert("Appointment with id " + appointmentId + " was updated!");
            });
        })
    },

    cancelEdit: function () {
        location.reload(true);
        document.forms["symptoms-editSection", "diagnostic-editSection", "treatment-editSection", "recommendations"].reset();
    },
};

Booking.getAppointments();
Booking.bindEvents();