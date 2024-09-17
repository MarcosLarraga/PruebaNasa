// Crear el mapa en el contenedor con el ID "map-container"
var map = L.map('map-container').setView([20, 0], 2); // Coordenadas globales con zoom 2

// Agregar un tile layer (capa de imagenes del mapa)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// URL de la API de EONET para obtener eventos
const eonetAPI = "https://eonet.gsfc.nasa.gov/api/v3/events";

// Función para obtener los eventos de la API de EONET
async function fetchEvents() {
    try {
        const response = await fetch(eonetAPI);
        const data = await response.json();
        displayEventsOnMap(data.events);
    } catch (error) {
        console.error("Error fetching EONET data:", error);
    }
}

// Función para mostrar los eventos en el mapa
function displayEventsOnMap(events) {
    events.forEach(event => {
        const coordinates = event.geometry[0].coordinates;
        const [longitude, latitude] = coordinates;

        // Crear un marcador en la posición del evento
        const marker = L.marker([latitude, longitude]).addTo(map);

        // Evento al hacer clic en el marcador
        marker.on('click', () => {
            displayEventDetails(event);
        });

        // Pop-up del marcador con el nombre del evento
        marker.bindPopup(`<b>${event.title}</b>`);
    });
}

// Función para mostrar los detalles del evento
function displayEventDetails(event) {
    const detailsContainer = document.getElementById('event-details');
    detailsContainer.innerHTML = `
        <h3>${event.title}</h3>
        <p><strong>Categoría:</strong> ${event.categories[0].title}</p>
        <p><strong>Fecha de inicio:</strong> ${new Date(event.geometry[0].date).toLocaleDateString()}</p>
        <p><strong>Coordenadas:</strong> [${event.geometry[0].coordinates[1]}, ${event.geometry[0].coordinates[0]}]</p>
        <p><a href="${event.link}" target="_blank">Ver más detalles</a></p>
    `;
}

// Llamar a la función para obtener los eventos cuando la página se carga
fetchEvents();
