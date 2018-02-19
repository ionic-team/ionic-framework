/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

import { createThemedClasses, getElementClassMap } from './chunk2.js';
import { getPageElement } from './chunk1.js';

class Content {
    constructor() {
        this.cTop = 0;
        this.cBottom = 0;
        this.dirty = false;
        /**
         * If true, the content will scroll behind the headers
         * and footers. This effect can easily be seen by setting the toolbar
         * to transparent.
         */
        this.fullscreen = false;
    }
    onNavChanged() {
        this.resize();
    }
    componentDidLoad() {
        this.scrollEl = this.el.querySelector('ion-scroll');
        this.resize();
    }
    componentDidUnload() {
        this.scrollEl = null;
    }
    hostData() {
        return {
            class: {
                'statusbar-padding': this.config.getBoolean('statusbarPadding')
            }
        };
    }
    /**
     * Scroll to the top of the content component.
     *
     * Duration of the scroll animation in milliseconds. Defaults to `300`.
     * Returns a promise which is resolved when the scroll has completed.
     */
    scrollToTop(duration = 300) {
        return this.scrollEl.scrollToTop(duration);
    }
    /**
     * Scroll to the bottom of the content component.
     *
     * Duration of the scroll animation in milliseconds. Defaults to `300`.
     * Returns a promise which is resolved when the scroll has completed.
     */
    scrollToBottom(duration = 300) {
        return this.scrollEl.scrollToBottom(duration);
    }
    resize() {
        if (!this.scrollEl) {
            return;
        }
        if (this.fullscreen) {
            this.dom.raf(() => {
                this.dom.read(this.readDimensions.bind(this));
                this.dom.write(this.writeDimensions.bind(this));
            });
        }
        else {
            this.cTop = this.cBottom = null;
            this.dom.write(() => this.scrollEl && this.scrollEl.removeAttribute('style'));
        }
    }
    readDimensions() {
        const page = getPageElement(this.el);
        const top = Math.max(this.el.offsetTop, 0);
        const bottom = Math.max(page.offsetHeight - top - this.el.offsetHeight, 0);
        this.dirty = top !== this.cTop || bottom !== this.cBottom;
        this.cTop = top;
        this.cBottom = bottom;
    }
    writeDimensions() {
        if (this.dirty && this.scrollEl) {
            const style = this.scrollEl.style;
            style.paddingTop = this.cTop + 'px';
            style.paddingBottom = this.cBottom + 'px';
            style.top = -this.cTop + 'px';
            style.bottom = -this.cBottom + 'px';
            this.dirty = false;
        }
    }
    render() {
        const themedClasses = createThemedClasses(this.mode, this.color, 'content');
        const hostClasses = getElementClassMap(this.el.classList);
        const scrollClasses = Object.assign({}, themedClasses, hostClasses);
        this.resize();
        return [
            h("ion-scroll", { class: scrollClasses },
                h("slot", null)),
            h("slot", { name: 'fixed' })
        ];
    }
    static get is() { return "ion-content"; }
    static get properties() { return { "config": { "context": "config" }, "dom": { "context": "dom" }, "el": { "elementRef": true }, "fullscreen": { "type": Boolean, "attr": "fullscreen" }, "scrollToBottom": { "method": true }, "scrollToTop": { "method": true } }; }
    static get style() { return "ion-content {\n  position: relative;\n  display: block;\n  flex: 1;\n  width: 100%;\n  contain: layout size style;\n  padding: 0 !important;\n}\n\nion-scroll {\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  position: absolute;\n  z-index: 1;\n  display: block;\n  overflow-x: hidden;\n  overflow-y: scroll;\n  -webkit-overflow-scrolling: touch;\n  will-change: scroll-position;\n  contain: size style layout;\n}\n\nion-content.js-scroll ion-scroll {\n  position: relative;\n  min-height: 100%;\n  overflow-x: initial;\n  overflow-y: initial;\n  -webkit-overflow-scrolling: auto;\n  will-change: initial;\n}\n\nion-app [no-padding],\nion-app [no-padding] ion-scroll {\n  padding: 0;\n}\n\nion-app [no-margin],\nion-app [no-margin] ion-scroll {\n  margin: 0;\n}\n\n.content-md {\n  font-family: \"Roboto\", \"Helvetica Neue\", sans-serif;\n  color: var(--ion-text-md-color, var(--ion-text-color, #000));\n  background-color: var(--ion-background-md-color, var(--ion-background-color, #fff));\n}\n\n.content-md hr {\n  background-color: var(--ion-background-md-color-step-50, var(--ion-background-color-step-50, #f2f2f2));\n}\n\n.app-md [padding],\n.app-md [padding] .scroll-inner {\n  padding: 16px;\n}\n\n.app-md [padding-top],\n.app-md [padding-top] .scroll-inner {\n  padding-top: 16px;\n}\n\n.app-md [padding-left],\n.app-md [padding-left] .scroll-inner {\n  padding-left: 16px;\n}\n\n.app-md [padding-right],\n.app-md [padding-right] .scroll-inner {\n  padding-right: 16px;\n}\n\n.app-md [padding-bottom],\n.app-md [padding-bottom] .scroll-inner {\n  padding-bottom: 16px;\n}\n\n.app-md [padding-vertical],\n.app-md [padding-vertical] .scroll-inner {\n  padding-top: 16px;\n  padding-bottom: 16px;\n}\n\n.app-md [padding-horizontal],\n.app-md [padding-horizontal] .scroll-inner {\n  padding-left: 16px;\n  padding-right: 16px;\n}\n\n.app-md [margin],\n.app-md [margin] ion-scroll {\n  margin: 16px;\n}\n\n.app-md [margin-top],\n.app-md [margin-top] ion-scroll {\n  margin-top: 16px;\n}\n\n.app-md [margin-left],\n.app-md [margin-left] ion-scroll {\n  margin-left: 16px;\n}\n\n.app-md [margin-start],\n.app-md [margin-start] ion-scroll {\n  margin-left: 16px;\n}\n\n.app-md [margin-right],\n.app-md [margin-right] ion-scroll {\n  margin-right: 16px;\n}\n\n.app-md [margin-end],\n.app-md [margin-end] ion-scroll {\n  margin-right: 16px;\n}\n\n.app-md [margin-bottom],\n.app-md [margin-bottom] ion-scroll {\n  margin-bottom: 16px;\n}\n\n.app-md [margin-vertical],\n.app-md [margin-vertical] ion-scroll {\n  margin-top: 16px;\n  margin-bottom: 16px;\n}\n\n.app-md [margin-horizontal],\n.app-md [margin-horizontal] ion-scroll {\n  margin-left: 16px;\n  margin-right: 16px;\n}"; }
    static get styleMode() { return "md"; }
}

export { Content as IonContent };
