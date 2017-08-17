import { SlideGesture } from './slide-gesture';
import { defaults } from '../util/util';
import { pointerCoord } from '../util/dom';
/**
 * @hidden
 */
export class SlideEdgeGesture extends SlideGesture {
    /**
     * @param {?} plt
     * @param {?} element
     * @param {?=} opts
     */
    constructor(plt, element, opts = {}) {
        defaults(opts, {
            edge: 'start',
            maxEdgeStart: 50
        });
        super(plt, element, opts);
        // Can check corners through use of eg 'left top'
        this.setEdges(opts.edge);
        this.maxEdgeStart = opts.maxEdgeStart;
    }
    /**
     * @param {?} edges
     * @return {?}
     */
    setEdges(edges) {
        const /** @type {?} */ isRTL = this.plt.isRTL;
        this.edges = edges.split(' ').map((value) => {
            switch (value) {
                case 'start': return isRTL ? 'right' : 'left';
                case 'end': return isRTL ? 'left' : 'right';
                default: return value;
            }
        });
    }
    /**
     * @param {?} ev
     * @return {?}
     */
    canStart(ev) {
        const /** @type {?} */ coord = pointerCoord(ev);
        this._d = this.getContainerDimensions();
        return this.edges.every(edge => this._checkEdge(edge, coord));
    }
    /**
     * @return {?}
     */
    getContainerDimensions() {
        const /** @type {?} */ plt = this.plt;
        return {
            left: 0,
            top: 0,
            width: plt.width(),
            height: plt.height()
        };
    }
    /**
     * @param {?} edge
     * @param {?} pos
     * @return {?}
     */
    _checkEdge(edge, pos) {
        const /** @type {?} */ data = this._d;
        const /** @type {?} */ maxEdgeStart = this.maxEdgeStart;
        switch (edge) {
            case 'left': return pos.x <= data.left + maxEdgeStart;
            case 'right': return pos.x >= data.width - maxEdgeStart;
            case 'top': return pos.y <= data.top + maxEdgeStart;
            case 'bottom': return pos.y >= data.height - maxEdgeStart;
        }
        return false;
    }
}
function SlideEdgeGesture_tsickle_Closure_declarations() {
    /** @type {?} */
    SlideEdgeGesture.prototype.edges;
    /** @type {?} */
    SlideEdgeGesture.prototype.maxEdgeStart;
    /** @type {?} */
    SlideEdgeGesture.prototype._d;
}
//# sourceMappingURL=slide-edge-gesture.js.map