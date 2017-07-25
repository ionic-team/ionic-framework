/*! Built with http://stenciljs.com */

App.defineComponents(

/**** module id ****/
'ion-loading.ion-loading-controller',

/**** component modules ****/
function importComponent(exports, h, t, Ionic) {
/**
 * iOS Loading Enter Animation
 */
var iOSEnterAnimation = function (baseElm) {
    var baseAnimation = new Ionic.Animation();
    var backdropAnimation = new Ionic.Animation();
    backdropAnimation.addElement(baseElm.querySelector('.loading-backdrop'));
    var wrapperAnimation = new Ionic.Animation();
    wrapperAnimation.addElement(baseElm.querySelector('.loading-wrapper'));
    backdropAnimation.fromTo('opacity', 0.01, 0.3);
    wrapperAnimation.fromTo('opacity', 0.01, 1)
        .fromTo('scale', 1.1, 1);
    return baseAnimation
        .addElement(baseElm)
        .easing('ease-in-out')
        .duration(200)
        .add(backdropAnimation)
        .add(wrapperAnimation);
};

/**
 * iOS Loading Leave Animation
 */
var iOSLeaveAnimation = function (baseElm) {
    var baseAnimation = new Ionic.Animation();
    var backdropAnimation = new Ionic.Animation();
    backdropAnimation.addElement(baseElm.querySelector('.loading-backdrop'));
    var wrapperAnimation = new Ionic.Animation();
    wrapperAnimation.addElement(baseElm.querySelector('.loading-wrapper'));
    backdropAnimation.fromTo('opacity', 0.3, 0);
    wrapperAnimation.fromTo('opacity', 0.99, 0)
        .fromTo('scale', 1, 0.9);
    return baseAnimation
        .addElement(baseElm)
        .easing('ease-in-out')
        .duration(200)
        .add(backdropAnimation)
        .add(wrapperAnimation);
};

var Loading = (function () {
    function Loading() {
        this.dismissOnPageChange = false;
        this.showSpinner = null;
        this.showBackdrop = true;
    }
    Loading.prototype.onDismiss = function (ev) {
        ev.stopPropagation();
        ev.preventDefault();
        this.dismiss();
    };
    Loading.prototype["componentDidLoad"] = function () {
        if (!this.spinner) {
            this.spinner = Ionic.config.get('loadingSpinner', Ionic.config.get('spinner', 'lines'));
        }
        if (this.showSpinner === null || this.showSpinner === undefined) {
            this.showSpinner = !!(this.spinner && this.spinner !== 'hide');
        }
        Ionic.emit(this, 'ionLoadingDidLoad', { detail: { loading: this } });
    };
    Loading.prototype.ionViewDidEnter = function () {
        var _this = this;
        // blur the currently active element
        var activeElement = document.activeElement;
        activeElement && activeElement.blur && activeElement.blur();
        // If there is a duration, dismiss after that amount of time
        if (typeof this.duration === 'number' && this.duration > 10) {
            this.durationTimeout = setTimeout(function () { return _this.dismiss(); }, this.duration);
        }
        Ionic.emit(this, 'ionLoadingDidPresent', { detail: { loading: this } });
    };
    Loading.prototype.present = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this._present(resolve);
        });
    };
    Loading.prototype._present = function (resolve) {
        var _this = this;
        if (this.animation) {
            this.animation.destroy();
            this.animation = null;
        }
        Ionic.emit(this, 'ionLoadingWillPresent', { detail: { loading: this } });
        // get the user's animation fn if one was provided
        var animationBuilder = this.enterAnimation;
        if (!animationBuilder) {
            // user did not provide a custom animation fn
            // decide from the config which animation to use
            // TODO!!
            animationBuilder = iOSEnterAnimation;
        }
        // build the animation and kick it off
        this.animation = animationBuilder(this.$el);
        this.animation.onFinish(function (a) {
            a.destroy();
            _this.ionViewDidEnter();
            resolve();
        }).play();
    };
    Loading.prototype.dismiss = function () {
        var _this = this;
        clearTimeout(this.durationTimeout);
        if (this.animation) {
            this.animation.destroy();
            this.animation = null;
        }
        return new Promise(function (resolve) {
            Ionic.emit(_this, 'ionLoadingWillDismiss', { detail: { loading: _this } });
            // get the user's animation fn if one was provided
            var animationBuilder = _this.exitAnimation;
            if (!animationBuilder) {
                // user did not provide a custom animation fn
                // decide from the config which animation to use
                // TODO!!
                animationBuilder = iOSLeaveAnimation;
            }
            // build the animation and kick it off
            _this.animation = animationBuilder(_this.$el);
            _this.animation.onFinish(function (a) {
                a.destroy();
                Ionic.emit(_this, 'ionLoadingDidDismiss', { detail: { loading: _this } });
                Core.dom.write(function () {
                    _this.$el.parentNode.removeChild(_this.$el);
                });
                resolve();
            }).play();
        });
    };
    Loading.prototype["componentDidunload"] = function () {
        Ionic.emit(this, 'ionLoadingDidUnload', { detail: { loading: this } });
    };
    Loading.prototype.render = function () {
        var userCssClass = 'loading-content';
        if (this.cssClass) {
            userCssClass += ' ' + this.cssClass;
        }
        var loadingInner = [];
        if (this.showSpinner) {
            loadingInner.push(h("div", { "c": { "loading-spinner": true } },
                h("ion-spinner", { "p": { "name": this.spinner } })));
        }
        if (this.content) {
            loadingInner.push(h("div", { "c": { "loading-content": true } }, this.content));
        }
        return [
            h("ion-gesture", { "c": { "loading-backdrop": true, "hide-backdrop": !this.showBackdrop }, "p": { "attachTo": 'parent', "autoBlockAll": true } }),
            h("div", { "c": { "loading-wrapper": true }, "a": { "role": 'dialog' } }, loadingInner)
        ];
    };
    return Loading;
}());

