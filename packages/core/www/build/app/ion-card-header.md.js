/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

import { createThemedClasses } from './chunk2.js';

class CardHeader {
    constructor() {
        /**
         * If true, the card header will be translucent. Defaults to `false`.
         */
        this.translucent = false;
    }
    hostData() {
        const themedClasses = this.translucent ? createThemedClasses(this.mode, this.color, 'card-header-translucent') : {};
        const hostClasses = Object.assign({}, themedClasses);
        return {
            class: hostClasses
        };
    }
    render() {
        return h("slot", null);
    }
    static get is() { return "ion-card-header"; }
    static get host() { return { "theme": "card-header" }; }
    static get properties() { return { "color": { "type": String, "attr": "color" }, "mode": { "type": "Any", "attr": "mode" }, "translucent": { "type": Boolean, "attr": "translucent" } }; }
    static get style() { return "ion-card-header {\n  position: relative;\n  display: block;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.card-header-md {\n  padding: 16px;\n}"; }
    static get styleMode() { return "md"; }
}

export { CardHeader as IonCardHeader };
