/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

class RefresherContent {
    componentDidLoad() {
        if (!this.pullingIcon) {
            this.pullingIcon = this.config.get('ionPullIcon', 'arrow-down');
        }
        if (!this.refreshingSpinner) {
            this.refreshingSpinner = this.config.get('ionRefreshingSpinner', this.config.get('spinner', 'lines'));
        }
    }
    render() {
        return [
            h("div", { class: 'refresher-pulling' },
                this.pullingIcon &&
                    h("div", { class: 'refresher-pulling-icon' },
                        h("ion-icon", { name: this.pullingIcon })),
                this.pullingText &&
                    h("div", { class: 'refresher-pulling-text', innerHTML: this.pullingText })),
            h("div", { class: 'refresher-refreshing' },
                this.refreshingSpinner &&
                    h("div", { class: 'refresher-refreshing-icon' },
                        h("ion-spinner", { name: this.refreshingSpinner })),
                this.refreshingText &&
                    h("div", { class: 'refresher-refreshing-text', innerHTML: this.refreshingText }))
        ];
    }
    static get is() { return "ion-refresher-content"; }
    static get properties() { return { "config": { "context": "config" }, "pullingIcon": { "type": String, "attr": "pulling-icon", "mutable": true }, "pullingText": { "type": String, "attr": "pulling-text" }, "refreshingSpinner": { "type": String, "attr": "refreshing-spinner", "mutable": true }, "refreshingText": { "type": String, "attr": "refreshing-text" } }; }
}

export { RefresherContent as IonRefresherContent };
