import { OverlayProxy } from '../../navigation/overlay-proxy';
import { ModalImpl } from './modal-impl';
/**
 * @hidden
 */
export class Modal extends OverlayProxy {
    /**
     * @param {?} app
     * @param {?} component
     * @param {?} data
     * @param {?=} opts
     * @param {?=} config
     * @param {?=} deepLinker
     */
    constructor(app, component, data, opts = {}, config, deepLinker) {
        super(app, component, config, deepLinker);
        this.data = data;
        this.opts = opts;
        this.isOverlay = true;
    }
    /**
     * @return {?}
     */
    getImplementation() {
        return new ModalImpl(this._app, this._component, this.data, this.opts, this._config);
    }
}
function Modal_tsickle_Closure_declarations() {
    /** @type {?} */
    Modal.prototype.isOverlay;
    /** @type {?} */
    Modal.prototype.data;
    /** @type {?} */
    Modal.prototype.opts;
}
//# sourceMappingURL=modal.js.map