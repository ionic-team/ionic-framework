/*! Built with http://stenciljs.com */

App.defineComponents(

/**** module id ****/
'fiber-demo.fiber-dot.fiber-triangle',

/**** component modules ****/
function importComponent(exports, h, t, Ionic) {
var FiberDemo = (function () {
    function FiberDemo() {
        this.elapsed = 0;
        this.seconds = 0;
    }
    FiberDemo.prototype["componentDidLoad"] = function () {
        var tick = this.tick.bind(this);
        this.intervalID = setInterval(tick, 1000);
    };
    FiberDemo.prototype.tick = function () {
        this.seconds = (this.seconds % 10) + 1;
    };
    FiberDemo.prototype.hostData = function () {
        var elapsed = this.elapsed;
        var t = (elapsed / 1000) % 10;
        var scale = 1 + (t > 5 ? 10 - t : t) / 10;
        var containerStyle = {
            position: 'absolute',
            transformOrigin: '0 0',
            left: '50%',
            top: '50%',
            width: '10px',
            height: '10px',
            background: '#eee',
            transform: 'scaleX(' + (scale / 2.1) + ') scaleY(0.7) translateZ(0.1px)'
        };
        return {
            style: containerStyle
        };
    };
    FiberDemo.prototype.render = function () {
        return (h("div", 0,
            h("fiber-triangle", { "p": { "x": 0, "y": 0, "s": 1000, "seconds": this.seconds } })));
    };
    return FiberDemo;
}());

var FiberDot = (function () {
    function FiberDot() {
        this.hover = false;
    }
    FiberDot.prototype.enter = function () {
        this.hover = true;
    };
    FiberDot.prototype.leave = function () {
        this.hover = false;
    };
    FiberDot.prototype.hostData = function () {
        var s = this.size * 1.3;
        var style = {
            position: 'absolute',
            font: 'normal 15px sans-serif',
            textAlign: 'center',
            cursor: 'pointer',
            width: s + 'px',
            height: s + 'px',
            left: (this.x) + 'px',
            top: (this.y) + 'px',
            borderRadius: (s / 2) + 'px',
            lineHeight: (s) + 'px',
            background: this.hover ? '#ff0' : '#61dafb'
        };
        return {
            style: style,
            on: {
                mouseenter: this.enter.bind(this),
                mouseleave: this.leave.bind(this)
            },
        };
    };
    FiberDot.prototype.render = function () {
        return (this.hover ? '**' + this.text + '**' : this.text);
    };
    return FiberDot;
}());

var targetSize = 25;
var FiberTriangle = (function () {
    function FiberTriangle() {
    }
    FiberTriangle.prototype.render = function () {
        var s = this.s;
        if (s <= targetSize) {
            return (h("fiber-dot", { "p": { "x": this.x - (targetSize / 2), "y": this.y - (targetSize / 2), "size": targetSize, "text": this.seconds.toString() } }));
        }
        s = s / 2;
        return [
            h("fiber-triangle", { "p": { "x": this.x, "y": this.y - (s / 2), "s": s, "seconds": this.seconds } }),
            h("fiber-triangle", { "p": { "x": this.x - s, "y": this.y + (s / 2), "s": s, "seconds": this.seconds } }),
            h("fiber-triangle", { "p": { "x": this.x + s, "y": this.y + (s / 2), "s": s, "seconds": this.seconds } })
        ];
    };
    return FiberTriangle;
}());

exports['FIBER-DEMO'] = FiberDemo;
exports['FIBER-DOT'] = FiberDot;
exports['FIBER-TRIANGLE'] = FiberTriangle;
},


/***************** fiber-demo *****************/
[
/** fiber-demo: [0] tag **/
'FIBER-DEMO',

/** fiber-demo: [1] host **/
{}

],

/***************** fiber-dot *****************/
[
/** fiber-dot: [0] tag **/
'FIBER-DOT',

/** fiber-dot: [1] host **/
{},

/** fiber-dot: [2] listeners **/
0 /* no listeners */,

/** fiber-dot: [3] states **/
['hover']

],

/***************** fiber-triangle *****************/
[
/** fiber-triangle: [0] tag **/
'FIBER-TRIANGLE',

/** fiber-triangle: [1] host **/
{}

]
)