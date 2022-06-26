let resposta;
let user;
let nome;
let mensagemTemplate;
let chat = document.querySelector(".bate-papo");
let mensagens;


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

}

function erroNome() {
    alert("Esse nome está inválido, por favor digie um nome válido");
    window.location.reload()
}

function atualizarStatus() {
    let online = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', user);
    online.catch(erroConexao)
}

function erroConexao() {
    alert("Ops, você caiu. Loga ai de novo");
    window.location.reload()
}

function carregarMensagens() {
    resposta = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    resposta.then(exibirMensagens)
}

function recarregarMensagens() {

    resposta = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    resposta.then(exibirMensagens)

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
            </span> <span class= "to"> Reservardamente para ${mensagens[i].to}:</span>
            <span class = "mensagem">${mensagens[i].text}</span></li>`

        }
        chat.innerHTML += `${mensagemTemplate}`


        console.log(mensagens.length);
    }
    novaMensagem()
}

function novaMensagem() {

    document.querySelector('.bate-papo').lastElementChild.scrollIntoView();
}

function enviarMensagem() {
    let recado = document.querySelector('.texto').value

    let estruturaMsg = {
        from: `${user.name}`,
        to: 'Todos',
        text: `${recado}`,
        type: "message" // ou "private_message" para o bônus};

    }

    const mensagemEnviada = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', estruturaMsg);
    mensagemEnviada.then(carregarMensagens);
    mensagemEnviada.catch(erroConexao);
    document.querySelector('.texto').value = "";
}

setInterval(atualizarStatus, 5000);
setInterval(recarregarMensagens, 3000);