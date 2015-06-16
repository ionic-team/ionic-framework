import {CSS} from '../util/dom';

const RENDER_DELAY = 36;
let AnimationRegistry = {};

/**
  Animation Steps/Process
  -----------------------
  1) Construct animation (doesn't start)
  2) Client play()'s animation, returns promise
  3) Add before classes to elements
  4) Remove before classes from elements
  5) Elements staged in "from" effect w/ inline styles
  6) Call onReady()
  7) Wait for RENDER_DELAY milliseconds (give browser time to render)
  8) Call onPlay()
  8) Run from/to animation on elements
  9) Animations finish async
 10) Set inline styles w/ the "to" effects on elements
 11) Add after classes to elements
 12) Remove after classes from elements
 13) Call onFinish()
 14) Resolve play()'s promise
**/

export class Animation {

  constructor(el) {
    this._el = [];
    this._children = [];
    this._animations = [];

    this._bfAdd = [];
    this._bfRmv = [];
    this._afAdd = [];
    this._afRmv = [];

    this._readyFns = [];
    this._playFns = [];
    this._finishFns = [];

    this.elements(el);
  }

  elements(el) {
    if (el) {
      if (typeof el === 'string') {
        el = document.querySelectorAll(el);
      }

      if (el.length) {
        for (let i = 0; i < el.length; i++) {
          this._el.push(el[i]);
        }

      } else if (el.nodeType) {
        this._el.push(el);
      }
    }
    return this;
  }

  parent(parentAnimation) {
    this._parent = parentAnimation;
    return this;
  }

  add(childAnimations) {
    childAnimations = Array.isArray(childAnimations) ? childAnimations : arguments;
    for (let i = 0; i < childAnimations.length; i++) {
      childAnimations[i].parent(this);
      this._children.push(childAnimations[i]);
    }
    return this;
  }

  duration(value) {
    if (arguments.length) {
      this._duration = value;
      return this;
    }
    return this._duration || (this._parent && this._parent.duration());
  }

  easing(name, opts) {
    if (arguments.length) {
      this._easing = {
        name: name,
        opts: opts
      };
      return this;
    }
    return this._easing || (this._parent && this._parent.easing());
  }

  playbackRate(value) {
    if (arguments.length) {
      this._rate = value;
      let i;
      for (i = 0; i < this._children.length; i++) {
        this._children[i].playbackRate(value);
      }
      for (i = 0; i < this._animations.length; i++) {
        this._animations[i].playbackRate(value);
      }
      return this;
    }
    return this._rate || (this._parent && this._parent.playbackRate());
  }

  from(property, value) {
    if (!this._from) {
      this._from = {};
    }
    this._from[property] = value;
    return this;
  }

  to(property, value) {
    if (!this._to) {
      this._to = {};
    }
    this._to[property] = value;
    return this;
  }

  fromTo(property, from, to) {
    return this.from(property, from).to(property, to);
  }

  fadeIn() {
    return this.fromTo('opacity', 0, 1);
  }

  fadeOut() {
    return this.fromTo('opacity', 1, 0);
  }

  get before() {
    return {
      addClass: (className) => {
        this._bfAdd.push(className);
        return this;
      },
      removeClass: (className) => {
        this._bfRmv.push(className);
        return this;
      }
    }
  }

  get after() {
    return {
      addClass: (className) => {
        this._afAdd.push(className);
        return this;
      },
      removeClass: (className) => {
        this._afRmv.push(className);
        return this;
      }
    }
  }

  play() {
    const self = this;
    const animations = self._animations;
    const children = self._children;
    let promises = [];
    let i, l;

    // the actual play() method which may or may not start async
    function beginPlay() {
      let i, l;
      let promises = [];

      for (i = 0, l = children.length; i < l; i++) {
        promises.push( children[i].play() );
      }

      for (i = 0, l = animations.length; i < l; i++) {
        promises.push( animations[i].play() );
      }

      return Promise.all(promises);
    }

    if (!self._parent) {
      // this is the top level animation and is in full control
      // of when the async play() should actually kick off

      // stage all animations and child animations at their starting point
      self.stage();

      let resolve;
      let promise = new Promise(res => { resolve = res; });

      function kickoff() {
        // synchronously call all onPlay()'s before play()
        self._onPlay();

        beginPlay().then(() => {
          self._onFinish();
          resolve();
        });
      }

      if (this._duration > RENDER_DELAY) {
        // begin each animation when everything is rendered in their starting point
        // give the browser some time to render everything in place before starting
        setTimeout(kickoff, RENDER_DELAY);

      } else {
        // no need to render everything in there place before animating in
        // just kick it off immediately to render them in their "to" locations
        kickoff();
      }

      return promise;
    }

    // this is a child animation, it is told exactly when to
    // start by the top level animation
    return beginPlay();
  }

