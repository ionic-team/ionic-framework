/*! Built with http://stenciljs.com */

App.defineComponents(

/**** module id ****/
'ion-spinner',

/**** component modules ****/
function importComponent(exports, h, t, Ionic) {
var SPINNERS = {
    lines: {
        dur: 1000,
        lines: 12,
        fn: function (dur, index, total) {
            var transform = 'rotate(' + (30 * index + (index < 6 ? 180 : -180)) + 'deg)';
            var animationDelay = -(dur - ((dur / total) * index)) + 'ms';
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
        fn: function (dur, index, total) {
            var transform = 'rotate(' + (30 * index + (index < 6 ? 180 : -180)) + 'deg)';
            var animationDelay = -(dur - ((dur / total) * index)) + 'ms';
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
        fn: function (dur, index, total) {
            var animationDelay = -(dur - ((dur / total) * index)) + 'ms';
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
        fn: function (dur, index, total) {
            var animationDelay = -(dur - ((dur / total) * index)) + 'ms';
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
        fn: function () {
            return {
                r: 26,
                style: {}
            };
        }
    },
    dots: {
        dur: 750,
        circles: 3,
        fn: function (dur, index) {
            var animationDelay = -(110 * index) + 'ms';
            dur;
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

function createThemedClasses(mode, color, classList) {
    var allClassObj = {};
    return classList.split(' ')
        .reduce(function (classObj, classString) {
        classObj[classString] = true;
        if (mode) {
            classObj[classString + "-" + mode] = true;
            if (color) {
                classObj[classString + "-" + color] = true;
                classObj[classString + "-" + mode + "-" + color] = true;
            }
        }
        return classObj;
    }, allClassObj);
}

var Spinner = (function () {
    function Spinner() {
        this.duration = null;
        this.paused = false;
    }
    Spinner.prototype["componentDidLoad"] = function () {
        if (this.name === 'ios') {
            // deprecation warning, renamed in v4
            console.warn("spinner \"ios\" has been renamed to \"lines\"");
        }
        else if (this.name === 'ios-small') {
            // deprecation warning, renamed in v4
            console.warn("spinner \"ios-small\" has been renamed to \"lines-sm\"");
        }
    };
    Spinner.prototype.hostData = function () {
        var spinnerThemedClasses = createThemedClasses(this.mode, this.color, "spinner spinner-" + this.name);
        spinnerThemedClasses['spinner-paused'] = true;
        return {
            class: spinnerThemedClasses
        };
    };
    Spinner.prototype.render = function () {
        var name = this.name || Ionic.config.get('spinner', 'lines');
        if (name === 'ios') {
            name = this.name = 'lines';
        }
        else if (this.name === 'ios-small') {
            name = this.name = 'lines-sm';
        }
        var spinner = SPINNERS[name] || SPINNERS['lines'];
        var duration = (typeof this.duration === 'number' && this.duration > 10 ? this.duration : spinner.dur);
        var svgs = [];
        var i = 0;
        var l = 0;
        if (spinner.circles) {
            for (i = 0, l = spinner.circles; i < l; i++) {
                svgs.push(buildCircle(spinner, duration, i, l));
            }
        }
        else if (spinner.lines) {
            for (i = 0, l = spinner.lines; i < l; i++) {
                svgs.push(buildLine(spinner, duration, i, l));
            }
        }
        return svgs;
    };
    return Spinner;
}());
function buildCircle(spinner, duration, index, total) {
    var data = spinner.fn(duration, index, total);
    data.style.animationDuration = duration + 'ms';
    return h('svg', { "n": "http://www.w3.org/2000/svg", "s": data.style, "a": { "attrs": { "viewBox": '0 0 64 64' } } }, h('circle', { "n": "http://www.w3.org/2000/svg", "a": { "attrs": { "r": data.r, "transform": 'translate(32,32)' } } }));
}
function buildLine(spinner, duration, index, total) {
    var data = spinner.fn(duration, index, total);
    data.style.animationDuration = duration + 'ms';
    return h('svg', { "n": "http://www.w3.org/2000/svg", "s": data.style, "a": { "attrs": { "viewBox": '0 0 64 64' } } }, h('line', { "n": "http://www.w3.org/2000/svg", "a": { "attrs": { "y1": data.y1, "y2": data.y2, "transform": 'translate(32,32)' } } }));
}

exports['ION-SPINNER'] = Spinner;
},


/***************** ion-spinner *****************/
[
/** ion-spinner: [0] tag **/
'ION-SPINNER',

/** ion-spinner: [1] host **/
{}

]
)