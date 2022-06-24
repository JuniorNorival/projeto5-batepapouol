let resposta;
let user;
let nome;
let mensagemTemplate;
entradaNaSala();
/* setInterval(atualizarStatus, 5000); */

function entradaNaSala() {
    nome = prompt("Qual a sua graça ?");
    user = {
        name: nome
    }
    const envio = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants ', user);
    envio.then(carregarMensagens);
}

function atualizarStatus (){
    let online = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants ', user);
  
}

function carregarMensagens() {
    resposta = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    resposta.then(exibirMensagens)
}

function exibirMensagens(resposta) {
    let mensagens = {};
    mensagens = resposta.data;

    for (let i = 0; i < mensagens.length; i++) {
       

        if (mensagens[i].type === 'status') {
        mensagemTemplate = `<li class="${mensagens[i].type}"><span class = "time">(${mensagens[i].time}) </span>
        <span class = "from negrito">${mensagens[i].from}</span> 
        <span class = "mensagem">${mensagens[i].text}</span></li>`
        
        } else if (mensagens[i].type === 'message') {
            mensagemTemplate = `<li class="${mensagens[i].type}"><span class = "time">(${mensagens[i].time}) </span>
        <span class = "from negrito">${mensagens[i].from}</span> 
        <span class = "mensagem">${mensagens[i].text}</span></li>`
        }
        document.querySelector(".bate-papo").innerHTML +=`${mensagemTemplate}`

    }

}