  stage() {
    // before the RENDER_DELAY
    // before the animations have started
    if (!this._isStaged) {
      this._isStaged = true;

      let i, l, j, ele;

      for (i = 0, l = this._children.length; i < l; i++) {
        this._children[i].stage();
      }

      for (i = 0; i < this._el.length; i++) {
        ele = this._el[i];

        for (j = 0; j < this._bfAdd.length; j++) {
          ele.classList.add(this._bfAdd[j]);
        }

        for (j = 0; j < this._bfRmv.length; j++) {
          ele.classList.remove(this._bfRmv[j]);
        }
      }

      if (this._to) {
        // only animate the elements if there are defined "to" effects
        for (i = 0; i < this._el.length; i++) {

          var animation = new Animate( this._el[i],
                                       this._from,
                                       this._to,
                                       this.duration(),
                                       this.easing(),
                                       this.playbackRate() );

          if (animation.shouldAnimate) {
            this._animations.push(animation);
          }

        }
      }

      for (i = 0; i < this._readyFns.length; i++) {
        this._readyFns[i](this);
      }
    }
  }

  _onPlay() {
    // after the RENDER_DELAY
    // before the animations have started
    let i;

    for (i = 0; i < this._children.length; i++) {
      this._children[i]._onPlay();
    }

    for (i = 0; i < this._playFns.length; i++) {
      this._playFns[i](this);
    }
  }

  _onFinish() {
    // after the animations have finished
    if (!this._isFinished) {
      this._isFinished = true;

      for (let i = 0, l = this._children.length; i < l; i++) {
        this._children[i]._onFinish();
      }

      // one requestAnimationFrame after onFinish happened
      let i, j, ele;

      if (this.playbackRate() < 0) {
        // reverse direction
        for (i = 0; i < this._el.length; i++) {
          ele = this._el[i];

          for (j = 0; j < this._bfAdd.length; j++) {
            ele.classList.remove(this._bfAdd[j]);
          }

          for (j = 0; j < this._bfRmv.length; j++) {
            ele.classList.add(this._bfRmv[j]);
          }
        }

      } else {
        // normal direction
        for (i = 0; i < this._el.length; i++) {
          ele = this._el[i];

          for (j = 0; j < this._afAdd.length; j++) {
            ele.classList.add(this._afAdd[j]);
          }

          for (j = 0; j < this._afRmv.length; j++) {
            ele.classList.remove(this._afRmv[j]);
          }
        }
      }

      for (i = 0; i < this._finishFns.length; i++) {
        this._finishFns[i](this);
      }
    }
  }

  pause() {
    this._hasFinished = false;

    let i;
    for (i = 0; i < this._children.length; i++) {
      this._children[i].pause();
    }

    for (i = 0; i < this._animations.length; i++) {
      this._animations[i].pause();
    }
  }

  progress(value) {
    let i;

    for (i = 0; i < this._children.length; i++) {
      this._children[i].progress(value);
    }

    if (!this._initProgress) {
      this._initProgress = true;
      this.play();
      this.pause();
    }

    for (i = 0; i < this._animations.length; i++) {
      this._animations[i].progress(value);
    }
  }

  onReady(fn) {
    this._readyFns.push(fn);
  }

  onPlay(fn) {
    this._playFns.push(fn);
  }

  onFinish(fn) {
    this._finishFns.push(fn);
  }

  dispose() {
    let i;

    for (i = 0; i < this._children.length; i++) {
      this._children[i].dispose();
    }
    for (i = 0; i < this._animations.length; i++) {
      this._animations[i].dispose();
    }

    this._el = this._parent = this._children = this._animations = this._readyFns = this._playFns = this._finishFns = null;
  }

  /*
   STATIC CLASSES
   */
  static create(element, name) {
    let AnimationClass = AnimationRegistry[name];

    if (!AnimationClass) {
      // couldn't find an animation by the given name
      // fallback to just the base Animation class
      AnimationClass = Animation;
    }
    return new AnimationClass(element);
  }

  static register(name, AnimationClass) {
    AnimationRegistry[name] = AnimationClass;
  }

}

class Animate {

