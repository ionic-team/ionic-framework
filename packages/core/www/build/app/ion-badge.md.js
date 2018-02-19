/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

import { createThemedClasses } from './chunk2.js';

class Badge {
    render() {
        return h("slot", null);
    }
    static get is() { return "ion-badge"; }
    static get host() { return { "theme": "badge" }; }
    static get properties() { return { "color": { "type": String, "attr": "color" }, "mode": { "type": "Any", "attr": "mode" } }; }
    static get style() { return "ion-badge {\n  padding: 3px 8px;\n  text-align: center;\n  display: inline-block;\n  min-width: 10px;\n  font-size: 13px;\n  font-weight: bold;\n  line-height: 1;\n  white-space: nowrap;\n  vertical-align: baseline;\n  font-smoothing: antialiased;\n  -webkit-font-smoothing: antialiased;\n  contain: content;\n}\n\nion-badge:empty {\n  display: none;\n}\n\n.badge-md {\n  border-radius: 4px;\n  font-family: \"Roboto\", \"Helvetica Neue\", sans-serif;\n  color: var(--ion-color-ios-primary-contrast, var(--ion-color-primary-contrast, #fff));\n  background-color: var(--ion-color-ios-primary, var(--ion-color-primary, #488aff));\n}\n\n.badge-md-primary {\n  color: var(--ion-color-md-primary-contrast, var(--ion-color-primary-contrast, #fff));\n  background-color: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n}\n\n.badge-md-secondary {\n  color: var(--ion-color-md-secondary-contrast, var(--ion-color-secondary-contrast, #fff));\n  background-color: var(--ion-color-md-secondary, var(--ion-color-secondary, #32db64));\n}\n\n.badge-md-tertiary {\n  color: var(--ion-color-md-tertiary-contrast, var(--ion-color-tertiary-contrast, #fff));\n  background-color: var(--ion-color-md-tertiary, var(--ion-color-tertiary, #f4a942));\n}\n\n.badge-md-success {\n  color: var(--ion-color-md-success-contrast, var(--ion-color-success-contrast, #fff));\n  background-color: var(--ion-color-md-success, var(--ion-color-success, #10dc60));\n}\n\n.badge-md-warning {\n  color: var(--ion-color-md-warning-contrast, var(--ion-color-warning-contrast, #000));\n  background-color: var(--ion-color-md-warning, var(--ion-color-warning, #ffce00));\n}\n\n.badge-md-danger {\n  color: var(--ion-color-md-danger-contrast, var(--ion-color-danger-contrast, #fff));\n  background-color: var(--ion-color-md-danger, var(--ion-color-danger, #f53d3d));\n}\n\n.badge-md-light {\n  color: var(--ion-color-md-light-contrast, var(--ion-color-light-contrast, #000));\n  background-color: var(--ion-color-md-light, var(--ion-color-light, #f4f4f4));\n}\n\n.badge-md-medium {\n  color: var(--ion-color-md-medium-contrast, var(--ion-color-medium-contrast, #000));\n  background-color: var(--ion-color-md-medium, var(--ion-color-medium, #989aa2));\n}\n\n.badge-md-dark {\n  color: var(--ion-color-md-dark-contrast, var(--ion-color-dark-contrast, #fff));\n  background-color: var(--ion-color-md-dark, var(--ion-color-dark, #222));\n}"; }
    static get styleMode() { return "md"; }
}

