function filter() {
    const searchBar = document.getElementById('searchBar').value.toLowerCase();
    const paquetesList = document.getElementById('paquetesList');
    const paquetes = paquetesList.getElementsByClassName('pro');
    const reservasList = document.getElementById('reservasList');
    const reservas = reservasList.getElementsByClassName('pro');
    
    for (let i = 0; i < reservas.length; i++) {
        const reserva = reservas[i];
        const nombre = reserva.querySelector('.des .title').textContent.toLowerCase();

        if (nombre.includes(searchBar)) {
            reserva.style.display = '';
        } else {
            reserva.style.display = 'none';
        }
    }
    
    for (let i = 0; i < paquetes.length; i++) {
        const paquete = paquetes[i];
        const nombre = paquete.querySelector('.des span').textContent.toLowerCase();

        if (nombre.includes(searchBar)) {
            paquete.style.display = '';
        } else {
            paquete.style.display = 'none';
        }
    }
}