var inputEmail = null;
var inputPassword = null;
var frmLogin = null;

import { usuariosServices } from "/servicios/usuarios-servicios.js";

document.addEventListener('DOMContentLoaded', () => {
    setLogin();
    const letraUsuario = sessionStorage.getItem('letraUsuario');
    if (letraUsuario) {
        ponerLetraUsuario(letraUsuario);
    }
});

export function setLogin() {
    frmLogin = document.getElementById('frmLogin'); 
    const btnLogout = document.getElementById('btnLogout');
    btnLogout.addEventListener('click', logout);

    if (getUsuarioAutenticado()) {
        if (frmLogin) frmLogin.outerHTML = '';
    } else {
        document.getElementById("sitio").classList.add('d-none');

        inputEmail = document.getElementById('loginEmail');
        inputPassword = document.getElementById('loginPassword');
        
        const btnLogin = document.getElementById('iniciar-sesion');

        inputEmail.addEventListener('blur', validarForm);
        inputPassword.addEventListener('blur', validarForm);

        btnLogin.addEventListener('click', usuarioExiste);
    }
}

async function usuarioExiste() {
    let existeUsuario;
    let usuarioActivo;
    let letraUsuario;
    let usuarioId;

    await usuariosServices.listar()
        .then(respuesta => {
            respuesta.forEach(usuario => {
                if (usuario.email === inputEmail.value && usuario.password === inputPassword.value) {
                    if (usuario.rol === 'Administrador') {
                        usuarioId = usuario.id;
                        usuarioActivo = usuario.nombre;
                        letraUsuario = usuario.nombre.charAt(0).toUpperCase();
                        return existeUsuario = true;
                    } else {
                        mostrarMensaje('Usuario no autorizado');
                    }
                } else {
                    return;
                }
            });
        })
        .catch(error => console.log(error));

    if (!existeUsuario) {
        mostrarMensaje('usuario/contraseña incorrectos');
    } else {
        frmLogin.outerHTML = '';
        document.getElementById("sitio").classList.remove('d-none');

        sessionStorage.setItem('usuarioId', usuarioId);
        sessionStorage.setItem('usuarioActivo', usuarioActivo);
        sessionStorage.setItem('letraUsuario', letraUsuario);

        ponerLetraUsuario(letraUsuario);

        setUsuarioAutenticado(true);
        window.location.href = "#/home";
    }
}

function ponerLetraUsuario(letra) {
    document.getElementById("letraUsuario").innerHTML = letra;
}

function validarForm(e) {
    return true;
}

function mostrarMensaje(msj) {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: msj
    });
}

function setUsuarioAutenticado(booleano) {
    sessionStorage.setItem('autenticado', booleano);
}

function getUsuarioAutenticado() {
    return (sessionStorage.getItem('autenticado') === "true");
}

function logout() {
    setUsuarioAutenticado(false);
    sessionStorage.removeItem('letraUsuario');
    window.location.replace("index.html");
}

export function get_mail() {
    return inputEmail.value;
}

export function get_pass() {
    return inputPassword.value;
}