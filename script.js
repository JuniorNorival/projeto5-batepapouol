let resposta;
let user;
let nome;
let mensagemTemplate;
let chat = document.querySelector(".bate-papo");
let mensagens;
let participantes = {};
let participantesTemplate;
let estruturaMsg;
let recebedor;
let participanteSelecionado;
let privacidadeEscolhida;
let privacidadeMensagem;

entradaNaSala();


document.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        enviarMensagem();
    }
})

function entradaNaSala() {
    nome = prompt("Qual a sua graça ?");
    user = {
        name: nome
    }
    const envio = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants ', user);
    envio.then(carregarMensagens);
    envio.catch(erroNome);
    privacidadeMensagem = 'Público';
    recebedor = 'Todos'


}

function erroNome() {
    alert("Esse nome está inválido, por favor digie um nome válido");
    window.location.reload();
}

function atualizarStatus() {
    let online = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', user);
    online.catch(erroConexao);
}

function erroConexao() {
    alert("Ops, você caiu. Loga ai de novo");
    window.location.reload();
}

function carregarMensagens() {
    resposta = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    resposta.then(exibirMensagens);
    buscaParticipantes();
}

function recarregarMensagens() {

    resposta = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    resposta.then(exibirMensagens);

}

function exibirMensagens(resposta) {
    mensagens = {};
    mensagens = resposta.data;
    chat.innerHTML = "";

    for (let i = 0; i < mensagens.length; i++) {


        if (mensagens[i].type === 'status') {
            mensagemTemplate = `<li class="${mensagens[i].type}">
            <span class = "time">(${mensagens[i].time}) </span>
            <span class = "from negrito">${mensagens[i].from}</span>
            
            <span class = "mensagem">${mensagens[i].text}</span></li>`

        } else if (mensagens[i].type === 'message') {
            mensagemTemplate = `<li class="${mensagens[i].type}">
            <span class = "time">(${mensagens[i].time}) </span>
            <span class = "from negrito">${mensagens[i].from}</span> 
            para <span class= "to negrito">${mensagens[i].to}:</span>   
            <span class = "mensagem">${mensagens[i].text}</span></li>`
        } else if (user.name === mensagens[i].from || user.name === mensagens[i].to) {
            mensagemTemplate = `<li class="${mensagens[i].type}">
            <span class = "time">(${mensagens[i].time}) </span>
            <span class = "from negrito">${mensagens[i].from}
            </span> <span class= "to negrito"> Reservardamente para ${mensagens[i].to}:</span>
            <span class = "mensagem">${mensagens[i].text}</span></li>`

        }
        chat.innerHTML += `${mensagemTemplate}`



    }
    novaMensagem();
}

function novaMensagem() {

    document.querySelector('.bate-papo').lastElementChild.scrollIntoView();
}

function enviarMensagem() {

    let recado = document.querySelector('.texto').value;
    if (privacidadeMensagem === 'Público') {
        estruturaMsg = {
            from: `${user.name}`,
            to: `${recebedor}`,
            text: `${recado}`,
            type: "message" // ou "private_message" para o bônus};

        }
    }
    if (privacidadeMensagem === 'Reservadamente') {
        estruturaMsg = {
            from: `${user.name}`,
            to: `${recebedor}`,
            text: `${recado}`,
            type: "private_message"

        }
    }


    const mensagemEnviada = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', estruturaMsg);
    mensagemEnviada.then(carregarMensagens);

    document.querySelector('.texto').value = "";
}

function buscaParticipantes() {

    let promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    promise.then(listarParticipantes)


}

function listarParticipantes(promise) {

    participantes = promise.data;
    if (recebedor === 'Todos' || recebedor === null) {
        document.querySelector(".participantes").innerHTML =
            `<div onclick="selecionarParticipante(this)" class="person selecionado">
    <ion-icon name="people-sharp"></ion-icon>
    <p>Todos</p>
    <ion-icon class="" name="checkmark-outline"></ion-icon>
</div>`;
    } else if (recebedor !== null) {
        document.querySelector(".participantes").innerHTML =
            `<div onclick="selecionarParticipante(this)" class="person ">
    <ion-icon name="people-sharp"></ion-icon>
    <p>Todos</p>
    <ion-icon class="" name="checkmark-outline"></ion-icon>
</div>`;
    }



    for (let i = 0; i < participantes.length; i++) {


        if (participantes[i].name !== recebedor) {
            participantesTemplate = `<li onclick="selecionarParticipante(this)" class="person">
        <ion-icon name="person-circle"></ion-icon>
        <p>${participantes[i].name}</p>
        <ion-icon class = "" name="checkmark-outline"></ion-icon></li>`

        } else if (participantes[i].name === recebedor) {
            participantesTemplate = `<li onclick="selecionarParticipante(this)" class="person selecionado">
        <ion-icon name="person-circle"></ion-icon>
        <p>${participantes[i].name}</p>
        <ion-icon class = "" name="checkmark-outline"></ion-icon></li>`

        }

        document.querySelector(".participantes").innerHTML += `${participantesTemplate}`
    }
}

function exibirParticipantes() {
    document.querySelector(".sidebar").classList.remove("escondido");
    document.querySelector(".fechar-sidebar").classList.add("background-cinza")
    document.querySelector(".bate-papo").style.overflow = 'hidden';
}

function fechaSidebar() {
    document.querySelector(".sidebar").classList.add("escondido");
    document.querySelector(".fechar-sidebar").classList.remove("background-cinza")
}

function selecionarParticipante(elemento) {
    participanteSelecionado = document.querySelector('.selecionado');

    if (participanteSelecionado !== null) {
        participanteSelecionado.classList.remove('selecionado');
    }

    elemento.classList.add('selecionado');

    recebedor = elemento.querySelector('p').innerHTML;


    if (participanteSelecionado === 'Público') {
        recebedor = 'Todos';
    }

}

function privacidade(elemento) {

    document.querySelector(".publico").classList.remove('selecionado');
    document.querySelector(".reservadamente").classList.remove('selecionado');

    elemento.classList.add('selecionado');

    

    
    privacidadeMensagem = elemento.querySelector('p').innerHTML;
    console.log(privacidadeMensagem);

}

setInterval(buscaParticipantes, 10000);
setInterval(atualizarStatus, 5000);
setInterval(recarregarMensagens, 3000);