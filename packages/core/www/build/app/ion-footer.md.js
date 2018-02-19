/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

import { createThemedClasses } from './chunk2.js';

class Footer {
    constructor() {
        /**
         * If true, the footer will be translucent.
         * Note: In order to scroll content behind the footer, the `fullscreen`
         * attribute needs to be set on the content.
         * Defaults to `false`.
         */
        this.translucent = false;
    }
    hostData() {
        const themedClasses = this.translucent ? createThemedClasses(this.mode, this.color, 'header-translucent') : {};
        const hostClasses = Object.assign({}, themedClasses);
        return {
            class: hostClasses
        };
    }
    render() {
        return h("slot", null);
    }
    static get is() { return "ion-footer"; }
    static get host() { return { "theme": "footer" }; }
    static get properties() { return { "translucent": { "type": Boolean, "attr": "translucent" } }; }
    static get style() { return "ion-footer {\n  position: relative;\n  z-index: 10;\n  display: block;\n  order: 1;\n  width: 100%;\n}"; }
    static get styleMode() { return "md"; }
}

export { Footer as IonFooter };
