function getGradientRatio(current, start, end) {
    return (current - start) / (end - start);
}

function mixColors(color1, color2, ratio) {
    const r = color1[0] + (color2[0] - color1[0]) * ratio;
    const g = color1[1] + (color2[1] - color1[1]) * ratio;
    const b = color1[2] + (color2[2] - color1[2]) * ratio;
    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

function isColorDark(r, g, b) {
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance <= 0.5;
}


function calculateGradientPosition(totalMinutes, sunriseTime, sunsetTime) {
    const dayLength = sunsetTime - sunriseTime;
    const minutesSinceSunrise = totalMinutes - sunriseTime;
    const progress = minutesSinceSunrise / dayLength;
    let x = 0;
    let y = 0;
  
    // Calculate the X position (horizontal)
    x = progress * 1; // This will move from 0 at sunrise to 100 at sunset
  
    // Calculate the Y position (vertical), peak at midday (50% progress)
    const midday = 0.5;
    if (progress <= midday) {
        y = progress / midday * 100; // This will move from 0 at sunrise to 100 at midday
    } else {
        y = (1 - ((progress - midday) / midday)) * 100; // This will move from 100 at midday to 0 at sunset
    }
  
    return { x, y };
}


function calculateGradientPosition(totalMinutes, sunriseTime, sunsetTime) {
    // Adjust the sunrise time for the next day if necessary
    const nextDaySunriseTime = sunriseTime < sunsetTime ? sunriseTime + 24 * 60 : sunriseTime;

    // Calculate middle of the night as the average of sunset and the next sunrise
    const middleOfTheNight = (sunsetTime + nextDaySunriseTime) / 2;
    
    // Calculate the length of the night
    const nightLength = nextDaySunriseTime - sunsetTime;

    let progress;
    let x = 0;
    let y = 0;

    if (totalMinutes >= sunriseTime - 25 && totalMinutes <= sunsetTime) {
        // Daytime
        const dayLength = sunsetTime - sunriseTime;
        const minutesSinceSunrise = totalMinutes - sunriseTime;
        progress = minutesSinceSunrise / dayLength;
        x = 0; // X moves from 0 at sunrise to 100 at sunset

        // Y position peaks at midday
        const midday = 0.5;
        if (progress <= midday) {
            y = progress / midday * 500;
        } else {
            y = (1 - ((progress - midday) / midday)) * 100;
        }
    } else {
        // Nighttime
        x = 0; // X remains at 100 after sunset

        // Calculate progress during the night
        const minutesAfterSunset = totalMinutes > sunsetTime ? totalMinutes - sunsetTime : totalMinutes + (24 * 60 - sunsetTime);
        progress = minutesAfterSunset / (middleOfTheNight - sunsetTime);

        if (totalMinutes <= sunsetTime + 40) {
            // First half of the night
            y = progress * 200;
        } else {
            // Second half of the night
            y = progress * 1000;
        }
    }

    return { x, y };
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
    const goldenHour = [244, 120, 81];
    const day = [173, 216, 230];

    let bgColor, r, g, b;

    if (totalMinutes <= sunriseTime - 30) {
        bgColor = night;



    // SUNRISE
    } 
    else if (totalMinutes > sunriseTime - 30 && totalMinutes <= sunriseTime - 25) {
        const ratio = getGradientRatio(totalMinutes, sunriseTime - 30, sunriseTime - 25);
        bgColor = mixColors(night, [10, 0, 40], ratio).match(/\d+/g).map(Number); // Very dark blue
    } 
    
    else if (totalMinutes > sunriseTime - 25 && totalMinutes <= sunriseTime - 20) {
        const ratio = getGradientRatio(totalMinutes, sunriseTime - 25, sunriseTime - 20);
        bgColor = mixColors([10, 0, 40], [20, 10, 50], ratio).match(/\d+/g).map(Number); // Dark blue with a hint of light
    } 
    
    else if (totalMinutes > sunriseTime - 20 && totalMinutes <= sunriseTime - 15) {
        const ratio = getGradientRatio(totalMinutes, sunriseTime - 20, sunriseTime - 15);
        bgColor = mixColors([20, 10, 50], [50, 40, 80], ratio).match(/\d+/g).map(Number); // Medium blue
    }
    
    else if (totalMinutes > sunriseTime - 15 && totalMinutes <= sunriseTime - 10) {
        const ratio = getGradientRatio(totalMinutes, sunriseTime - 15, sunriseTime - 10);
        bgColor = mixColors([50, 40, 80], [100, 80, 120], ratio).match(/\d+/g).map(Number); // Transition to lighter blue before hitting warmer colors
    }
    
    else if (totalMinutes > sunriseTime - 10 && totalMinutes <= sunriseTime - 5) {
        const ratio = getGradientRatio(totalMinutes, sunriseTime - 10, sunriseTime - 5);
        bgColor = mixColors([100, 80, 120], [246, 140, 70], ratio).match(/\d+/g).map(Number); // Transition to orange from light blue
    }
    
    else if (totalMinutes > sunriseTime - 5 && totalMinutes < sunriseTime) {
        const ratio = getGradientRatio(totalMinutes, sunriseTime - 5, sunriseTime);
        bgColor = mixColors([246, 140, 70], [244, 120, 81], ratio).match(/\d+/g).map(Number); // Finalize the orange shade
    }
    
    
    // DAYTIME
    else if (totalMinutes >= sunriseTime && totalMinutes < sunriseTime + 15) {
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

    let opacity = 0;

if (totalMinutes <= sunriseTime - 30) {
    // Night time: fully present
    opacity = 1;
    
} else if (totalMinutes <= sunriseTime - 22) {
    // 8 minutes between sunrise - 30 and sunrise - 22, so use this for transition
    opacity = (sunriseTime - 22 - totalMinutes) / 8;

} else if (totalMinutes < sunsetTime + 22) {
    // Day time: absent
    opacity = 0;

} else if (totalMinutes < sunsetTime + 30) {
    // 8 minutes between sunset + 22 and sunset + 30, so use this for transition
    opacity = (totalMinutes - sunsetTime - 22) / 8;
} else {
    // Night time: fully present
    opacity = 1;
}

// Additional code to adjust the gradient
const gradientPosition = calculateGradientPosition(totalMinutes, sunriseTime, sunsetTime);
const gradientX = gradientPosition.x;
const gradientY = gradientPosition.y;

  // Update the background gradient
  document.body.style.backgroundImage = `linear-gradient(${gradientX}deg, 
    rgba(${r}, ${g}, ${b}, 0.8) 0%, 
    rgba(${r}, ${g}, ${b}, 0.8) ${gradientY}%, 
    ${'#0000ff'} 100%)`;


canvas.style.opacity = Math.max(0, Math.min(1, opacity));  // Ensure it's between 0 and 1
canvas.style.display = opacity > 0 ? 'block' : 'none';     // Only display if there's some opacity

}

// Fetch sunrise and sunset times and then update the background color and time
fetchSunriseSunset();
setInterval(updateDisplayedTime, 1000);  // Update displayed time every second
setInterval(updateBackgroundColor, 60000); // Update background color every minute after the first immediate update