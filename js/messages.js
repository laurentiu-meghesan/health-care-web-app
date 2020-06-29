function openForm() {
    document.getElementById("myChatForm").style.display = "block";
}

function closeForm() {
    document.getElementById("myChatForm").style.display = "none";
}

window.Messages = {

    API_BASE_URL: "http://localhost:8084/chats/",

    createMessage: function () {

        let patientId = sessionStorage.getItem("loggedUserId");
        let currentDate = Date.now();

        let messageSent = $("#textarea-message").val();

        let requestBody = {

            doctorId: 1,
            messageDate: new Date(currentDate),
            messageReceived: "",
            messageSent: messageSent,
            patientId: patientId
        };

        $.ajax({
            url: Messages.API_BASE_URL,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(requestBody)
        }).done(function (event) {
            console.log(messageSent, event);
            Messages.getMessages();
        })
    },

    getMessages: function () {
        userIsLoggedIn = sessionStorage.getItem("userIsLoggedIn");
        loggedUserIsDoctor = sessionStorage.getItem("loggedUserIsDoctor");

        if (userIsLoggedIn) {
            if (loggedUserIsDoctor == 'false') {
                let patientId = sessionStorage.getItem("loggedUserId");
                userIsLoggedIn = sessionStorage.getItem("userIsLoggedIn");

                $.ajax({
                    url: Messages.API_BASE_URL + "/patientId=" + patientId
                }).done(function (response) {
                    console.log(response);
                    let displayContent = response.content;
                    displayContent = displayContent.sort(postMessage);

                    Messages.displayMessages(displayContent.reverse());
                })
            } else {
                let doctorId = 1;

                $.ajax({
                    url: Messages.API_BASE_URL + "/doctorId=" + doctorId
                }).done(function (response) {

                    let patientsIds = [];

                    for (let i = 0; i < response.content.length; i++) {
                        patientsIds[i] = response.content[i].patientId;
                    }

                    let uniqueId = [];
                    $.each(patientsIds, function (i, el) {
                        if ($.inArray(el, uniqueId) === -1) uniqueId.push(el);
                    });

                    uniqueId.reverse();

                    let patientsNames = [];

                    console.log(patientsNames);
                    for (let i = 0; i < uniqueId.length; i++) {
                        $.ajax({
                            url: "http://localhost:8084/patients/" + uniqueId[i]
                        }).done(function (patient) {
                            patientsNames.push(patient.firstName + " " + patient.lastName);

                            let htmlNames = '';
                            patientsNames.forEach(patient => htmlNames += Messages.getHtmlTableWithPatientsName(patient));
                            $('.messages-new-class').html(htmlNames);
                        })
                    }
                })
            }
        }
    },

    getHtmlTableWithPatientsName: function (patient) {

        console.log(patient);

        return `<div class="container-chat">
                     <img src="img/icon/icon-6.png" alt="Avatar">
                     <p>${patient}</p>
                     <button type="button" class="open-messages" onclick="Messages.openMessagesWithOnePatient(62)">Open messages with patient ${patient}</button>
                </div>`;
    },

    openMessagesWithOnePatient: function (patient) {

        console.log(patient);

        $.ajax({
            url: Messages.API_BASE_URL + "/patientId=" + patient
        }).done(function (response) {
            console.log(response);
            let displayContent = response.content;
            displayContent = displayContent.sort(postMessage);

            Messages.displayMessages(displayContent.reverse());
        })
    },

    displayMessages: function (messages) {
        let messagesHtml = '';

        function messageContent(message) {
            let messageSent = Messages.getHtmlForMessageSent(message);
            let messageReceived = '';
            if (message.messageReceived.length > 0) {
                messageReceived = Messages.getHtmlForMessageReceived(message);
            }

            if (messageReceived.length === 0) {
                messagesHtml += messageSent;
            } else messagesHtml += messageReceived + messageSent;
        }

        messages.forEach(message => messageContent(message));

        $('.messages-new-class').html(messagesHtml);
    },

    getHtmlForMessageSent: function (message) {
        return `<div class="container-chat">
        <img src="img/icon/icon-6.png" alt="Avatar">
        <a href="#" data-id=${message.id} class="delete-message">
                <i class="fas fa-trash-alt" style="float: right; size: 180px" title="Delete message"></i>
            </a>
        <p>${message.messageSent}</p>
        <span class="time-right">${new Date(message.messageDate).toLocaleString()}</span>
    </div>`;

    },

    getHtmlForMessageReceived: function (message) {
        return `<div class="container-chat darker-chat">
        <img src="img/icon/icon-1.png" alt="Avatar" class="right">
        <p>${message.messageReceived}</p>
        <span class="time-left">${new Date(message.messageReceivedDate).toLocaleString()}</span>
    </div>`;
    },

    deleteMessage: function (id) {
        $.ajax({
            url: Messages.API_BASE_URL + id,
            method: "DELETE"
        }).done(function () {
            Messages.getMessages();
        })
    },

    bindEvents: function () {
        $('#message-submit').click(function (event) {
            event.preventDefault();
            Messages.createMessage();
        });

        $(".messages-class").delegate(".delete-message", "click", function (event) {
            event.preventDefault();

            let answer = confirm("Are you sure you want to delete this message?");
            if (answer == true) {
                let messageId = $(this).data("id");
                Messages.deleteMessage(messageId);
            }
        })
    }
};
Messages.getMessages();
Messages.bindEvents();