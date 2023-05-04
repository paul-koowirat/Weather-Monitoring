function setup(){
   
    if ("geolocation" in navigator) {
        console.log('geolocation available');
        navigator.geolocation.getCurrentPosition(async position => {
            let lat, lon, weather, air, city;
            try {
                lat = position.coords.latitude;
                lon = position.coords.longitude;
                //console.log(lat, lon);
                document.getElementById("latitude").textContent = lat.toFixed(2);          
                document.getElementById("longitude").textContent = lon.toFixed(2);
                const api_url = `weather/${lat},${lon}`;
                //const api_url = '/weather';
                const response = await fetch(api_url);
                const json = await response.json();
                //console.log(json);
    
                weather = json.weather.current;
                //city = json.weather.location;
                air = json.air_quality.data;           
                //location = json.air.city;
    
                document.getElementById('summary').textContent = weather.condition.text;
                document.getElementById('temp').textContent = weather.temp_c;
                document.getElementById('location').textContent = air.city.name;
                document.getElementById('aq_value').textContent = air.iaqi.pm25.v;
                document.getElementById('aq_date').textContent = air.time.s;  
                
                
            } catch (error) {
                console.error(error);
                air = {value: -1};
                document.getElementById('aq_value').textContent = 'NO READ';
            }
            const data = {lat, lon, weather, air};
            const options = {    
                method: 'POST',
                headers: {
                        'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            };
            const db_response = await fetch('/api', options);
            const db_json = await db_response.json();
            console.log(db_json);            
        });
    } else {
        console.log('geolocation not available');
    }
}