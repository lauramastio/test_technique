document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('pointCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    function generateRandomPoint() {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        return { x, y };
    }

    function renderPoints(numPoints, pointSize) {
        ctx.fillStyle = '#000';
        for (let i = 0; i < numPoints; i++) {
            const point = generateRandomPoint();
            ctx.fillRect(point.x, point.y, pointSize, pointSize);
        }
    }

    const numPoints = 100000/10;
    const pointSize = 2;
    renderPoints(numPoints, pointSize);
});

// optimisation of generation
// divide the canvas into 4 quadrants and generate points in each quadrant
// instead of fillRect aka drawing one by one, draw all at once? (same issue as writing char by char in c instead of the whole string at once)

