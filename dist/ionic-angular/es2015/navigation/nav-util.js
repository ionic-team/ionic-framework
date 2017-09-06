import { isArray, isPresent } from '../util/util';
import { ViewController, isViewController } from './view-controller';
/**
 * @param {?} linker
 * @param {?} nameOrPageOrView
 * @param {?=} params
 * @return {?}
 */
export function getComponent(linker, nameOrPageOrView, params) {
    if (typeof nameOrPageOrView === 'function') {
        return Promise.resolve(new ViewController(nameOrPageOrView, params));
    }
    if (typeof nameOrPageOrView === 'string') {
        return linker.getComponentFromName(nameOrPageOrView).then((component) => {
            const /** @type {?} */ vc = new ViewController(component, params);
            vc.id = nameOrPageOrView;
            return vc;
        });
    }
    return Promise.resolve(null);
}
/**
 * @param {?} linker
 * @param {?} nameOrPageOrView
 * @param {?} params
 * @return {?}
 */
export function convertToView(linker, nameOrPageOrView, params) {
    if (nameOrPageOrView) {
        if (isViewController(nameOrPageOrView)) {
            // is already a ViewController
            return Promise.resolve(/** @type {?} */ (nameOrPageOrView));
        }
        return getComponent(linker, nameOrPageOrView, params);
    }
    return Promise.resolve(null);
}
/**
 * @param {?} linker
 * @param {?} pages
 * @return {?}
 */
export function convertToViews(linker, pages) {
    const /** @type {?} */ views = [];
    if (isArray(pages)) {
        for (var /** @type {?} */ i = 0; i < pages.length; i++) {
            var /** @type {?} */ page = pages[i];
            if (page) {
                if (isViewController(page)) {
                    views.push(page);
                }
                else if (page.page) {
                    views.push(convertToView(linker, page.page, page.params));
                }
                else {
                    views.push(convertToView(linker, page, null));
                }
            }
        }
    }
    return Promise.all(views);
}
let /** @type {?} */ portalZindex = 9999;
/**
 * @param {?} nav
 * @param {?} enteringView
 * @param {?} leavingView
 * @param {?} direction
 * @param {?} renderer
 * @return {?}
 */
export function setZIndex(nav, enteringView, leavingView, direction, renderer) {
    if (enteringView) {
        if (nav._isPortal) {
            if (direction === DIRECTION_FORWARD) {
                enteringView._setZIndex(nav._zIndexOffset + portalZindex, renderer);
            }
            portalZindex++;
            return;
        }
        leavingView = leavingView || nav.getPrevious(enteringView);
        if (leavingView && isPresent(leavingView._zIndex)) {
            if (direction === DIRECTION_BACK) {
                enteringView._setZIndex(leavingView._zIndex - 1, renderer);
            }
            else {
                enteringView._setZIndex(leavingView._zIndex + 1, renderer);
            }
        }
        else {
            enteringView._setZIndex(INIT_ZINDEX + nav._zIndexOffset, renderer);
        }
    }
}
/**
 * @param {?} nav
 * @return {?}
 */
export function isTabs(nav) {
    // Tabs (ion-tabs)
    return !!nav && !!nav.getSelected;
}
/**
 * @param {?} nav
 * @return {?}
 */
export function isTab(nav) {
    // Tab (ion-tab)
    return !!nav && isPresent(nav._tabId);
}
/**
 * @param {?} nav
 * @return {?}
 */
export function isNav(nav) {
    // Nav (ion-nav), Tab (ion-tab), Portal (ion-portal)
    return !!nav && !!nav.push && nav.getType() === 'nav';
}
/**
 * @param {?} navId
 * @param {?} type
 * @param {?} secondaryId
 * @param {?} link
 * @return {?}
 */
export function linkToSegment(navId, type, secondaryId, link) {
    const /** @type {?} */ segment = (Object.assign({}, link));
    segment.navId = navId;
    segment.type = type;
    segment.secondaryId = secondaryId;
    return segment;
}
/**
 * @hidden
 */
export class DeepLinkMetadata {
}
function DeepLinkMetadata_tsickle_Closure_declarations() {
    /** @type {?} */
    DeepLinkMetadata.prototype.component;
    /** @type {?} */
    DeepLinkMetadata.prototype.loadChildren;
    /** @type {?} */
    DeepLinkMetadata.prototype.name;
    /** @type {?} */
    DeepLinkMetadata.prototype.segment;
    /** @type {?} */
    DeepLinkMetadata.prototype.defaultHistory;
    /** @type {?} */
    DeepLinkMetadata.prototype.priority;
}
/**
 * @hidden
 */
export var DeepLinkMetadataFactory;
export const /** @type {?} */ STATE_NEW = 1;
export const /** @type {?} */ STATE_INITIALIZED = 2;
export const /** @type {?} */ STATE_ATTACHED = 3;
export const /** @type {?} */ STATE_DESTROYED = 4;
export const /** @type {?} */ INIT_ZINDEX = 100;
export const /** @type {?} */ DIRECTION_BACK = 'back';
export const /** @type {?} */ DIRECTION_FORWARD = 'forward';
export const /** @type {?} */ DIRECTION_SWITCH = 'switch';
export const /** @type {?} */ NAV = 'nav';
export const /** @type {?} */ TABS = 'tabs';
//# sourceMappingURL=nav-util.js.map