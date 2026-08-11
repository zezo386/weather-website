async function get_IP(){
    try {
        let response = await fetch("https://ipapi.co/json")
        if (!response.ok){
            throw new Error(`HTTP Error, status code: ${response.status}`);
        }
        let data = await response.json();
        let pos = [data.latitude, data.longitude];
        
        return pos
        
    }
    catch (error){
        console.log(error)
    }
}

function get_dynamic_temp_color(temp){
    temp = Math.max(0,Math.min(40,temp));
    if (temp < 27){
        let pct = ((temp-0)/(27-0));

        r = Math.round(58 + (247 - 58) * pct)
        g = Math.round(134 + (127 - 134) * pct)
        b =  Math.round(255 + (0-255) * pct)

        return `rgb(${r},${g},${b})`;
    }
    else {
        let pct = (temp-27)/(40-27);

        r = Math.round(247 + (214- 247) * pct)
        g = Math.round(127 + (40 - 127) * pct)
        b =  Math.round(0 + (40 - 0) * pct)

        return `rgb(${r},${g},${b})`;
    }
}

function get_dynamic_humidity_color(humidity){
    if (humidity<50){
        let pct = humidity/50;

        let r = Math.round(58 + (40 - 58) * pct);
        let g = Math.round(134 + (167 - 134) * pct);
        let b = Math.round(255 + (69 - 255) * pct);

        return `rgb(${r},${g},${b})`;
    }
    else {
        let pct = (humidity-50)/(100-50);

        let r = Math.round(40 + (220 - 40) * pct);
        let g = Math.round(167 + (53 - 167) * pct);
        let b = Math.round(69 + (69 - 69) * pct);

        return `rgb(${r},${g},${b})`;
    }
}

async function get_temp(pos){
    try {
        let response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${pos[0]}&longitude=${pos[1]}&current=temperature_2m,apparent_temperature,is_day,cloud_cover,rain,relative_humidity_2m&timezone=auto&forecast_days=1`);
        if (!response.ok) {
            throw new Error(`HTTP Error, status code: ${response.status}`);
        }
        let data = await response.json();
        console.log(data)
        let temp = data["current"]["temperature_2m"];
        let last_check = data["current"]["time"].replace("T"," ");
        let apparent_temp = data["current"]["apparent_temperature"];
        let cloud_cover = data["current"]["cloud_cover"];
        let day = data["current"]["is_day"];
        let rain = data["current"]["rain"];
        let humidity = data["current"]["relative_humidity_2m"];
        document.getElementById("temp").innerText = temp;
        document.getElementById("temp").style.color = get_dynamic_temp_color(temp);
        document.getElementById("last-check").innerText = last_check;
        document.getElementById("apparent-temp").innerText = apparent_temp;
        document.getElementById("apparent-temp").style.color = get_dynamic_temp_color(apparent_temp);
        document.getElementById("cloud-cover").innerText = cloud_cover;
        document.getElementById("day-night").className = day? "day" : "night";
        document.getElementById("day-night").innerText = day? "Day" : "Night";
        document.getElementById("rain").innerText = rain;
        document.getElementById("humidity").innerText = humidity;
        document.getElementById("humidity").style.color = get_dynamic_humidity_color(humidity);
    }
    catch(error){
        console.log(error)
    }
}

document.addEventListener("DOMContentLoaded",(async function () {
    let pos = await get_IP();
    await get_temp(pos);
}))
