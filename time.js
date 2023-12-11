function updateDisplayedTime() {
    let now = new Date();
    // Convert to Zurich time
    let zurichTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Zurich" }));
    // Format the time to show only hours and minutes
    let formattedTime = zurichTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('time').innerText = formattedTime;
}

document.addEventListener("DOMContentLoaded", function () {
    // Set interval to update displayed time every 5 seconds
    setInterval(updateDisplayedTime, 5000);
});

window.addEventListener('resize', resizeCanvas);
