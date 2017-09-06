export class Simulate {
    constructor() {
        this.index = 0;
        this.points = [];
        this.timedelta = 1 / 60;
    }
    /**
     * @param {?} x
     * @param {?=} y
     * @return {?}
     */
    static from(x, y) {
        let /** @type {?} */ s = new Simulate();
        return s.start(x, y);
    }
    /**
     * @return {?}
     */
    reset() {
        this.index = 0;
        return this;
    }
    /**
     * @param {?} x
     * @param {?=} y
     * @return {?}
     */
    start(x, y) {
        this.points = [];
        return this.to(x, y);
    }
    /**
     * @param {?} x
     * @param {?=} y
     * @return {?}
     */
    to(x, y) {
        this.newPoint(parseCoordinates(x, y), 1);
        return this;
    }
    /**
     * @param {?} x
     * @param {?=} y
     * @return {?}
     */
    delta(x, y) {
        let /** @type {?} */ newPoint = parseCoordinates(x, y);
        let /** @type {?} */ prevCoord = this.getLastPoint().coord;
        newPoint.x += prevCoord.x;
        newPoint.y += prevCoord.y;
        this.newPoint(newPoint, 1);
        return this;
    }
    /**
     * @param {?} angle
     * @param {?} distance
     * @return {?}
     */
    deltaPolar(angle, distance) {
        angle *= Math.PI / 180;
        let /** @type {?} */ prevCoord = this.getLastPoint().coord;
        let /** @type {?} */ coord = {
            x: prevCoord.x + (Math.cos(angle) * distance),
            y: prevCoord.y + (Math.sin(angle) * distance)
        };
        this.newPoint(coord, 1);
        return this;
    }
    /**
     * @param {?} angle
     * @param {?} distance
     * @return {?}
     */
    toPolar(angle, distance) {
        angle *= Math.PI / 180;
        let /** @type {?} */ coord = {
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance
        };
        this.newPoint(coord, 1);
        return this;
    }
    /**
     * @param {?} duration
     * @return {?}
     */
    duration(duration) {
        this.getLastPoint().duration = duration;
        return this;
    }
    /**
     * @param {?} vel
     * @return {?}
     */
    velocity(vel) {
        let /** @type {?} */ p1 = this.getLastPoint();
        let /** @type {?} */ p2 = this.getPreviousPoint();
        let /** @type {?} */ d = distance(p1, p2);
        return this.duration(d / vel);
    }
    /**
     * @param {?} maxAngle
     * @param {?} distance
     * @return {?}
     */
    swipeRight(maxAngle, distance) {
        // x------>
        let /** @type {?} */ angle = randomAngle(maxAngle);
        return this.deltaPolar(angle, distance);
    }
    /**
     * @param {?} maxAngle
     * @param {?} distance
     * @return {?}
     */
    swipeLeft(maxAngle, distance) {
        // <------x
        let /** @type {?} */ angle = randomAngle(maxAngle) + 180;
        return this.deltaPolar(angle, distance);
    }
    /**
     * @param {?} maxAngle
     * @param {?} distance
     * @return {?}
     */
    swipeTop(maxAngle, distance) {
        let /** @type {?} */ angle = randomAngle(maxAngle) + 90;
        return this.deltaPolar(angle, distance);
    }
    /**
     * @param {?} maxAngle
     * @param {?} distance
     * @return {?}
     */
    swipeBottom(maxAngle, distance) {
        let /** @type {?} */ angle = randomAngle(maxAngle) - 90;
        return this.deltaPolar(angle, distance);
    }
    /**
     * @param {?} callback
     * @return {?}
     */
    run(callback) {
        let /** @type {?} */ points = this.points;
        let /** @type {?} */ len = points.length - 1;
        let /** @type {?} */ i = 0;
        for (; i < len; i++) {
            var /** @type {?} */ p1 = points[i].coord;
            var /** @type {?} */ p2 = points[i + 1].coord;
            var /** @type {?} */ duration = points[i + 1].duration;
            var /** @type {?} */ vectorX = p2.x - p1.x;
            var /** @type {?} */ vectorY = p2.y - p1.y;
            var /** @type {?} */ nuSteps = Math.ceil(duration / this.timedelta);
            vectorX /= nuSteps;
            vectorY /= nuSteps;
            for (let /** @type {?} */ j = 0; j < nuSteps; j++) {
                callback({
                    x: p1.x + vectorX * j,
                    y: p1.y + vectorY * j
                });
            }
        }
        this.index = i;
        return this;
    }
    /**
     * @param {?} coord
     * @param {?} duration
     * @return {?}
     */
    newPoint(coord, duration) {
        this.points.push({
            coord: coord,
            duration: duration,
        });
    }
    /**
     * @return {?}
     */
    getLastPoint() {
        let /** @type {?} */ len = this.points.length;
        if (len > 0) {
            return this.points[len - 1];
        }
        throw new Error('can not call point');
    }
    /**
     * @return {?}
     */
    getPreviousPoint() {
        let /** @type {?} */ len = this.points.length;
        if (len > 1) {
            return this.points[len - 2];
        }
        throw new Error('can not call point');
    }
}
function Simulate_tsickle_Closure_declarations() {
    /** @type {?} */
    Simulate.prototype.index;
    /** @type {?} */
    Simulate.prototype.points;
    /** @type {?} */
    Simulate.prototype.timedelta;
}
/**
 * @param {?} maxAngle
 * @return {?}
 */
function randomAngle(maxAngle) {
    return (Math.random() * maxAngle * 2) - maxAngle;
}
/**
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
function distance(a, b) {
    let /** @type {?} */ deltaX = a.x - b.x;
    let /** @type {?} */ deltaY = a.y - a.y;
    return Math.hypot(deltaX, deltaY);
}
/**
 * @param {?} coord
 * @param {?=} y
 * @return {?}
 */
function parseCoordinates(coord, y) {
    if (typeof coord === 'number') {
        return { x: coord, y: y };
    }
    return coord;
}
//# sourceMappingURL=simulator.js.map