var LoadingController = (function () {
    function LoadingController() {
        this.ids = 0;
        this.loadingResolves = {};
        this.loadings = [];
    }
    LoadingController.prototype["componentDidLoad"] = function () {
        this.appRoot = document.querySelector('ion-app') || document.body;
        Ionic.loadController('loading', this);
    };
    LoadingController.prototype.load = function (opts) {
        var _this = this;
        // create ionic's wrapping ion-loading component
        var loading = document.createElement('ion-loading');
        var id = this.ids++;
        // give this loading a unique id
        loading.id = "loading-" + id;
        loading.style.zIndex = (20000 + id);
        // convert the passed in loading options into props
        // that get passed down into the new loading
        Object.assign(loading, opts);
        // append the loading element to the document body
        this.appRoot.appendChild(loading);
        // store the resolve function to be called later up when the loading loads
        return new Promise(function (resolve) {
            _this.loadingResolves[loading.id] = resolve;
        });
    };
    LoadingController.prototype.viewDidLoad = function (ev) {
        var loading = ev.detail.loading;
        var loadingResolve = this.loadingResolves[loading.id];
        if (loadingResolve) {
            loadingResolve(loading);
            delete this.loadingResolves[loading.id];
        }
    };
    LoadingController.prototype.willPresent = function (ev) {
        this.loadings.push(ev.detail.loading);
    };
    LoadingController.prototype.willDismiss = function (ev) {
        var index = this.loadings.indexOf(ev.detail.loading);
        if (index > -1) {
            this.loadings.splice(index, 1);
        }
    };
    LoadingController.prototype.escapeKeyUp = function () {
        var lastLoading = this.loadings[this.loadings.length - 1];
        if (lastLoading) {
            lastLoading.dismiss();
        }
    };
    return LoadingController;
}());

exports['ION-LOADING'] = Loading;
exports['ION-LOADING-CONTROLLER'] = LoadingController;
},


/***************** ion-loading *****************/
[
/** ion-loading: [0] tag **/
'ION-LOADING',

/** ion-loading: [1] host **/
{"theme":"loading"},

/** ion-loading: [2] listeners **/
[
  [
    /***** ion-loading listener[0]  ionDismiss -> ionDismiss() *****/
    /* [0] eventMethod ***/ 'onDismiss',
    /* [1] eventName *****/ 'ionDismiss',
    /* [2] eventCapture **/ 0 /* false */,
    /* [3] eventPassive **/ 0 /* false */,
    /* [4] eventEnabled **/ 1 /* true **/
  ]
],

/** ion-loading: [3] states **/
['showSpinner', 'spinner']

],

/***************** ion-loading-controller *****************/
[
/** ion-loading-controller: [0] tag **/
'ION-LOADING-CONTROLLER',

/** ion-loading-controller: [1] host **/
{},

/** ion-loading-controller: [2] listeners **/
[
  [
    /***** ion-loading-controller listener[0]  body:ionLoadingDidLoad -> body:ionLoadingDidLoad() *****/
    /* [0] eventMethod ***/ 'viewDidLoad',
    /* [1] eventName *****/ 'body:ionLoadingDidLoad',
    /* [2] eventCapture **/ 0 /* false */,
    /* [3] eventPassive **/ 0 /* false */,
    /* [4] eventEnabled **/ 1 /* true **/
  ],
  [
    /***** ion-loading-controller listener[1]  body:ionLoadingDidUnload -> body:ionLoadingDidUnload() *****/
    /* [0] eventMethod ***/ 'willDismiss',
    /* [1] eventName *****/ 'body:ionLoadingDidUnload',
    /* [2] eventCapture **/ 0 /* false */,
    /* [3] eventPassive **/ 0 /* false */,
    /* [4] eventEnabled **/ 1 /* true **/
  ],
  [
    /***** ion-loading-controller listener[2]  body:ionLoadingWillDismiss -> body:ionLoadingWillDismiss() *****/
    /* [0] eventMethod ***/ 'willDismiss',
    /* [1] eventName *****/ 'body:ionLoadingWillDismiss',
    /* [2] eventCapture **/ 0 /* false */,
    /* [3] eventPassive **/ 0 /* false */,
    /* [4] eventEnabled **/ 1 /* true **/
  ],
  [
    /***** ion-loading-controller listener[3]  body:ionLoadingWillPresent -> body:ionLoadingWillPresent() *****/
    /* [0] eventMethod ***/ 'willPresent',
    /* [1] eventName *****/ 'body:ionLoadingWillPresent',
    /* [2] eventCapture **/ 0 /* false */,
    /* [3] eventPassive **/ 0 /* false */,
    /* [4] eventEnabled **/ 1 /* true **/
  ],
  [
    /***** ion-loading-controller listener[4]  body:keyup.escape -> body:keyup.escape() *****/
    /* [0] eventMethod ***/ 'escapeKeyUp',
    /* [1] eventName *****/ 'body:keyup.escape',
    /* [2] eventCapture **/ 0 /* false */,
    /* [3] eventPassive **/ 0 /* false */,
    /* [4] eventEnabled **/ 1 /* true **/
  ]
]

]
)