  constructor(ele, fromEffect, toEffect, duration, easingConfig, playbackRate) {
    // https://w3c.github.io/web-animations/
    // not using the direct API methods because they're still in flux
    // however, element.animate() seems locked in and uses the latest
    // and correct API methods under the hood, so really doesn't matter
    this.toEffect = parseEffect(toEffect);

    this.shouldAnimate = (duration > RENDER_DELAY);

    if (!this.shouldAnimate) {
      return inlineStyle(ele, this.toEffect);
    }

    this.ele = ele;
    this.resolve;
    this.promise = new Promise(res => { this.resolve = res; });

    // stage where the element will start from
    fromEffect = parseEffect(fromEffect);
    inlineStyle(ele, fromEffect);

    this.duration = duration;
    this.rate = playbackRate;

    this.easing = easingConfig && easingConfig.name || 'linear';

    this.effects = [ convertProperties(fromEffect) ];

    if (this.easing in EASING_FN) {
      insertEffects(this.effects, fromEffect, this.toEffect, easingConfig);

    } else if (this.easing in CUBIC_BEZIERS) {
      this.easing = 'cubic-bezier(' + CUBIC_BEZIERS[this.easing] + ')';
    }

    this.effects.push( convertProperties(this.toEffect) );
  }

  play() {
    const self = this;

    if (self.player) {
      self.player.play();

    } else {
      self.player = self.ele.animate(self.effects, {
        duration: self.duration || 0,
        easing: self.easing,
        playbackRate: self.rate || 1
      });

      self.player.onfinish = () => {
        // lock in where the element will stop at
        // if the playbackRate is negative then it needs to return
        // to its "from" effects
        inlineStyle(self.ele, self.rate < 0 ? self.fromEffect : self.toEffect);

        self.resolve();
      };
    }

    return self.promise;
  }

  pause() {
    this.player && this.player.pause();
  }

  progress(value) {
    let player = this.player;

    if (player) {
      // passed a number between 0 and 1
      value = Math.max(0, Math.min(1, value));

      if (value >= 1) {
        player.currentTime = (this.duration * 0.999);
        return player.play();
      }

      if (player.playState !== 'paused') {
        player.pause();
      }

      player.currentTime = (this.duration * value);
    }
  }

  playbackRate(value) {
    this.rate = value;
    if (this.player) {
      this.player.playbackRate = value;
    }
  }

  dispose() {
    this.ele = this.player = this.effects = this.toEffect = null;
  }

}

function insertEffects(effects, fromEffect, toEffect, easingConfig) {
  easingConfig.opts = easingConfig.opts || {};

  const increment = easingConfig.opts.increment || 0.04;
  const easingFn = EASING_FN[easingConfig.name];

  let pos, tweenEffect, addEffect, property, toProperty, fromValue, diffValue;

  for(pos = increment; pos <= (1 - increment); pos += increment) {
    tweenEffect = {};
    addEffect = false;

    for (property in toEffect) {
      toProperty = toEffect[property];

      if (toProperty.tween) {

        fromValue = fromEffect[property].num
        diffValue = toProperty.num - fromValue;

        tweenEffect[property] = {
          value: roundValue(  (easingFn(pos, easingConfig.opts) * diffValue) + fromValue ) + toProperty.unit
        };

        addEffect = true;
      }
    }

    if (addEffect) {
      effects.push( convertProperties(tweenEffect) );
    }

  }
}

function parseEffect(inputEffect) {
  let val, r, num, property;
  let outputEffect = {};

  for (property in inputEffect) {
    val = inputEffect[property];
    r = val.toString().match(/(\d*\.?\d*)(.*)/);
    num = parseFloat(r[1]);

    outputEffect[property] = {
      value: val,
      num: num,
      unit: (r[0] != r[2] ? r[2] : ''),
      tween: !isNaN(num) && (ANIMATE_PROPERTIES.indexOf(property) > -1)
    }
  }

  return outputEffect;
}

function convertProperties(inputEffect) {
  let outputEffect = {};
  let transforms = [];
  let value, property;

  for (property in inputEffect) {
    value = inputEffect[property].value;

    if (TRANSFORMS.indexOf(property) > -1) {
      transforms.push(property + '(' + value + ')');

    } else {
      outputEffect[property] = value;
    }
  }

  if (transforms.length) {
    transforms.push('translateZ(0px)');
    outputEffect.transform = transforms.join(' ');
  }

  return outputEffect;
}

function inlineStyle(ele, effect) {
  if (ele && effect) {
    let transforms = [];
    let value, property;

    for (property in effect) {
      value = effect[property].value;

      if (TRANSFORMS.indexOf(property) > -1) {
        transforms.push(property + '(' + value + ')');

      } else {
        ele.style[property] = value;
      }
    }

    if (transforms.length) {
      transforms.push('translateZ(0px)');
      ele.style[CSS.transform] = transforms.join(' ');
    }
  }
}

function roundValue(val) {
  return Math.round(val * 10000) / 10000;
}


const TRANSFORMS = ['translateX', 'translateY', 'translateZ', 'scale', 'scaleX', 'scaleY', 'scaleZ',
                    'rotate', 'rotateX', 'rotateY', 'rotateZ', 'skewX', 'skewY', 'perspective'];

const ANIMATE_PROPERTIES = TRANSFORMS.concat('opacity');


