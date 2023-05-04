const express = require('express');
const Datastore = require('nedb');
//const fetch = require(node-fetch);
require('dotenv').config();

//console.log(process.env);

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`start sever at ${port}`);
});

app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

const database = new Datastore('database.db');
database.loadDatabase();
//database.insert({name: 'Halen', status: 'single'});
//database.insert({name: 'Tommy', status: 'married'});

app.get('/api', (request, response) => {
    database.find({}, (err, data) => {
        if(err){
            response.end();
            return;
        }
        response.json(data);
    });  
});

app.post('/api', (request, response) => {
    console.log('I got a request!');
    //console.log(request.body);
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    //console.log(database);

    response.json({
        status: 'SUCCESS',
        timestamp: timestamp,
        latitude: data.lat,
        longitude: data.lon,
        weather: data.weather,
        air: data.air
    });

});

app.get('/weather/:latlon', async (request, response) => {
    console.log(request.params);
    const latlon = request.params.latlon.split(',');
    console.log(latlon);
    const lat = latlon[0];
    const lon = latlon[1];
    console.log(lat, lon);
    //const api_key = '0a824f35fd64457c8f624053230205';
    const api_key = process.env.API_KEY;

    const weather_url = `http://api.weatherapi.com/v1/current.json?key=${api_key}&q=${lat},${lon}&aqi=no`;
    //const weather_url = `http://api.weatherapi.com/v1/current.json?key=0a824f35fd64457c8f624053230205&q=${lat},${lon}&aqi=no`;
    //const api_url = `http://api.weatherapi.com/v1/current.json?key=0a824f35fd64457c8f624053230205&q=13.15,100.98&aqi=no`;
    const weather_response = await fetch(weather_url);
    const weather_data = await weather_response.json();

    const aq_url = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=d3f40edd378ff51eb1d87fc69b09c99c79c3f785`;
    //const aq_url = `https://api.waqi.info/feed/geo:13.3;100.7/?token=d3f40edd378ff51eb1d87fc69b09c99c79c3f785`;
    const aq_response = await fetch(aq_url);
    const aq_data = await aq_response.json();

    const data = {
        weather: weather_data,
        air_quality: aq_data
    };

    //console.log(json);
    response.json(data);
});
    
