(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../util/util", "./view-controller"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require("../util/util");
    var view_controller_1 = require("./view-controller");
    /**
     * @param {?} linker
     * @param {?} nameOrPageOrView
     * @param {?=} params
     * @return {?}
     */
    function getComponent(linker, nameOrPageOrView, params) {
        if (typeof nameOrPageOrView === 'function') {
            return Promise.resolve(new view_controller_1.ViewController(nameOrPageOrView, params));
        }
        if (typeof nameOrPageOrView === 'string') {
            return linker.getComponentFromName(nameOrPageOrView).then(function (component) {
                var /** @type {?} */ vc = new view_controller_1.ViewController(component, params);
                vc.id = nameOrPageOrView;
                return vc;
            });
        }
        return Promise.resolve(null);
    }
    exports.getComponent = getComponent;
    /**
     * @param {?} linker
     * @param {?} nameOrPageOrView
     * @param {?} params
     * @return {?}
     */
    function convertToView(linker, nameOrPageOrView, params) {
        if (nameOrPageOrView) {
            if (view_controller_1.isViewController(nameOrPageOrView)) {
                // is already a ViewController
                return Promise.resolve(/** @type {?} */ (nameOrPageOrView));
            }
            return getComponent(linker, nameOrPageOrView, params);
        }
        return Promise.resolve(null);
    }
    exports.convertToView = convertToView;
    /**
     * @param {?} linker
     * @param {?} pages
     * @return {?}
     */
    function convertToViews(linker, pages) {
        var /** @type {?} */ views = [];
        if (util_1.isArray(pages)) {
            for (var /** @type {?} */ i = 0; i < pages.length; i++) {
                var /** @type {?} */ page = pages[i];
                if (page) {
                    if (view_controller_1.isViewController(page)) {
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
    exports.convertToViews = convertToViews;
    var /** @type {?} */ portalZindex = 9999;
    /**
     * @param {?} nav
     * @param {?} enteringView
     * @param {?} leavingView
     * @param {?} direction
     * @param {?} renderer
     * @return {?}
     */
    function setZIndex(nav, enteringView, leavingView, direction, renderer) {
        if (enteringView) {
            if (nav._isPortal) {
                if (direction === exports.DIRECTION_FORWARD) {
                    enteringView._setZIndex(nav._zIndexOffset + portalZindex, renderer);
                }
                portalZindex++;
                return;
            }
            leavingView = leavingView || nav.getPrevious(enteringView);
            if (leavingView && util_1.isPresent(leavingView._zIndex)) {
                if (direction === exports.DIRECTION_BACK) {
                    enteringView._setZIndex(leavingView._zIndex - 1, renderer);
                }
                else {
                    enteringView._setZIndex(leavingView._zIndex + 1, renderer);
                }
            }
            else {
                enteringView._setZIndex(exports.INIT_ZINDEX + nav._zIndexOffset, renderer);
            }
        }
    }
    exports.setZIndex = setZIndex;
    /**
     * @param {?} nav
     * @return {?}
     */
    function isTabs(nav) {
        // Tabs (ion-tabs)
        return !!nav && !!nav.getSelected;
    }
    exports.isTabs = isTabs;
    /**
     * @param {?} nav
     * @return {?}
     */
    function isTab(nav) {
        // Tab (ion-tab)
        return !!nav && util_1.isPresent(nav._tabId);
    }
    exports.isTab = isTab;
    /**
     * @param {?} nav
     * @return {?}
     */
    function isNav(nav) {
        // Nav (ion-nav), Tab (ion-tab), Portal (ion-portal)
        return !!nav && !!nav.push && nav.getType() === 'nav';
    }
    exports.isNav = isNav;
    /**
     * @param {?} navId
     * @param {?} type
     * @param {?} secondaryId
     * @param {?} link
     * @return {?}
     */
    function linkToSegment(navId, type, secondaryId, link) {
        var /** @type {?} */ segment = (Object.assign({}, link));
        segment.navId = navId;
        segment.type = type;
        segment.secondaryId = secondaryId;
        return segment;
    }
    exports.linkToSegment = linkToSegment;
    /**
     * @hidden
     */
    var DeepLinkMetadata = (function () {
        function DeepLinkMetadata() {
        }
        return DeepLinkMetadata;
    }());
    exports.DeepLinkMetadata = DeepLinkMetadata;
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
    exports.STATE_NEW = 1;
    exports.STATE_INITIALIZED = 2;
    exports.STATE_ATTACHED = 3;
    exports.STATE_DESTROYED = 4;
    exports.INIT_ZINDEX = 100;
    exports.DIRECTION_BACK = 'back';
    exports.DIRECTION_FORWARD = 'forward';
    exports.DIRECTION_SWITCH = 'switch';
    exports.NAV = 'nav';
    exports.TABS = 'tabs';
});
//# sourceMappingURL=nav-util.js.map