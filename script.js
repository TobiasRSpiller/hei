let sunriseTime, sunsetTime;

function getGradientRatio(current, start, end) {
    return (current - start) / (end - start);
}

function mixColors(color1, color2, ratio) {
    const r = color1[0] + (color2[0] - color1[0]) * ratio;
    const g = color1[1] + (color2[1] - color1[1]) * ratio;
    const b = color1[2] + (color2[2] - color1[2]) * ratio;
    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

// Updated color definitions
const night = [0, 38, 77];
const goldenHour = [255, 204, 0];
const day = [173, 216, 230];


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
        
        // Update time and background color after fetching the sunrise and sunset times
        updateDisplayedTime();   // Immediate time update
        updateBackgroundColor(); // Immediate background color update
    });
}

function updateDisplayedTime() {
    let now = new Date();
    // Convert to Zurich time
    let zurichTime = new Date(now.toLocaleString("en-US", {timeZone: "Europe/Zurich"}));
    document.getElementById('time').innerText = zurichTime.toLocaleTimeString();
}

document.addEventListener("DOMContentLoaded", function() {
    const timeSlider = document.getElementById('timeSlider');
    
    // Get current Zurich time in minutes
    const now = new Date();
    const zurichTime = new Date(now.toLocaleString("en-US", {timeZone: "Europe/Zurich"}));
    const currentMinutes = zurichTime.getHours() * 60 + zurichTime.getMinutes();
    
    // Set the slider to the current time
    timeSlider.value = currentMinutes;

    // Update the label immediately
    const hours = Math.floor(currentMinutes / 60);
    const minutes = currentMinutes % 60;
    document.getElementById('sliderLabel').innerText = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    // Add the input event listener
    timeSlider.addEventListener('input', function(event) {
        // Get the total minutes from the slider
        const totalMinutes = parseInt(event.target.value);

        // Convert minutes to HH:MM format and display it
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        document.getElementById('sliderLabel').innerText = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        updateBackgroundColor(totalMinutes);
    });
});


function isColorDark(r, g, b) {
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance <= 0.5;
}

function updateBackgroundColor(totalMinutes = null) {
    let now, zurichTime, hours, minutes;
    
    if (totalMinutes === null) {
        now = new Date();
        zurichTime = new Date(now.toLocaleString("en-US", {timeZone: "Europe/Zurich"}));
        hours = zurichTime.getHours();
        minutes = zurichTime.getMinutes();
        totalMinutes = hours * 60 + minutes;
    }

    // Define colors
    const night = [0, 0, 0];
    const goldenHour = [255, 165, 0];
    const day = [173, 216, 230];

    let bgColor, r, g, b;

    if (totalMinutes <= sunriseTime - 15) {
        bgColor = night;

    } else if (totalMinutes > sunriseTime - 30 && totalMinutes < sunriseTime) {
        // Calculate the gradient ratio for the transition from night to golden hour
        const ratio = getGradientRatio(totalMinutes, sunriseTime - 30, sunriseTime);
        bgColor = mixColors(night, goldenHour, ratio).match(/\d+/g).map(Number);

    } else if (totalMinutes >= sunriseTime && totalMinutes < sunriseTime + 15) {
        // Calculate the gradient ratio for the transition from golden hour to day
        const ratio = getGradientRatio(totalMinutes, sunriseTime, sunriseTime + 15);
        bgColor = mixColors(goldenHour, day, ratio).match(/\d+/g).map(Number);

    } else if (totalMinutes >= sunriseTime + 15 && totalMinutes <= sunsetTime - 15) {
        bgColor = day;

    } else if (totalMinutes > sunsetTime - 15 && totalMinutes < sunsetTime) {
        // Similar gradient logic for sunset
        const ratio = getGradientRatio(totalMinutes, sunsetTime - 15, sunsetTime);
        bgColor = mixColors(day, goldenHour, ratio).match(/\d+/g).map(Number);

    } else if (totalMinutes >= sunsetTime && totalMinutes < sunsetTime + 45) {
        // Calculate the gradient ratio for the transition from night to golden hour
        const ratio = getGradientRatio(totalMinutes, sunsetTime, sunsetTime + 45);
        bgColor = mixColors(goldenHour, night, ratio).match(/\d+/g).map(Number);

    } else {
        bgColor = night;
    }

    [r, g, b] = bgColor;

    document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    document.getElementById('time').innerText = (hours ? hours.toString().padStart(2, '0') : '00') + ':' + (minutes ? minutes.toString().padStart(2, '0') : '00');

    // Check if the color is dark and set the text color accordingly
    if (isColorDark(r, g, b)) {
        document.getElementById('time').style.color = 'white';
        document.querySelector('.city-name').style.color = 'white';
    } else {
        document.getElementById('time').style.color = 'black';
        document.querySelector('.city-name').style.color = 'black';
    }
}



// Fetch sunrise and sunset times and then update the background color and time
fetchSunriseSunset();
setInterval(updateDisplayedTime, 1000);  // Update displayed time every second
setInterval(updateBackgroundColor, 60000); // Update background color every minute after the first immediate update
