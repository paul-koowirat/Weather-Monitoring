const myMap = L.map('checkinMap').setView([0, 0], 1);
const attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
/*test without {s} also work*/
//const tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, {attribution});
//tiles.addTo(myMap);
tiles.addTo(myMap);

//getData();

async function getData() {
    const response = await fetch('/api');
    const data = await response.json();

    for(item of data){

        const marker = L.marker([item.lat, item.lon]).addTo(myMap);
        let txt = `The weather at ${item.air.city.name} coordinates ${item.lat}&deg, ${item.lon}&deg is ${item.weather.condition.text} with a temperature of
        ${item.weather.temp_c} &degC`;

        if(item.air.iaqi.pm25.v < 0){
            txt += 'No air quality reading';
        }else{
            txt += `The concentration of PM25 is ${item.air.iaqi.pm25.v} last read on ${item.air.time.s}`;
        }
        

        marker.bindPopup(txt);

        /*const root = document.createElement('p');
        const name = document.createElement('p');
        const geo = document.createElement('p');
        const date = document.createElement('p');
        const image = document.createElement('img');
        
        name.textContent = `name: ${item.name}`;               
        geo.textContent = `latitude: ${item.lat}, longitude: ${item.lon}`; 
        //date.textContent = `time: ${item.timestamp}`;             
        const dateString = new Date(item.timestamp).toLocaleString();
        date.textContent = dateString;
        image.src = item.image64;

        root.append(name, geo, date, image);
        document.body.append(root);*/
    }

    console.log(data);
}

getData();
