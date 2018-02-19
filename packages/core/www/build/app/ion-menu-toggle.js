/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

class MenuToggle {
    constructor() {
        this.visible = false;
        this.autoHide = true;
    }
    componentDidLoad() {
        this.updateVisibility();
    }
    onClick() {
        getMenuController().then(menuCtrl => {
            if (menuCtrl) {
                return menuCtrl.toggle(this.menu);
            }
            return false;
        });
    }
    updateVisibility() {
        getMenuController().then(menuCtrl => {
            if (menuCtrl) {
                const menu = menuCtrl.get(this.menu);
                if (menu && menu.isActive()) {
                    this.visible = true;
                    return;
                }
            }
            this.visible = false;
        });
    }
    hostData() {
        const hidden = this.autoHide && !this.visible;
        return {
            class: {
                'menu-toggle-hidden': hidden
            }
        };
    }
    render() {
        return h("slot", null);
    }
    static get is() { return "ion-menu-toggle"; }
    static get properties() { return { "autoHide": { "type": Boolean, "attr": "auto-hide" }, "menu": { "type": String, "attr": "menu" }, "visible": { "state": true } }; }
    static get style() { return "ion-menu-toggle.menu-toggle-hidden {\n  display: none;\n}"; }
}
function getMenuController() {
    const menuControllerElement = document.querySelector('ion-menu-controller');
    if (!menuControllerElement) {
        return Promise.resolve(null);
    }
    return menuControllerElement.componentOnReady();
}

export { MenuToggle as IonMenuToggle };
