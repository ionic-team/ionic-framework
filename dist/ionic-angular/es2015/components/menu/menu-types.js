import { Animation } from '../../animations/animation';
import { MenuController } from '../app/menu-controller';
/**
 * @hidden
 * Menu Type
 * Base class which is extended by the various types. Each
 * type will provide their own animations for open and close
 * and registers itself with Menu.
 */
export class MenuType {
    /**
     * @param {?} plt
     */
    constructor(plt) {
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
    setOpen(shouldOpen, animated, done) {
        const /** @type {?} */ ani = this.ani
            .onFinish(done, true, true)
            .reverse(!shouldOpen);
        if (animated) {
            ani.play();
        }
        else {
            ani.syncPlay();
        }
    }
    /**
     * @param {?} isOpen
     * @return {?}
     */
    setProgressStart(isOpen) {
        this.isOpening = !isOpen;
        // the cloned animation should not use an easing curve during seek
        this.ani
            .reverse(isOpen)
            .progressStart();
    }
    /**
     * @param {?} stepValue
     * @return {?}
     */
    setProgessStep(stepValue) {
        // adjust progress value depending if it opening or closing
        this.ani.progressStep(stepValue);
    }
    /**
     * @param {?} shouldComplete
     * @param {?} currentStepValue
     * @param {?} velocity
     * @param {?} done
     * @return {?}
     */
    setProgressEnd(shouldComplete, currentStepValue, velocity, done) {
        let /** @type {?} */ isOpen = (this.isOpening && shouldComplete);
        if (!this.isOpening && !shouldComplete) {
            isOpen = true;
        }
        const /** @type {?} */ ani = this.ani;
        ani.onFinish(() => {
            this.isOpening = false;
            done(isOpen);
        }, true);
        const /** @type {?} */ factor = 1 - Math.min(Math.abs(velocity) / 4, 0.7);
        const /** @type {?} */ dur = ani.getDuration() * factor;
        ani.progressEnd(shouldComplete, currentStepValue, dur);
    }
    /**
     * @return {?}
     */
    destroy() {
        this.ani.destroy();
        this.ani = null;
    }
}
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
class MenuRevealType extends MenuType {
    /**
     * @param {?} menu
     * @param {?} plt
     */
    constructor(menu, plt) {
        super(plt);
        const openedX = (menu.width() * (menu.isRightSide ? -1 : 1)) + 'px';
        const contentOpen = new Animation(plt, menu.getContentElement());
        contentOpen.fromTo('translateX', '0px', openedX);
        this.ani.add(contentOpen);
    }
}
MenuController.registerType('reveal', MenuRevealType);
/**
 * @hidden
 * Menu Push Type
 * The content slides over to reveal the menu underneath.
 * The menu itself also slides over to reveal its bad self.
 */
class MenuPushType extends MenuType {
    /**
     * @param {?} menu
     * @param {?} plt
     */
    constructor(menu, plt) {
        super(plt);
        let contentOpenedX, menuClosedX, menuOpenedX;
        const width = menu.width();
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
        const menuAni = new Animation(plt, menu.getMenuElement());
        menuAni.fromTo('translateX', menuClosedX, menuOpenedX);
        this.ani.add(menuAni);
        const contentApi = new Animation(plt, menu.getContentElement());
        contentApi.fromTo('translateX', '0px', contentOpenedX);
        this.ani.add(contentApi);
    }
}
MenuController.registerType('push', MenuPushType);
/**
 * @hidden
 * Menu Overlay Type
 * The menu slides over the content. The content
 * itself, which is under the menu, does not move.
 */
class MenuOverlayType extends MenuType {
    /**
     * @param {?} menu
     * @param {?} plt
     */
    constructor(menu, plt) {
        super(plt);
        let closedX, openedX;
        const width = menu.width();
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
        const menuAni = new Animation(plt, menu.getMenuElement());
        menuAni.fromTo('translateX', closedX, openedX);
        this.ani.add(menuAni);
        const backdropApi = new Animation(plt, menu.getBackdropElement());
        backdropApi.fromTo('opacity', 0.01, 0.35);
        this.ani.add(backdropApi);
    }
}
MenuController.registerType('overlay', MenuOverlayType);
//# sourceMappingURL=menu-types.js.map