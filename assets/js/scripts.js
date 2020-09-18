var main = document.querySelector('main');
var input = document.querySelector("#postarMensagem");
var listaParticipantes = document.querySelector('.participantes');
var telaInicial = document.querySelector('#tela-inicial');

var meuUsuario = {};
var destinatario = "Todos";
var ultimaVisibilidade = "Público";
var visibilidade = "message";
var participantes = [];

function pressionaenterEntrarNaSala(){
    codekey = event.keyCode;
    if (codekey === 13){
        iniciarChat();
    }
}

function iniciarChat(){
    var nome = document.querySelector("#nome");
    meuUsuario.name = nome.value;
    
    mostraTelaCarregando();
    enviaUsuario();
}

function enviaUsuario(){
    axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v1/uol/participants',meuUsuario).then(processarSucessoEntradaUsuario).catch(erroNomeUsuario)
}

function processarSucessoEntradaUsuario(){
    setTimeout(desativarTelaInicial,4000);
    setInterval(enviarStatus,4500)
    setInterval(buscarMensagens,3000);
    setInterval(buscarParticipantes,10000);
}

function erroNomeUsuario(erro){
    setTimeout(voltarTelaPedirNome,1500);
}

function buscarMensagens(){
    axios.get('https://mock-api.bootcamp.respondeai.com.br/api/v1/uol/messages').then(processarMensagens);
}

function buscarParticipantes(){
    axios.get('https://mock-api.bootcamp.respondeai.com.br/api/v1/uol/participants').then(processarParticipantes);
}

function enviarStatus(){
    axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v1/uol/status', meuUsuario).catch(processarErroPost);
}

function processarMensagens(resposta){
    renderizarChat(resposta.data);
}

function processarParticipantes(resposta){
    renderizarParticipantes(resposta.data);
}

function processarErroPost(resposta){
    window.location.reload();
}

function enviarMensagem(){
    var dados = montarMensagem();

    if(dados !== null){
        renderizarMensagem(dados);
        axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v1/uol/messages',dados).catch(processarErroPost);
    }else{
        return
    }
}

function pressionarEnter(){
    codekey = event.keyCode;
    if (codekey === 13){
        enviarMensagem();
    }
}

function montarMensagem(){
    var textoMensagem = input.value;
    textoMensagem = textoMensagem.trim();
    var time = pegarHoras();

    if(textoMensagem === ""){
        return null;
    }else{
        var dados = {
            "from": meuUsuario.name,
            "to": destinatario,
            "text": textoMensagem,
            "type": visibilidade,
            "time": time
        }
        input.value = "";
    
        return dados;
    }
}

function mostrarMenu(){
    var menu = document.querySelector("aside");
    menu.classList.add('ativado');
}
function fecharMenu(){
    var menu = document.querySelector("aside");
    menu.classList.remove('ativado');
}

function renderizarChat(mensagens){
    main.innerHTML = "";
    for(var i = 0; i < mensagens.length; i++){
        renderizarMensagem(mensagens[i]);
    }
    scrollAtomatico();
}

function renderizarParticipantes(resposta){
    listaParticipantes.innerHTML = "";
    participantes = resposta;

    criarLiParticipantes("Todos");

    for(var i = 0; i < participantes.length; i++){
        criarLiParticipantes(participantes[i].name);
    }

    participantes.push({"name": "Todos"});
}

function renderizarMensagem(elemento){
    var divMensagem = criarElemento("div","mensagem");

    var tipo = verificaTipo(elemento.type); 
    divMensagem.classList.add(tipo);

    var time = criarElemento("time");
    time.innerText = elemento.time;

    var divUsuario = criarElemento("span","usuario");
    divUsuario.innerText = primeiraLetraMaiuscula(elemento.from);

    var divDestinatario = criarElemento("span","destinatario");
    divDestinatario.innerText = primeiraLetraMaiuscula(elemento.to);

    var texto = document.createTextNode(elemento.text);

    var checagemReservado = verificaMensagemPrivada(tipo,elemento.from,elemento.to);

    //verificação se o tipo é status para decidir se renderiza ou não o destinatario
    var filhos = verificacaoTipoStatusAntesRenderizar(divUsuario,divDestinatario,texto,tipo,time);
    
    if(checagemReservado === "ocultar"){
        return;
    }
    vincularFilhos(main,divMensagem,filhos);

    scrollAtomatico();
}

