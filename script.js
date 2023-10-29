let sunriseTime, sunsetTime;

function getGradientRatio(current, start, end) {
    return (current - start) / (end - start);
}

function mixColors(color1, color2, ratio) {
    const r = color1[0] + (color2[0] - color1[0]) * ratio;
    const g = color1[1] + (color2[1] - color1[1]) * ratio;
    const b = color1[2] + (color2[2] - color1[2]) * ratio;
    return `rgb(${r}, ${g}, ${b})`;
}

function getMinutesFromTimeString(timeString) {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
}

function fetchSunriseSunset() {
    const url = 'https://api.sunrise-sunset.org/json?lat=47.3769&lng=8.5417&formatted=0';
    fetch(url)
    .then(response => response.json())
    .then(data => {
        sunriseTime = getMinutesFromTimeString(new Date(data.results.sunrise).toLocaleTimeString());
        sunsetTime = getMinutesFromTimeString(new Date(data.results.sunset).toLocaleTimeString());
        updateTime();
    });
}

function updateTime() {
    let now = new Date();
    // Convert to Zurich time
    let zurichTime = new Date(now.toLocaleString("en-US", {timeZone: "Europe/Zurich"}));
    const hours = zurichTime.getHours();
    const minutes = zurichTime.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    // Colors for different times of the day
    const night = [25, 25, 112];
    const dawn = [138, 43, 226];
    const sunriseColor = [255, 215, 0];
    const midday = [135, 206, 250];
    const sunsetColor = [255, 69, 0];
    const dusk = [75, 0, 130];

    let bgColor;

    if (totalMinutes < sunriseTime) {
        bgColor = mixColors(night, dawn, getGradientRatio(totalMinutes, 0, sunriseTime));
    } else if (totalMinutes < sunriseTime + 60) {
        bgColor = mixColors(dawn, sunriseColor, getGradientRatio(totalMinutes, sunriseTime, sunriseTime + 60));
    } else if (totalMinutes < sunsetTime - 60) {
        bgColor = mixColors(sunriseColor, midday, getGradientRatio(totalMinutes, sunriseTime + 60, sunsetTime - 60));
    } else if (totalMinutes < sunsetTime) {
        bgColor = mixColors(midday, sunsetColor, getGradientRatio(totalMinutes, sunsetTime - 60, sunsetTime));
    } else {
        bgColor = mixColors(sunsetColor, night, getGradientRatio(totalMinutes, sunsetTime, 1440));
    }

    document.body.style.backgroundColor = bgColor;
    document.getElementById('time').innerText = zurichTime.toLocaleTimeString();
}

// Fetch sunrise and sunset times and then update the background color
fetchSunriseSunset();
setInterval(updateTime, 60000); // Update every 60 seconds
