import { ActionSheetCmp } from './action-sheet-component';
import { ActionSheetMdSlideIn, ActionSheetMdSlideOut, ActionSheetSlideIn, ActionSheetSlideOut, ActionSheetWpSlideIn, ActionSheetWpSlideOut } from './action-sheet-transitions';
import { isPresent } from '../../util/util';
import { ViewController } from '../../navigation/view-controller';
/**
 * @hidden
 */
export class ActionSheet extends ViewController {
    /**
     * @param {?} app
     * @param {?} opts
     * @param {?} config
     */
    constructor(app, opts, config) {
        opts.buttons = opts.buttons || [];
        opts.enableBackdropDismiss = isPresent(opts.enableBackdropDismiss) ? !!opts.enableBackdropDismiss : true;
        super(ActionSheetCmp, opts, null);
        this._app = app;
        this.isOverlay = true;
        config.setTransition('action-sheet-slide-in', ActionSheetSlideIn);
        config.setTransition('action-sheet-slide-out', ActionSheetSlideOut);
        config.setTransition('action-sheet-md-slide-in', ActionSheetMdSlideIn);
        config.setTransition('action-sheet-md-slide-out', ActionSheetMdSlideOut);
        config.setTransition('action-sheet-wp-slide-in', ActionSheetWpSlideIn);
        config.setTransition('action-sheet-wp-slide-out', ActionSheetWpSlideOut);
    }
    /**
     * @hidden
     * @param {?} direction
     * @return {?}
     */
    getTransitionName(direction) {
        const /** @type {?} */ key = 'actionSheet' + (direction === 'back' ? 'Leave' : 'Enter');
        return this._nav && this._nav.config.get(key);
    }
    /**
     * @param {?} title
     * @return {?}
     */
    setTitle(title) {
        this.data.title = title;
        return this;
    }
    /**
     * @param {?} subTitle
     * @return {?}
     */
    setSubTitle(subTitle) {
        this.data.subTitle = subTitle;
        return this;
    }
    /**
     * @param {?} button
     * @return {?}
     */
    addButton(button) {
        this.data.buttons.push(button);
        return this;
    }
    /**
     * Present the action sheet instance.
     *
     * @param {?=} navOptions
     * @return {?}
     */
    present(navOptions = {}) {
        navOptions.minClickBlockDuration = navOptions.minClickBlockDuration || 400;
        return this._app.present(this, navOptions);
    }
}
function ActionSheet_tsickle_Closure_declarations() {
    /** @type {?} */
    ActionSheet.prototype._app;
}
//# sourceMappingURL=action-sheet.js.map