var Site = function () { };
var Elements = () => { };
var Expressions = () => { };


Site.userLogged = {
    nome: "",
    email: "",
    senha: "",
    eventos: [],
    logged: false
};

Site.page = "";
Site.idPageEditEvent = "";

Site.refreshUser = () => {
    const user = JSON.parse(localStorage.getItem('user_logged'));
    if (user) Site.userLogged = user;
}

onload = () => {
    const user = JSON.parse(localStorage.getItem('user_logged'));
    if (user) Site.userLogged = user;

    Site.idPageEditEvent = localStorage.getItem('idPageEditEvent');

    let page = document.querySelector('#page');
    if (page && page.value == "event_list") {
        Site.page = page.value;
        Site.controllerViewEventList();
    } else if (page && page.value == "event_edit") {
        Site.controllerViewEventEdit();
    }
}

Site.navigationToLogin = function () {
    location.href = '/index.html';
}
Site.navigationToEventList = function () {
    location.href = "/views/event_list.html";
}
Site.navigationToEventNew = function () {
    location.href = "/views/event_new.html";
}
Site.navigationToEventEdit = function (idPage) {
    if (idPage) {
        Site.idPageEditEvent = idPage.toString();
        localStorage.setItem('idPageEditEvent', idPage.toString());
    }
    location.href = "/views/event_edit.html";
}

Site.navigationToEventDetails = function () {
    location.href = "/views/event_details.html";
}

clearAlert = () => {
    document.querySelector('.txt-alert').innerHTML = "";
}
Site.appendChildHtml = (elementSelector, htmlChild) => {
    document.querySelector(elementSelector).innerHTML += htmlChild;
}
Site.hideAlert = function () {
    document.querySelector('.txt-alert').innerHTML = "";
    document.querySelector('.alert').style.display = "none";
}
Site.showAlert = function () {
    document.querySelector('.alert').style.display = "block";
}
Site.saveNewUser = (user) => {
    userLogged.nome = user.nome;
    userLogged.email = user.email;
    userLogged.senha = user.senha;
    localStorage.setItem('userLogged', JSON.stringify(userLogged));
};

Site.Login = () => {
    let email = document.querySelector('#email').value;
    let senha = document.querySelector('#senha').value;
    let erro = false;

    clearAlert();

    if (!email) {
        document.querySelector('.txt-alert').innerHTML += "<li>O campo E-mail é obrigatório.</li>";
        erro = true;
    }
    if (!senha) {
        document.querySelector('.txt-alert').innerHTML += "<li>O campo Senha é obrigatório.</li>";
        erro = true;
    }

    if (erro)
        Site.showAlert();
    else {
        if (senha == Site.userLogged.senha &&
            email == Site.userLogged.email) {
            Site.navigationToEventList();
        } else {
            document.querySelector('.txt-alert').innerHTML += "<li>E-mail ou senha inválidos.</li>";
            Site.showAlert();
        }
    }

}

Site.controllerViewEventList = () => {

    if (!Site.userLogged || !Site.userLogged.email || !Site.userLogged.nome)
        Site.navigationToLogin();
    else {
        if (!Site.userLogged.eventos || Site.userLogged.eventos.length == 0) {
            setTimeout(function () {
                Elements.removeLoaddingCentered();
                Site.appendChildHtml(".componentContent", Elements.getElementListEmpty());
            }, 800);

        } else {
            setTimeout(function () {
                Elements.removeLoaddingCentered();
                Elements.makeCardList();
            }, 800);
        }
    }
}

Site.controllerViewEventEdit = () => {
    if (Site.idPageEditEvent && Site.userLogged.eventos && Site.userLogged.eventos.length > 0) {
        const event = Site.userLogged.eventos.find(x => x.id === Site.idPageEditEvent);
        document.querySelector('#data').value = event.data;
        document.querySelector('#descricao').value = event.descricao;
        document.querySelector('#obs').value = event.obs;
    }
}


Site.logout = () => {
    if (confirm('Você deseja realmente sair?')) {
        document.querySelector('#btnBack').click()
    }
}

