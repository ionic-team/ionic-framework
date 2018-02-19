/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

class InfiniteScrollContent {
    componentDidLoad() {
        if (!this.loadingSpinner) {
            this.loadingSpinner = this.config.get('infiniteLoadingSpinner', this.config.get('spinner', 'lines'));
        }
    }
    render() {
        return (h("div", { class: 'infinite-loading' },
            this.loadingSpinner &&
                h("div", { class: 'infinite-loading-spinner' },
                    h("ion-spinner", { name: this.loadingSpinner })),
            this.loadingText &&
                h("div", { class: 'infinite-loading-text', innerHTML: this.loadingText })));
    }
    static get is() { return "ion-infinite-scroll-content"; }
    static get host() { return { "theme": "infinite-scroll-content" }; }
    static get properties() { return { "config": { "context": "config" }, "loadingSpinner": { "type": String, "attr": "loading-spinner", "mutable": true }, "loadingText": { "type": String, "attr": "loading-text" } }; }
    static get style() { return "ion-infinite-scroll-content {\n  text-align: center;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  min-height: 84px;\n}\n\n.infinite-loading {\n  margin: 0 0 32px;\n  display: none;\n  width: 100%;\n}\n\n.infinite-loading-text {\n  margin: 4px 32px 0;\n}\n\n.infinite-scroll-loading ion-infinite-scroll-content > .infinite-loading {\n  display: block;\n}\n\n.infinite-scroll-content-md .infinite-loading-text {\n  color: var(--ion-text-md-color-step-400, var(--ion-text-color-step-400, #666666));\n}\n\n.infinite-scroll-content-md .infinite-loading-spinner .spinner-crescent circle {\n  stroke: var(--ion-text-md-color-step-400, var(--ion-text-color-step-400, #666666));\n}\n\n.infinite-scroll-content-md .infinite-loading-spinner .spinner-bubbles circle,\n.infinite-scroll-content-md .infinite-loading-spinner .spinner-circles circle,\n.infinite-scroll-content-md .infinite-loading-spinner .spinner-dots circle {\n  fill: var(--ion-text-md-color-step-400, var(--ion-text-color-step-400, #666666));\n}"; }
    static get styleMode() { return "md"; }
}

export { InfiniteScrollContent as IonInfiniteScrollContent };
