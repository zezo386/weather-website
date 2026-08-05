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

async function get_temp(pos){
    try {
        let response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${pos[0]}&longitude=${pos[1]}&current=temperature_2m&timezone=auto&forecast_days=1`);
        if (!response.ok) {
            throw new Error(`HTTP Error, status code: ${response.status}`);
        }
        let data = await response.json();
        console.log(data)
        let temp = data["current"]["temperature_2m"];
        let last_check = data["current"]["time"].replace("T"," ");
        document.getElementById("temp").innerText = temp
        document.getElementById("last-check").innerText = last_check;
    }
    catch(error){
        console.log(error)
    }
}

document.addEventListener("DOMContentLoaded",(async function () {
    let pos = await get_IP();
    await get_temp(pos);
}))