Elements.removeLoaddingCentered = () => {
    document.querySelector(".sob-loading").remove();
}
Elements.removeLoadding = () => {
    document.querySelector("#loading").remove();
}
Elements.getLoaddingCentered = () => {
    let el = '<div class="sob-loading">'
        + '<div class="loading-center" id="loading"></div>'
        + '</div>';
    return el;
}
Elements.makeCardList = () => {
    Site.appendChildHtml(".componentContent", '<div class="cards cards-content"></div>');

    for (let i = 0; i < Site.userLogged.eventos.length; i++) {
        const element = Site.userLogged.eventos[i];
        let dateNow = new Date();
        let dateEvent = new Date(element.data);
        const dateFormat = Expressions.formatDateBr(element.data);
        if (dateEvent <= dateNow) {
            if (dateEvent.toDateString() == dateNow.toDateString())
                Site.appendChildHtml(".cards-content", Elements.getElementCardEventWarning(element.id, element.descricao, dateFormat));
            else
                Site.appendChildHtml(".cards-content", Elements.getElementCardEventDanger(element.id, element.descricao, dateFormat));
        } else
            Site.appendChildHtml(".cards-content", Elements.getElementCardEventInfo(element.id, element.descricao, dateFormat));

    }

}
Elements.getLoadding = () => {
    let el = '<div id="loading"></div>';
    return el;
}

Elements.getElementCardEventWarning = (id, title, data) => {
    let card = '<div class="card -warning">'
        + '<div onclick="Site.navigationToEventEdit(' + id + ')" class="div-sub-card">'
        + '<h3 class="title-event">' + title + '</h3><span class="txt-data-event">' + data + '</span>'
        + '</div>'
        + '<div>'
        + '<button class="btn-remove-event" onclick="EventRoles.removeEvent(' + id + ')" type="button" data-dismiss="alert" aria-label="Close">×</button>'
        + '</div>'
        + '</div>';
    return card;
}
Elements.getElementCardEventDanger = (id, title, data) => {
    let card = '<div class="card -danger">'
        + '<div onclick="Site.navigationToEventEdit(' + id + ')" class="div-sub-card">'
        + '<h3 class="title-event">' + title + '</h3><span class="txt-data-event">' + data + '</span>'
        + '</div>'
        + '<div>'
        + '<button class="btn-remove-event" onclick="EventRoles.removeEvent(' + id + ')" type="button" data-dismiss="alert" aria-label="Close">×</button>'
        + '</div>'
        + '</div>';
    return card;

}
Elements.getElementCardEventInfo = (id, title, data) => {
    let card = '<div class="card -info">'
        + '<div onclick="Site.navigationToEventEdit(' + id + ')" class="div-sub-card">'
        + '<h3 class="title-event">' + title + '</h3><span class="txt-data-event">' + data + '</span>'
        + '</div>'
        + '<div>'
        + '<button class="btn-remove-event" onclick="EventRoles.removeEvent(' + id + ')" type="button" data-dismiss="alert" aria-label="Close">×</button>'
        + '</div>'
        + '</div>';
    return card;

}
Elements.getElementCardEventDefault = (id, title, data) => {
    let card = '<div class="card -default">'
        + '<div onclick="Site.navigationToEventEdit(' + id + ')" class="div-sub-card">'
        + '<h3 class="title-event">' + title + '</h3><span class="txt-data-event">' + data + '</span>'
        + '</div>'
        + '<div>'
        + '<button class="btn-remove-event" onclick="EventRoles.removeEvent(' + id + ')" type="button" data-dismiss="alert" aria-label="Close">×</button>'
        + '</div>'
        + '</div>';
    return card;
}

Elements.getElementListEmpty = () => {
    let el = '<div class="content-list-empty" style="text-align: center; margin-top: 5rem;">'
        + '<img src="/assets/list-erro-2.png" style="width: 50%;">'
        + '<div>'
        + '<strong style="font-size: 16pt; font-weight: bold; ">'
        + 'Nenhum envento adicionado!'
        + '</strong>'
        + '</div>'
        + '</div>';
    return el;
}

Expressions.formatDateBr = (date) => {
    let today = new Date(date);
    let dd = today.getDate();
    let mm = today.getMonth() + 1;

    let yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    return dd + '/' + mm + '/' + yyyy;
}