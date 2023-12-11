let sunriseTime, sunsetTime, civilTwilightBegin, civilTwilightEnd;

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
        civilTwilightBegin = getMinutesFromTimeString(new Date(data.results.civil_twilight_begin).toLocaleTimeString());
        civilTwilightEnd = getMinutesFromTimeString(new Date(data.results.civil_twilight_end).toLocaleTimeString());
        
        // Update time and background color after fetching the sunrise and sunset times
        updateDisplayedTime();   // Immediate time update
        updateBackgroundColor(); // Immediate background color update
    });
}