class TabButton {
    constructor() {
        this.keyFocus = false;
        this.selected = false;
    }
    componentDidLoad() {
        this.ionTabButtonDidLoad.emit();
    }
    componentDidUnload() {
        this.ionTabButtonDidUnload.emit();
    }
    onClick(ev) {
        this.ionTabbarClick.emit(this.tab);
        ev.stopPropagation();
    }
    onKeyUp() {
        this.keyFocus = true;
    }
    onBlur() {
        this.keyFocus = false;
    }
    hostData() {
        const selected = this.selected;
        const tab = this.tab;
        const hasTitle = !!tab.title;
        const hasIcon = !!tab.icon;
        const hasTitleOnly = (hasTitle && !hasIcon);
        const hasIconOnly = (hasIcon && !hasTitle);
        const hasBadge = !!tab.badge;
        return {
            'role': 'tab',
            'id': tab.btnId,
            'aria-selected': selected,
            class: {
                'tab-selected': selected,
                'has-title': hasTitle,
                'has-icon': hasIcon,
                'has-title-only': hasTitleOnly,
                'has-icon-only': hasIconOnly,
                'has-badge': hasBadge,
                'tab-disabled': tab.disabled,
                'tab-hidden': tab.hidden,
                'focused': this.keyFocus
            }
        };
    }
    render() {
        const tab = this.tab;
        return [
            h("button", { type: 'button', class: 'tab-cover', onKeyUp: this.onKeyUp.bind(this), onBlur: this.onBlur.bind(this), disabled: tab.disabled },
                tab.icon && h("ion-icon", { class: 'tab-button-icon', name: tab.icon }),
                tab.title && h("span", { class: 'tab-button-text' }, tab.title),
                tab.badge && h("ion-badge", { class: 'tab-badge', color: tab.badgeStyle }, tab.badge),
                this.mode === 'md' && h("ion-ripple-effect", null))
        ];
    }
    static get is() { return "ion-tab-button"; }
    static get properties() { return { "el": { "elementRef": true }, "keyFocus": { "state": true }, "selected": { "type": Boolean, "attr": "selected" }, "tab": { "type": "Any", "attr": "tab" } }; }
    static get events() { return [{ "name": "ionTabbarClick", "method": "ionTabbarClick", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionTabButtonDidLoad", "method": "ionTabButtonDidLoad", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionTabButtonDidUnload", "method": "ionTabButtonDidUnload", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "ion-tab-button {\n  margin: 0;\n  text-align: center;\n  border-radius: 0;\n  box-sizing: border-box;\n  position: relative;\n  z-index: 0;\n  display: block;\n  overflow: hidden;\n  flex: 1;\n  height: 100%;\n  border: 0;\n  text-decoration: none;\n  background: none;\n  user-select: none;\n}\n\n.tab-cover {\n  margin: 0;\n  padding: 0;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: space-between;\n  width: 100%;\n  height: 100%;\n  border: 0;\n  color: inherit;\n  background: transparent;\n  cursor: pointer;\n}\n\n.tab-cover:active, .tab-cover:focus {\n  outline: none;\n}\n\n.tab-disabled {\n  pointer-events: none;\n}\n\n.tab-disabled > .tab-cover {\n  opacity: .4;\n}\n\n.tab-button-text,\n.tab-button-icon {\n  display: none;\n  overflow: hidden;\n  align-self: center;\n  min-width: 26px;\n  max-width: 100%;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.has-icon .tab-button-icon,\n.has-title .tab-button-text {\n  display: block;\n}\n\n.has-title-only .tab-button-text {\n  white-space: normal;\n}\n\n.layout-icon-start .tab-button {\n  flex-direction: row;\n}\n\n.layout-icon-end .tab-button {\n  flex-direction: row-reverse;\n}\n\n.layout-icon-bottom .tab-button {\n  flex-direction: column-reverse;\n}\n\n.layout-icon-start .tab-button,\n.layout-icon-end .tab-button,\n.layout-icon-hide .tab-button,\n.layout-title-hide .tab-button {\n  justify-content: center;\n}\n\n.tab-hidden,\n.layout-icon-hide .tab-button-icon,\n.layout-title-hide .tab-button-text {\n  display: none;\n}\n\n.tab-badge {\n  right: 4%;\n  top: 6%;\n  right: calc(50% - 50px);\n  padding: 1px 6px;\n  position: absolute;\n  height: auto;\n  font-size: 12px;\n  line-height: 16px;\n}\n\n.has-icon .tab-badge {\n  right: calc(50% - 30px);\n}\n\n.layout-icon-bottom .tab-badge,\n.layout-icon-start .tab-badge,\n.layout-icon-end .tab-badge {\n  right: calc(50% - 50px);\n}\n\n.tab-button-md {\n  max-width: 168px;\n  font-weight: normal;\n  color: var(--ion-tabbar-md-text-color, var(--ion-text-md-color-step-400, var(--ion-text-color-step-400, #666666)));\n  fill: var(--ion-tabbar-md-text-color, var(--ion-text-md-color-step-400, var(--ion-text-color-step-400, #666666)));\n}\n\n.tab-button-md.focused {\n  background: var(--ion-tabbar-ios-background-color-focused, var(--ion-tabbar-background-color-focused, #dadada));\n}\n\n.tab-button-md .tab-cover {\n  padding: 8px 12px 10px 12px;\n  display: flex;\n}\n\n.scrollable .tab-button-md {\n  overflow: hidden;\n  flex: 1 0 auto;\n}\n\n.tab-button-md.tab-selected {\n  color: var(--ion-tabbar-md-text-color-active, var(--ion-tabbar-text-color-active, #488aff));\n  fill: var(--ion-tabbar-md-text-color-active, var(--ion-tabbar-text-color-active, #488aff));\n}\n\n.placement-top .tab-button-md.tab-selected .tab-button-icon,\n.placement-top .tab-button-md.tab-selected .tab-button-text {\n  transform: inherit;\n}\n\n.tab-button-md .tab-button-text {\n  margin: 0;\n  transform-origin: center bottom;\n  font-size: 12px;\n  text-transform: none;\n  transition: transform 0.3s ease-in-out;\n}\n\n.tab-button-md.tab-selected .tab-button-text {\n  transform: scale3d(1.16667, 1.16667, 1);\n  transition: transform 0.3s ease-in-out;\n}\n\n.layout-icon-top .tab-button-md .has-icon .tab-button-text {\n  margin-bottom: -2px;\n}\n\n.layout-icon-bottom .tab-button-md .tab-button-text {\n  transform-origin: center top;\n  margin-top: -2px;\n}\n\n.tab-button-md .tab-button-icon {\n  transform-origin: center center;\n  width: 24px;\n  height: 24px;\n  font-size: 24px;\n  transition: transform 0.3s ease-in-out;\n}\n\n.tab-button-md.tab-selected .tab-button-icon {\n  transform: translate3d(0,  -2px,  0);\n}\n\n.layout-icon-end .tab-button-md.tab-selected .tab-button-icon {\n  transform: translate3d(2px,  0,  0);\n}\n\n.layout-icon-bottom .tab-button-md.tab-selected .tab-button-icon {\n  transform: translate3d(0,  2px,  0);\n}\n\n.layout-icon-start .tab-button-md.tab-selected .tab-button-icon {\n  transform: translate3d(-2px,  0,  0);\n}\n\n.layout-icon-hide .tab-button-md,\n.layout-title-hide .tab-button-md,\n.tab-button-md.icon-only,\n.tab-button-md.has-title-only {\n  justify-content: center;\n}"; }
    static get styleMode() { return "md"; }
}

class Tabbar {
    constructor() {
        this.canScrollLeft = false;
        this.canScrollRight = false;
        this.hidden = false;
        this.placement = 'bottom';
        this.layout = 'icon-top';
        this.highlight = false;
        /**
         * If true, the tabbar will be translucent. Defaults to `false`.
         */
        this.translucent = false;
    }
    selectedTabChanged() {
        this.scrollable && this.scrollToSelectedButton();
        this.highlight && this.updateHighlight();
    }
    onKeyboardWillHide() {
        setTimeout(() => this.hidden = false, 50);
    }
    onKeyboardWillShow() {
        if (this.placement === 'bottom') {
            this.hidden = true;
        }
    }
    onResize() {
        this.highlight && this.updateHighlight();
    }
    onTabButtonLoad() {
        this.scrollable && this.updateBoundaries();
        this.highlight && this.updateHighlight();
    }
    analyzeTabs() {
        const tabs = Array.from(document.querySelectorAll('ion-tab-button'));
        const scrollLeft = this.scrollEl.scrollLeft;
        const tabsWidth = this.scrollEl.clientWidth;
        let previous;
        let next;
        tabs.forEach((tab) => {
            const left = tab.offsetLeft;
            const right = left + tab.offsetWidth;
            if (left < scrollLeft) {
                previous = { tab, amount: left };
            }
            if (!next && right > (tabsWidth + scrollLeft)) {
                const amount = right - tabsWidth;
                next = { tab, amount };
            }
        });
        return { previous, next };
    }
    getSelectedButton() {
        return Array.from(this.el.querySelectorAll('ion-tab-button'))
            .find(btn => btn.selected);
    }
    scrollToSelectedButton() {
        this.dom.read(() => {
            const activeTabButton = this.getSelectedButton();
            if (activeTabButton) {
                const scrollLeft = this.scrollEl.scrollLeft, tabsWidth = this.scrollEl.clientWidth, left = activeTabButton.offsetLeft, right = left + activeTabButton.offsetWidth;
                let amount;
                if (right > (tabsWidth + scrollLeft)) {
                    amount = right - tabsWidth;
                }
                else if (left < scrollLeft) {
                    amount = left;
                }
                if (amount !== undefined) {
                    this.scrollEl.scrollToPoint(amount, 0, 250).then(() => {
                        this.updateBoundaries();
                    });
                }
            }
        });
    }
    scrollByTab(direction) {
        this.dom.read(() => {
            const { previous, next } = this.analyzeTabs(), info = direction === 'right' ? next : previous, amount = info && info.amount;
            if (info) {
                this.scrollEl.scrollToPoint(amount, 0, 250).then(() => {
                    this.updateBoundaries();
                });
            }
        });
    }
    updateBoundaries() {
        this.canScrollLeft = this.scrollEl.scrollLeft !== 0;
        this.canScrollRight = this.scrollEl.scrollLeft < (this.scrollEl.scrollWidth - this.scrollEl.offsetWidth);
    }
    updateHighlight() {
        if (!this.highlight) {
            return;
        }
        this.dom.read(() => {
            const btn = this.getSelectedButton();
            const highlight = this.el.querySelector('div.tabbar-highlight');
            if (btn && highlight) {
                highlight.style.transform = `translate3d(${btn.offsetLeft}px,0,0) scaleX(${btn.offsetWidth})`;
            }
        });
    }
    hostData() {
        const themedClasses = this.translucent ? createThemedClasses(this.mode, this.color, 'tabbar-translucent') : {};
        return {
            role: 'tablist',
            class: Object.assign({}, themedClasses, { [`layout-${this.layout}`]: true, [`placement-${this.placement}`]: true, 'tabbar-hidden': this.hidden, 'scrollable': this.scrollable })
        };
    }
    render() {
        const selectedTab = this.selectedTab;
        const ionTabbarHighlight = this.highlight ? h("div", { class: 'animated tabbar-highlight' }) : null;
        const buttonClasses = createThemedClasses(this.mode, this.color, 'tab-button');
        const tabButtons = this.tabs.map(tab => h("ion-tab-button", { class: buttonClasses, tab: tab, selected: selectedTab === tab }));
        if (this.scrollable) {
            return [
                h("ion-button", { onClick: () => this.scrollByTab('left'), fill: 'clear', class: { inactive: !this.canScrollLeft } },
                    h("ion-icon", { name: 'arrow-dropleft' })),
                h("ion-scroll", { ref: (scrollEl) => this.scrollEl = scrollEl },
                    tabButtons,
                    ionTabbarHighlight),
                h("ion-button", { onClick: () => this.scrollByTab('right'), fill: 'clear', class: { inactive: !this.canScrollRight } },
                    h("ion-icon", { name: 'arrow-dropright' }))
            ];
        }
        else {
            return [
                ...tabButtons,
                ionTabbarHighlight
            ];
        }
    }
    static get is() { return "ion-tabbar"; }
    static get host() { return { "theme": "tabbar" }; }
    static get properties() { return { "canScrollLeft": { "state": true }, "canScrollRight": { "state": true }, "dom": { "context": "dom" }, "el": { "elementRef": true }, "hidden": { "state": true }, "highlight": { "type": Boolean, "attr": "highlight" }, "layout": { "type": String, "attr": "layout" }, "placement": { "type": String, "attr": "placement" }, "scrollable": { "type": "Any", "attr": "scrollable" }, "selectedTab": { "type": "Any", "attr": "selected-tab", "watchCallbacks": ["selectedTabChanged"] }, "tabs": { "type": "Any", "attr": "tabs" }, "translucent": { "type": Boolean, "attr": "translucent" } }; }
    static get style() { return "ion-tabbar {\n  position: relative;\n  z-index: 10;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  order: 1;\n  width: 100%;\n}\n\nion-tabbar.tabbar-hidden {\n  display: none;\n}\n\nion-tabbar.placement-top {\n  order: -1;\n}\n\n.tabbar-highlight {\n  left: 0;\n  bottom: 0;\n  transform-origin: 0 0;\n  position: absolute;\n  display: block;\n  width: 1px;\n  height: 2px;\n  transform: translateZ(0);\n}\n\n.tabbar-highlight.animated {\n  transition-duration: 300ms;\n  transition-property: transform;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  will-change: transform;\n}\n\n.placement-top .tabbar-highlight {\n  bottom: 0;\n}\n\n.placement-bottom .tabbar-highlight {\n  top: 0;\n}\n\nion-tabbar.scrollable ion-scroll {\n  overflow: hidden;\n}\n\nion-tabbar.scrollable .scroll-inner {\n  position: relative;\n  display: flex;\n  flex-direction: row;\n}\n\nion-tabbar.scrollable ion-button.inactive {\n  visibility: hidden;\n}\n\n.tabbar-md {\n  height: 56px;\n  border-top: 1px solid var(--ion-tabbar-md-border-color, var(--ion-tabbar-border-color, rgba(0, 0, 0, 0.07)));\n  background: var(--ion-tabbar-md-background-color, var(--ion-tabbar-background-color, #f8f8f8));\n  contain: strict;\n}\n\n.tabbar-md .tabbar-highlight {\n  background: var(--ion-tabbar-md-text-color-active, var(--ion-tabbar-text-color-active, #488aff));\n}\n\n.tabbar-md.scrollable ion-scroll {\n  margin: 0 8px;\n  max-width: 650px;\n}\n\n.tabbar-md-primary {\n  color: var(--ion-color-md-primary-contrast, var(--ion-color-primary-contrast, #fff));\n  background-color: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n  fill: var(--ion-color-md-primary-contrast, var(--ion-color-primary-contrast, #fff));\n}\n\n.tabbar-md-primary .tab-button.focused {\n  background: var(--ion-color-ios-primary-shade, var(--ion-color-primary-shade, #3f79e0));\n}\n\n.enable-hover .tabbar-md-primary .tab-button:hover,\n.tabbar-md-primary .tab-button.tab-selected {\n  color: var(--ion-color-md-primary-contrast, var(--ion-color-primary-contrast, #fff));\n  fill: var(--ion-color-md-primary-contrast, var(--ion-color-primary-contrast, #fff));\n}\n\n.tabbar-md-primary .tabbar-highlight {\n  background: var(--ion-color-md-primary-contrast, var(--ion-color-primary-contrast, #fff));\n}\n\n.tabbar-md-secondary {\n  color: var(--ion-color-md-secondary-contrast, var(--ion-color-secondary-contrast, #fff));\n  background-color: var(--ion-color-md-secondary, var(--ion-color-secondary, #32db64));\n  fill: var(--ion-color-md-secondary-contrast, var(--ion-color-secondary-contrast, #fff));\n}\n\n.tabbar-md-secondary .tab-button.focused {\n  background: var(--ion-color-ios-secondary-shade, var(--ion-color-secondary-shade, #2cc158));\n}\n\n.enable-hover .tabbar-md-secondary .tab-button:hover,\n.tabbar-md-secondary .tab-button.tab-selected {\n  color: var(--ion-color-md-secondary-contrast, var(--ion-color-secondary-contrast, #fff));\n  fill: var(--ion-color-md-secondary-contrast, var(--ion-color-secondary-contrast, #fff));\n}\n\n.tabbar-md-secondary .tabbar-highlight {\n  background: var(--ion-color-md-secondary-contrast, var(--ion-color-secondary-contrast, #fff));\n}\n\n.tabbar-md-tertiary {\n  color: var(--ion-color-md-tertiary-contrast, var(--ion-color-tertiary-contrast, #fff));\n  background-color: var(--ion-color-md-tertiary, var(--ion-color-tertiary, #f4a942));\n  fill: var(--ion-color-md-tertiary-contrast, var(--ion-color-tertiary-contrast, #fff));\n}\n\n.tabbar-md-tertiary .tab-button.focused {\n  background: var(--ion-color-ios-tertiary-shade, var(--ion-color-tertiary-shade, #d7953a));\n}\n\n.enable-hover .tabbar-md-tertiary .tab-button:hover,\n.tabbar-md-tertiary .tab-button.tab-selected {\n  color: var(--ion-color-md-tertiary-contrast, var(--ion-color-tertiary-contrast, #fff));\n  fill: var(--ion-color-md-tertiary-contrast, var(--ion-color-tertiary-contrast, #fff));\n}\n\n.tabbar-md-tertiary .tabbar-highlight {\n  background: var(--ion-color-md-tertiary-contrast, var(--ion-color-tertiary-contrast, #fff));\n}\n\n.tabbar-md-success {\n  color: var(--ion-color-md-success-contrast, var(--ion-color-success-contrast, #fff));\n  background-color: var(--ion-color-md-success, var(--ion-color-success, #10dc60));\n  fill: var(--ion-color-md-success-contrast, var(--ion-color-success-contrast, #fff));\n}\n\n.tabbar-md-success .tab-button.focused {\n  background: var(--ion-color-ios-success-shade, var(--ion-color-success-shade, #0ec254));\n}\n\n.enable-hover .tabbar-md-success .tab-button:hover,\n.tabbar-md-success .tab-button.tab-selected {\n  color: var(--ion-color-md-success-contrast, var(--ion-color-success-contrast, #fff));\n  fill: var(--ion-color-md-success-contrast, var(--ion-color-success-contrast, #fff));\n}\n\n.tabbar-md-success .tabbar-highlight {\n  background: var(--ion-color-md-success-contrast, var(--ion-color-success-contrast, #fff));\n}\n\n.tabbar-md-warning {\n  color: var(--ion-color-md-warning-contrast, var(--ion-color-warning-contrast, #000));\n  background-color: var(--ion-color-md-warning, var(--ion-color-warning, #ffce00));\n  fill: var(--ion-color-md-warning-contrast, var(--ion-color-warning-contrast, #000));\n}\n\n.tabbar-md-warning .tab-button.focused {\n  background: var(--ion-color-ios-warning-shade, var(--ion-color-warning-shade, #e0b500));\n}\n\n.enable-hover .tabbar-md-warning .tab-button:hover,\n.tabbar-md-warning .tab-button.tab-selected {\n  color: var(--ion-color-md-warning-contrast, var(--ion-color-warning-contrast, #000));\n  fill: var(--ion-color-md-warning-contrast, var(--ion-color-warning-contrast, #000));\n}\n\n.tabbar-md-warning .tabbar-highlight {\n  background: var(--ion-color-md-warning-contrast, var(--ion-color-warning-contrast, #000));\n}\n\n.tabbar-md-danger {\n  color: var(--ion-color-md-danger-contrast, var(--ion-color-danger-contrast, #fff));\n  background-color: var(--ion-color-md-danger, var(--ion-color-danger, #f53d3d));\n  fill: var(--ion-color-md-danger-contrast, var(--ion-color-danger-contrast, #fff));\n}\n\n.tabbar-md-danger .tab-button.focused {\n  background: var(--ion-color-ios-danger-shade, var(--ion-color-danger-shade, #d83636));\n}\n\n.enable-hover .tabbar-md-danger .tab-button:hover,\n.tabbar-md-danger .tab-button.tab-selected {\n  color: var(--ion-color-md-danger-contrast, var(--ion-color-danger-contrast, #fff));\n  fill: var(--ion-color-md-danger-contrast, var(--ion-color-danger-contrast, #fff));\n}\n\n.tabbar-md-danger .tabbar-highlight {\n  background: var(--ion-color-md-danger-contrast, var(--ion-color-danger-contrast, #fff));\n}\n\n.tabbar-md-light {\n  color: var(--ion-color-md-light-contrast, var(--ion-color-light-contrast, #000));\n  background-color: var(--ion-color-md-light, var(--ion-color-light, #f4f4f4));\n  fill: var(--ion-color-md-light-contrast, var(--ion-color-light-contrast, #000));\n}\n\n.tabbar-md-light .tab-button.focused {\n  background: var(--ion-color-ios-light-shade, var(--ion-color-light-shade, #d7d7d7));\n}\n\n.enable-hover .tabbar-md-light .tab-button:hover,\n.tabbar-md-light .tab-button.tab-selected {\n  color: var(--ion-color-md-light-contrast, var(--ion-color-light-contrast, #000));\n  fill: var(--ion-color-md-light-contrast, var(--ion-color-light-contrast, #000));\n}\n\n.tabbar-md-light .tabbar-highlight {\n  background: var(--ion-color-md-light-contrast, var(--ion-color-light-contrast, #000));\n}\n\n.tabbar-md-medium {\n  color: var(--ion-color-md-medium-contrast, var(--ion-color-medium-contrast, #000));\n  background-color: var(--ion-color-md-medium, var(--ion-color-medium, #989aa2));\n  fill: var(--ion-color-md-medium-contrast, var(--ion-color-medium-contrast, #000));\n}\n\n.tabbar-md-medium .tab-button.focused {\n  background: var(--ion-color-ios-medium-shade, var(--ion-color-medium-shade, #86888f));\n}\n\n.enable-hover .tabbar-md-medium .tab-button:hover,\n.tabbar-md-medium .tab-button.tab-selected {\n  color: var(--ion-color-md-medium-contrast, var(--ion-color-medium-contrast, #000));\n  fill: var(--ion-color-md-medium-contrast, var(--ion-color-medium-contrast, #000));\n}\n\n.tabbar-md-medium .tabbar-highlight {\n  background: var(--ion-color-md-medium-contrast, var(--ion-color-medium-contrast, #000));\n}\n\n.tabbar-md-dark {\n  color: var(--ion-color-md-dark-contrast, var(--ion-color-dark-contrast, #fff));\n  background-color: var(--ion-color-md-dark, var(--ion-color-dark, #222));\n  fill: var(--ion-color-md-dark-contrast, var(--ion-color-dark-contrast, #fff));\n}\n\n.tabbar-md-dark .tab-button.focused {\n  background: var(--ion-color-ios-dark-shade, var(--ion-color-dark-shade, #1e1e1e));\n}\n\n.enable-hover .tabbar-md-dark .tab-button:hover,\n.tabbar-md-dark .tab-button.tab-selected {\n  color: var(--ion-color-md-dark-contrast, var(--ion-color-dark-contrast, #fff));\n  fill: var(--ion-color-md-dark-contrast, var(--ion-color-dark-contrast, #fff));\n}\n\n.tabbar-md-dark .tabbar-highlight {\n  background: var(--ion-color-md-dark-contrast, var(--ion-color-dark-contrast, #fff));\n}"; }
    static get styleMode() { return "md"; }
}

export { Badge as IonBadge, TabButton as IonTabButton, Tabbar as IonTabbar };
