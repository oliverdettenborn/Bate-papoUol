var main = document.querySelector('main');
var listaParticipantes = document.querySelector('.participantes');
var mensagens;
var participantes;
var meuUsuario = "João";

setInterval(buscarMensagens,3000);
setInterval(buscarParticipantes,10000);


function buscarMensagens(){
    var requisicao = axios.get('https://mock-api.bootcamp.respondeai.com.br/api/v1/uol/messages');
    requisicao.then(processarMensagens);
}

function buscarParticipantes(){
    var requisicao = axios.get('https://mock-api.bootcamp.respondeai.com.br/api/v1/uol/participants');
    requisicao.then(processarParticipantes);
}

function processarMensagens(resposta){
    mensagens = resposta.data;
    renderizarChat();
}

function processarParticipantes(resposta){
    participantes = resposta.data;
    renderizarParticipantes();
}

function mostrarMenu(){
    var menu = document.querySelector("aside");
    menu.classList.toggle('ativado')
}

function renderizarChat(){
    main.innerHTML = "";
    //percorrer array
    for(var i = 0; i < mensagens.length; i++){
        renderizarMensagem(mensagens[i]);
    }
    main.scrollIntoView({block: "end"});
}

function renderizarParticipantes(){
    listaParticipantes.innerHTML = "";

    criarLiParticipantes("Todos");

    for(var i = 0; i < participantes.length; i++){
        criarLiParticipantes(participantes[i].name);
    }

    console.log(listaParticipantes);
}

function renderizarMensagem(elemento){
    var divMensagem = criarElemento("div","mensagem");

    var tipo = verificaTipo(elemento.type); 
    divMensagem.classList.add(tipo);

    var time = criarElemento("time");
    time.innerText = elemento.time;

    var divUsuario = criarElemento("div","usuario");
    divUsuario.innerText = elemento.from;

    var divDestinatario = criarElemento("div","destinatario");
    divDestinatario.innerText = elemento.to;

    var texto = criarElemento("p");
    texto.innerText = elemento.text;

    var checagemReservado = verificaMensagemPrivada(tipo,elemento.from,elemento.to);

    //verificação se o tipo é status para decidir se renderiza ou não o destinatario
    var filhos = verificacaoTipoStatusAntesRenderizar(tipo,divMensagem,time,divUsuario,divDestinatario,texto);
    
    if(checagemReservado === "ocultar"){
        return;
    }
    vincularFilhos(main,divMensagem,filhos);
}

function criarElemento(elemento,classe){
    var elementoCriado = document.createElement(elemento);
    elementoCriado.classList.add(classe);
    return elementoCriado;
}

function criarLiParticipantes(participante){
    var li = document.createElement('li');
    li.setAttribute('onclick','check(this)');

    var icone = document.createElement('ion-icon');
    icone.setAttribute('name','people');

    var texto = document.createElement('h6');
    texto.innerText = participante;

    var filhos = [icone,texto];
    vincularFilhos(listaParticipantes,li,filhos);
}

function verificaTipo(tipo){
    if(tipo === "status"){
        return "entrouOuSaiu";
    }else if(tipo === "message"){
        return "publico";
    }else if(tipo === "private_message"){
        return "reservado";
    }
}

function verificaMensagemPrivada(tipo, usuarioOrigem,usuarioDestino){
    if(tipo === "reservado"){
        if(meuUsuario === usuarioOrigem || meuUsuario === usuarioDestino)
            return "exibir";
        else
            return "ocultar";
    }else{
        return "exibir";
    }
}

function verificacaoTipoStatusAntesRenderizar(tipo,divMensagem,time,divUsuario,divDestinatario,texto){
    if(tipo === "entrouOuSaiu"){
        return [time, divUsuario, texto];
        
    }else{
        return [time,divUsuario,divDestinatario,texto];
    }
}

function vincularFilhos(elementoHTML,pai,filhos){
    var arrayFilhos = filhos;

    for(var i = 0; i < arrayFilhos.length; i++){
        pai.appendChild(arrayFilhos[i]);
    }
    elementoHTML.appendChild(pai);
}