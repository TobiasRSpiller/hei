const canvas = document.getElementById('starsCanvas');
const ctx = canvas.getContext('2d');
let stars = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createStars(count) {
    const bandWidth = canvas.width * 0.2;  // 20% of the canvas width
    const bandXStart = (canvas.width - bandWidth) / 2;  // start of the band

    for (let i = 0; i < count; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;

        // Define a bell curve to adjust star density
        let bellCurve = Math.exp(-((x - canvas.width / 2) ** 2) / (2 * bandWidth ** 2));

        if (Math.random() < bellCurve) {
            stars.push({
                x: x,
                y: y,
                size: Math.random() * 2,
                opacity: Math.random()
            });
        }
    }
}

function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let star of stars) {
        ctx.globalAlpha = star.opacity;
        ctx.fillStyle = 'white';
        ctx.fillRect(star.x, star.y, star.size, star.size);
    }
}

function sparkleStars() {
    for (let star of stars) {
        star.opacity = Math.random(); // change opacity randomly to simulate sparkling
    }
    drawStars();
}

resizeCanvas();
createStars(9000); // Adjust for desired density
drawStars();
setInterval(sparkleStars, 5000); // sparkle every 5 seconds

window.addEventListener('resize', resizeCanvas);