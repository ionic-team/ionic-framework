/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

class FabList {
    constructor() {
        this.activated = false;
    }
    activatedChanged(activated) {
        const fabs = this.el.querySelectorAll('ion-fab-button');
        // if showing the fabs add a timeout, else show immediately
        const timeout = activated ? 30 : 0;
        for (let i = 0; i < fabs.length; i++) {
            const fab = fabs[i];
            setTimeout(() => fab.show = activated, i * timeout);
        }
    }
    hostData() {
        return {
            class: {
                'fab-list-active': this.activated
            }
        };
    }
    render() {
        return (h("slot", null));
    }
    static get is() { return "ion-fab-list"; }
    static get properties() { return { "activated": { "type": Boolean, "attr": "activated", "watchCallbacks": ["activatedChanged"] }, "el": { "elementRef": true } }; }
    static get style() { return "ion-fab-list {\n  margin: 66px 0;\n  position: absolute;\n  top: 0;\n  display: none;\n  flex-direction: column;\n  align-items: center;\n  min-width: 56px;\n  min-height: 56px;\n}\n\n.fab-list-active {\n  display: flex;\n}\n\n.fab-button-in-list {\n  margin: 8px 0;\n  width: 40px;\n  height: 40px;\n  opacity: 0;\n  visibility: hidden;\n  transform: scale(0);\n}\n\n.fab-button-in-list.fab-button-show {\n  opacity: 1;\n  visibility: visible;\n  transform: scale(1);\n}\n\nion-fab-list[side=left] .fab-button-in-list,\nion-fab-list[side=right] .fab-button-in-list {\n  margin: 0 8px;\n}\n\nion-fab-list[side=top] {\n  top: auto;\n  bottom: 0;\n  flex-direction: column-reverse;\n}\n\nion-fab-list[side=left] {\n  margin: 0 66px;\n  right: 0;\n  flex-direction: row-reverse;\n}\n\nion-fab-list[side=right] {\n  margin: 0 66px;\n  left: 0;\n  flex-direction: row;\n}"; }
}

export { FabList as IonFabList };