// Robert Penner's Easing Functions
// http://robertpenner.com/easing/

const CUBIC_BEZIERS = {

  // default browser suppored easing
  // ease
  // ease-in
  // ease-out
  // ease-in-out

  // Cubic
  'ease-in-cubic': '0.55,0.055,0.675,0.19',
  'ease-out-cubic': '0.215,0.61,0.355,1',
  'ease-in-Out-cubic': '0.645,0.045,0.355,1',

  // Circ
  'ease-in-circ': '0.6,0.04,0.98,0.335',
  'ease-out-circ': '0.075,0.82,0.165,1',
  'ease-in-out-circ': '0.785,0.135,0.15,0.86',

  // Expo
  'ease-in-expo': '0.95,0.05,0.795,0.035',
  'ease-out-expo': '0.19,1,0.22,1',
  'ease-in-out-expo': '1,0,0,1',

  // Quad
  'ease-in-quad': '0.55,0.085,0.68,0.53',
  'ease-out-quad': '0.25,0.46,0.45,0.94',
  'ease-in-out-quad': '0.455,0.03,0.515,0.955',

  // Quart
  'ease-in-quart': '0.895,0.03,0.685,0.22',
  'ease-out-quart': '0.165,0.84,0.44,1',
  'ease-in-out-quart': '0.77,0,0.175,1',

  // Quint
  'ease-in-quint': '0.755,0.05,0.855,0.06',
  'ease-out-quint': '0.23,1,0.32,1',
  'ease-in-out-quint': '0.86,0,0.07,1',

  // Sine
  'ease-in-sine': '0.47,0,0.745,0.715',
  'ease-out-sine': '0.39,0.575,0.565,1',
  'ease-in-out-sine': '0.445,0.05,0.55,0.95',

  // Back
  'ease-in-back': '0.6,-0.28,0.735,0.045',
  'ease-out-back': '0.175,0.885,0.32,1.275',
  'ease-in-out-back': '0.68,-0.55,0.265,1.55',
};


const EASING_FN = {

  'elastic': function(pos) {
    return -1 * Math.pow(4, -8 * pos) * Math.sin((pos * 6 - 1) * (2 * Math.PI) / 2) + 1;
  },

  'swing-from-to': function(pos, opts) {
    let s = opts.s || 1.70158;
    return ((pos /= 0.5) < 1) ? 0.5 * (pos * pos * (((s *= (1.525)) + 1) * pos - s)) :
    0.5 * ((pos -= 2) * pos * (((s *= (1.525)) + 1) * pos + s) + 2);
  },

  'swing-from': function(pos, opts) {
    let s = opts.s || 1.70158;
    return pos * pos * ((s + 1) * pos - s);
  },

  'swing-to': function(pos, opts) {
    let s = opts.s || 1.70158;
    return (pos -= 1) * pos * ((s + 1) * pos + s) + 1;
  },

  'bounce': function(pos) {
    if (pos < (1 / 2.75)) {
      return (7.5625 * pos * pos);
    } else if (pos < (2 / 2.75)) {
      return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
    } else if (pos < (2.5 / 2.75)) {
      return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
    }
    return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
  },

  'bounce-past': function(pos) {
    if (pos < (1 / 2.75)) {
      return (7.5625 * pos * pos);
    } else if (pos < (2 / 2.75)) {
      return 2 - (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
    } else if (pos < (2.5 / 2.75)) {
      return 2 - (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
    }
    return 2 - (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
  },

  'ease-out-bounce': function(pos) {
    if ((pos) < (1 / 2.75)) {
      return (7.5625 * pos * pos);
    } else if (pos < (2 / 2.75)) {
      return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
    } else if (pos < (2.5 / 2.75)) {
      return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
    }
    return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
  },

  'ease-from-to': function(pos) {
    if ((pos /= 0.5) < 1) return 0.5 * Math.pow(pos, 4);
    return -0.5 * ((pos -= 2) * Math.pow(pos, 3) - 2);
  },

  'ease-from': function(pos, opts) {
    return Math.pow(pos, opts.s || 4);
  },

  'ease-to': function(pos, opts) {
    return Math.pow(pos, opts.s || 0.25);
  },

  /*
   * scripty2, Thomas Fuchs (MIT Licence)
   * https://raw.github.com/madrobby/scripty2/master/src/effects/transitions/transitions.js
   */
  'spring': function(pos, opts) {
    let damping = opts.damping || 4.5;
    let elasticity = opts.elasticity || 6;
    return 1 - (Math.cos(pos * damping * Math.PI) * Math.exp(-pos * elasticity));
  },

  'sinusoidal': function(pos) {
    return (-Math.cos(pos * Math.PI) / 2) + 0.5;
  }

};
