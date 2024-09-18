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

// Crear iconos personalizados
const fireIcon = L.icon({
    iconUrl: 'icons/fire.png', // Reemplaza con la URL de tu icono
    iconSize: [32, 32], // Tamaño del icono
    iconAnchor: [16, 32], // Punto del icono que se situará en la posición
    popupAnchor: [0, -32] // Posición del popup respecto al icono
});

const stormIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1146/1146860.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

const earthquakeIcon = L.icon({
    iconUrl: 'https://static.vecteezy.com/system/resources/previews/025/351/032/non_2x/earthquake-disaster-illustration-free-png.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

const volcanoIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2206/2206644.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

const tsunamiIcon = L.icon({
    iconUrl: 'https://static.vecteezy.com/system/resources/previews/024/295/730/original/tsunami-graphic-clipart-design-free-png.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

// Función para mostrar los eventos en el mapa con los iconos correctos
function displayEventsOnMap(events) {
    events.forEach(event => {
        const coordinates = event.geometry[0].coordinates;
        const [longitude, latitude] = coordinates;

        // Mostrar la categoría en la consola para depurar
        console.log('Categoría recibida:', event.categories[0].title);

        // Asignar icono basado en el tipo de evento (asegurarse de que no haya espacios ni mayúsculas)
        let icon;
        switch (event.categories[0].title.toLowerCase().trim()) {
            case 'wildfires':
                icon = fireIcon;
                break;
            case 'severe storms':
                icon = stormIcon;
                break;
            case 'earthquakes':
                icon = earthquakeIcon;
                break;
            case 'volcanoes':
                icon = volcanoIcon;
                break;
            case 'tsunamis':
                icon = tsunamiIcon;
                break;
            default:
                icon = L.icon({iconUrl: 'icons/default.png', iconSize: [32, 32]});
        }

        // Crear un marcador con el icono correspondiente
        const marker = L.marker([latitude, longitude], { icon }).addTo(map);

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
