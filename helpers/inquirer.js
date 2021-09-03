require('colors')

const inquirer = require('inquirer')
// Este es una paquete para manipular la cosa de una forma mucho más sencillay con una interfaz personalizada
const questions = {
    type: 'list',
    name: 'option', /* Este es el valor que retorna la opción seleccionada */
    message: 'What do you want to do: '.yellow,
    choices: [
        {
            value: 1,
            name: ` ${ '1.'.green } Search Cities`
        },
        {
            value: 2,
            name: ` ${ '2.'.green } History`
        },
        {
            value: 0,
            name: ` ${ '3.'.green } Exit`
        }
    ]
}

const  inquirerMenu = async () => {
    // Generar el evento de inquirer, luego tomar el valor del objeto que retorna.
    const { option } = await inquirer.prompt([questions])
    return option
}


const pause = async () => {
    return await inquirer.prompt({
        type: 'input',
        name: 'pause',
        message: `Press ${ 'ENTER'.red } to continue`
    })
}

// Como función genérica con mensaje para hacerla escalable
const typeOnce = async (message) => {
    const { description } = await inquirer.prompt({
        type: 'input',
        name: 'description',
        message: `${message}`.yellow
    })
    return description
}


const showOptionsList = async (citiesArr = []) => {
    const choices = citiesArr.map((singleCity, indexCity) => ({
        
        value: singleCity.id,
        name: `${indexCity + 1}. ${singleCity.name}`
    }))

    const questions = {
        type: 'list',
        name: 'cityID',
        message: 'Select a city from the list below'.yellow,
        choices
    } 

    const { cityID } = await inquirer.prompt(questions)
    return cityID
}


const confirm = async (message) => {
    const { confirm } = await inquirer.prompt({
        type: 'confirm',
        name: 'confirm',
        message
    })
    return confirm
}

const markTasks = async (taskArr) => {
    const choices = taskArr.map((singleTask, indexTask) => {
         const { id, desc, completed } = singleTask
        return {
            value: id,
            name: `${indexTask} ${desc}`,
            checked: completed ? true : false
        }
    }) 

    const {taskId} = await inquirer.prompt({
        type: 'checkbox',
        name: 'taskId',
        message: 'Mark and unmark the tasks',
        choices
    })

    // Por método de inquirer devuelve un array con los valores establecidos en el choice
    return taskId
}

module.exports = {
    inquirerMenu,
    pause,
    typeOnce,
    showOptionsList,
    confirm,
    markTasks
}