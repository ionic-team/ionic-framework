/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

import { asyncRaf, getIonApp, getNavAsChildIfExists } from './chunk1.js';

class Tab {
    constructor() {
        this.loaded = false;
        this.init = false;
        this.active = false;
        /**
         * The badge color for the tab button.
         */
        this.badgeStyle = 'default';
        /**
         * If true, the user cannot interact with the tab. Defaults to `false`.
         */
        this.disabled = false;
        /**
         * If true, the tab will be selected. Defaults to `false`.
         */
        this.selected = false;
        /**
         * If true, the tab button is visible within the tabbar. Defaults to `true`.
         */
        this.show = true;
        /**
         * If true, hide the tabs on child pages.
         */
        this.tabsHideOnSubPages = false;
    }
    selectedChanged(selected) {
        if (selected) {
            this.ionSelect.emit();
        }
    }
    getRouteId() {
        if (this.name) {
            return this.name;
        }
        if (typeof this.component === 'string') {
            return this.component;
        }
        return null;
    }
    setActive() {
        return this.prepareLazyLoaded().then(() => this.showTab());
    }
    prepareLazyLoaded() {
        if (!this.loaded && this.component) {
            this.loaded = true;
            const promise = (this.delegate)
                ? this.delegate.attachViewToDom(this.el, this.component)
                : attachViewToDom(this.el, this.component);
            return promise.then(() => asyncRaf());
        }
        return Promise.resolve();
    }
    showTab() {
        this.active = true;
        const nav = getNavAsChildIfExists(this.el);
        if (!nav) {
            return Promise.resolve();
        }
        // the tab's nav has been initialized externally
        return getIonApp().then((ionApp) => {
            const externalNavPromise = ionApp ? ionApp.getExternalNavPromise() : null;
            if (externalNavPromise) {
                return externalNavPromise.then(() => {
                    ionApp.setExternalNavPromise(null);
                });
            }
            // the tab's nav has not been initialized externally, so
            // check if we need to initiailize it
            return nav.componentOnReady()
                .then(() => nav.activateFromTab());
        });
    }
    hostData() {
        const hidden = !this.active || !this.selected;
        return {
            'aria-hidden': hidden,
            'aria-labelledby': this.btnId,
            'role': 'tabpanel',
            class: {
                'show-tab': this.active
            }
        };
    }
    render() {
        return h("slot", null);
    }
    static get is() { return "ion-tab"; }
    static get properties() { return { "active": { "type": Boolean, "attr": "active", "mutable": true }, "badge": { "type": String, "attr": "badge" }, "badgeStyle": { "type": String, "attr": "badge-style" }, "btnId": { "type": String, "attr": "btn-id" }, "component": { "type": "Any", "attr": "component" }, "delegate": { "type": "Any", "attr": "delegate" }, "disabled": { "type": Boolean, "attr": "disabled" }, "el": { "elementRef": true }, "getRouteId": { "method": true }, "icon": { "type": String, "attr": "icon" }, "init": { "state": true }, "name": { "type": String, "attr": "name" }, "selected": { "type": Boolean, "attr": "selected", "mutable": true, "watchCallbacks": ["selectedChanged"] }, "setActive": { "method": true }, "show": { "type": Boolean, "attr": "show" }, "tabsHideOnSubPages": { "type": Boolean, "attr": "tabs-hide-on-sub-pages" }, "title": { "type": String, "attr": "title" } }; }
    static get events() { return [{ "name": "ionSelect", "method": "ionSelect", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "ion-tab {\n  left: 0;\n  top: 0;\n  position: absolute;\n  z-index: -1;\n  display: none;\n  width: 100%;\n  height: 100%;\n  contain: layout size style;\n}\n\nion-tab.show-tab {\n  z-index: 0;\n  display: block;\n}"; }
}
function attachViewToDom(container, cmp) {
    const el = document.createElement(cmp);
    container.appendChild(el);
    if (el.componentOnReady) {
        return el.componentOnReady();
    }
    return Promise.resolve();
}

export { Tab as IonTab };
