(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../util/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require("../util/util");
    /**
     * @hidden
     */
    var Animation = (function () {
        /**
         * @param {?} plt
         * @param {?=} ele
         * @param {?=} opts
         */
        function Animation(plt, ele, opts) {
            this._dur = null;
            this._es = null;
            this._rvEs = null;
            this.hasChildren = false;
            this.isPlaying = false;
            this.hasCompleted = false;
            this.plt = plt;
            this.element(ele);
            this.opts = opts;
        }
        /**
         * @param {?} ele
         * @return {?}
         */
        Animation.prototype.element = function (ele) {
            if (ele) {
                if (typeof ele === 'string') {
                    ele = this.plt.doc().querySelectorAll(ele);
                    for (var /** @type {?} */ i = 0; i < ele.length; i++) {
                        this._addEle(ele[i]);
                    }
                }
                else if (ele.length) {
                    for (var /** @type {?} */ i = 0; i < ele.length; i++) {
                        this._addEle(ele[i]);
                    }
                }
                else {
                    this._addEle(ele);
                }
            }
            return this;
        };
        /**
         * NO DOM
         * @param {?} ele
         * @return {?}
         */
        Animation.prototype._addEle = function (ele) {
            if (ele.nativeElement) {
                ele = ele.nativeElement;
            }
            if (((ele)).nodeType === 1) {
                this._eL = (this._e = this._e || []).push(ele);
            }
        };
        /**
         * Add a child animation to this animation.
         * @param {?} childAnimation
         * @return {?}
         */
        Animation.prototype.add = function (childAnimation) {
            childAnimation.parent = this;
            this.hasChildren = true;
            this._cL = (this._c = this._c || []).push(childAnimation);
            return this;
        };
        /**
         * Get the duration of this animation. If this animation does
         * not have a duration, then it'll get the duration from its parent.
         * @param {?=} opts
         * @return {?}
         */
        Animation.prototype.getDuration = function (opts) {
            if (opts && util_1.isDefined(opts.duration)) {
                return opts.duration;
            }
            else if (this._dur !== null) {
                return this._dur;
            }
            else if (this.parent) {
                return this.parent.getDuration();
            }
            return 0;
        };
        /**
         * Returns if the animation is a root one.
         * @return {?}
         */
        Animation.prototype.isRoot = function () {
            return !this.parent;
        };
        /**
         * Set the duration for this animation.
         * @param {?} milliseconds
         * @return {?}
         */
        Animation.prototype.duration = function (milliseconds) {
            this._dur = milliseconds;
            return this;
        };
        /**
         * Get the easing of this animation. If this animation does
         * not have an easing, then it'll get the easing from its parent.
         * @return {?}
         */
        Animation.prototype.getEasing = function () {
            if (this._rv && this._rvEs) {
                return this._rvEs;
            }
            return this._es !== null ? this._es : (this.parent && this.parent.getEasing()) || null;
        };
        /**
         * Set the easing for this animation.
         * @param {?} name
         * @return {?}
         */
        Animation.prototype.easing = function (name) {
            this._es = name;
            return this;
        };
        /**
         * Set the easing for this reversed animation.
         * @param {?} name
         * @return {?}
         */
        Animation.prototype.easingReverse = function (name) {
            this._rvEs = name;
            return this;
        };
        /**
         * Add the "from" value for a specific property.
         * @param {?} prop
         * @param {?} val
         * @return {?}
         */
        Animation.prototype.from = function (prop, val) {
            this._addProp('from', prop, val);
            return this;
        };
        /**
         * Add the "to" value for a specific property.
         * @param {?} prop
         * @param {?} val
         * @param {?=} clearProperyAfterTransition
         * @return {?}
         */
        Animation.prototype.to = function (prop, val, clearProperyAfterTransition) {
            var /** @type {?} */ fx = this._addProp('to', prop, val);
            if (clearProperyAfterTransition) {
                // if this effect is a transform then clear the transform effect
                // otherwise just clear the actual property
                this.afterClearStyles([fx.trans ? this.plt.Css.transform : prop]);
            }
            return this;
        };
        /**
         * Shortcut to add both the "from" and "to" for the same property.
         * @param {?} prop
         * @param {?} fromVal
         * @param {?} toVal
         * @param {?=} clearProperyAfterTransition
         * @return {?}
         */
        Animation.prototype.fromTo = function (prop, fromVal, toVal, clearProperyAfterTransition) {
            return this.from(prop, fromVal).to(prop, toVal, clearProperyAfterTransition);
        };
        /**
         * @hidden
         * NO DOM
         * @param {?} name
         * @return {?}
         */
        Animation.prototype._getProp = function (name) {
            if (this._fx) {
                return this._fx.find(function (prop) { return prop.name === name; });
            }
            else {
                this._fx = [];
            }
            return null;
        };
        /**
         * @param {?} state
         * @param {?} prop
         * @param {?} val
         * @return {?}
         */
        Animation.prototype._addProp = function (state, prop, val) {
            var /** @type {?} */ fxProp = this._getProp(prop);
            if (!fxProp) {
                // first time we've see this EffectProperty
                var /** @type {?} */ shouldTrans = (ANIMATION_TRANSFORMS[prop] === 1);
                fxProp = {
                    name: prop,
                    trans: shouldTrans,
                    // add the will-change property for transforms or opacity
                    wc: (shouldTrans ? this.plt.Css.transform : prop)
                };
                this._fx.push(fxProp);
            }
            // add from/to EffectState to the EffectProperty
            var /** @type {?} */ fxState = {
                val: val,
                num: null,
                unit: '',
            };
            fxProp[state] = fxState;
            if (typeof val === 'string' && val.indexOf(' ') < 0) {
                var /** @type {?} */ r = val.match(ANIMATION_CSS_VALUE_REGEX);
                var /** @type {?} */ num = parseFloat(r[1]);
                if (!isNaN(num)) {
                    fxState.num = num;
                }
                fxState.unit = (r[0] !== r[2] ? r[2] : '');
            }
            else if (typeof val === 'number') {
                fxState.num = val;
            }
            return fxProp;
        };
        /**
         * Add CSS class to this animation's elements
         * before the animation begins.
         * @param {?} className
         * @return {?}
         */
        Animation.prototype.beforeAddClass = function (className) {
            (this._bfAdd = this._bfAdd || []).push(className);
            return this;
        };
        /**
         * Remove CSS class from this animation's elements
         * before the animation begins.
         * @param {?} className
         * @return {?}
         */
        Animation.prototype.beforeRemoveClass = function (className) {
            (this._bfRm = this._bfRm || []).push(className);
            return this;
        };
        /**
         * Set CSS inline styles to this animation's elements
         * before the animation begins.
         * @param {?} styles
         * @return {?}
         */
        Animation.prototype.beforeStyles = function (styles) {
            this._bfSty = styles;
            return this;
        };
        /**
         * Clear CSS inline styles from this animation's elements
         * before the animation begins.
         * @param {?} propertyNames
         * @return {?}
         */
        Animation.prototype.beforeClearStyles = function (propertyNames) {
            this._bfSty = this._bfSty || {};
            for (var /** @type {?} */ i = 0; i < propertyNames.length; i++) {
                this._bfSty[propertyNames[i]] = '';
            }
            return this;
        };
        /**
         * Add a function which contains DOM reads, which will run
         * before the animation begins.
         * @param {?} domReadFn
         * @return {?}
         */
        Animation.prototype.beforeAddRead = function (domReadFn) {
            (this._rdFn = this._rdFn || []).push(domReadFn);
            return this;
        };
        /**
         * Add a function which contains DOM writes, which will run
         * before the animation begins.
         * @param {?} domWriteFn
         * @return {?}
         */
        Animation.prototype.beforeAddWrite = function (domWriteFn) {
            (this._wrFn = this._wrFn || []).push(domWriteFn);
            return this;
        };
        /**
         * Add CSS class to this animation's elements
         * after the animation finishes.
         * @param {?} className
         * @return {?}
         */
        Animation.prototype.afterAddClass = function (className) {
            (this._afAdd = this._afAdd || []).push(className);
            return this;
        };
        /**
         * Remove CSS class from this animation's elements
         * after the animation finishes.
         * @param {?} className
         * @return {?}
         */
        Animation.prototype.afterRemoveClass = function (className) {
            (this._afRm = this._afRm || []).push(className);
            return this;
        };
        /**
         * Set CSS inline styles to this animation's elements
         * after the animation finishes.
         * @param {?} styles
         * @return {?}
         */
        Animation.prototype.afterStyles = function (styles) {
            this._afSty = styles;
            return this;
        };
        /**
         * Clear CSS inline styles from this animation's elements
         * after the animation finishes.
         * @param {?} propertyNames
         * @return {?}
         */
        Animation.prototype.afterClearStyles = function (propertyNames) {
            this._afSty = this._afSty || {};
            for (var /** @type {?} */ i = 0; i < propertyNames.length; i++) {
                this._afSty[propertyNames[i]] = '';
            }
            return this;
        };
        /**
         * Play the animation.
         * @param {?=} opts
         * @return {?}
         */
        Animation.prototype.play = function (opts) {
            var _this = this;
            // If the animation was already invalidated (it did finish), do nothing
            if (!this.plt) {
                return;
            }
            // this is the top level animation and is in full control
            // of when the async play() should actually kick off
            // if there is no duration then it'll set the TO property immediately
            // if there is a duration, then it'll stage all animations at the
            // FROM property and transition duration, wait a few frames, then
            // kick off the animation by setting the TO property for each animation
            this._isAsync = this._hasDuration(opts);
            // ensure all past transition end events have been cleared
            this._clearAsync();
            // recursively kicks off the correct progress step for each child animation
            // ******** DOM WRITE ****************
            this._playInit(opts);
            // doubling up RAFs since this animation was probably triggered
            // from an input event, and just having one RAF would have this code
            // run within the same frame as the triggering input event, and the
            // input event probably already did way too much work for one frame
            this.plt.raf(function () {
                _this.plt.raf(_this._playDomInspect.bind(_this, opts));
            });
        };
        /**
         * @return {?}
         */
        Animation.prototype.syncPlay = function () {
            // If the animation was already invalidated (it did finish), do nothing
            if (!this.plt) {
                return;
            }
            var /** @type {?} */ opts = { duration: 0 };
            this._isAsync = false;
            this._clearAsync();
            this._playInit(opts);
            this._playDomInspect(opts);
        };
        /**
         * @hidden
         * DOM WRITE
         * RECURSION
         * @param {?} opts
         * @return {?}
         */
        Animation.prototype._playInit = function (opts) {
            // always default that an animation does not tween
            // a tween requires that an Animation class has an element
            // and that it has at least one FROM/TO effect
            // and that the FROM/TO effect can tween numeric values
            this._twn = false;
            this.isPlaying = true;
            this.hasCompleted = false;
            this._hasDur = (this.getDuration(opts) > ANIMATION_DURATION_MIN);
            var /** @type {?} */ children = this._c;
            for (var /** @type {?} */ i = 0; i < this._cL; i++) {
                // ******** DOM WRITE ****************
                children[i]._playInit(opts);
            }
            if (this._hasDur) {
                // if there is a duration then we want to start at step 0
                // ******** DOM WRITE ****************
                this._progress(0);
                // add the will-change properties
                // ******** DOM WRITE ****************
                this._willChg(true);
            }
        };
        /**
         * @hidden
         * DOM WRITE
         * NO RECURSION
         * ROOT ANIMATION
         * @param {?} opts
         * @return {?}
         */
        Animation.prototype._playDomInspect = function (opts) {
            // fire off all the "before" function that have DOM READS in them
            // elements will be in the DOM, however visibily hidden
            // so we can read their dimensions if need be
            // ******** DOM READ ****************
            // ******** DOM WRITE ****************
            this._beforeAnimation();
            // for the root animation only
            // set the async TRANSITION END event
            // and run onFinishes when the transition ends
            var /** @type {?} */ dur = this.getDuration(opts);
            if (this._isAsync) {
                this._asyncEnd(dur, true);
            }
            // ******** DOM WRITE ****************
            this._playProgress(opts);
            if (this._isAsync && this.plt) {
                // this animation has a duration so we need another RAF
                // for the CSS TRANSITION properties to kick in
                this.plt.raf(this._playToStep.bind(this, 1));
            }
        };
        /**
         * @hidden
         * DOM WRITE
         * RECURSION
         * @param {?} opts
         * @return {?}
         */
        Animation.prototype._playProgress = function (opts) {
            var /** @type {?} */ children = this._c;
            for (var /** @type {?} */ i = 0; i < this._cL; i++) {
                // ******** DOM WRITE ****************
                children[i]._playProgress(opts);
            }
            if (this._hasDur) {
                // set the CSS TRANSITION duration/easing
                // ******** DOM WRITE ****************
                this._setTrans(this.getDuration(opts), false);
            }
            else {
                // this animation does not have a duration, so it should not animate
                // just go straight to the TO properties and call it done
                // ******** DOM WRITE ****************
                this._progress(1);
                // since there was no animation, immediately run the after
                // ******** DOM WRITE ****************
                this._setAfterStyles();
                // this animation has no duration, so it has finished
                // other animations could still be running
                this._didFinish(true);
            }
        };
        /**
         * @hidden
         * DOM WRITE
         * RECURSION
         * @param {?} stepValue
         * @return {?}
         */
        Animation.prototype._playToStep = function (stepValue) {
            var /** @type {?} */ children = this._c;
            for (var /** @type {?} */ i = 0; i < this._cL; i++) {
                // ******** DOM WRITE ****************
                children[i]._playToStep(stepValue);
            }
            if (this._hasDur) {
                // browser had some time to render everything in place
                // and the transition duration/easing is set
                // now set the TO properties which will trigger the transition to begin
                // ******** DOM WRITE ****************
                this._progress(stepValue);
            }
        };
        /**
         * @hidden
         * DOM WRITE
         * NO RECURSION
         * ROOT ANIMATION
         * @param {?} dur
         * @param {?} shouldComplete
         * @return {?}
         */
        Animation.prototype._asyncEnd = function (dur, shouldComplete) {
            (void 0) /* assert */;
            (void 0) /* assert */;
            (void 0) /* assert */;
            var /** @type {?} */ self = this;
            /**
             * @return {?}
             */
            function onTransitionEnd() {
                // congrats! a successful transition completed!
                // ensure transition end events and timeouts have been cleared
                self._clearAsync();
                // ******** DOM WRITE ****************
                self._playEnd();
                // transition finished
                self._didFinishAll(shouldComplete, true, false);
            }
            /**
             * @return {?}
             */
            function onTransitionFallback() {
                (void 0) /* console.debug */;
                // oh noz! the transition end event didn't fire in time!
                // instead the fallback timer when first
                // if all goes well this fallback should never fire
                // clear the other async end events from firing
                self._tm = undefined;
                self._clearAsync();
                // set the after styles
                // ******** DOM WRITE ****************
                self._playEnd(shouldComplete ? 1 : 0);
                // transition finished
                self._didFinishAll(shouldComplete, true, false);
            }
            // set the TRANSITION END event on one of the transition elements
            self._unrgTrns = this.plt.transitionEnd(self._transEl(), onTransitionEnd, false);
            // set a fallback timeout if the transition end event never fires, or is too slow
            // transition end fallback: (animation duration + XXms)
            self._tm = self.plt.timeout(onTransitionFallback, (dur + ANIMATION_TRANSITION_END_FALLBACK_PADDING_MS));
        };
        /**
         * @hidden
         * DOM WRITE
         * RECURSION
         * @param {?=} stepValue
         * @return {?}
         */
        Animation.prototype._playEnd = function (stepValue) {
            var /** @type {?} */ children = this._c;
            for (var /** @type {?} */ i = 0; i < this._cL; i++) {
                // ******** DOM WRITE ****************
                children[i]._playEnd(stepValue);
            }
            if (this._hasDur) {
                if (util_1.isDefined(stepValue)) {
                    // too late to have a smooth animation, just finish it
                    // ******** DOM WRITE ****************
                    this._setTrans(0, true);
                    // ensure the ending progress step gets rendered
                    // ******** DOM WRITE ****************
                    this._progress(stepValue);
                }
                // set the after styles
                // ******** DOM WRITE ****************
                this._setAfterStyles();
                // remove the will-change properties
                // ******** DOM WRITE ****************
                this._willChg(false);
            }
        };
        /**
         * @hidden
         * NO DOM
         * RECURSION
         * @param {?} opts
         * @return {?}
         */
        Animation.prototype._hasDuration = function (opts) {
            if (this.getDuration(opts) > ANIMATION_DURATION_MIN) {
                return true;
            }
            var /** @type {?} */ children = this._c;
            for (var /** @type {?} */ i = 0; i < this._cL; i++) {
                if (children[i]._hasDuration(opts)) {
                    return true;
                }
            }
            return false;
        };
        /**
         * @hidden
         * NO DOM
         * RECURSION
         * @return {?}
         */
        Animation.prototype._hasDomReads = function () {
            if (this._rdFn && this._rdFn.length) {
                return true;
            }
            var /** @type {?} */ children = this._c;
            for (var /** @type {?} */ i = 0; i < this._cL; i++) {
                if (children[i]._hasDomReads()) {
                    return true;
                }
            }
            return false;
        };
        /**
         * Immediately stop at the end of the animation.
         * @param {?=} stepValue
         * @return {?}
         */
        Animation.prototype.stop = function (stepValue) {
            if (stepValue === void 0) { stepValue = 1; }
            // ensure all past transition end events have been cleared
            this._clearAsync();
            this._hasDur = true;
            this._playEnd(stepValue);
        };
        /**
         * @hidden
         * NO DOM
         * NO RECURSION
         * @return {?}
         */
        Animation.prototype._clearAsync = function () {
            this._unrgTrns && this._unrgTrns();
            this._tm && clearTimeout(this._tm);
            this._tm = this._unrgTrns = undefined;
        };
        /**
         * @hidden
         * DOM WRITE
         * NO RECURSION
         * @param {?} stepValue
         * @return {?}
         */
        Animation.prototype._progress = function (stepValue) {
            // bread 'n butter
            var /** @type {?} */ val;
            var /** @type {?} */ effects = this._fx;
            var /** @type {?} */ nuElements = this._eL;
            if (!effects || !nuElements) {
                return;
            }
            // flip the number if we're going in reverse
            if (this._rv) {
                stepValue = ((stepValue * -1) + 1);
            }
            var /** @type {?} */ i, /** @type {?} */ j;
            var /** @type {?} */ finalTransform = '';
            var /** @type {?} */ elements = this._e;
            for (i = 0; i < effects.length; i++) {
                var /** @type {?} */ fx = effects[i];
                if (fx.from && fx.to) {
                    var /** @type {?} */ fromNum = fx.from.num;
                    var /** @type {?} */ toNum = fx.to.num;
                    var /** @type {?} */ tweenEffect = (fromNum !== toNum);
                    (void 0) /* assert */;
                    if (tweenEffect) {
                        this._twn = true;
                    }
                    if (stepValue === 0) {
                        // FROM
                        val = fx.from.val;
                    }
                    else if (stepValue === 1) {
                        // TO
                        val = fx.to.val;
                    }
                    else if (tweenEffect) {
                        // EVERYTHING IN BETWEEN
                        var /** @type {?} */ valNum = (((toNum - fromNum) * stepValue) + fromNum);
                        var /** @type {?} */ unit = fx.to.unit;
                        if (unit === 'px') {
                            valNum = Math.round(valNum);
                        }
                        val = valNum + unit;
                    }
                    if (val !== null) {
                        var /** @type {?} */ prop = fx.name;
                        if (fx.trans) {
                            finalTransform += prop + '(' + val + ') ';
                        }
                        else {
                            for (j = 0; j < nuElements; j++) {
                                // ******** DOM WRITE ****************
                                ((elements[j].style))[prop] = val;
                            }
                        }
                    }
                }
            }
            // place all transforms on the same property
            if (finalTransform.length) {
                if (!this._rv && stepValue !== 1 || this._rv && stepValue !== 0) {
                    finalTransform += 'translateZ(0px)';
                }
                var /** @type {?} */ cssTransform = this.plt.Css.transform;
                for (i = 0; i < elements.length; i++) {
                    // ******** DOM WRITE ****************
                    ((elements[i].style))[cssTransform] = finalTransform;
                }
            }
        };
        /**
         * @hidden
         * DOM WRITE
         * NO RECURSION
         * @param {?} dur
         * @param {?} forcedLinearEasing
         * @return {?}
         */
        Animation.prototype._setTrans = function (dur, forcedLinearEasing) {
            // Transition is not enabled if there are not effects
            if (!this._fx) {
                return;
            }
            // set the TRANSITION properties inline on the element
            var /** @type {?} */ elements = this._e;
            var /** @type {?} */ easing = (forcedLinearEasing ? 'linear' : this.getEasing());
            var /** @type {?} */ durString = dur + 'ms';
            var /** @type {?} */ Css = this.plt.Css;
            var /** @type {?} */ cssTransform = Css.transition;
            var /** @type {?} */ cssTransitionDuration = Css.transitionDuration;
            var /** @type {?} */ cssTransitionTimingFn = Css.transitionTimingFn;
            var /** @type {?} */ eleStyle;
            for (var /** @type {?} */ i = 0; i < this._eL; i++) {
                eleStyle = elements[i].style;
                if (dur > 0) {
                    // ******** DOM WRITE ****************
                    eleStyle[cssTransform] = '';
                    eleStyle[cssTransitionDuration] = durString;
                    // each animation can have a different easing
                    if (easing) {
                        // ******** DOM WRITE ****************
                        eleStyle[cssTransitionTimingFn] = easing;
                    }
                }
                else {
                    eleStyle[cssTransform] = 'none';
                }
            }
        };
        /**
         * @hidden
         * DOM READ
         * DOM WRITE
         * RECURSION
         * @return {?}
         */
        Animation.prototype._beforeAnimation = function () {
            // fire off all the "before" function that have DOM READS in them
            // elements will be in the DOM, however visibily hidden
            // so we can read their dimensions if need be
            // ******** DOM READ ****************
            this._fireBeforeReadFunc();
            // ******** DOM READS ABOVE / DOM WRITES BELOW ****************
            // fire off all the "before" function that have DOM WRITES in them
            // ******** DOM WRITE ****************
            this._fireBeforeWriteFunc();
            // stage all of the before css classes and inline styles
            // ******** DOM WRITE ****************
            this._setBeforeStyles();
        };
        /**
         * @hidden
         * DOM WRITE
         * RECURSION
         * @return {?}
         */
        Animation.prototype._setBeforeStyles = function () {
            var /** @type {?} */ i, /** @type {?} */ j;
            var /** @type {?} */ children = this._c;
            for (i = 0; i < this._cL; i++) {
                children[i]._setBeforeStyles();
            }
            // before the animations have started
            // only set before styles if animation is not reversed
            if (this._rv) {
                return;
            }
            var /** @type {?} */ addClasses = this._bfAdd;
            var /** @type {?} */ removeClasses = this._bfRm;
            var /** @type {?} */ ele;
            var /** @type {?} */ eleClassList;
            var /** @type {?} */ prop;
            for (i = 0; i < this._eL; i++) {
                ele = this._e[i];
                eleClassList = ele.classList;
                // css classes to add before the animation
                if (addClasses) {
                    for (j = 0; j < addClasses.length; j++) {
                        // ******** DOM WRITE ****************
                        eleClassList.add(addClasses[j]);
                    }
                }
                // css classes to remove before the animation
                if (removeClasses) {
                    for (j = 0; j < removeClasses.length; j++) {
                        // ******** DOM WRITE ****************
                        eleClassList.remove(removeClasses[j]);
                    }
                }
                // inline styles to add before the animation
                if (this._bfSty) {
                    for (prop in this._bfSty) {
                        // ******** DOM WRITE ****************
                        ((ele)).style[prop] = this._bfSty[prop];
                    }
                }
            }
        };
        /**
         * @hidden
         * DOM READ
         * RECURSION
         * @return {?}
         */
        Animation.prototype._fireBeforeReadFunc = function () {
            var /** @type {?} */ children = this._c;
            for (var /** @type {?} */ i = 0; i < this._cL; i++) {
                // ******** DOM READ ****************
                children[i]._fireBeforeReadFunc();
            }
            var /** @type {?} */ readFunctions = this._rdFn;
            if (readFunctions) {
                for (var /** @type {?} */ i = 0; i < readFunctions.length; i++) {
                    // ******** DOM READ ****************
                    readFunctions[i]();
                }
            }
        };
        /**
         * @hidden
         * DOM WRITE
         * RECURSION
         * @return {?}
         */
        Animation.prototype._fireBeforeWriteFunc = function () {
            var /** @type {?} */ children = this._c;
            for (var /** @type {?} */ i = 0; i < this._cL; i++) {
                // ******** DOM WRITE ****************
                children[i]._fireBeforeWriteFunc();
            }
            var /** @type {?} */ writeFunctions = this._wrFn;
            if (this._wrFn) {
                for (var /** @type {?} */ i = 0; i < writeFunctions.length; i++) {
                    // ******** DOM WRITE ****************
                    writeFunctions[i]();
                }
            }
        };
        /**
         * @hidden
         * DOM WRITE
         * @return {?}
         */
        Animation.prototype._setAfterStyles = function () {
            var /** @type {?} */ i, /** @type {?} */ j;
            var /** @type {?} */ ele;
            var /** @type {?} */ eleClassList;
            var /** @type {?} */ elements = this._e;
            for (i = 0; i < this._eL; i++) {
                ele = elements[i];
                eleClassList = ele.classList;
                // remove the transition duration/easing
                // ******** DOM WRITE ****************
                ((ele)).style[this.plt.Css.transitionDuration] = ((ele)).style[this.plt.Css.transitionTimingFn] = '';
                if (this._rv) {
                    // finished in reverse direction
                    // css classes that were added before the animation should be removed
                    if (this._bfAdd) {
                        for (j = 0; j < this._bfAdd.length; j++) {
                            // ******** DOM WRITE ****************
                            eleClassList.remove(this._bfAdd[j]);
                        }
                    }
                    // css classes that were removed before the animation should be added
                    if (this._bfRm) {
                        for (j = 0; j < this._bfRm.length; j++) {
                            // ******** DOM WRITE ****************
                            eleClassList.add(this._bfRm[j]);
                        }
                    }
                    // inline styles that were added before the animation should be removed
                    if (this._bfSty) {
                        for (var /** @type {?} */ prop in this._bfSty) {
                            // ******** DOM WRITE ****************
                            ((ele)).style[prop] = '';
                        }
                    }
                }
                else {
                    // finished in forward direction
                    // css classes to add after the animation
                    if (this._afAdd) {
                        for (j = 0; j < this._afAdd.length; j++) {
                            // ******** DOM WRITE ****************
                            eleClassList.add(this._afAdd[j]);
                        }
                    }
                    // css classes to remove after the animation
                    if (this._afRm) {
                        for (j = 0; j < this._afRm.length; j++) {
                            // ******** DOM WRITE ****************
                            eleClassList.remove(this._afRm[j]);
                        }
                    }
                    // inline styles to add after the animation
                    if (this._afSty) {
                        for (var /** @type {?} */ prop in this._afSty) {
                            // ******** DOM WRITE ****************
                            ((ele)).style[prop] = this._afSty[prop];
                        }
                    }
                }
            }
        };
        /**
         * @hidden
         * DOM WRITE
         * NO RECURSION
         * @param {?} addWillChange
         * @return {?}
         */
        Animation.prototype._willChg = function (addWillChange) {
            var /** @type {?} */ wc;
            var /** @type {?} */ effects = this._fx;
            var /** @type {?} */ willChange;
            if (addWillChange && effects) {
                wc = [];
                for (var /** @type {?} */ i = 0; i < effects.length; i++) {
                    var /** @type {?} */ propWC = effects[i].wc;
                    if (propWC === 'webkitTransform') {
                        wc.push('transform', '-webkit-transform');
                    }
                    else {
                        wc.push(propWC);
                    }
                }
                willChange = wc.join(',');
            }
            else {
                willChange = '';
            }
            for (var /** @type {?} */ i = 0; i < this._eL; i++) {
                // ******** DOM WRITE ****************
                ((this._e[i])).style.willChange = willChange;
            }
        };
        /**
         * Start the animation with a user controlled progress.
         * @return {?}
         */
        Animation.prototype.progressStart = function () {
            // ensure all past transition end events have been cleared
            this._clearAsync();
            // ******** DOM READ/WRITE ****************
            this._beforeAnimation();
            // ******** DOM WRITE ****************
            this._progressStart();
        };
        /**
         * @hidden
         * DOM WRITE
         * RECURSION
         * @return {?}
         */
        Animation.prototype._progressStart = function () {
            var /** @type {?} */ children = this._c;
            for (var /** @type {?} */ i = 0; i < this._cL; i++) {
                // ******** DOM WRITE ****************
                children[i]._progressStart();
            }
            // force no duration, linear easing
            // ******** DOM WRITE ****************
            this._setTrans(0, true);
            // ******** DOM WRITE ****************
            this._willChg(true);
        };
        /**
         * Set the progress step for this animation.
         * progressStep() is not debounced, so it should not be called faster than 60FPS.
         * @param {?} stepValue
         * @return {?}
         */
        Animation.prototype.progressStep = function (stepValue) {
            // only update if the last update was more than 16ms ago
            stepValue = Math.min(1, Math.max(0, stepValue));
            var /** @type {?} */ children = this._c;
            for (var /** @type {?} */ i = 0; i < this._cL; i++) {
                // ******** DOM WRITE ****************
                children[i].progressStep(stepValue);
            }
            if (this._rv) {
                // if the animation is going in reverse then
                // flip the step value: 0 becomes 1, 1 becomes 0
                stepValue = ((stepValue * -1) + 1);
            }
            // ******** DOM WRITE ****************
            this._progress(stepValue);
        };
        /**
         * End the progress animation.
         * @param {?} shouldComplete
         * @param {?} currentStepValue
         * @param {?=} dur
         * @return {?}
         */
        Animation.prototype.progressEnd = function (shouldComplete, currentStepValue, dur) {
            if (dur === void 0) { dur = -1; }
            (void 0) /* console.debug */;
            if (this._rv) {
                // if the animation is going in reverse then
                // flip the step value: 0 becomes 1, 1 becomes 0
                currentStepValue = ((currentStepValue * -1) + 1);
            }
            var /** @type {?} */ stepValue = shouldComplete ? 1 : 0;
            var /** @type {?} */ diff = Math.abs(currentStepValue - stepValue);
            if (diff < 0.05) {
                dur = 0;
            }
            else if (dur < 0) {
                dur = this._dur;
            }
            this._isAsync = (dur > 30);
            this._progressEnd(shouldComplete, stepValue, dur, this._isAsync);
            if (this._isAsync) {
                // for the root animation only
                // set the async TRANSITION END event
                // and run onFinishes when the transition ends
                // ******** DOM WRITE ****************
                this._asyncEnd(dur, shouldComplete);
                // this animation has a duration so we need another RAF
                // for the CSS TRANSITION properties to kick in
                this.plt && this.plt.raf(this._playToStep.bind(this, stepValue));
            }
        };
        /**
         * @hidden
         * DOM WRITE
         * RECURSION
         * @param {?} shouldComplete
         * @param {?} stepValue
         * @param {?} dur
         * @param {?} isAsync
         * @return {?}
         */
        Animation.prototype._progressEnd = function (shouldComplete, stepValue, dur, isAsync) {
            var /** @type {?} */ children = this._c;
            for (var /** @type {?} */ i = 0; i < this._cL; i++) {
                // ******** DOM WRITE ****************
                children[i]._progressEnd(shouldComplete, stepValue, dur, isAsync);
            }
            if (!isAsync) {
                // stop immediately
                // set all the animations to their final position
                // ******** DOM WRITE ****************
                this._progress(stepValue);
                this._willChg(false);
                this._setAfterStyles();
                this._didFinish(shouldComplete);
            }
            else {
                // animate it back to it's ending position
                this.isPlaying = true;
                this.hasCompleted = false;
                this._hasDur = true;
                // ******** DOM WRITE ****************
                this._willChg(true);
                this._setTrans(dur, false);
            }
        };
        /**
         * Add a callback to fire when the animation has finished.
         * @param {?} callback
         * @param {?=} onceTimeCallback
         * @param {?=} clearOnFinishCallacks
         * @return {?}
         */
        Animation.prototype.onFinish = function (callback, onceTimeCallback, clearOnFinishCallacks) {
            if (onceTimeCallback === void 0) { onceTimeCallback = false; }
            if (clearOnFinishCallacks === void 0) { clearOnFinishCallacks = false; }
            if (clearOnFinishCallacks) {
                this._fFn = this._fOneFn = undefined;
            }
            if (onceTimeCallback) {
                this._fOneFn = this._fOneFn || [];
                this._fOneFn.push(callback);
            }
            else {
                this._fFn = this._fFn || [];
                this._fFn.push(callback);
            }
            return this;
        };
        /**
         * @hidden
         * NO DOM
         * RECURSION
         * @param {?} hasCompleted
         * @param {?} finishAsyncAnimations
         * @param {?} finishNoDurationAnimations
         * @return {?}
         */
        Animation.prototype._didFinishAll = function (hasCompleted, finishAsyncAnimations, finishNoDurationAnimations) {
            var /** @type {?} */ children = this._c;
            for (var /** @type {?} */ i = 0; i < this._cL; i++) {
                children[i]._didFinishAll(hasCompleted, finishAsyncAnimations, finishNoDurationAnimations);
            }
            if (finishAsyncAnimations && this._isAsync || finishNoDurationAnimations && !this._isAsync) {
                this._didFinish(hasCompleted);
            }
        };
        /**
         * @hidden
         * NO RECURSION
         * @param {?} hasCompleted
         * @return {?}
         */
        Animation.prototype._didFinish = function (hasCompleted) {
            this.isPlaying = false;
            this.hasCompleted = hasCompleted;
            if (this._fFn) {
                // run all finish callbacks
                for (var /** @type {?} */ i = 0; i < this._fFn.length; i++) {
                    this._fFn[i](this);
                }
            }
            if (this._fOneFn) {
                // run all "onetime" finish callbacks
                for (var /** @type {?} */ i = 0; i < this._fOneFn.length; i++) {
                    this._fOneFn[i](this);
                }
                this._fOneFn.length = 0;
            }
        };
        /**
         * Reverse the animation.
         * @param {?=} shouldReverse
         * @return {?}
         */
        Animation.prototype.reverse = function (shouldReverse) {
            if (shouldReverse === void 0) { shouldReverse = true; }
            var /** @type {?} */ children = this._c;
            for (var /** @type {?} */ i = 0; i < this._cL; i++) {
                children[i].reverse(shouldReverse);
            }
            this._rv = shouldReverse;
            return this;
        };
        /**
         * Recursively destroy this animation and all child animations.
         * @return {?}
         */
        Animation.prototype.destroy = function () {
            var /** @type {?} */ children = this._c;
            for (var /** @type {?} */ i = 0; i < this._cL; i++) {
                children[i].destroy();
            }
            this._clearAsync();
            this.parent = this.plt = this._e = this._rdFn = this._wrFn = null;
            if (this._c) {
                this._c.length = this._cL = 0;
            }
            if (this._fFn) {
                this._fFn.length = 0;
            }
            if (this._fOneFn) {
                this._fOneFn.length = 0;
            }
        };
        /**
         * @hidden
         * NO DOM
         * @return {?}
         */
        Animation.prototype._transEl = function () {
            // get the lowest level element that has an Animation
            var /** @type {?} */ targetEl;
            for (var /** @type {?} */ i = 0; i < this._cL; i++) {
                targetEl = this._c[i]._transEl();
                if (targetEl) {
                    return targetEl;
                }
            }
            return (this._twn && this._hasDur && this._eL ? this._e[0] : null);
        };
        return Animation;
    }());
    exports.Animation = Animation;
    function Animation_tsickle_Closure_declarations() {
        /** @type {?} */
        Animation.prototype._c;
        /** @type {?} */
        Animation.prototype._cL;
        /** @type {?} */
        Animation.prototype._e;
        /** @type {?} */
        Animation.prototype._eL;
        /** @type {?} */
        Animation.prototype._fx;
        /** @type {?} */
        Animation.prototype._dur;
        /** @type {?} */
        Animation.prototype._es;
        /** @type {?} */
        Animation.prototype._rvEs;
        /** @type {?} */
        Animation.prototype._bfSty;
        /** @type {?} */
        Animation.prototype._bfAdd;
        /** @type {?} */
        Animation.prototype._bfRm;
        /** @type {?} */
        Animation.prototype._afSty;
        /** @type {?} */
        Animation.prototype._afAdd;
        /** @type {?} */
        Animation.prototype._afRm;
        /** @type {?} */
        Animation.prototype._rdFn;
        /** @type {?} */
        Animation.prototype._wrFn;
        /** @type {?} */
        Animation.prototype._fFn;
        /** @type {?} */
        Animation.prototype._fOneFn;
        /** @type {?} */
        Animation.prototype._rv;
        /** @type {?} */
        Animation.prototype._unrgTrns;
        /** @type {?} */
        Animation.prototype._tm;
        /** @type {?} */
        Animation.prototype._hasDur;
        /** @type {?} */
        Animation.prototype._isAsync;
        /** @type {?} */
        Animation.prototype._twn;
        /** @type {?} */
        Animation.prototype.plt;
        /** @type {?} */
        Animation.prototype.parent;
        /** @type {?} */
        Animation.prototype.opts;
        /** @type {?} */
        Animation.prototype.hasChildren;
        /** @type {?} */
        Animation.prototype.isPlaying;
        /** @type {?} */
        Animation.prototype.hasCompleted;
    }
    var /** @type {?} */ ANIMATION_TRANSFORMS = {
        'translateX': 1,
        'translateY': 1,
        'translateZ': 1,
        'scale': 1,
        'scaleX': 1,
        'scaleY': 1,
        'scaleZ': 1,
        'rotate': 1,
        'rotateX': 1,
        'rotateY': 1,
        'rotateZ': 1,
        'skewX': 1,
        'skewY': 1,
        'perspective': 1
    };
    var /** @type {?} */ ANIMATION_CSS_VALUE_REGEX = /(^-?\d*\.?\d*)(.*)/;
    var /** @type {?} */ ANIMATION_DURATION_MIN = 32;
    var /** @type {?} */ ANIMATION_TRANSITION_END_FALLBACK_PADDING_MS = 400;
});
//# sourceMappingURL=animation.js.map