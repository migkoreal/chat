// ===== Inicialização =====
let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

// ===== Cadastro =====
function cadastrar(){
    const nome = document.getElementById('cadNome').value.trim();
    const usuario = document.getElementById('cadUsuario').value.trim();
    const senha = document.getElementById('cadSenha').value.trim();
    const mensagem = document.getElementById('mensagem');

    // Valida campos
    if(!nome || !usuario || !senha){
        mensagem.style.color = "#ff6b6b";
        mensagem.innerText = "Preencha todos os campos!";
        return;
    }

    if(!usuario.startsWith('@') || usuario.includes(' ')){
        mensagem.style.color = "#ff6b6b";
        mensagem.innerText = "O @usuario deve começar com @ e não pode ter espaços!";
        return;
    }

    // Checa duplicidade
    if(usuarios.find(u => u.usuario === usuario)){
        mensagem.style.color = "#ff6b6b";
        mensagem.innerText = "Usuário já existe!";
        return;
    }

    // Cria novo usuário
    let novoUsuario = {
        nomeExibido: nome,
        usuario: usuario,
        senha: senha,
        isAdmin: usuario === '@migkoreal' ? true : false,
        avatar: '',
        status:'',
        pv:{}  // Conversas privadas
    };

    usuarios.push(novoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    mensagem.style.color = "#4fff4f";
    mensagem.innerText = "Cadastro realizado com sucesso! Agora faça login.";

    // Limpa campos
    document.getElementById('cadNome').value='';
    document.getElementById('cadUsuario').value='';
    document.getElementById('cadSenha').value='';
}

// ===== Login =====
function logar(){
    const usuario = document.getElementById('loginUsuario').value.trim();
    const senha = document.getElementById('loginSenha').value.trim();
    const mensagem = document.getElementById('mensagem');

    if(!usuario || !senha){
        mensagem.style.color = "#ff6b6b";
        mensagem.innerText = "Preencha todos os campos!";
        return;
    }

    const user = usuarios.find(u => u.usuario === usuario && u.senha === senha);
    if(!user){
        mensagem.style.color = "#ff6b6b";
        mensagem.innerText = "Usuário ou senha incorretos!";
        return;
    }

    // Salva usuário logado
    localStorage.setItem('currentUser', JSON.stringify(user));

    // Redireciona para chat
    window.location.href = 'chat.html';
}

// ===== Função auxiliar: pegar usuário logado =====
function getCurrentUser(){
    return JSON.parse(localStorage.getItem('currentUser')) || null;
}

// ===== Função para checar admin =====
function isAdmin(){
    const user = getCurrentUser();
    return user && user.isAdmin;
      }
