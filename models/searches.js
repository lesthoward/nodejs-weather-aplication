const fs = require('fs')
const axios = require('axios').default


class Searches {
    constructor() {
        // TODO: Cities array
        this.historial = []
        this.directory = './db/database.json'
        this.readDatabase()
    }

    async getCity (term) {
        const instance = axios.create({
            baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${term}.json/`,
            params: {
                'access_token': process.env.MAPBOX_KEY,
                'limit': 5,
                'language':'es'
            }
        })
        const res = await instance.get()
        // Push the cities array
        const cityObj = res.data.features.map(singleCityObj => {
            const { id,  place_name, center} = singleCityObj
            return { 
                id,
                name: place_name,
                long: center[0],
                lat: center[1]
            }
        })

        return cityObj
    }

    async getWeather (cityObj) {
        const {lat, long } = cityObj
        try {
            const instance = axios.create({
                baseURL: 'http://api.openweathermap.org/data/2.5/weather/',
                params: {
                    'appid': process.env.OPENWEATHER_KEY,
                    'lat': lat,
                    'lon': long,
                    'units': 'metric'
                }
            }) 
            const res = await instance.get()
            const weatherInfo = res.data
            // Weather Object Info
            const { main, weather } = weatherInfo
            const { temp, temp_min, temp_max} = main
            const { description } = weather[0]

            return {
                min: temp_min,
                max: temp_max,
                temp,
                description
            }

        } catch (error) {
            console.log(error);
        }
    }

    addToHistorial (cityName = '') {
        if(!this.historial.includes(cityName)) {
            this.historial.unshift(cityName)
        }
    }

    saveInDatabase() {
        fs.writeFileSync(this.directory, JSON.stringify(this.historial))
        
    }

    async readDatabase() {
        const res  = await fs.readFileSync(this.directory)
        this.historial = JSON.parse(res)
    }
}

module.exports = Searches