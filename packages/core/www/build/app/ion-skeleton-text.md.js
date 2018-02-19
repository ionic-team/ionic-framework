/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

class SkeletonText {
    constructor() {
        this.width = '100%';
    }
    render() {
        return h("span", { style: { width: this.width } }, "\u00A0");
    }
    static get is() { return "ion-skeleton-text"; }
    static get host() { return { "theme": "skeleton-text" }; }
    static get properties() { return { "width": { "type": String, "attr": "width" } }; }
    static get style() { return "ion-skeleton-text {\n  display: inline-block;\n  width: 100%;\n  pointer-events: none;\n  user-select: none;\n}\n\nion-skeleton-text span {\n  display: inline-block;\n  font-size: 8px;\n}\n\n.skeleton-text-md span {\n  background-color: var(--ion-text-md-color, var(--ion-text-color, #000));\n  opacity: 0.1;\n}"; }
    static get styleMode() { return "md"; }
}

export { SkeletonText as IonSkeletonText };
