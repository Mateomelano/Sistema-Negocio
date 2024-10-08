
import { Home } from "./home/home.js";
import { Usuarios } from "./usuarios/usuarios.js";
import { Productos } from "./productos/productos.js";
import { Destinos } from "./destinos/destinos.js";
import { Paquetes } from "./paquetes/paquetes.js";
import { Reservas } from "./reservas/reservas.js";
import { Categorias } from "./categorias/categorias.js";




export function Router(){
    let hash = location.hash;
    //CAMBIAR MENU ACTIVO
    let origen = document.querySelector("a[href^='" + hash + "']");
    if (origen ){
        if ( origen.className.indexOf('nav-link') >= 0 ) {
            document.querySelector('.nav-item .active').classList.remove('active');
            document.querySelector("a[href^='" + hash + "']").classList.add('active');
         }
    }


    if (hash === '#/usuarios'){
        Usuarios();
    }else if(( hash==='#/home') || (hash==='') || (hash==='#')){
        Home();
    }else if(hash==='#/destinos'){
        Destinos();
    }else if(hash==='#/paquetes'){
        Paquetes();
    }else if(hash==='#/reservas'){
        Reservas();
    } else if(hash==='#/productos'){
        Productos();
    } else if(hash==='#/categorias'){
        Categorias();
    } 
         
    console.log (hash);
}