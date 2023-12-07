class Rectangle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    contains(point) {
        return (
            point[0] >= this.x &&
            point[0] <= this.x + this.width &&
            point[1] >= this.y &&
            point[1] <= this.y + this.height
        );
    }
}

class QuadtreeNode {
    constructor(boundary) {
        this.boundary = boundary;
        this.capacity = 4;
        this.points = [];
        this.subdivided = false; // is the node a leaf
        this.northwest = null;
        this.northeast = null;
        this.southwest = null;
        this.southeast = null;
    }

    insert(point) {
        if (!this.boundary.contains(point)) {
            return false; // Point is outside the Quadtree's boundary
        }

        if (this.points.length < this.capacity) {
            this.points.push(point); // Add point to the current node
            return true;
        }

        if (!this.subdivided) {
            this.subdivide(); // Subdivide the node if not already done
        }

        // Insert the point into the appropriate subnode
        return (
            this.northwest.insert(point) ||
            this.northeast.insert(point) ||
            this.southwest.insert(point) ||
            this.southeast.insert(point)
        );
    }

    subdivide() {
        const x = this.boundary.x;
        const y = this.boundary.y;
        const w = this.boundary.width / 2;
        const h = this.boundary.height / 2;

        const nwBoundary = new Rectangle(x, y, w, h);
        const neBoundary = new Rectangle(x + w, y, w, h);
        const swBoundary = new Rectangle(x, y + h, w, h);
        const seBoundary = new Rectangle(x + w, y + h, w, h);

        // Create subnodes
        this.northwest = new QuadtreeNode(nwBoundary, this.capacity);
        this.northeast = new QuadtreeNode(neBoundary, this.capacity);
        this.southwest = new QuadtreeNode(swBoundary, this.capacity);
        this.southeast = new QuadtreeNode(seBoundary, this.capacity);

        this.subdivided = true;
    }
}