function criarElemento(elemento,classe){
    var elementoCriado = document.createElement(elemento);
    elementoCriado.classList.add(classe);
    return elementoCriado;
}

function criarLiParticipantes(participante){
    var li = document.createElement('li');
    li.setAttribute('onclick','selecionaDestinatario(this)');
    li.setAttribute('data-name',participante);

    var icone = document.createElement('ion-icon');

    if(participante === "Todos"){icone.setAttribute('name','people');}
    else {icone.setAttribute('name','person-circle');}

    var texto = document.createElement('h6');
    texto.innerText = participante;

    var checkmark = document.createElement('ion-icon');
    checkmark.setAttribute('name','checkmark');
    checkmark.classList.add('checkmark');
    if(participante.toUpperCase() == destinatario.toUpperCase()){
        li.classList.add('selecionado');
    }

    var filhos = [icone,texto,checkmark];
    vincularFilhos(listaParticipantes,li,filhos);
}

function selecionaDestinatario(participanteClidado){
    var ultimoDestinatario = document.querySelector('.participantes .selecionado');
    
    if(ultimoDestinatario === null){
        destinatario = "Todos";
        renderizarParticipantes();
        mudaplaceholder();
    }

    ultimoDestinatario.classList.toggle('selecionado');
    participanteClidado.classList.toggle('selecionado');

    destinatario = participanteClidado.getAttribute('data-name');
    mudaplaceholder();
}

function selecionaVisibilidade(clicado){
    var visibilidadeAtual = document.querySelector('.visibilidade .selecionado');
    visibilidadeAtual.classList.toggle('selecionado');
    clicado.classList.toggle('selecionado');
    
    var textoNovaVisibilidade = clicado.querySelector('h6');
    ultimaVisibilidade = textoNovaVisibilidade.innerText;

    if(ultimaVisibilidade === "Público"){
        visibilidade = "message";
    }else if(ultimaVisibilidade === "Reservadamente"){
        visibilidade = "private_message";
    }
    
    mudaplaceholder();
}

function mudaplaceholder(){
    var novoPlaceholder = "Enviando para " + destinatario + " (" + ultimaVisibilidade + ")";
    input.setAttribute('placeholder',novoPlaceholder);
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
        var euEnviei = meuUsuario.name === usuarioOrigem;
        var souDestino = meuUsuario.name === usuarioDestino;
        var paraTodoMundo = meuUsuario.name === "Todos";
        if(euEnviei || souDestino || paraTodoMundo)
            return "exibir";
        else
            return "ocultar";

    }else{
        return "exibir";
    }
}

function verificacaoTipoStatusAntesRenderizar(divUsuario,divDestinatario,texto,tipo,time){
    if(tipo === "entrouOuSaiu"){
        return [time, divUsuario, texto];
    }else{
        return [time,divUsuario,divDestinatario,texto];
    }
}

function vincularFilhos(elementoHTML,pai,filhos){

    for(var i = 0; i < filhos.length; i++){
        pai.appendChild(filhos[i]);
    }
    elementoHTML.appendChild(pai);
}

function mostraTelaCarregando(){
    telaInicial.innerHTML = "<img class='logo' src='imagens/logo.png' alt='logo da Uol'><img class='carregando' src='https://media.giphy.com/media/l3q2SWX1EW3LdD7H2/giphy.gif' alt='carregando'><p>Entrando...</p>"
}

function voltarTelaPedirNome(){
    telaInicial.innerHTML = "<img class='logo' src='imagens/logo.png' alt='logo da Uol'><em>Nome já está em uso!</em><input id='nome' type='text' placeholder='Digite outro nome'onkeypress='pressionaenterEntrarNaSala()'><button onclick='iniciarChat()'>Entrar</button>"
}

function desativarTelaInicial(){
    telaInicial.style.display = 'none';
}

function pegarHoras(){
    var data = new Date();
    var horario = data.getHours() + ":" +  data.getMinutes() + ":" + + data.getSeconds();
    return horario;
}

function scrollAtomatico(){
    window.scrollTo(0,document.body.scrollHeight);
}

function primeiraLetraMaiuscula(string){
    return string[0].toUpperCase() + string.slice(1);
}