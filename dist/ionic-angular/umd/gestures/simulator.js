(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Simulate = (function () {
        function Simulate() {
            this.index = 0;
            this.points = [];
            this.timedelta = 1 / 60;
        }
        /**
         * @param {?} x
         * @param {?=} y
         * @return {?}
         */
        Simulate.from = function (x, y) {
            var /** @type {?} */ s = new Simulate();
            return s.start(x, y);
        };
        /**
         * @return {?}
         */
        Simulate.prototype.reset = function () {
            this.index = 0;
            return this;
        };
        /**
         * @param {?} x
         * @param {?=} y
         * @return {?}
         */
        Simulate.prototype.start = function (x, y) {
            this.points = [];
            return this.to(x, y);
        };
        /**
         * @param {?} x
         * @param {?=} y
         * @return {?}
         */
        Simulate.prototype.to = function (x, y) {
            this.newPoint(parseCoordinates(x, y), 1);
            return this;
        };
        /**
         * @param {?} x
         * @param {?=} y
         * @return {?}
         */
        Simulate.prototype.delta = function (x, y) {
            var /** @type {?} */ newPoint = parseCoordinates(x, y);
            var /** @type {?} */ prevCoord = this.getLastPoint().coord;
            newPoint.x += prevCoord.x;
            newPoint.y += prevCoord.y;
            this.newPoint(newPoint, 1);
            return this;
        };
        /**
         * @param {?} angle
         * @param {?} distance
         * @return {?}
         */
        Simulate.prototype.deltaPolar = function (angle, distance) {
            angle *= Math.PI / 180;
            var /** @type {?} */ prevCoord = this.getLastPoint().coord;
            var /** @type {?} */ coord = {
                x: prevCoord.x + (Math.cos(angle) * distance),
                y: prevCoord.y + (Math.sin(angle) * distance)
            };
            this.newPoint(coord, 1);
            return this;
        };
        /**
         * @param {?} angle
         * @param {?} distance
         * @return {?}
         */
        Simulate.prototype.toPolar = function (angle, distance) {
            angle *= Math.PI / 180;
            var /** @type {?} */ coord = {
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance
            };
            this.newPoint(coord, 1);
            return this;
        };
        /**
         * @param {?} duration
         * @return {?}
         */
        Simulate.prototype.duration = function (duration) {
            this.getLastPoint().duration = duration;
            return this;
        };
        /**
         * @param {?} vel
         * @return {?}
         */
        Simulate.prototype.velocity = function (vel) {
            var /** @type {?} */ p1 = this.getLastPoint();
            var /** @type {?} */ p2 = this.getPreviousPoint();
            var /** @type {?} */ d = distance(p1, p2);
            return this.duration(d / vel);
        };
        /**
         * @param {?} maxAngle
         * @param {?} distance
         * @return {?}
         */
        Simulate.prototype.swipeRight = function (maxAngle, distance) {
            // x------>
            var /** @type {?} */ angle = randomAngle(maxAngle);
            return this.deltaPolar(angle, distance);
        };
        /**
         * @param {?} maxAngle
         * @param {?} distance
         * @return {?}
         */
        Simulate.prototype.swipeLeft = function (maxAngle, distance) {
            // <------x
            var /** @type {?} */ angle = randomAngle(maxAngle) + 180;
            return this.deltaPolar(angle, distance);
        };
        /**
         * @param {?} maxAngle
         * @param {?} distance
         * @return {?}
         */
        Simulate.prototype.swipeTop = function (maxAngle, distance) {
            var /** @type {?} */ angle = randomAngle(maxAngle) + 90;
            return this.deltaPolar(angle, distance);
        };
        /**
         * @param {?} maxAngle
         * @param {?} distance
         * @return {?}
         */
        Simulate.prototype.swipeBottom = function (maxAngle, distance) {
            var /** @type {?} */ angle = randomAngle(maxAngle) - 90;
            return this.deltaPolar(angle, distance);
        };
        /**
         * @param {?} callback
         * @return {?}
         */
        Simulate.prototype.run = function (callback) {
            var /** @type {?} */ points = this.points;
            var /** @type {?} */ len = points.length - 1;
            var /** @type {?} */ i = 0;
            for (; i < len; i++) {
                var /** @type {?} */ p1 = points[i].coord;
                var /** @type {?} */ p2 = points[i + 1].coord;
                var /** @type {?} */ duration = points[i + 1].duration;
                var /** @type {?} */ vectorX = p2.x - p1.x;
                var /** @type {?} */ vectorY = p2.y - p1.y;
                var /** @type {?} */ nuSteps = Math.ceil(duration / this.timedelta);
                vectorX /= nuSteps;
                vectorY /= nuSteps;
                for (var /** @type {?} */ j = 0; j < nuSteps; j++) {
                    callback({
                        x: p1.x + vectorX * j,
                        y: p1.y + vectorY * j
                    });
                }
            }
            this.index = i;
            return this;
        };
        /**
         * @param {?} coord
         * @param {?} duration
         * @return {?}
         */
        Simulate.prototype.newPoint = function (coord, duration) {
            this.points.push({
                coord: coord,
                duration: duration,
            });
        };
        /**
         * @return {?}
         */
        Simulate.prototype.getLastPoint = function () {
            var /** @type {?} */ len = this.points.length;
            if (len > 0) {
                return this.points[len - 1];
            }
            throw new Error('can not call point');
        };
        /**
         * @return {?}
         */
        Simulate.prototype.getPreviousPoint = function () {
            var /** @type {?} */ len = this.points.length;
            if (len > 1) {
                return this.points[len - 2];
            }
            throw new Error('can not call point');
        };
        return Simulate;
    }());
    exports.Simulate = Simulate;
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
        var /** @type {?} */ deltaX = a.x - b.x;
        var /** @type {?} */ deltaY = a.y - a.y;
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
});
//# sourceMappingURL=simulator.js.map