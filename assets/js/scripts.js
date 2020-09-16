var main = document.querySelector('main');
var windowHeight = window.innerHeight + 75;
var listaParticipantes = document.querySelector('.participantes');
var mensagens;
var participantes;
var meuUsuario = {};
var destinatario = "Todos";

iniciarChat();

function iniciarChat(){
    meuUsuario.name = prompt("Qual o seu nome?");
    enviaUsuario();
}

function enviaUsuario(){
    axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v1/uol/participants',meuUsuario).catch(erroNomeUsuario).then(processarSucessoEntradaUsuario)
}

function processarSucessoEntradaUsuario(){
    setInterval(enviarStatus,3000)
    setInterval(buscarMensagens,3000);
    setInterval(buscarParticipantes,10000);
}

function erroNomeUsuario(erro){
    console.log(erro);
    meuUsuario.name = prompt("Este nome já está em uso, digite um novo nome?");
}

function buscarMensagens(){
    axios.get('https://mock-api.bootcamp.respondeai.com.br/api/v1/uol/messages').then(processarMensagens);
}

function buscarParticipantes(){
    axios.get('https://mock-api.bootcamp.respondeai.com.br/api/v1/uol/participants').then(processarParticipantes);
}

function enviarStatus(){
    axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v1/uol/status', meuUsuario);
}

function processarMensagens(resposta){
    mensagens = resposta.data;
    renderizarChat();
}

function processarParticipantes(resposta){
    participantes = resposta.data;
    renderizarParticipantes();
}

function processarErroPost(resposta){
    console.log("deu erro");
    window.location.reload();
}

function enviarMensagem(){
    var dados = montarMensagem();

    if(dados !== null){
        axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v1/uol/messages',dados).catch(processarErroPost);
    }else{
        return
    }
}

function mostrarMenu(){
    var menu = document.querySelector("aside");
    menu.classList.toggle('ativado')
}

function montarMensagem(input){
    var input = document.querySelector("#postarMensagem");
    var textoMensagem = input.value.trim();
    var time = pegarHoras();

    if(textoMensagem === ""){
        return null;
    }else{
        var dados = {
            "from": meuUsuario.name,
            "to": destinatario,
            "text": textoMensagem,
            "type": "message",
            "time": "00:00:00"
        }
        input.value = "";
    
        renderizarMensagem(dados);
    
        return dados;
    }
}

function renderizarChat(){
    main.innerHTML = "";
    //percorrer array
    for(var i = 0; i < mensagens.length; i++){
        renderizarMensagem(mensagens[i]);
    }
    window.scrollTo(0,document.body.scrollHeight);
}

function renderizarParticipantes(){
    listaParticipantes.innerHTML = "";

    criarLiParticipantes("Todos");

    for(var i = 0; i < participantes.length; i++){
        criarLiParticipantes(participantes[i].name);
    }
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

function pegarHoras(){
    var data = new Date();
    var horario = data.getHours() + ":" +  data.getMinutes() + ":" + + data.getSeconds();
    return horario;
}