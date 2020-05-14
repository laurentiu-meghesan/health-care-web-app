window.Messages = {

    API_BASE_URL: "http://localhost:8084",

    getMessages: function () {
        $.ajax({
            url: Messages.API_BASE_URL,
            method: "GET"
        }).done(function (response) {

        })
    },

    getMessageRow: function (message) {
        return `<div class="container">
    <img src="/w3images/bandmember.jpg" alt="Avatar">
    <p>message</p>
<span class="time-right">11:00</span>
</div>

<div class="container darker">
    <img src="/w3images/avatar_g2.jpg" alt="Avatar" class="right">
    <p>Hey! I'm fine. Thanks for asking!</p>
<span class="time-left">11:01</span>
</div>`
    }

};