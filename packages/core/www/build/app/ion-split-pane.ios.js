/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

const SPLIT_PANE_MAIN = 'split-pane-main';
const SPLIT_PANE_SIDE = 'split-pane-side';
const QUERY = {
    'xs': '(min-width: 0px)',
    'sm': '(min-width: 576px)',
    'md': '(min-width: 768px)',
    'lg': '(min-width: 992px)',
    'xl': '(min-width: 1200px)',
    'never': ''
};
class SplitPane {
    constructor() {
        this.visible = false;
        /**
         * If true, the split pane will be hidden. Defaults to `false`.
         */
        this.disabled = false;
        /**
         * When the split-pane should be shown.
         * Can be a CSS media query expression, or a shortcut expression.
         * Can also be a boolean expression.
         */
        this.when = QUERY['md'];
    }
    visibleChanged(visible) {
        const detail = { visible };
        this.ionChange.emit(detail);
        this.ionSplitPaneVisible.emit(detail);
    }
    componentDidLoad() {
        this._styleChildren();
        this.whenChanged();
    }
    componentDidUnload() {
        this.rmL && this.rmL();
        this.rmL = null;
    }
    whenChanged() {
        this.rmL && this.rmL();
        this.rmL = null;
        // Check if the split-pane is disabled
        if (this.disabled) {
            this.visible = false;
            return;
        }
        // When query is a boolean
        const query = this.when;
        if (typeof query === 'boolean') {
            this.visible = query;
            return;
        }
        // When query is a string, let's find first if it is a shortcut
        const defaultQuery = QUERY[query];
        const mediaQuery = (defaultQuery)
            ? defaultQuery
            : query;
        // Media query is empty or null, we hide it
        if (!mediaQuery || mediaQuery.length === 0) {
            this.visible = false;
            return;
        }
        // Listen on media query
        const callback = (q) => this.visible = q.matches;
        const mediaList = window.matchMedia(mediaQuery);
        mediaList.addListener(callback);
        this.rmL = () => mediaList.removeListener(callback);
        this.visible = mediaList.matches;
    }
    isVisible() {
        return this.visible;
    }
    isPane(element) {
        if (!this.visible) {
            return false;
        }
        return element.parentElement === this.el
            && element.classList.contains(SPLIT_PANE_SIDE);
    }
    _styleChildren() {
        const children = this.el.children;
        const nu = this.el.childElementCount;
        let foundMain = false;
        for (let i = 0; i < nu; i++) {
            const child = children[i];
            const isMain = child.hasAttribute('main');
            if (isMain) {
                if (foundMain) {
                    console.warn('split pane can not have more than one main node');
                    return;
                }
                foundMain = true;
            }
            setPaneClass(child, isMain);
        }
        if (!foundMain) {
            console.warn('split pane could not found any main node');
        }
    }
    hostData() {
        return {
            class: {
                'split-pane-visible': this.visible
            }
        };
    }
    render() {
        return h("slot", null);
    }
    static get is() { return "ion-split-pane"; }
    static get host() { return { "theme": "split-pane" }; }
    static get properties() { return { "disabled": { "type": Boolean, "attr": "disabled" }, "el": { "elementRef": true }, "isPane": { "method": true }, "isVisible": { "method": true }, "visible": { "state": true, "watchCallbacks": ["visibleChanged"] }, "when": { "type": "Any", "attr": "when", "watchCallbacks": ["whenChanged"] } }; }
    static get events() { return [{ "name": "ionChange", "method": "ionChange", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionSplitPaneVisible", "method": "ionSplitPaneVisible", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return ".split-pane {\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  position: absolute;\n  display: flex;\n  flex-direction: row;\n  flex-wrap: nowrap;\n  contain: strict;\n}\n\n.split-pane-visible > .split-pane-side,\n.split-pane-visible > .split-pane-main {\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  position: relative;\n  z-index: 0;\n  flex: 1;\n  box-shadow: none !important;\n}\n\n.split-pane-visible > .split-pane-side:not(ion-menu),\n.split-pane-visible > ion-menu.split-pane-side.menu-enabled {\n  display: flex;\n  flex-shrink: 0;\n  order: -1;\n}\n\n.split-pane-side:not(ion-menu) {\n  display: none;\n}\n\n.split-pane-visible > ion-menu > .menu-inner {\n  left: 0;\n  right: 0;\n  width: auto;\n  box-shadow: none !important;\n  transform: none !important;\n}\n\n.split-pane-visible > ion-menu > .ion-backdrop {\n  display: hidden !important;\n}\n\n.split-pane-visible > .split-pane-side[side=start] {\n  order: -1;\n}\n\n.split-pane-visible > .split-pane-side[side=end] {\n  order: 1;\n}\n\n.split-pane-visible > .split-pane-side[side=left] {\n  order: -1;\n}\n\n.split-pane-visible > .split-pane-side[side=right] {\n  order: 1;\n}\n\n.split-pane-ios.split-pane-visible > .split-pane-side {\n  min-width: 270px;\n  max-width: 28%;\n  border-right: 0.55px solid var(--ion-item-ios-border-color, var(--ion-item-border-color, #c8c7cc));\n  border-left: 0;\n}\n\n.split-pane-ios.split-pane-visible > .split-pane-side[side=right] {\n  border-right: 0;\n  border-left: 0.55px solid var(--ion-item-ios-border-color, var(--ion-item-border-color, #c8c7cc));\n}"; }
    static get styleMode() { return "ios"; }
}
function setPaneClass(el, isMain) {
    let toAdd;
    let toRemove;
    if (isMain) {
        toAdd = SPLIT_PANE_MAIN;
        toRemove = SPLIT_PANE_SIDE;
    }
    else {
        toAdd = SPLIT_PANE_SIDE;
        toRemove = SPLIT_PANE_MAIN;
    }
    const classList = el.classList;
    classList.add(toAdd);
    classList.remove(toRemove);
}

export { SplitPane as IonSplitPane };
