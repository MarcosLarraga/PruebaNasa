const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Para permitir CORS si es necesario

const app = express();
const PORT = 3000;

app.use(cors()); // Permite las solicitudes desde otros dominios

// Ruta para calcular el promedio de temperatura
app.get('/promedio-temperatura', async (req, res) => {
    const { lat, lon } = req.query;
    console.log(lat, lon)
    // Validar que se proporcionen latitud y longitud
    if (!lat || !lon) {
        return res.status(400).json({ error: 'Por favor, proporciona latitud y longitud.' });
    }

    const apiKey = 'e2870774a12d168577b9e044c7eba143'; // Asegúrate de usar tu clave API
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=metric&appid=${apiKey}`;
    console.log(weatherURL)
    try {
        const weatherResponse = await axios.get(weatherURL);
        const dailyData = weatherResponse.data.daily;

        // Calcular el promedio de la temperatura diaria
        const totalTemp = dailyData.reduce((sum, day) => sum + day.temp.day + day.temp.night, 0);
        const averageTemp = totalTemp / (dailyData.length * 2); // Total de temperaturas diarias y nocturnas

        res.json({ promedioTemperatura: averageTemp });
    } catch (error) {
        console.error(`Error al obtener datos: ${error.message}`);
        res.status(500).json({
            error: 'Error al obtener los datos de la API.',
            detalles: error.response ? error.response.data : error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
