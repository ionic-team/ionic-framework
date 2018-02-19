/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

import { getIonApp } from './chunk1.js';

class Tabs {
    constructor() {
        this.ids = -1;
        this.transitioning = false;
        this.tabsId = (++tabIds);
        this.initialized = false;
        this.tabs = [];
        /**
         * If true, the tabbar
         */
        this.tabbarHidden = false;
        /**
         * If true, the tabs will be translucent.
         * Note: In order to scroll content behind the tabs, the `fullscreen`
         * attribute needs to be set on the content.
         * Defaults to `false`.
         */
        this.translucent = false;
        this.scrollable = false;
    }
    componentDidLoad() {
        this.loadConfig('tabsPlacement', 'bottom');
        this.loadConfig('tabsLayout', 'icon-top');
        this.loadConfig('tabsHighlight', true);
        const promises = [];
        promises.push(this.initTabs());
        promises.push(getIonApp());
        return Promise.all(promises).then(([_, ionApp]) => {
            if (ionApp) {
                return ionApp.getExternalNavOccuring();
            }
            return false;
        }).then((externalNavOccuring) => {
            if (!externalNavOccuring) {
                return this.initSelect();
            }
            return null;
        }).then(() => {
            this.initialized = true;
        });
    }
    componentDidUnload() {
        this.tabs.length = 0;
        this.selectedTab = undefined;
    }
    tabChange(ev) {
        const selectedTab = ev.detail;
        this.select(selectedTab);
    }
    /**
     * @param {number|Tab} tabOrIndex Index, or the Tab instance, of the tab to select.
     */
    select(tabOrIndex) {
        if (this.transitioning) {
            return Promise.resolve(false);
        }
        const selectedTab = (typeof tabOrIndex === 'number' ? this.getByIndex(tabOrIndex) : tabOrIndex);
        if (!selectedTab) {
            return Promise.resolve(false);
        }
        // Reset rest of tabs
        for (const tab of this.tabs) {
            if (selectedTab !== tab) {
                tab.selected = false;
            }
        }
        const leavingTab = this.selectedTab;
        this.transitioning = true;
        return selectedTab.setActive().then(() => {
            this.transitioning = false;
            selectedTab.selected = true;
            if (leavingTab !== selectedTab) {
                if (leavingTab) {
                    leavingTab.active = false;
                }
                this.selectedTab = selectedTab;
                this.ionChange.emit(selectedTab);
                this.ionNavChanged.emit({ isPop: false });
                return true;
            }
            return false;
        });
    }
    /**
     * @param {number} index Index of the tab you want to get
     * @returns {HTMLIonTabElement} Returns the tab who's index matches the one passed
     */
    getByIndex(index) {
        return this.tabs[index];
    }
    /**
     * @return {HTMLIonTabElement} Returns the currently selected tab
     */
    getSelected() {
        return this.selectedTab;
    }
    getIndex(tab) {
        return this.tabs.indexOf(tab);
    }
    getTabs() {
        return this.tabs;
    }
    setRouteId(id) {
        if (this.selectedTab && this.selectedTab.getRouteId() === id) {
            return Promise.resolve(false);
        }
        const tab = this.tabs.find(t => id === t.getRouteId());
        return this.select(tab).then(() => true);
    }
    getRouteId() {
        if (this.selectedTab) {
            return this.selectedTab.getRouteId();
        }
        return null;
    }
    getContentElement() {
        return this.selectedTab;
    }
    initTabs() {
        const tabs = this.tabs = Array.from(this.el.querySelectorAll('ion-tab'));
        const tabPromises = tabs.map(tab => {
            const id = `t-${this.tabsId}-${++this.ids}`;
            tab.btnId = 'tab-' + id;
            tab.id = 'tabpanel-' + id;
            return tab.componentOnReady();
        });
        return Promise.all(tabPromises);
    }
    initSelect() {
        if (document.querySelector('ion-router')) {
            return Promise.resolve();
        }
        // find pre-selected tabs
        const selectedTab = this.tabs.find(t => t.selected) ||
            this.tabs.find(t => t.show && !t.disabled);
        // reset all tabs none is selected
        for (const tab of this.tabs) {
            if (tab !== selectedTab) {
                tab.selected = false;
            }
        }
        const promise = selectedTab ? selectedTab.setActive() : Promise.resolve();
        return promise.then(() => {
            this.selectedTab = selectedTab;
            if (selectedTab) {
                selectedTab.selected = true;
                selectedTab.active = true;
            }
        });
    }
    loadConfig(attrKey, fallback) {
        const val = this[attrKey];
        if (typeof val === 'undefined') {
            this[attrKey] = this.config.get(attrKey, fallback);
        }
    }
    render() {
        const dom = [
            h("div", { class: 'tabs-inner' },
                h("slot", null))
        ];
        if (!this.tabbarHidden) {
            dom.push(h("ion-tabbar", { tabs: this.tabs, color: this.color, selectedTab: this.selectedTab, highlight: this.tabbarHighlight, placement: this.tabbarPlacement, layout: this.tabbarLayout, translucent: this.translucent, scrollable: this.scrollable }));
        }
        return dom;
    }
    static get is() { return "ion-tabs"; }
    static get properties() { return { "color": { "type": String, "attr": "color" }, "config": { "context": "config" }, "el": { "elementRef": true }, "getByIndex": { "method": true }, "getContentElement": { "method": true }, "getIndex": { "method": true }, "getRouteId": { "method": true }, "getSelected": { "method": true }, "getTabs": { "method": true }, "name": { "type": String, "attr": "name" }, "scrollable": { "type": Boolean, "attr": "scrollable" }, "select": { "method": true }, "selectedTab": { "state": true }, "setRouteId": { "method": true }, "tabbarHidden": { "type": Boolean, "attr": "tabbar-hidden" }, "tabbarHighlight": { "type": Boolean, "attr": "tabbar-highlight", "mutable": true }, "tabbarLayout": { "type": String, "attr": "tabbar-layout", "mutable": true }, "tabbarPlacement": { "type": String, "attr": "tabbar-placement", "mutable": true }, "tabs": { "state": true }, "translucent": { "type": Boolean, "attr": "translucent" } }; }
    static get events() { return [{ "name": "ionChange", "method": "ionChange", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionNavChanged", "method": "ionNavChanged", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "ion-tabs {\n  top: 0;\n  position: absolute;\n  z-index: 0;\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  height: 100%;\n  contain: layout size style;\n}\n\n.tabs-inner {\n  position: relative;\n  flex: 1;\n  contain: layout size style;\n}"; }
}
let tabIds = -1;

export { Tabs as IonTabs };
