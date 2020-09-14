# Descrição

Seu terceiro projeto com JavaScript será a implementação de um bate-papo totalmente funcional, inspirado no saudoso Bate-Papo UOL. Mas evite usar o site real da UOL como referência, pois apesar de inspirado nele, nossa interface é totalmente diferente :)

Todas as instruções estão em: [https://github.com/bootcamp-ra/projeto-05-bate-papo-uol](https://github.com/bootcamp-ra/projeto-05-bate-papo-uol)

# Requisitos

- Geral
    - [ ]  Para manipular o HTML, sugerimos utilizar o pattern de Render Function, ensinado nessa semana
    - [ ]  Não utilize nenhuma biblioteca para implementar este projeto (jquery, lodash, etc), somente JavaScript puro
    - [ ]  Seu projeto deverá ser desenvolvido utilizando Git e GitHub
    - [ ]  Para isso, comece fazendo um **fork** **privado** do projeto de referência: [https://github.com/bootcamp-ra/projeto-05-bate-papo-uol](https://github.com/bootcamp-ra/projeto-05-bate-papo-uol)
    - [ ]  **A cada requisito implementado** faça um commit com uma mensagem descritiva do que você evoluiu
    - [ ]  Caso queira dividir um requisito em vários commits, não há problema. Mas evite colocar mais de um requisito no mesmo commit
- Layout
    - [ ]  Aplicar layout para mobile, seguindo imagens fornecidas
    - [ ]  Fonte usada deve ser a Roboto
    - [ ]  Topo e a área de envio de mensagens devem ter posição **fixa**

    Cores

    - Background cinza do body (tela do chat): #F3F3F3
    - Background mensagem de entrar/sair da sala: #DCDCDC
    - Background mensagem com reservadamente: #FFDEDE
    - Textos: #333333
    - Demais backgrounds: #FFFFFF (branco)
- Chat
    - [ ]  Ao entrar no site, este deve carregar as mensagens do servidor e exibi-las conforme layout fornecido
    - [ ]  A cada 3 segundos o site deve re-carregar as mensagens do servidor para manter sempre atualizado
    - [ ]  O chat deverá ter rolagem automática por padrão, ou seja, sempre que novas mensagens forem adicionadas ao final do chat ele deve scrollar para o final
    - [ ]  Caso a mensagem seja de **Entrou** ou **Saiu** da sala, deve ter o fundo cinza
    - [ ]  Caso a mensagem seja **Reservadamente**, deve ter o fundo rosa
    - [ ]  Nos demais caso, deve ter o fundo branco
    - [ ]  **Importante**: as mensagens com **Reservadamente** só devem ser exibidas se o nome do destinatário for igual ao nome do usuário que está usando o chat (ou senão ele poderia ver as mensagens reservadas para outras pessoas)
        - Obs: Fazer essa filtragem no front-end não é uma boa prática, o ideal seria o servidor não fornecer essas mensagens para outras pessoas. Manteremos dessa forma por fins didáticos :)
- Entrada na sala
    - [ ]  Ao entrar no site, o usuário deverá ser perguntado com um `prompt` ****seu lindo nome
    - [ ]  Ao responder, o nome deve ser enviado para o servidor
    - [ ]  Caso o servidor responda com sucesso, o usuário poderá entrar na sala
    - [ ]  Caso o servidor responda com erro, deve-se pedir para o usuário digitar outro nome, pois este já está em uso
    - [ ]  Enquanto o usuário estiver na sala, a cada 5 segundos o site deve avisar ao servidor que o usuário ainda está presente, ou senão será considerado que "Saiu da sala"
- Envio de mensagem
    - [ ]  Por padrão, as mensagens terão como destinatário o **Todos**
    - [ ]  Mensagens vazias não devem ser enviadas
    - [ ]  Ao enviar uma mensagem, esta deve ser adicionada imediatamente no chat, antes mesmo de ser enviada ao servidor, e o campo de texto deve ser limpo
    - [ ]  Logo em seguida, a mensagem deve ser enviada ao servidor
    - [ ]  Nesse envio, deve ser informado o remetente, o destinatário e se a mensagem é reservada ou não
    - [ ]  Caso o servidor responda com sucesso, nada deve ser feito
    - [ ]  Caso o servidor responda com erro, significa que esse usuário não está mais na sala e a página deve ser atualizada (e com isso voltando pra etapa de pedir o nome)

        Dica: experimente usar `window.location.reload()`

- Participantes ativos
    - [ ]  Ao clicar no ícone superior direito de participantes, o menu lateral deve abrir de forma animada (transitando da direita pra esquerda)
    - [ ]  Ao mesmo tempo, um fundo escuro deve tapar o restante do site, de forma que quando clicado oculte o menu lateral novamente
    - [ ]  O site deve obter a lista de participantes assim que entra no chat e deve atualizar a lista a cada 10 segundos
    - [ ]  Ao clicar em uma pessoa ou em público/reservadamente, a opção clicada deve ser marcada com um check e as demais desmarcadas
    - [ ]  Além do check acima, ao trocar esses parâmetros também deve ser alterada a frase que informa o destinatário, que fica embaixo do input de mensagem

# Bônus (opcional)

- [ ]  Em vez de um prompt, faça uma tela inicial, seguindo o layout fornecido nos arquivos úteis
- [ ]  Faça uma versão para desktop. O layout pode ser o mesmo, porém a lista de participantes pode ficar sempre visível na lateral direita da tela em vez de ter o botão para abrir.
- [ ]  Faça com que, caso o usuário tecle Enter no campo de mensagem, ela seja enviada (ou seja, deve ter o mesmo comportamento caso o usuário clique no botão de envio)