/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

import { createThemedClasses } from './chunk2.js';

class ToolbarTitle {
    render() {
        const themedClasses = createThemedClasses(this.mode, this.color, 'toolbar-title');
        return [
            h("div", { class: themedClasses },
                h("slot", null))
        ];
    }
    static get is() { return "ion-title"; }
    static get host() { return { "theme": "title" }; }
    static get style() { return "ion-title {\n  display: flex;\n  flex: 1;\n  align-items: center;\n  transform: translateZ(0);\n}\n\n.toolbar-title {\n  display: block;\n  overflow: hidden;\n  width: 100%;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.toolbar-ios ion-title {\n  left: 0;\n  top: 0;\n  padding: 0 90px 1px;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  transform: translateZ(0);\n  pointer-events: none;\n}\n\n.toolbar-title-ios {\n  text-align: center;\n  font-size: 17px;\n  font-weight: 600;\n  color: var(--ion-toolbar-ios-text-color, var(--ion-toolbar-text-color, var(--ion-text-color, #000)));\n  pointer-events: auto;\n}\n\n.toolbar-primary .toolbar-title-ios {\n  color: var(--ion-color-ios-primary-contrast, var(--ion-color-primary-contrast, #fff));\n}\n\n.toolbar-secondary .toolbar-title-ios {\n  color: var(--ion-color-ios-secondary-contrast, var(--ion-color-secondary-contrast, #fff));\n}\n\n.toolbar-tertiary .toolbar-title-ios {\n  color: var(--ion-color-ios-tertiary-contrast, var(--ion-color-tertiary-contrast, #fff));\n}\n\n.toolbar-success .toolbar-title-ios {\n  color: var(--ion-color-ios-success-contrast, var(--ion-color-success-contrast, #fff));\n}\n\n.toolbar-warning .toolbar-title-ios {\n  color: var(--ion-color-ios-warning-contrast, var(--ion-color-warning-contrast, #000));\n}\n\n.toolbar-danger .toolbar-title-ios {\n  color: var(--ion-color-ios-danger-contrast, var(--ion-color-danger-contrast, #fff));\n}\n\n.toolbar-light .toolbar-title-ios {\n  color: var(--ion-color-ios-light-contrast, var(--ion-color-light-contrast, #000));\n}\n\n.toolbar-medium .toolbar-title-ios {\n  color: var(--ion-color-ios-medium-contrast, var(--ion-color-medium-contrast, #000));\n}\n\n.toolbar-dark .toolbar-title-ios {\n  color: var(--ion-color-ios-dark-contrast, var(--ion-color-dark-contrast, #fff));\n}"; }
    static get styleMode() { return "ios"; }
}

export { ToolbarTitle as IonTitle };
