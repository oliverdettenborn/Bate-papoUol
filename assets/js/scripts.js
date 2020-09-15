var main = document.querySelector('main');
var mensagens;
var participantes;

//setInterval(buscarMensagens,3000);
buscarMensagens();

function buscarMensagens(){
    var requisicao = axios.get('https://mock-api.bootcamp.respondeai.com.br/api/v1/uol/messages');
    requisicao.then(processarMensagens);
}

function processarMensagens(resposta){
    mensagens = resposta.data;
    renderizarChat();
}
