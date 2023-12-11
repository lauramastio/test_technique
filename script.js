document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('pointCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var mouseX, mouseY;

    const NUM_POINTS = 1000000; //number of points to generate
    const POINT_SIZE = 1; //thickness of the points, adjust for visibility
    const bounds = new Rectangle(0, 0, canvas.width, canvas.height);
    const quadtree = new QuadtreeNode(bounds);

    const points = populateQuadTree();
    let lastClosestPoint = renderPoints(points);

    function populateQuadTree() {
        const points = new Int32Array(NUM_POINTS * 2);

        for (let i = 0; i < NUM_POINTS * 2; i += 2) {
            points[i] = Math.floor(Math.random() * canvas.width);
            points[i + 1] = Math.floor(Math.random() * canvas.height);
            quadtree.insert({x: points[i], y: points[i + 1]});
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

            if (node.point.x !== undefined && node.point.y !== undefined) {
                const x = node.point.x;
                const y = node.point.y;
                const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestPoint = { x, y };
                }
            }

            if (node.hasChild) {
                search(node.northwest);
                search(node.northeast);
                search(node.southwest);
                search(node.southeast);
            }
        }
        search(quadtree);
        return closestPoint;
    }

    function renderPoints(points) {
        ctx.fillStyle = '#000';
        const closestPoint = findClosestPoint(mouseX, mouseY, quadtree);

        if (closestPoint == null) {
            console.error('No closest point found.');
        }
        for (let i = 0; i < points.length; i += 2) {
            if (points[i] === closestPoint?.x && points[i + 1] === closestPoint?.y) {
                ctx.fillStyle = '#f00';
            } else {
                ctx.fillStyle = '#000';
            }
            ctx.fillRect(points[i], points[i + 1], POINT_SIZE, POINT_SIZE);
        }
        return closestPoint;
    }

    function rerenderPoints() {
        if (lastClosestPoint) {
            ctx.fillStyle = '#000';
            ctx.fillRect(lastClosestPoint.x, lastClosestPoint.y, POINT_SIZE, POINT_SIZE);
        }
        ctx.fillStyle = '#f00';
        const closestPoint = findClosestPoint(mouseX, mouseY, quadtree);
        ctx.fillRect(closestPoint.x, closestPoint.y, POINT_SIZE, POINT_SIZE);
        lastClosestPoint = closestPoint;

    }

    canvas.addEventListener('mousemove', function(event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
        rerenderPoints();
    });

});
