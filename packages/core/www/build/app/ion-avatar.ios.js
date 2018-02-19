/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

class Avatar {
    render() {
        return h("slot", null);
    }
    static get is() { return "ion-avatar"; }
    static get host() { return { "theme": "avatar" }; }
    static get style() { return "ion-avatar {\n  display: block;\n}\n\nion-avatar img {\n  width: 100%;\n  height: 100%;\n}\n\n.avatar-ios {\n  border-radius: 50%;\n  width: 48px;\n  height: 48px;\n}\n\n.avatar-ios ion-img,\n.avatar-ios img {\n  border-radius: 50%;\n  overflow: hidden;\n}"; }
    static get styleMode() { return "ios"; }
}

export { Avatar as IonAvatar };
