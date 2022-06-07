const fs = require("fs");
const axios = require("axios");

class Busquedas {
    historial = [];
    dbPath = "./db/database.json";

    constructor() {
        this.leerDB();
    }

    get historialCapitalizado() {
        return this.historial.map((lugar) => {
            let palabras = lugar.split(" ");
            palabras = palabras.map((p) => {
                return p[0].toUpperCase() + p.substring(1);
            });
            return palabras.join(" ");
        });
    }

    get paramsMapBox() {
        return {
            access_token: process.env.MAPBOX_KEY,
            limit: 5,
            language: "es",
        };
    }

    get paramsOpenWeather() {
        return {
            appid: process.env.OPENWEATHER_KEY,
            lang: "es",
            units: "metric",
        };
    }

    async ciudad(lugar = "") {
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapBox,
            });

            const resp = await instance.get();

            return resp.data.features.map((lugar) => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lat: lugar.center[1],
                lng: lugar.center[0],
            }));
        } catch (error) {
            return [];
        }
    }

    async climaLugar(lat, lon) {
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsOpenWeather, lat, lon },
            });

            const resp = await instance.get();

            const { main, weather } = resp.data;
            return {
                desc: weather[0].description,
                min: Math.round(main.temp_min),
                max: Math.round(main.temp_max),
                temp: Math.round(main.temp),
            };
        } catch (error) {
            return [error];
        }
    }

    agregarHistorial(lugar = "") {
        if (this.historial.includes(lugar.toLowerCase())) {
            return;
        }

        this.historial = this.historial.splice(0, 5);

        this.historial.unshift(lugar.toLowerCase());

        this.guardarDB();
    }

    guardarDB() {
        const payload = {
            historial: this.historial,
        };
        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    leerDB() {
        if (!fs.existsSync(this.dbPath)) return;

        const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });

        const data = JSON.parse(info);

        this.historial = data.historial;
    }
}

module.exports = Busquedas;