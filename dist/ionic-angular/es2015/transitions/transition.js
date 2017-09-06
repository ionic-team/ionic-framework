import { Animation } from '../animations/animation';
/**
 * @hidden
 *
 * - play
 * - Add before classes - DOM WRITE
 * - Remove before classes - DOM WRITE
 * - Add before inline styles - DOM WRITE
 * - set inline FROM styles - DOM WRITE
 * - RAF
 * - read toolbar dimensions - DOM READ
 * - write content top/bottom padding - DOM WRITE
 * - set css transition duration/easing - DOM WRITE
 * - RAF
 * - set inline TO styles - DOM WRITE
 */
export class Transition extends Animation {
    /**
     * @param {?} plt
     * @param {?} enteringView
     * @param {?} leavingView
     * @param {?} opts
     */
    constructor(plt, enteringView, leavingView, opts) {
        super(plt, null, opts);
        this.enteringView = enteringView;
        this.leavingView = leavingView;
    }
    /**
     * @return {?}
     */
    init() { }
    /**
     * @param {?} trnsStart
     * @return {?}
     */
    registerStart(trnsStart) {
        this._trnsStart = trnsStart;
    }
    /**
     * @return {?}
     */
    start() {
        this._trnsStart && this._trnsStart();
        this._trnsStart = null;
        // bubble up start
        this.parent && this.parent.start();
    }
    /**
     * @return {?}
     */
    destroy() {
        super.destroy();
        this.parent = this.enteringView = this.leavingView = this._trnsStart = null;
    }
}
function Transition_tsickle_Closure_declarations() {
    /** @type {?} */
    Transition.prototype._trnsStart;
    /** @type {?} */
    Transition.prototype.parent;
    /** @type {?} */
    Transition.prototype.trnsId;
    /** @type {?} */
    Transition.prototype.enteringView;
    /** @type {?} */
    Transition.prototype.leavingView;
}
//# sourceMappingURL=transition.js.map