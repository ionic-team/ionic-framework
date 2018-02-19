/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

import { now } from './chunk1.js';

class RippleEffect {
    constructor() {
        this.lastClick = -10000;
    }
    tapClickChanged(useTapClick) {
        this.enableListener(this, 'parent:ionActivated', useTapClick);
        this.enableListener(this, 'touchstart', !useTapClick);
        this.enableListener(this, 'mousedown', !useTapClick);
    }
    ionActivated(ev) {
        this.addRipple(ev.detail.x, ev.detail.y);
    }
    touchStart(ev) {
        this.lastClick = now(ev);
        const touches = ev.touches[0];
        this.addRipple(touches.clientX, touches.clientY);
    }
    mouseDown(ev) {
        const timeStamp = now(ev);
        if (this.lastClick < (timeStamp - 1000)) {
            this.addRipple(ev.pageX, ev.pageY);
        }
    }
    componentDidLoad() {
        if (this.useTapClick === undefined) {
            this.useTapClick = !!document.querySelector('ion-tap-click');
        }
        this.tapClickChanged(this.useTapClick);
    }
    addRipple(pageX, pageY) {
        let x, y, size;
        this.dom.read(() => {
            const rect = this.el.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;
            size = Math.min(Math.sqrt(width * width + height * height) * 2, 600);
            x = pageX - rect.left - (size / 2);
            y = pageY - rect.top - (size / 2);
        });
        this.dom.write(() => {
            const div = document.createElement('div');
            div.classList.add('ripple-effect');
            const style = div.style;
            const duration = Math.max(800 * Math.sqrt(size / 350) + 0.5, 260);
            style.top = y + 'px';
            style.left = x + 'px';
            style.width = size + 'px';
            style.height = size + 'px';
            style.animationDuration = duration + 'ms';
            this.el.appendChild(div);
            setTimeout(() => this.el.removeChild(div), duration + 50);
        });
    }
    static get is() { return "ion-ripple-effect"; }
    static get host() { return { "theme": "ripple" }; }
    static get properties() { return { "addRipple": { "method": true }, "dom": { "context": "dom" }, "el": { "elementRef": true }, "enableListener": { "context": "enableListener" }, "useTapClick": { "type": Boolean, "attr": "use-tap-click", "mutable": true, "watchCallbacks": ["tapClickChanged"] } }; }
    static get style() { return "ion-ripple-effect {\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  position: absolute;\n  contain: strict;\n}\n\n.ripple-effect {\n  border-radius: 50%;\n  position: absolute;\n  opacity: 0;\n  will-change: transform, opacity;\n  pointer-events: none;\n  animation-name: rippleAnimation;\n  animation-duration: 200ms;\n  animation-timing-function: ease-out;\n  contain: strict;\n}\n\n\@keyframes rippleAnimation {\n  0% {\n    opacity: .2;\n    transform: scale(0.05);\n  }\n  100% {\n    opacity: 0;\n    transform: scale(1);\n  }\n}\n\n.ripple-iod .ripple-effect {\n  background-color: var(--ion-text-ios-color, var(--ion-text-color, #000));\n}"; }
    static get styleMode() { return "ios"; }
}

export { RippleEffect as IonRippleEffect };
