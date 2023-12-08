document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('pointCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var mouseX, mouseY;

    const numPoints = 1000;
    const pointSize = 10; //thickness of the points, adjust for visibility
    const bounds = new Rectangle(0, 0, canvas.width, canvas.height);
    const quadtree = new QuadtreeNode(bounds);

    const points = generateRandomPoints(numPoints);
    renderPoints(points, pointSize);

    function generateRandomPoints(numPoints) {
        const points = new Float32Array(numPoints * 2);

        for (let i = 0; i < numPoints * 2; i += 2) {
            points[i] = Math.random() * canvas.width;
            points[i + 1] = Math.random() * canvas.height;
            quadtree.insert([points[i], points[i + 1]]);
        }

        return points;
    }

    function findClosestPoint(mouseX, mouseY, quadtree) {
        let closestPoint = null;
        let minDistance = Number.MAX_VALUE;

        function search(node) {
            if (node == null) {
                return closestPoint;
            }

            if (node.points.length > 0) {
                const x = node.points[0];
                const y = node.points[1];
                const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestPoint = { x, y };
                }
            }

            if (node.subdivided) {
                search(node.northwest);
                search(node.northeast);
                search(node.southwest);
                search(node.southeast);
            }
        }

        search(quadtree);
        return closestPoint;
    }

    function renderPoints(points, pointSize) {
        ctx.fillStyle = '#000';
        const closestPoint = findClosestPoint(mouseX, mouseY, quadtree);

        if (closestPoint == null) {
            console.log('no closest point found');
        }
        for (let i = 0; i < points.length; i += 2) {
            if (points[i] === closestPoint?.x && points[i + 1] === closestPoint?.y) {
                ctx.fillStyle = '#f00';
            } else {
                ctx.fillStyle = '#000';
            }
            ctx.fillRect(points[i], points[i + 1], pointSize, pointSize);
        }
    }

    canvas.addEventListener('mousemove', function(event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        renderPoints(points, pointSize);
    });

});
