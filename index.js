require('dotenv').config()
const { inquirerMenu, pause, typeOnce, showOptionsList } = require("./helpers/inquirer")
const Searches = require("./models/searches")

const main = async () => {
    const searches = new Searches()
    let opt = 0 
    do {
        console.clear()
        opt = await inquirerMenu()
        // let opt = 1
        switch (opt) {
            case 1:
                // Close it in braces to apply "toLowerCase" and "trim" functions
                const term = (await typeOnce('Type a city:')).toLowerCase().trim()
                if(!term)  continue
                // Search the places
                const cityList = await searches.getCity(term)
                // Select place
                const cityID = await showOptionsList(cityList)
                // Weather
                const cityChosen = cityList.find(singleCityList => singleCityList.id === cityID)
                // Push into historial array for save to the database
                searches.addToHistorial(cityChosen.name)
                const weatherInfoObjetct = await searches.getWeather(cityChosen)

                console.log('City Information');
                console.log('City:', `${cityChosen.name}`.red);
                console.log('Short Weather:', weatherInfoObjetct.description.toUpperCase().blue);
                console.log('Latitude:', `${cityChosen.long}`.red);
                console.log('Longitud:', `${cityChosen.lat}`.red);
                console.log('Temp:', `${weatherInfoObjetct.temp}`.red);
                console.log('Max Temp:', `${weatherInfoObjetct.max}`.red);
                console.log('Min Temp:', `${weatherInfoObjetct.min}`.red);
                break;
            case 2:
                searches.historial.forEach((cityName, indexCity) => {
                    const pointer = `${indexCity + 1}.`.red
                    console.log(pointer, cityName);
                })
                break
        }
        // Save in database
        searches.saveInDatabase()

        if( opt !== 0 ) await pause()

    } while (opt !== 0)
}
main()