"use strict";

var token;

var handleDomo = function handleDomo(e) {
    e.preventDefault();

    $("#domoMessage").animate({
        width: 'hide'
    }, 350);

    if ($("#domoName").val() == '' || $("#domoAge").val == '') {
        handleError('All fields are required');
        return false;
    }
    var x = {
        x: 13,
        y: 23
    };

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function (param) {
        loadDomosFromServer();
    });

    return false;
};

var DomoForm = function DomoForm(props) {
    return React.createElement(
        "form",
        { id: "domoForm",
            onSubmit: handleDomo,
            action: "/maker",
            method: "POST",
            className: "domoForm"
        },
        React.createElement(
            "label",
            { htmlFor: "name" },
            " Name: "
        ),
        React.createElement("input", { id: "domoName", type: "text", name: "name", placeholder: "Domo Name" }),
        React.createElement(
            "label",
            { htmlFor: "age" },
            " Age: "
        ),
        React.createElement("input", { id: "domoAge", type: "text", name: "age", placeholder: "domo age" }),
        React.createElement(
            "label",
            { htmlFor: "level" },
            " Level: "
        ),
        React.createElement("input", { id: "domoLevel", type: "text", name: "level", placeholder: "domo level" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeDomoSubmit", type: "submit", value: "Make Domo" })
    );
};

var DomoList = function DomoList(props) {
    if (props.domos.length === 0) {
        return React.createElement(
            "div",
            { className: "domoList" },
            React.createElement(
                "h3",
                { className: "emptyDomo" },
                " No Domos yet "
            )
        );
    }

    var domoNodes = props.domos.map(function (domo) {
        return React.createElement(
            "div",
            { key: domo._id, className: "domo" },
            React.createElement("img", { src: "assets/img/domoface.jpeg", alt: "domo face", className: "domoFace" }),
            React.createElement(
                "h3",
                { className: "domoName" },
                " Name: ",
                domo.name,
                " "
            ),
            React.createElement(
                "h3",
                { className: "domoAge" },
                " Age: ",
                domo.age,
                " "
            ),
            React.createElement(
                "h3",
                { className: "domoLevel" },
                " Level: ",
                domo.level,
                " "
            ),
            React.createElement(
                "button",
                { className: "levelUp" },
                "Level Up"
            )
        );
    });

    return React.createElement(
        "div",
        { className: "domoList" },
        domoNodes
    );
};
var firstDomo = {

    x: 3
};

var loadDomosFromServer = function loadDomosFromServer() {
    sendAjax('GET', '/getDomos', $.param(firstDomo), function (data) {
        console.log(data.domos);
        firstDomo._id = data.domos[0]._id;
        firstDomo._csrf = token;
        ReactDOM.render(React.createElement(DomoList, { domos: data.domos }), document.querySelector("#domos"));
        searchDomos();
    });
};

var searchDomos = function searchDomos() {

    console.log($.param(firstDomo));
    sendAjax('GET', '/searchDomos', $.param(firstDomo), function (data) {
        console.log(data);
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(DomoForm, { csrf: csrf }), document.querySelector("#makeDomo"));

    ReactDOM.render(React.createElement(DomoList, { domos: [] }), document.querySelector("#domos"));
    loadDomosFromServer();
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        token = result.csrfToken;
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
    $("#domoMessage").animate({
        width: 'toggle'
    }, 350);
};

var redirect = function redirect(response) {
    $("#domoMessage").animate({
        width: 'hide'
    }, 350);
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    console.log(action + "  " + data);
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            console.log("error");
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
