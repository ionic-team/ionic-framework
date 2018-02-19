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
    static get style() { return "ion-title {\n  display: flex;\n  flex: 1;\n  align-items: center;\n  transform: translateZ(0);\n}\n\n.toolbar-title {\n  display: block;\n  overflow: hidden;\n  width: 100%;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.toolbar-title-md {\n  padding: 0 12px;\n  font-size: 20px;\n  font-weight: 500;\n  color: var(--ion-toolbar-md-text-color, var(--ion-toolbar-text-color, #424242));\n}\n\n.toolbar-primary .toolbar-title-md {\n  color: var(--ion-color-md-primary-contrast, var(--ion-color-primary-contrast, #fff));\n}\n\n.toolbar-secondary .toolbar-title-md {\n  color: var(--ion-color-md-secondary-contrast, var(--ion-color-secondary-contrast, #fff));\n}\n\n.toolbar-tertiary .toolbar-title-md {\n  color: var(--ion-color-md-tertiary-contrast, var(--ion-color-tertiary-contrast, #fff));\n}\n\n.toolbar-success .toolbar-title-md {\n  color: var(--ion-color-md-success-contrast, var(--ion-color-success-contrast, #fff));\n}\n\n.toolbar-warning .toolbar-title-md {\n  color: var(--ion-color-md-warning-contrast, var(--ion-color-warning-contrast, #000));\n}\n\n.toolbar-danger .toolbar-title-md {\n  color: var(--ion-color-md-danger-contrast, var(--ion-color-danger-contrast, #fff));\n}\n\n.toolbar-light .toolbar-title-md {\n  color: var(--ion-color-md-light-contrast, var(--ion-color-light-contrast, #000));\n}\n\n.toolbar-medium .toolbar-title-md {\n  color: var(--ion-color-md-medium-contrast, var(--ion-color-medium-contrast, #000));\n}\n\n.toolbar-dark .toolbar-title-md {\n  color: var(--ion-color-md-dark-contrast, var(--ion-color-dark-contrast, #fff));\n}"; }
    static get styleMode() { return "md"; }
}

export { ToolbarTitle as IonTitle };
