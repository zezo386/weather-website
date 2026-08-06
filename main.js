async function get_IP(){
    try {
        let response = await fetch("https://ipinfo.io/json")
        if (!response.ok){
            throw new Error(`HTTP Error, status code: ${response.status}`);
        }
        let data = await response.json();
        let pos = data["loc"].split(",");
        
        return pos
        
    }
    catch (error){
        console.log(error)
    }
}

function get_dynamic_color(temp){
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

async function get_temp(pos){
    try {
        let response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${pos[0]}&longitude=${pos[1]}&current=temperature_2m,apparent_temperature,is_day,cloud_cover,rain&timezone=auto&forecast_days=1`);
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
        document.getElementById("temp").innerText = temp;
        document.getElementById("temp").style.color = get_dynamic_color(temp);
        document.getElementById("last-check").innerText = last_check;
        document.getElementById("apparent-temp").innerText = apparent_temp;
        document.getElementById("apparent-temp").style.color = get_dynamic_color(apparent_temp);
        document.getElementById("cloud-cover").innerText = cloud_cover;
        document.getElementById("day-night").className = day? "day" : "night";
        document.getElementById("day-night").innerText = day? "Day" : "Night";
    }
    catch(error){
        console.log(error)
    }
}

document.addEventListener("DOMContentLoaded",(async function () {
    let pos = await get_IP();
    await get_temp(pos);
}))