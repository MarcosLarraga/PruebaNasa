// Crear el mapa en el contenedor con el ID "map-container"
var map = L.map('map-container').setView([20, 0], 2); // Coordenadas globales con zoom 2

// Agregar un tile layer (capa de imágenes del mapa)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// URL de la API de EONET para obtener eventos
const eonetAPI = "https://eonet.gsfc.nasa.gov/api/v3/events";
let markers = [];
let eventsData = [];

// Función para obtener los eventos de la API de EONET
async function fetchEvents() {
    try {
        const response = await fetch(eonetAPI);
        const data = await response.json();
        eventsData = data.events;
        displayEventsOnMap(eventsData);
    } catch (error) {
        console.error("Error fetching EONET data:", error);
    }
}

// Crear iconos personalizados
const fireIcon = L.icon({
    iconUrl: 'https://static.vecteezy.com/system/resources/previews/011/999/958/non_2x/fire-icon-free-png.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});
const stormIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1146/1146860.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});
const earthquakeIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3522/3522343.png',
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
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1858/1858464.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});
const icebergIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/6362/6362942.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

// Función para mostrar los eventos en el mapa
function displayEventsOnMap(events) {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    events.forEach(event => {
        const coordinates = event.geometry[0].coordinates;
        const [longitude, latitude] = coordinates;

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
            case 'sea and lake ice':
                icon = icebergIcon;
                break;
            default:
                icon = L.icon({iconUrl: 'https://via.placeholder.com/32x32.png', iconSize: [32, 32]});
        }

        const marker = L.marker([latitude, longitude], { icon }).addTo(map);
        markers.push(marker);

        marker.on('click', () => {
            displayEventDetails(event);
        });

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

// Filtro de eventos basado en tipo y fechas
function filterEventsByType(events) {
    const eventType = document.getElementById('event-type').value.toLowerCase();
    const startDate = new Date(document.getElementById('start-date').value);
    const endDate = new Date(document.getElementById('end-date').value);

    let filteredEvents = events;

    if (eventType !== 'all') {
        filteredEvents = filteredEvents.filter(event => event.categories[0].title.toLowerCase().trim() === eventType);
    }

    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        filteredEvents = filteredEvents.filter(event => {
            const eventDate = new Date(event.geometry[0].date);
            return eventDate >= startDate && eventDate <= endDate;
        });
    }

    displayEventsOnMap(filteredEvents);
}

// Detectar clic en el botón de filtro
document.getElementById('filter-button').addEventListener('click', () => {
    filterEventsByType(eventsData);
});

// Llamar a la función para obtener los eventos
fetchEvents();
