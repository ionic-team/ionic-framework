/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

class ItemGroup {
    render() {
        return h("slot", null);
    }
    static get is() { return "ion-item-group"; }
    static get host() { return { "theme": "item-group" }; }
    static get style() { return "ion-item-group {\n  display: block;\n}\n\n.item-group-md ion-item:first-child .item-inner {\n  border-top-width: 0;\n}\n\n.item-group-md ion-item:last-child .item-inner,\n.item-group-md .item-sliding:last-child .item .item-inner {\n  border: 0;\n}"; }
    static get styleMode() { return "md"; }
}

export { ItemGroup as IonItemGroup };
