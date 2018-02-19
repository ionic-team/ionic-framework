/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

import { createThemedClasses } from './chunk2.js';

const SPINNERS = {
    lines: {
        dur: 1000,
        lines: 12,
        fn: (dur, index, total) => {
            const transform = 'rotate(' + (30 * index + (index < 6 ? 180 : -180)) + 'deg)';
            const animationDelay = -(dur - ((dur / total) * index)) + 'ms';
            return {
                y1: 17,
                y2: 29,
                style: {
                    transform: transform,
                    webkitTransform: transform,
                    animationDelay: animationDelay,
                    webkitAnimationDelay: animationDelay
                }
            };
        }
    },
    'lines-sm': {
        dur: 1000,
        lines: 12,
        fn: (dur, index, total) => {
            const transform = 'rotate(' + (30 * index + (index < 6 ? 180 : -180)) + 'deg)';
            const animationDelay = -(dur - ((dur / total) * index)) + 'ms';
            return {
                y1: 12,
                y2: 20,
                style: {
                    transform: transform,
                    webkitTransform: transform,
                    animationDelay: animationDelay,
                    webkitAnimationDelay: animationDelay
                }
            };
        }
    },
    bubbles: {
        dur: 1000,
        circles: 9,
        fn: (dur, index, total) => {
            const animationDelay = -(dur - ((dur / total) * index)) + 'ms';
            return {
                r: 5,
                style: {
                    top: (9 * Math.sin(2 * Math.PI * index / total)) + 'px',
                    left: (9 * Math.cos(2 * Math.PI * index / total)) + 'px',
                    animationDelay: animationDelay,
                    webkitAnimationDelay: animationDelay
                }
            };
        }
    },
    circles: {
        dur: 1000,
        circles: 8,
        fn: (dur, index, total) => {
            const animationDelay = -(dur - ((dur / total) * index)) + 'ms';
            return {
                r: 5,
                style: {
                    top: (9 * Math.sin(2 * Math.PI * index / total)) + 'px',
                    left: (9 * Math.cos(2 * Math.PI * index / total)) + 'px',
                    animationDelay: animationDelay,
                    webkitAnimationDelay: animationDelay
                }
            };
        }
    },
    crescent: {
        dur: 750,
        circles: 1,
        fn: () => {
            return {
                r: 26,
                style: {}
            };
        }
    },
    dots: {
        dur: 750,
        circles: 3,
        fn: (dur, index) => {
            const animationDelay = -(110 * index) + 'ms';
            return {
                r: 6,
                style: {
                    left: (9 - (9 * index)) + 'px',
                    animationDelay: animationDelay,
                    webkitAnimationDelay: animationDelay
                }
            };
        }
    }
};

