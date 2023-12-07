document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('pointCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    function generateRandomPoints(numPoints) {
        const points = new Float32Array(numPoints * 2);

        for (let i = 0; i < numPoints * 2; i += 2) {
            points[i] = Math.random() * canvas.width;
            points[i + 1] = Math.random() * canvas.height;
        }

        return points;
    }

    function renderPoints(points, pointSize) {
        ctx.fillStyle = '#000';
        for (let i = 0; i < points.length; i += 2) {
            ctx.fillRect(points[i], points[i + 1], pointSize, pointSize);
        }
    }

    const numPoints = 100000/10;
    const pointSize = 2; //thickness of the points, adjust for visibility
    const points = generateRandomPoints(numPoints);
    renderPoints(points, pointSize);
});

// 0,01 second slower than the previous one but on larger scale is significantly faster