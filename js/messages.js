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

            doctorId: 7,
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

        let patientId = sessionStorage.getItem("loggedUserId");
        userIsLoggedIn = sessionStorage.getItem("userIsLoggedIn");

        $.ajax({
            url: Messages.API_BASE_URL + "/patientId=" + patientId
        }).done(function (response) {
            console.log(response);

            Messages.displayMessages(response.content);
        })
    }
    ,

    displayMessages: function (messages) {
        let messagesHtml = '';

        messages.forEach(messageSent => messagesHtml += Messages.getHtmlForMessageSent(messageSent));
        messages.forEach(messageReceived => messagesHtml += Messages.getHtmlForMessageReceived(messageReceived));

        $('.messages-class .container-chat').html(messagesHtml);
    }
    ,

    getHtmlForMessageSent: function (message) {
        return `<div class="container-chat">
        <img src="img/icon/icon-1.png" alt="Avatar">
        <p>${message.messageSent}</p>
        <span class="time-right">${message.messageDate}</span>
    </div>`;

    },

    getHtmlForMessageReceived: function (message) {
        return `<div class="container-chat darker-chat">
        <img src="img/icon/icon-6.png" alt="Avatar" class="right">
        <p>${message.messageReceived}</p>
        <span class="time-left">${message.messageDate}</span>
    </div>`;
    },

    bindEvents: function () {
        $('#message-submit').click(function () {
            Messages.createMessage();
        })
    }
};
Messages.getMessages();
Messages.bindEvents();