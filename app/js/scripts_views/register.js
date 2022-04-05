var Register = function () {

};

Register.saveNewAccont = function () {
    let model = {
        nome: document.querySelector('#nome').value,
        email: document.querySelector('#email').value,
        senha: document.querySelector('#senha').value,
        senhaConfirmed: document.querySelector('#senhaConfirmed').value,
    }
    clearAlert();
    if (Register.createIsValid(model)) {
        Site.hideAlert();
        Site.userLogged = {
            nome: model.nome,
            email: model.email,
            senha: model.senha,
            eventos: [],
            logged: false
        };
        localStorage.setItem("user_logged", JSON.stringify(Site.userLogged));
        Site.navigationToLogin();
    } else {
        Site.showAlert();
    }
};

Register.createIsValid = function (model) {
    let error = false;

    if (!model.nome) {
        document.querySelector('.txt-alert').innerHTML += "<li>O campo Nome é obrigatório.</li>";
        error = true;
    }
    if (!model.email) {
        document.querySelector('.txt-alert').innerHTML += "<li>O campo E-mail é obrigatório.</li>";
        error = true;
    }
    if (!model.senha) {
        document.querySelector('.txt-alert').innerHTML += "<li>O campo Senha é obrigatório.</li>";
        error = true;
    }

    if (!model.senhaConfirmed) {
        document.querySelector('.txt-alert').innerHTML += "<li>O campo de Confirmação da Senha é obrigatório.</li>";
        error = true;
    }

    if (!error && model.senhaConfirmed != model.senha) {
        document.querySelector('.txt-alert').innerHTML += "<li>O campo Senha e o campo Confirmação da Senha devem ser identicos.</li>";
        error = true;
    }

    return !error
};