export class PanRecognizer {
    /**
     * @param {?} direction
     * @param {?} threshold
     * @param {?} maxAngle
     */
    constructor(direction, threshold, maxAngle) {
        this.direction = direction;
        this.dirty = false;
        this._angle = 0;
        this._isPan = 0;
        const radians = maxAngle * (Math.PI / 180);
        this.maxCosine = Math.cos(radians);
        this.threshold = threshold * threshold;
    }
    /**
     * @param {?} coord
     * @return {?}
     */
    start(coord) {
        this.startCoord = coord;
        this._angle = 0;
        this._isPan = 0;
        this.dirty = true;
    }
    /**
     * @param {?} coord
     * @return {?}
     */
    detect(coord) {
        if (!this.dirty) {
            return false;
        }
        const /** @type {?} */ deltaX = (coord.x - this.startCoord.x);
        const /** @type {?} */ deltaY = (coord.y - this.startCoord.y);
        const /** @type {?} */ distance = deltaX * deltaX + deltaY * deltaY;
        if (distance >= this.threshold) {
            var /** @type {?} */ angle = Math.atan2(deltaY, deltaX);
            var /** @type {?} */ cosine = (this.direction === 'y')
                ? Math.sin(angle)
                : Math.cos(angle);
            this._angle = angle;
            if (cosine > this.maxCosine) {
                this._isPan = 1;
            }
            else if (cosine < -this.maxCosine) {
                this._isPan = -1;
            }
            else {
                this._isPan = 0;
            }
            this.dirty = false;
            return true;
        }
        return false;
    }
    /**
     * @return {?}
     */
    angle() {
        return this._angle;
    }
    /**
     * @return {?}
     */
    pan() {
        return this._isPan;
    }
}
function PanRecognizer_tsickle_Closure_declarations() {
    /** @type {?} */
    PanRecognizer.prototype.startCoord;
    /** @type {?} */
    PanRecognizer.prototype.dirty;
    /** @type {?} */
    PanRecognizer.prototype.threshold;
    /** @type {?} */
    PanRecognizer.prototype.maxCosine;
    /** @type {?} */
    PanRecognizer.prototype._angle;
    /** @type {?} */
    PanRecognizer.prototype._isPan;
    /** @type {?} */
    PanRecognizer.prototype.direction;
}
//# sourceMappingURL=recognizers.js.map