var EventRoles = function () {

};
EventRoles.showContentSearch = () => {
    document.getElementsByClassName("content-search")[0].style.display = "flex";
    document.getElementById("search").focus();
}
EventRoles.closeContentSearch = () => {
    document.getElementsByClassName("content-search")[0].style.display = "none";
    document.getElementById("search").value = "";
    document.querySelector(".cards-content").remove()
    Elements.makeCardList();
}

EventRoles.saveNewEvent = () => {

    let eventModel = {
        id: Math.random().toString().replace('0.', '').substring(0, 5),
        data: document.querySelector('#data').value,
        descricao: document.querySelector('#descricao').value,
        obs: document.querySelector('#obs').value,
    };

    clearAlert();
    if (EventRoles.modelIsValid(eventModel)) {
        Site.hideAlert();
        Site.refreshUser();

        Site.userLogged.eventos.push(eventModel);

        localStorage.setItem("user_logged", JSON.stringify(Site.userLogged));
        document.querySelector('#btnBackToEventList').click()
    } else {
        Site.showAlert();
    }

}

EventRoles.saveEditEvent = () => {

    let eventModel = {
        id: Site.idPageEditEvent,
        data: document.querySelector('#data').value,
        descricao: document.querySelector('#descricao').value,
        obs: document.querySelector('#obs').value,
    };

    clearAlert();
    if (EventRoles.modelIsValid(eventModel)) {
        Site.hideAlert();
        Site.refreshUser();

        const indexEvent = Site.userLogged.eventos.findIndex(x => x.id === Site.idPageEditEvent.toString())

        Site.userLogged.eventos[indexEvent].data = eventModel.data;
        Site.userLogged.eventos[indexEvent].descricao = eventModel.descricao;
        Site.userLogged.eventos[indexEvent].obs = eventModel.obs;

        localStorage.setItem("user_logged", JSON.stringify(Site.userLogged));
        document.querySelector('#btnBackToEventList').click()
    } else {
        Site.showAlert();
    }

}
EventRoles.modelIsValid = (model) => {
    let error = false;

    if (!model.data) {
        document.querySelector('.txt-alert').innerHTML += "<li>O campo Data é obrigatório.</li>";
        error = true;
    }
    if (!model.descricao) {
        document.querySelector('.txt-alert').innerHTML += "<li>O campo Descrição é obrigatório.</li>";
        error = true;
    }
    if (!model.obs) {
        document.querySelector('.txt-alert').innerHTML += "<li>O campo Observação é obrigatório.</li>";
        error = true;
    }

    return !error
};

EventRoles.searchEventList = () => {
    document.querySelector(".cards-content").innerHTML = '';
    let search = document.querySelector('#search').value;

    for (let i = 0; i < Site.userLogged.eventos.length; i++) {
        const element = Site.userLogged.eventos[i];
        if (search && element.descricao.toUpperCase().includes(search.toUpperCase())) {

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
}
EventRoles.removeEvent = (id) => {
    if (id) {
        const event = Site.userLogged.eventos.find(x => x.id === id.toString());
        if (event) {
            if (confirm('Você deseja realmente remover este evento?')) {
                Site.userLogged.eventos.splice(Site.userLogged.eventos.findIndex(x => x.id === id.toString()), 1);
                localStorage.setItem("user_logged", JSON.stringify(Site.userLogged));
                document.querySelector(".cards-content").remove()
                Elements.makeCardList();
            }
        }
    }
}