require("dotenv").config();
require("./config/colors");

const {
    inquirerMenu,
    inquirerPausa,
    inquirerLeerInput,
    inquirerListarLugares,
} = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async() => {
    const busquedas = new Busquedas();
    let opt = "";

    do {
        opt = await inquirerMenu();
        switch (opt) {
            case 1:
                // Obtener la ciudad
                const ciudad = await inquirerLeerInput("Ciudad:");

                // Buscar los lugares
                const lugares = await busquedas.ciudad(ciudad);

                // Seleccionar el lugar
                const idLugar = await inquirerListarLugares(lugares);
                if (idLugar === 0) continue;

                // Busca el lugar dentro de los lugares
                const lugarSel = lugares.find((l) => l.id === idLugar);

                // Obtener el clima
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);

                // Mostrar resultados
                console.log("\nInformación".cMain);
                console.log("Ciudad:".cText, lugarSel.nombre);
                console.log("Lat:".cText, lugarSel.lat);
                console.log("Lng:".cText, lugarSel.lng);
                console.log("Temperatura".cText, clima.temp);
                console.log("Minima".cText, clima.min);
                console.log("Maxima".cText, clima.max);
                console.log("¿Cómo está el clima?".cText, clima.desc);

                // Guardar en DB
                busquedas.agregarHistorial(lugarSel.nombre);

                break;
            case 2:
                // Leer historial
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    const idx = `${i + 1}.`.cMain;
                    console.log(`${idx} ${lugar} `);
                });
                break;
        }
        // Salir
        if (opt !== 3) await inquirerPausa();
    } while (opt !== 3);
    console.log("\nGracias por usar la aplicación.");
};

main();