/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

class Fab {
    constructor() {
        this.activated = false;
        this.toggleActive = () => {
            this.activated = !this.activated;
        };
    }
    /**
     * Close an active FAB list container
     */
    close() {
        this.activated = false;
    }
    render() {
        const fab = this.el.querySelector('ion-fab-button');
        fab.toggleActive = this.toggleActive;
        fab.activated = this.activated;
        const lists = this.el.querySelectorAll('ion-fab-list');
        for (let i = 0, length = lists.length; i < length; i += 1) {
            lists[i].activated = this.activated;
        }
        return (h("slot", null));
    }
    static get is() { return "ion-fab"; }
    static get properties() { return { "activated": { "state": true }, "close": { "method": true }, "el": { "elementRef": true } }; }
    static get style() { return "ion-fab {\n  position: absolute;\n  z-index: 999;\n}\n\nion-fab[center] {\n  left: 50%;\n  margin-left: -28px;\n}\n\nion-fab[middle] {\n  margin-top: -28px;\n  top: 50%;\n}\n\nion-fab[top] {\n  top: 10px;\n}\n\nion-fab[right] {\n  right: 10px;\n  right: calc(10px + constant(safe-area-inset-right));\n  right: calc(10px + env(safe-area-inset-right));\n}\n\nion-fab[end] {\n  right: 10px;\n  right: calc(constant(safe-area-inset-right) + 10px);\n  right: calc(env(safe-area-inset-right) + 10px);\n}\n\nion-fab[bottom] {\n  bottom: 10px;\n}\n\nion-fab[left] {\n  left: 10px;\n  left: calc(10px + constant(safe-area-inset-left));\n  left: calc(10px + env(safe-area-inset-left));\n}\n\nion-fab[start] {\n  left: 10px;\n  left: calc(constant(safe-area-inset-left) + 10px);\n  left: calc(env(safe-area-inset-left) + 10px);\n}\n\nion-fab[top][edge] {\n  top: -28px;\n}\n\nion-fab[bottom][edge] {\n  bottom: -28px;\n}"; }
}

export { Fab as IonFab };
