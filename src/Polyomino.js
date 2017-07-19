const _rotations = [
    ([x,y]) => [x,y],   // 0
    ([x,y]) => [-y,x],  // 90
    ([x,y]) => [-x,-y], // 180
    ([x,y]) => [y,-x]   // 270
];

const _reflect = ([x,y]) => [-x, y];

const _getx = ([x, _]) => x;
const _gety = ([_, y]) => y;

export default class Polyomino {

    constructor(coords) {
        this.coords = coords;
    }

    // Rotates n*90 degrees counter-clockwise
    rotate(n) {
        let angle = n % 4;
        return new Polyomino(this.coords.map(_trans[angle]));
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

    // Return an translated version with smallest possible non-negative coordinates
    getMinimalNonNegative() {
        let smallestX = Math.min(...this.coords.map(_getx));
        let smallestY = Math.min(...this.coords.map(_gety));
        return this.translate(-smallestX, -smallestY);
    }

    getWidth() {
        let xs = this.coords.map(_getx);
        return Math.max(...xs) - Math.min(...xs) + 1;
    }

    getHeight() {
        let ys = this.coords.map(_gety);
        return Math.max(...ys) - Math.min(...ys) + 1;
    }

}
