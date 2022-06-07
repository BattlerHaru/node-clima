const inquirer = require("inquirer");
require("../config/colors");

const questionsForInquirerMenu = [{
    type: "list",
    name: "opt",
    message: "¿Qué desea hacer?",
    choices: [{
            value: 1,
            name: `${"1.".cMain} ${"Buscar ciudad.".cText}`,
        },
        {
            value: 2,
            name: `${"2.".cMain} ${"Historial.".cText}`,
        },
        {
            value: 3,
            name: `${"3.".cMain} ${"Salir.".cText}`,
        },
    ],
}, ];

const inquirerMenu = async() => {
    // console.clear();
    process.stdout.write("\033c");

    console.log("============================".cMain);
    console.log("  Seleccione una opción".cText);
    console.log("============================\n".cMain);

    const { opt } = await inquirer.prompt(questionsForInquirerMenu);

    return opt;
};

const inquirerPausa = async() => {
    const question = [{
        type: "input",
        name: "input",
        message: `Presione ${"ENTER".cMain} para continuar`,
    }, ];
    console.log("\n");
    await inquirer.prompt(question);
};

const inquirerLeerInput = async(msg) => {
    const question = [{
        type: "input",
        name: "desc",
        message: msg,
        validate(value) {
            if (value.length === 0) {
                return `${"Por favor ingrese un valor.".cWarning}`;
            }
            return true;
        },
    }, ];

    const { desc } = await inquirer.prompt(question);
    return desc;
};

const inquirerListarLugares = async(lugares = []) => {
    const choices = lugares.map((lugar, i) => {
        const idx = `${i + 1}`.cMain;
        return {
            value: lugar.id,
            name: `${idx}. ${lugar.nombre}`,
        };
    });

    choices.unshift({
        value: 0,
        name: `${"0.".cMain} Cancelar. \n`,
    });

    const question = [{
        type: "list",
        name: "id",
        message: "Seleccione el lugar deseado:",
        choices,
    }, ];

    const { id } = await inquirer.prompt(question);
    return id;
};

module.exports = {
    inquirerMenu,
    inquirerPausa,
    inquirerLeerInput,
    inquirerListarLugares,
};