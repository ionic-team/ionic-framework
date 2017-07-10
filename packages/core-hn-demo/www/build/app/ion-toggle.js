/*! Built with http://stenciljs.com */

App.defineComponents(

/**** module id ****/
'ion-toggle',

/**** component modules ****/
function importComponent(exports, h, t, Ionic) {
var Toggle = (function () {
    function Toggle() {
        this.activated = false;
        this.hasFocus = false;
        this.checked = false;
        this.disabled = false;
    }
    Toggle.prototype["componentWillLoad"] = function () {
        this.emitStyle();
    };
    Toggle.prototype.changed = function (val) {
        Ionic.emit(this, 'ionChange', { detail: { checked: val } });
        this.emitStyle();
    };
    Toggle.prototype.disableChanged = function () {
        this.emitStyle();
    };
    Toggle.prototype.emitStyle = function () {
        var _this = this;
        clearTimeout(this.styleTmr);
        this.styleTmr = setTimeout(function () {
            Ionic.emit(_this, 'ionStyle', {
                detail: {
                    'toggle-disabled': _this.disabled,
                    'toggle-checked': _this.checked,
                    'toggle-activated': _this.activated,
                    'toggle-focus': _this.hasFocus
                }
            });
        });
    };
    Toggle.prototype.canStart = function () {
        return !this.disabled;
    };
    Toggle.prototype.onDragStart = function (detail) {
        this.startX = detail.startX;
        this.fireFocus();
    };
    Toggle.prototype.onDragMove = function (detail) {
        if (this.checked) {
            if (detail.currentX + 15 < this.startX) {
                this.checked = false;
                this.activated = true;
                this.startX = detail.currentX;
            }
        }
        else if (detail.currentX - 15 > this.startX) {
            this.checked = true;
            this.activated = (detail.currentX < this.startX + 5);
            this.startX = detail.currentX;
        }
    };
    Toggle.prototype.onDragEnd = function (detail) {
        if (this.checked) {
            if (detail.startX + 4 > detail.currentX) {
                this.checked = false;
            }
        }
        else if (detail.startX - 4 < detail.currentX) {
            this.checked = true;
        }
        this.activated = false;
        this.fireBlur();
        this.startX = null;
    };
    Toggle.prototype.onSpace = function (ev) {
        this.toggle();
        ev.stopPropagation();
        ev.preventDefault();
    };
    Toggle.prototype.toggle = function () {
        if (!this.disabled) {
            this.checked = !this.checked;
            this.fireFocus();
        }
        return this.checked;
    };
    Toggle.prototype.fireFocus = function () {
        if (!this.hasFocus) {
            this.hasFocus = true;
            Ionic.emit(this, 'ionFocus');
            this.emitStyle();
        }
    };
    Toggle.prototype.fireBlur = function () {
        if (this.hasFocus) {
            this.hasFocus = false;
            Ionic.emit(this, 'ionBlur');
            this.emitStyle();
        }
    };
    Toggle.prototype.hostData = function () {
        return {
            class: {
                'toggle-activated': this.activated,
                'toggle-checked': this.checked,
                'toggle-disabled': this.disabled
            }
        };
    };
    Toggle.prototype.render = function () {
        return (h("ion-gesture", { "p": { "canStart": this.canStart.bind(this), "onStart": this.onDragStart.bind(this), "onMove": this.onDragMove.bind(this), "onEnd": this.onDragEnd.bind(this), "onPress": this.toggle.bind(this), "gestureName": 'toggle', "gesturePriority": 30, "type": 'pan,press', "direction": 'x', "threshold": 20, "attachTo": 'parent' } },
            h("div", { "c": { "toggle-icon": true } },
                h("div", { "c": { "toggle-inner": true } })),
            h("div", { "c": { "toggle-cover": true }, "p": { "attrs": { "id": this.id, "aria-checked": this.checked ? 'true' : false, "aria-disabled": this.disabled ? 'true' : false, "aria-labelledby": this.labelId, "role": 'checkbox', "tabindex": 0 } } })));
    };
    return Toggle;
}());

exports['ION-TOGGLE'] = Toggle;
},


/***************** ion-toggle *****************/
[
/** ion-toggle: [0] tag **/
'ION-TOGGLE',

/** ion-toggle: [1] host **/
{"theme":"toggle"},

/** ion-toggle: [2] listeners **/
[
  [
    /***** ion-toggle listener[0]  keydown.space -> keydown.space() *****/
    /* [0] eventMethod ***/ 'onSpace',
    /* [1] eventName *****/ 'keydown.space',
    /* [2] eventCapture **/ 0 /* false */,
    /* [3] eventPassive **/ 0 /* false */,
    /* [4] eventEnabled **/ 1 /* true **/
  ]
],

/** ion-toggle: [3] states **/
0 /* no states */,

/** ion-toggle: [4] propWillChanges **/
0 /* no prop will change methods */,

/** ion-toggle: [5] propDidChanges **/
[
  [
    /*****  ion-toggle prop did change [0] ***** /
    /* [0] prop name **/ 'checked',
    /* [1] call fn *****/ 'changed'
  ],
  [
    /*****  ion-toggle prop did change [1] ***** /
    /* [0] prop name **/ 'disabled',
    /* [1] call fn *****/ 'disableChanged'
  ]
]

]
)