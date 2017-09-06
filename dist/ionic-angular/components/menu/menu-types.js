var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Animation } from '../../animations/animation';
import { MenuController } from '../app/menu-controller';
/**
 * @hidden
 * Menu Type
 * Base class which is extended by the various types. Each
 * type will provide their own animations for open and close
 * and registers itself with Menu.
 */
var MenuType = (function () {
    /**
     * @param {?} plt
     */
    function MenuType(plt) {
        this.ani = new Animation(plt);
        this.ani
            .easing('cubic-bezier(0.0, 0.0, 0.2, 1)')
            .easingReverse('cubic-bezier(0.4, 0.0, 0.6, 1)')
            .duration(280);
    }
    /**
     * @param {?} shouldOpen
     * @param {?} animated
     * @param {?} done
     * @return {?}
     */
    MenuType.prototype.setOpen = function (shouldOpen, animated, done) {
        var /** @type {?} */ ani = this.ani
            .onFinish(done, true, true)
            .reverse(!shouldOpen);
        if (animated) {
            ani.play();
        }
        else {
            ani.syncPlay();
        }
    };
    /**
     * @param {?} isOpen
     * @return {?}
     */
    MenuType.prototype.setProgressStart = function (isOpen) {
        this.isOpening = !isOpen;
        // the cloned animation should not use an easing curve during seek
        this.ani
            .reverse(isOpen)
            .progressStart();
    };
    /**
     * @param {?} stepValue
     * @return {?}
     */
    MenuType.prototype.setProgessStep = function (stepValue) {
        // adjust progress value depending if it opening or closing
        this.ani.progressStep(stepValue);
    };
    /**
     * @param {?} shouldComplete
     * @param {?} currentStepValue
     * @param {?} velocity
     * @param {?} done
     * @return {?}
     */
    MenuType.prototype.setProgressEnd = function (shouldComplete, currentStepValue, velocity, done) {
        var _this = this;
        var /** @type {?} */ isOpen = (this.isOpening && shouldComplete);
        if (!this.isOpening && !shouldComplete) {
            isOpen = true;
        }
        var /** @type {?} */ ani = this.ani;
        ani.onFinish(function () {
            _this.isOpening = false;
            done(isOpen);
        }, true);
        var /** @type {?} */ factor = 1 - Math.min(Math.abs(velocity) / 4, 0.7);
        var /** @type {?} */ dur = ani.getDuration() * factor;
        ani.progressEnd(shouldComplete, currentStepValue, dur);
    };
    /**
     * @return {?}
     */
    MenuType.prototype.destroy = function () {
        this.ani.destroy();
        this.ani = null;
    };
    return MenuType;
}());
export { MenuType };
function MenuType_tsickle_Closure_declarations() {
    /** @type {?} */
    MenuType.prototype.ani;
    /** @type {?} */
    MenuType.prototype.isOpening;
}
/**
 * @hidden
 * Menu Reveal Type
 * The content slides over to reveal the menu underneath.
 * The menu itself, which is under the content, does not move.
 */
var MenuRevealType = (function (_super) {
    __extends(MenuRevealType, _super);
    /**
     * @param {?} menu
     * @param {?} plt
     */
    function MenuRevealType(menu, plt) {
        var _this = _super.call(this, plt) || this;
        var openedX = (menu.width() * (menu.isRightSide ? -1 : 1)) + 'px';
        var contentOpen = new Animation(plt, menu.getContentElement());
        contentOpen.fromTo('translateX', '0px', openedX);
        _this.ani.add(contentOpen);
        return _this;
    }
    return MenuRevealType;
}(MenuType));
MenuController.registerType('reveal', MenuRevealType);
/**
 * @hidden
 * Menu Push Type
 * The content slides over to reveal the menu underneath.
 * The menu itself also slides over to reveal its bad self.
 */
var MenuPushType = (function (_super) {
    __extends(MenuPushType, _super);
    /**
     * @param {?} menu
     * @param {?} plt
     */
    function MenuPushType(menu, plt) {
        var _this = _super.call(this, plt) || this;
        var contentOpenedX, menuClosedX, menuOpenedX;
        var width = menu.width();
        if (menu.isRightSide) {
            // right side
            contentOpenedX = -width + 'px';
            menuClosedX = width + 'px';
            menuOpenedX = '0px';
        }
        else {
            contentOpenedX = width + 'px';
            menuOpenedX = '0px';
            menuClosedX = -width + 'px';
        }
        var menuAni = new Animation(plt, menu.getMenuElement());
        menuAni.fromTo('translateX', menuClosedX, menuOpenedX);
        _this.ani.add(menuAni);
        var contentApi = new Animation(plt, menu.getContentElement());
        contentApi.fromTo('translateX', '0px', contentOpenedX);
        _this.ani.add(contentApi);
        return _this;
    }
    return MenuPushType;
}(MenuType));
MenuController.registerType('push', MenuPushType);
/**
 * @hidden
 * Menu Overlay Type
 * The menu slides over the content. The content
 * itself, which is under the menu, does not move.
 */
var MenuOverlayType = (function (_super) {
    __extends(MenuOverlayType, _super);
    /**
     * @param {?} menu
     * @param {?} plt
     */
    function MenuOverlayType(menu, plt) {
        var _this = _super.call(this, plt) || this;
        var closedX, openedX;
        var width = menu.width();
        if (menu.isRightSide) {
            // right side
            closedX = 8 + width + 'px';
            openedX = '0px';
        }
        else {
            // left side
            closedX = -(8 + width) + 'px';
            openedX = '0px';
        }
        var menuAni = new Animation(plt, menu.getMenuElement());
        menuAni.fromTo('translateX', closedX, openedX);
        _this.ani.add(menuAni);
        var backdropApi = new Animation(plt, menu.getBackdropElement());
        backdropApi.fromTo('opacity', 0.01, 0.35);
        _this.ani.add(backdropApi);
        return _this;
    }
    return MenuOverlayType;
}(MenuType));
MenuController.registerType('overlay', MenuOverlayType);
//# sourceMappingURL=menu-types.js.map