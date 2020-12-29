var cols, rows;
var size = 20;
var grid = [];

var current;

var stack = [];

function setup() {
    createCanvas(600, 600);
    cols = floor(width / size);
    rows = floor(height / size);

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            var cell = new Cell(c, r)
            grid.push(cell)
        }
    }

    current = grid[0];
}

function draw() {
    background(51);
    for (var i = 0; i < grid.length; i++) {
        grid[i].show();
    }

    current.visited = true;
    current.highlight();
    let next = current.checkNeighbors();
    if (next) {
        next.visited = true;
        stack.push(current);
        removeWalls(current, next);
        current = next;
    } else if (stack.length > 0) {
        current = stack.pop();
    }
}

function index(c, r) {
    if (c < 0 || r < 0 || c > cols - 1 || r > rows - 1) {
        return -1;
    }
    return c + r * cols;
}

function Cell(c, r) {
    this.c = c;
    this.r = r;
    this.walls = [true, true, true, true];
    this.visited = false;

    this.checkNeighbors = function () {
        var neighbors = [];

        var top = grid[index(c, r - 1)];
        var right = grid[index(c + 1, r)];
        var bottom = grid[index(c, r + 1)];
        var left = grid[index(c - 1, r)];

        if (top && !top.visited) {
            neighbors.push(top)
        }
        if (bottom && !bottom.visited) {
            neighbors.push(bottom)
        }
        if (right && !right.visited) {
            neighbors.push(right)
        }
        if (left && !left.visited) {
            neighbors.push(left)
        }

        if (neighbors.length > 0) {
            var q = floor(random(0, neighbors.length));
            return neighbors[q];
        } else {
            return undefined
        }
    }

    this.show = function () {
        var x = this.c * size;
        var y = this.r * size;
        stroke(51);
        if (this.walls[0]) {
            line(x, y, x + size, y);
            line(x, y, x + size, y);
        }
        if (this.walls[1]) {
            line(x + size, y, x + size, y + size);
            line(x + size, y, x + size, y + size);
        }
        if (this.walls[2]) {
            line(x + size, y + size, x, y + size);
            line(x + size, y + size, x, y + size);
        }
        if (this.walls[3]) {
            line(x, y + size, x, y);
            line(x, y + size, x, y);
        }

        if (this.visited) {
            noStroke();
            fill("#00adb5")
            rect(x, y, size, size)
        }
    }

    this.highlight = function () {
        var x = this.c * size;
        var y = this.r * size;
        noStroke();
        fill('#2b7de9');
        rect(x, y, size, size);
    }
}

function removeWalls(a, b) {

    var x = a.c - b.c;
    if (x === 1) {
        a.walls[3] = false;
        b.walls[1] = false;
    } else if (x === -1) {
        a.walls[1] = false;
        b.walls[3] = false;
    }

    var y = a.r - b.r;
    if (y === 1) {
        a.walls[0] = false;
        b.walls[2] = false;
    } else if (y === -1) {
        a.walls[2] = false;
        b.walls[0] = false;
    }
}