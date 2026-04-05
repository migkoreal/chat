///////////////////////
// Inicialização
///////////////////////
let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let mensagensGlobal = JSON.parse(localStorage.getItem('mensagensGlobal')) || [];

// Verifica login
if(!currentUser){
    alert("Você precisa fazer login!");
    window.location.href = "index.html";
}

///////////////////////
// Elementos DOM
///////////////////////
const chatMessages = document.getElementById('chatMessages');
const mensagemInput = document.getElementById('mensagemInput');
const statusInput = document.getElementById('statusInput');
const bioInput = document.getElementById('bioInput');
const nomeExibido = document.getElementById('nomeExibido');
const avatarUser = document.getElementById('avatarUser');
const bannerImg = document.getElementById('bannerImg');
const amigosList = document.getElementById('amigosList');
const servidoresList = document.getElementById('servidoresList');

///////////////////////
// Inicializa interface
///////////////////////
function initInterface(){
    nomeExibido.innerText = currentUser.nomeExibido;
    avatarUser.src = currentUser.avatar || "https://i.imgur.com/7kXH0bE.png";
    bannerImg.src = currentUser.banner || "https://i.imgur.com/7kXH0bE.png";
    statusInput.value = currentUser.status || "";
    bioInput.value = currentUser.bio || "";
    atualizarAmigosServidores();
    atualizarChat();
}

///////////////////////
// Enviar mensagem
///////////////////////
function enviarMensagem(){
    const msg = mensagemInput.value.trim();
    if(!msg) return;

    if(msg.startsWith('/')){
        processarComando(msg);
        mensagemInput.value='';
        return;
    }

    const mensagemObj = {
        usuario: currentUser.nomeExibido,
        texto: msg,
        hora: new Date().toLocaleTimeString(),
        tipo: "global",
        anexo: null
    };

    mensagensGlobal.push(mensagemObj);
    localStorage.setItem('mensagensGlobal', JSON.stringify(mensagensGlobal));
    mensagemInput.value='';
    atualizarChat();
}

///////////////////////
// Enviar anexo
///////////////////////
function enviarAnexo(input){
    if(input.files.length === 0) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = function(e){
        const mensagemObj = {
            usuario: currentUser.nomeExibido,
            texto: '',
            hora: new Date().toLocaleTimeString(),
            tipo: "global",
            anexo: e.target.result,
            anexoTipo: file.type.startsWith('image/') ? 'img' : 'video'
        };
        mensagensGlobal.push(mensagemObj);
        localStorage.setItem('mensagensGlobal', JSON.stringify(mensagensGlobal));
        atualizarChat();
        input.value='';
    };
    reader.readAsDataURL(file);
}

///////////////////////
// Atualizar chat
///////////////////////
function atualizarChat(){
    chatMessages.innerHTML='';
    mensagensGlobal.forEach(msg=>{
        const div = document.createElement('div');
        div.classList.add('msg');

        let conteudo = `<strong>${msg.usuario}</strong> [${msg.hora}]: ${msg.texto}`;
        if(msg.anexo){
            if(msg.anexoTipo==='img'){
                conteudo += `<br><img src="${msg.anexo}" class="msg-anexo">`;
            } else {
                conteudo += `<br><video src="${msg.anexo}" controls class="msg-anexo"></video>`;
            }
        }

        div.innerHTML = conteudo;
        chatMessages.appendChild(div);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

///////////////////////
// Atualizar status
///////////////////////
function atualizarStatus(){
    currentUser.status = statusInput.value.trim() || "Online";
    salvarUsuario();
}

///////////////////////
// Atualizar bio
///////////////////////
function atualizarBio(){
    currentUser.bio = bioInput.value.trim();
    salvarUsuario();
}

///////////////////////
// Salvar usuário
///////////////////////
function salvarUsuario(){
    const index = usuarios.findIndex(u => u.usuario===currentUser.usuario);
    if(index>=0){
        usuarios[index] = currentUser;
    } else{
        usuarios.push(currentUser);
    }
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

///////////////////////
// Comandos
///////////////////////
function processarComando(cmd){
    const args = cmd.split(" ");
    const comando = args[0].toLowerCase();

    if(comando==='/status'){
        alert("Seu status atual: " + currentUser.status);
    } else if(comando==='/bot'){
        alert("Bot: Olá " + currentUser.nomeExibido + "! Comando recebido.");
    } else if(comando==='/admin'){
        if(currentUser.isAdmin){
            alert("Modo Admin ativo! Você pode ver tudo e gerenciar chats.");
        } else{
            alert("Você não tem permissão de admin!");
        }
    } else if(comando==='/limpar'){
        chatMessages.innerHTML='';
    } else {
        alert("Comando não reconhecido.");
    }
}

///////////////////////
// Amigos e Servidores
///////////////////////
function atualizarAmigosServidores(){
    amigosList.innerHTML='';
    usuarios.forEach(u=>{
        if(u.usuario!==currentUser.usuario){
            const li = document.createElement('li');
            li.innerText = u.nomeExibido + " (" + u.usuario + ")";
            amigosList.appendChild(li);
        }
    });

    const servidores = ["Global","Servidor Público","Grupo Amigos"];
    servidoresList.innerHTML='';
    servidores.forEach(s=>{
        const li = document.createElement('li');
        li.innerText = s;
        servidoresList.appendChild(li);
    });
}

///////////////////////
// Inicialização
///////////////////////
initInterface();

// Atualização periódica (simula tempo real)
setInterval(()=>{
    mensagensGlobal = JSON.parse(localStorage.getItem('mensagensGlobal')) || [];
    atualizarChat();
}, 2000);