class Spinner {
    constructor() {
        /**
         * If true, the spinner's animation will be paused. Defaults to `false`.
         */
        this.paused = false;
    }
    getName() {
        let name = this.name || this.config.get('spinner');
        if (!name) {
            // fallback
            if (this.mode === 'md') {
                return 'crescent';
            }
            else {
                return 'lines';
            }
        }
        if (name === 'ios') {
            // deprecation warning, renamed in v4
            console.warn(`spinner "ios" has been renamed to "lines"`);
            name = 'lines';
        }
        else if (name === 'ios-small') {
            // deprecation warning, renamed in v4
            console.warn(`spinner "ios-small" has been renamed to "lines-sm"`);
            name = 'lines-sm';
        }
        return name;
    }
    hostData() {
        const themedClasses = createThemedClasses(this.mode, this.color, `spinner spinner-${this.getName()}`);
        const spinnerClasses = Object.assign({}, themedClasses, { 'spinner-paused': this.paused });
        return {
            class: spinnerClasses
        };
    }
    render() {
        const name = this.getName();
        const spinner = SPINNERS[name] || SPINNERS['lines'];
        const duration = (typeof this.duration === 'number' && this.duration > 10 ? this.duration : spinner.dur);
        const svgs = [];
        if (spinner.circles) {
            for (let i = 0; i < spinner.circles; i++) {
                svgs.push(buildCircle(spinner, duration, i, spinner.circles));
            }
        }
        else if (spinner.lines) {
            for (let i = 0; i < spinner.lines; i++) {
                svgs.push(buildLine(spinner, duration, i, spinner.lines));
            }
        }
        return svgs;
    }
    static get is() { return "ion-spinner"; }
    static get host() { return { "theme": "spinner" }; }
    static get properties() { return { "color": { "type": String, "attr": "color" }, "config": { "context": "config" }, "duration": { "type": Number, "attr": "duration" }, "mode": { "type": "Any", "attr": "mode" }, "name": { "type": String, "attr": "name" }, "paused": { "type": Boolean, "attr": "paused" } }; }
    static get style() { return "ion-spinner {\n  position: relative;\n  display: inline-block;\n  width: 28px;\n  height: 28px;\n}\n\nion-spinner svg {\n  left: 0;\n  top: 0;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  transform: translateZ(0);\n}\n\nion-spinner.spinner-paused svg {\n  animation-play-state: paused;\n}\n\n.spinner-lines line,\n.spinner-lines-sm line {\n  stroke-width: 4px;\n  stroke-linecap: round;\n}\n\n.spinner-lines svg,\n.spinner-lines-sm svg {\n  animation: spinner-fade-out 1s linear infinite;\n}\n\n.spinner-bubbles svg {\n  animation: spinner-scale-out 1s linear infinite;\n}\n\n.spinner-circles svg {\n  animation: spinner-fade-out 1s linear infinite;\n}\n\n.spinner-crescent circle {\n  fill: transparent;\n  stroke-width: 4px;\n  stroke-dasharray: 128px;\n  stroke-dashoffset: 82px;\n}\n\n.spinner-crescent svg {\n  animation: spinner-rotate 1s linear infinite;\n}\n\n.spinner-dots circle {\n  stroke-width: 0;\n}\n\n.spinner-dots svg {\n  transform-origin: center;\n  animation: spinner-dots 1s linear infinite;\n}\n\n\@keyframes spinner-fade-out {\n  0% {\n    opacity: 1;\n  }\n  100% {\n    opacity: 0;\n  }\n}\n\n\@keyframes spinner-scale-out {\n  0% {\n    transform: scale(1, 1);\n  }\n  100% {\n    transform: scale(0, 0);\n  }\n}\n\n\@keyframes spinner-rotate {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n\n\@keyframes spinner-dots {\n  0% {\n    opacity: .9;\n    transform: scale(1, 1);\n  }\n  50% {\n    opacity: .3;\n    transform: scale(0.4, 0.4);\n  }\n  100% {\n    opacity: .9;\n    transform: scale(1, 1);\n  }\n}\n\n.spinner-lines-ios line,\n.spinner-lines-sm-ios line {\n  stroke: var(--ion-text-ios-color-step-400, var(--ion-text-color-step-400, #666666));\n}\n\n.spinner-bubbles-ios circle {\n  fill: var(--ion-text-ios-color, var(--ion-text-color, #000));\n}\n\n.spinner-circles-ios circle {\n  fill: var(--ion-text-ios-color-step-400, var(--ion-text-color-step-400, #666666));\n}\n\n.spinner-crescent-ios circle {\n  stroke: var(--ion-text-ios-color, var(--ion-text-color, #000));\n}\n\n.spinner-dots-ios circle {\n  fill: var(--ion-text-ios-color-step-400, var(--ion-text-color-step-400, #666666));\n}\n\n.spinner-ios-primary.spinner-lines line,\n.spinner-ios-primary.spinner-lines-sm line,\n.spinner-ios-primary.spinner-crescent circle {\n  stroke: var(--ion-color-ios-primary, var(--ion-color-primary, #488aff));\n}\n\n.spinner-ios-primary.spinner-bubbles circle,\n.spinner-ios-primary.spinner-circles circle,\n.spinner-ios-primary.spinner-dots circle {\n  fill: var(--ion-color-ios-primary, var(--ion-color-primary, #488aff));\n}\n\n.spinner-ios-secondary.spinner-lines line,\n.spinner-ios-secondary.spinner-lines-sm line,\n.spinner-ios-secondary.spinner-crescent circle {\n  stroke: var(--ion-color-ios-secondary, var(--ion-color-secondary, #32db64));\n}\n\n.spinner-ios-secondary.spinner-bubbles circle,\n.spinner-ios-secondary.spinner-circles circle,\n.spinner-ios-secondary.spinner-dots circle {\n  fill: var(--ion-color-ios-secondary, var(--ion-color-secondary, #32db64));\n}\n\n.spinner-ios-tertiary.spinner-lines line,\n.spinner-ios-tertiary.spinner-lines-sm line,\n.spinner-ios-tertiary.spinner-crescent circle {\n  stroke: var(--ion-color-ios-tertiary, var(--ion-color-tertiary, #f4a942));\n}\n\n.spinner-ios-tertiary.spinner-bubbles circle,\n.spinner-ios-tertiary.spinner-circles circle,\n.spinner-ios-tertiary.spinner-dots circle {\n  fill: var(--ion-color-ios-tertiary, var(--ion-color-tertiary, #f4a942));\n}\n\n.spinner-ios-success.spinner-lines line,\n.spinner-ios-success.spinner-lines-sm line,\n.spinner-ios-success.spinner-crescent circle {\n  stroke: var(--ion-color-ios-success, var(--ion-color-success, #10dc60));\n}\n\n.spinner-ios-success.spinner-bubbles circle,\n.spinner-ios-success.spinner-circles circle,\n.spinner-ios-success.spinner-dots circle {\n  fill: var(--ion-color-ios-success, var(--ion-color-success, #10dc60));\n}\n\n.spinner-ios-warning.spinner-lines line,\n.spinner-ios-warning.spinner-lines-sm line,\n.spinner-ios-warning.spinner-crescent circle {\n  stroke: var(--ion-color-ios-warning, var(--ion-color-warning, #ffce00));\n}\n\n.spinner-ios-warning.spinner-bubbles circle,\n.spinner-ios-warning.spinner-circles circle,\n.spinner-ios-warning.spinner-dots circle {\n  fill: var(--ion-color-ios-warning, var(--ion-color-warning, #ffce00));\n}\n\n.spinner-ios-danger.spinner-lines line,\n.spinner-ios-danger.spinner-lines-sm line,\n.spinner-ios-danger.spinner-crescent circle {\n  stroke: var(--ion-color-ios-danger, var(--ion-color-danger, #f53d3d));\n}\n\n.spinner-ios-danger.spinner-bubbles circle,\n.spinner-ios-danger.spinner-circles circle,\n.spinner-ios-danger.spinner-dots circle {\n  fill: var(--ion-color-ios-danger, var(--ion-color-danger, #f53d3d));\n}\n\n.spinner-ios-light.spinner-lines line,\n.spinner-ios-light.spinner-lines-sm line,\n.spinner-ios-light.spinner-crescent circle {\n  stroke: var(--ion-color-ios-light, var(--ion-color-light, #f4f4f4));\n}\n\n.spinner-ios-light.spinner-bubbles circle,\n.spinner-ios-light.spinner-circles circle,\n.spinner-ios-light.spinner-dots circle {\n  fill: var(--ion-color-ios-light, var(--ion-color-light, #f4f4f4));\n}\n\n.spinner-ios-medium.spinner-lines line,\n.spinner-ios-medium.spinner-lines-sm line,\n.spinner-ios-medium.spinner-crescent circle {\n  stroke: var(--ion-color-ios-medium, var(--ion-color-medium, #989aa2));\n}\n\n.spinner-ios-medium.spinner-bubbles circle,\n.spinner-ios-medium.spinner-circles circle,\n.spinner-ios-medium.spinner-dots circle {\n  fill: var(--ion-color-ios-medium, var(--ion-color-medium, #989aa2));\n}\n\n.spinner-ios-dark.spinner-lines line,\n.spinner-ios-dark.spinner-lines-sm line,\n.spinner-ios-dark.spinner-crescent circle {\n  stroke: var(--ion-color-ios-dark, var(--ion-color-dark, #222));\n}\n\n.spinner-ios-dark.spinner-bubbles circle,\n.spinner-ios-dark.spinner-circles circle,\n.spinner-ios-dark.spinner-dots circle {\n  fill: var(--ion-color-ios-dark, var(--ion-color-dark, #222));\n}"; }
    static get styleMode() { return "ios"; }
}
function buildCircle(spinner, duration, index, total) {
    const data = spinner.fn(duration, index, total);
    data.style.animationDuration = duration + 'ms';
    return (h("svg", { viewBox: '0 0 64 64', style: data.style },
        h("circle", { transform: 'translate(32,32)', r: data.r })));
}
function buildLine(spinner, duration, index, total) {
    const data = spinner.fn(duration, index, total);
    data.style.animationDuration = duration + 'ms';
    return (h("svg", { viewBox: '0 0 64 64', style: data.style },
        h("line", { transform: 'translate(32,32)', y1: data.y1, y2: data.y2 })));
}

export { Spinner as IonSpinner };
