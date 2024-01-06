const _rotations = [
    ([x,y]) => [x,y],   // 0
    ([x,y]) => [-y,x],  // 90
    ([x,y]) => [-x,-y], // 180
    ([x,y]) => [y,-x]   // 270
];

const _reflect = ([x,y]) => [-x, y];

const _getx = ([x, _]) => x;
const _gety = ([_, y]) => y;

const _compare = ([x1, y1], [x2, y2]) => x1 == x2 && y1 == y2;

export class Polyomino {

    constructor(coords) {
        this.coords = coords;
    }

    clone() {
        return new Polyomino(this.coords);
    }

    // Return an translated version with smallest possible non-negative coordinates
    // and coordinates sorted by ascending x then ascending y
    normalize() {
        let smallestX = Math.min(...this.coords.map(_getx));
        let smallestY = Math.min(...this.coords.map(_gety));
        let p = this.translate(-smallestX, -smallestY);
        let coords = p.coords.toSorted(([ x1, y1 ], [ x2, y2 ]) => (x1 - x2) != 0 ? (x1 - x2) : (y1 - y2));
        return new Polyomino(coords);
    }

    // Strict comparison; i.e. the coordinates are identical as lists.
    equals(p) {
        return (this.coords.length == p.coords.length) && this.coords.every((c, i) => _compare(c, p.coords[i]));
    }

    isEmpty() {
        return this.coords.length == 0;
    }

    // Rotates n*90 degrees counter-clockwise
    rotate(n) {
        let angle = n % 4;
        return new Polyomino(this.coords.map(_rotations[angle]));
    }

    reflect() {
        return new Polyomino(this.coords.map(_reflect));
    }

    translate(dx, dy) {
        let t = ([x, y]) => [x + dx, y + dy];
        return new Polyomino(this.coords.map(t));
    }

    isDisjointFrom(other) {
        for (let mine of this.coords) {
            for (let theirs of other.coords) {
                if (mine[0] == theirs[0] && mine[1] == theirs[1]) return false;
            }
        }
        return true;
    }

    getWidth() {
        let xs = this.coords.map(_getx);
        return Math.max(...xs) - Math.min(...xs) + 1;
    }

    getHeight() {
        let ys = this.coords.map(_gety);
        return Math.max(...ys) - Math.min(...ys) + 1;
    }

    getSize() {
        return Math.max(this.getWidth(), this.getHeight());
    }

    getLargestX() {
        return Math.max(...this.coords.map(_getx));
    }

    getLargestY() {
        return Math.max(...this.coords.map(_gety));
    }

    containsCoordinate(c) {
        return this.coords.some(([x, y]) => x == c[0] && y == c[1]);
    }

}

export const tetrominos = {
    'I': new Polyomino([[0, 0], [0, 1], [0, 2], [0, 3]]),
    'O': new Polyomino([[0, 0], [0, 1], [1, 1], [1, 0]]),
    'T': new Polyomino([[0, 1], [1, 1], [1, 0], [2, 1]]),
    'J': new Polyomino([[0, 0], [1, 0], [1, 1], [1, 2]]),
    'L': new Polyomino([[0, 2], [0, 1], [0, 0], [1, 0]]),
    'S': new Polyomino([[0, 0], [1, 0], [1, 1], [2, 1]]),
    'Z': new Polyomino([[0, 1], [1, 1], [1, 0], [2, 0]]),
};
