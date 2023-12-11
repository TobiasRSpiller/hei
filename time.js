function updateDisplayedTime() {
    let now = new Date();
    // Convert to Zurich time
    let zurichTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Zurich" }));
    document.getElementById('time').innerText = zurichTime.toLocaleTimeString();
}

document.addEventListener("DOMContentLoaded", function () {
    const timeSlider = document.getElementById('timeSlider');

    // Get current Zurich time in minutes
    const now = new Date();
    const zurichTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Zurich" }));
    const currentMinutes = zurichTime.getHours() * 60 + zurichTime.getMinutes();

    // Set the slider to the current time
    timeSlider.value = currentMinutes;

    // Update the label immediately
    updateSliderLabel(currentMinutes);

    // Event listener for the mouse wheel
    timeSlider.addEventListener('wheel', function(event) {
        // Check if the wheel was scrolled up or down
        if (event.deltaY < 0) {
            timeSlider.value = parseInt(timeSlider.value) - 1;
        } else if (event.deltaY > 0) {
            timeSlider.value = parseInt(timeSlider.value) + 1;
        }

        // Prevent the default scrolling behavior
        event.preventDefault();

        // Update the label and background
        updateSliderLabel(parseInt(timeSlider.value));
        updateBackgroundColor(parseInt(timeSlider.value));
    });

    // Event listener for keyboard arrows
    timeSlider.addEventListener('keydown', function(event) {
        console.log("Keydown event triggered");
        if (event.key === "ArrowUp") {
            timeSlider.value = parseInt(timeSlider.value) - 1;
        } else if (event.key === "ArrowDown") {
            timeSlider.value = parseInt(timeSlider.value) + 1;
        }

        // Update the label and background
        updateSliderLabel(parseInt(timeSlider.value));
        updateBackgroundColor(parseInt(timeSlider.value));
    });

    // Add the input event listener
    timeSlider.addEventListener('input', function (event) {
        const totalMinutes = parseInt(event.target.value);
        updateSliderLabel(totalMinutes);
        updateBackgroundColor(totalMinutes);
    });

    function updateSliderLabel(totalMinutes) {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        document.getElementById('sliderLabel').innerText = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    setInterval(updateDisplayedTime, 5000);
});

window.addEventListener('resize', resizeCanvas);
