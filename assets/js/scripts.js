var main = document.querySelector('main');
var mensagens;
var participantes;
var usuario = "";

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

function renderizarChat(){
    main.innerHTML = "";
    //percorrer array
    for(var i = 0; i < mensagens.length; i++){
        renderizarMensagem(mensagens[i]);
    }
}

function renderizarMensagem(elemento){
    var divMensagem = criarElemento("div","mensagem");

    var tipo = verificaTipo(elemento.type); 
    divMensagem.classList.add(tipo);


            //verifica se o user é destinatario ou remetente
                //add class reservado
                //se não: não insere
    
    var time = criarElemento("time");
    time.innerText = elemento.time;

    var divUsuario = criarElemento("div","usuario");
    divUsuario.innerText = elemento.from;

    var divDestinatario = criarElemento("div","destinatario");
    divDestinatario.innerText = elemento.to;

    var texto = criarElemento("p");
    texto.innerText = elemento.text;

    if(tipo === "entrouOuSaiu"){
        var filhos = [time, divUsuario, texto];
        vincularFilhos(main,divMensagem,filhos);
    }else{
        var filhos = [time,divUsuario,divDestinatario,texto];
        vincularFilhos(main,divMensagem,filhos);
    }
}

function criarElemento(elemento,classe){
    var elementoCriado = document.createElement(elemento);
    elementoCriado.classList.add(classe);
    return elementoCriado;
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

function vincularFilhos(elementoHTML,pai,filhos){
    var arrayFilhos = filhos;

    for(var i = 0; i < arrayFilhos.length; i++){
        pai.appendChild(arrayFilhos[i]);
    }
    elementoHTML.appendChild(pai);
}
