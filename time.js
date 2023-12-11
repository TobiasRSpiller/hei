function updateDisplayedTime() {
    let now = new Date();
    // Convert to Zurich time
    let zurichTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Zurich" }));
    document.getElementById('time').innerText = zurichTime.toLocaleTimeString();
}

document.addEventListener("DOMContentLoaded", function () {
    // Set interval to update displayed time every 5 seconds
    setInterval(updateDisplayedTime, 5000);
});

window.addEventListener('resize', resizeCanvas);
