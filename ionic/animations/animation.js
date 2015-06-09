import * as util from 'ionic/util/util';


let registry = {};

export class Animation {

  constructor(el) {
    this._el = [];
    this._parent = null;
    this._children = [];
    this._players = [];

    this._from = null;
    this._to = null;
    this._duration = null;
    this._easing = null;
    this._rate = null;

    this._beforeAddCls = [];
    this._beforeRmvCls = [];
    this._afterAddCls = [];
    this._afterRmvCls = [];

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
      var i;
      for (i = 0; i < this._children.length; i++) {
        this._children[i].playbackRate(value);
      }
      for (i = 0; i < this._players.length; i++) {
        this._players[i].playbackRate(value);
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

  get beforePlay() {
    return {
      addClass: (className) => {
        this._beforeAddCls.push(className);
        return this;
      },
      removeClass: (className) => {
        this._beforeRmvCls.push(className);
        return this;
      }
    }
  }

  get afterFinish() {
    return {
      addClass: (className) => {
        this._afterAddCls.push(className);
        return this;
      },
      removeClass: (className) => {
        this._afterRmvCls.push(className);
        return this;
      }
    }
  }

  play() {
    let i, l;
    let promises = [];
    let players = this._players;

    for (i = 0, l = this._children.length; i < l; i++) {
      promises.push( this._children[i].play() );
    }

    if (!players.length) {
      // first time played
      for (i = 0; i < this._el.length; i++) {
        players.push(
          new Animate( this._el[i],
                       this._from,
                       this._to,
                       this.duration(),
                       this.easing(),
                       this.playbackRate() )
        );
      }

      this._onReady();

    } else {
      // has been paused, now play again
      for (i = 0, l = players.length; i < l; i++) {
        players[i].play();
      }
    }

    for (i = 0, l = players.length; i < l; i++) {
      if (players[i].promise) {
        promises.push(players[i].promise);
      }
    }

    let promise = Promise.all(promises);

    promise.then(() => {
      this._onFinish();
    });

    return promise;
  }

  pause() {
    this._hasFinished = false;

    var i;
    for (i = 0; i < this._children.length; i++) {
      this._children[i].pause();
    }

    for (i = 0; i < this._players.length; i++) {
      this._players[i].pause();
    }
  }

  progress(value) {
    var i;

    for (i = 0; i < this._children.length; i++) {
      this._children[i].progress(value);
    }

    if (!this._players.length) {
      this.play();
      this.pause();
    }

    for (i = 0; i < this._players.length; i++) {
      this._players[i].progress(value);
    }
  }

  _onReady() {
    if (!this._hasPlayed) {
      this._hasPlayed = true;

      var i, j, ele;
      for (i = 0; i < this._el.length; i++) {
        ele = this._el[i];

        for (j = 0; j < this._beforeAddCls.length; j++) {
          ele.classList.add(this._beforeAddCls[j]);
        }

        for (j = 0; j < this._beforeRmvCls.length; j++) {
          ele.classList.remove(this._beforeRmvCls[j]);
        }
      }

      this.onReady && this.onReady();
    }
  }

  _onFinish() {
    if (!this._hasFinished) {
      this._hasFinished = true;

      var i, j, ele;

      if (this.playbackRate() < 0) {
        // reverse direction
        for (i = 0; i < this._el.length; i++) {
          ele = this._el[i];

          for (j = 0; j < this._beforeAddCls.length; j++) {
            ele.classList.remove(this._beforeAddCls[j]);
          }

          for (j = 0; j < this._beforeRmvCls.length; j++) {
            ele.classList.add(this._beforeRmvCls[j]);
          }
        }

      } else {
        // normal direction
        for (i = 0; i < this._el.length; i++) {
          ele = this._el[i];

          for (j = 0; j < this._afterAddCls.length; j++) {
            ele.classList.add(this._afterAddCls[j]);
          }

          for (j = 0; j < this._afterRmvCls.length; j++) {
            ele.classList.remove(this._afterRmvCls[j]);
          }
        }
      }

      this.onFinish && this.onFinish();
    }
  }

  dispose() {
    var i;
    for (i = 0; i < this._children.length; i++) {
      this._children[i].dispose();
    }
    for (i = 0; i < this._players.length; i++) {
      this._players[i].dispose();
    }
    this._el = this._parent = this._children = this._players = null;
  }

  /*
   STATIC CLASSES
   */
  static create(element, name) {
    let AnimationClass = registry[name];
    if (!AnimationClass) {
      AnimationClass = Animation;
    }
    return new AnimationClass(element);
  }

  static register(name, AnimationClass) {
    registry[name] = AnimationClass;
  }

}

class Animate {

  constructor(ele, fromEffect, toEffect, duration, easingConfig, playbackRate) {

    if (!toEffect) {
      // not an actual animation that tweens between from and to properties
      // probably just adding/removing CSS classes, so resolve it right away
      return;
    }

    // https://w3c.github.io/web-animations/
    // not using the direct API methods because they're still in flux
    // however, element.animate() seems locked in and uses the latest
    // and correct API methods under the hood, so really doesn't matter

    fromEffect = parseEffect(fromEffect);
    toEffect = parseEffect(toEffect);

    this._duration = duration;

    var easingName = easingConfig && easingConfig.name || 'linear';

    var effects = [ convertProperties(fromEffect) ];

    if (easingName in EASING_FN) {
      insertEffects(effects, fromEffect, toEffect, easingConfig);

    } else if (easingName in CUBIC_BEZIERS) {
      easingName = 'cubic-bezier(' + CUBIC_BEZIERS[easingName] + ')';
    }

    effects.push( convertProperties(toEffect) );

    this.player = ele.animate(effects, {
      duration: duration || 0,
      easing: easingName,
      playbackRate: playbackRate || 1
    });

    this.promise = new Promise(resolve => {
      this.player.onfinish = () => {
        resolve();
      };
    });

  }

  play() {
    this.player && this.player.play();
  }

  pause() {
    this.player && this.player.pause();
  }

  progress(value) {
    let player = this.player;

    if (!player) return;

    // passed a number between 0 and 1
    value = Math.max(0, Math.min(1, value));

    if (value === 1) {
      player.currentTime = (this._duration * 0.9999);
      player.play();
      return;
    }

    if (player.playState !== 'paused') {
      player.pause();
    }

    player.currentTime = (this._duration * value);
  }

  playbackRate(value) {
    if (this.player) {
      this.player.playbackRate = value;
    }
  }

  dispose() {
    this.player = null;
  }

}

function insertEffects(effects, fromEffect, toEffect, easingConfig) {
  easingConfig.opts = easingConfig.opts || {};
  var increment = easingConfig.opts.increment || 0.04;

  var easingFn = EASING_FN[easingConfig.name];

  for(var pos = increment; pos <= (1 - increment); pos += increment) {

    var tweenEffect = {};
    var addEffect = false;

    for (var property in toEffect) {
      var toProperty = toEffect[property];
      if (toProperty.tween) {

        var fromValue = fromEffect[property].num
        var diffValue = toProperty.num - fromValue;

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
  var val, r, num, property;
  var outputEffect = {};

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
  var outputEffect = {};
  var transforms = [];

  for (var property in inputEffect) {
    var value = inputEffect[property].value;

    if (TRANSFORMS.indexOf(property) > -1) {
      transforms.push(property + '(' + value + ')');

    } else {
      outputEffect[property] = value;
    }
  }

  if (transforms.length) {
    outputEffect.transform = transforms.join(' ');
  }

  return outputEffect;
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
  'ease-out-back': '0.175, 0.885,0.32,1.275',
  'ease-in-out-back': '0.68,-0.55,0.265,1.55',
};


const EASING_FN = {

  'elastic': function(pos) {
    return -1 * Math.pow(4, -8 * pos) * Math.sin((pos * 6 - 1) * (2 * Math.PI) / 2) + 1;
  },

  'swing-from-to': function(pos, opts) {
    var s = opts.s || 1.70158;
    return ((pos /= 0.5) < 1) ? 0.5 * (pos * pos * (((s *= (1.525)) + 1) * pos - s)) :
    0.5 * ((pos -= 2) * pos * (((s *= (1.525)) + 1) * pos + s) + 2);
  },

  'swing-from': function(pos, opts) {
    var s = opts.s || 1.70158;
    return pos * pos * ((s + 1) * pos - s);
  },

  'swing-to': function(pos, opts) {
    var s = opts.s || 1.70158;
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
    var damping = opts.damping || 4.5;
    var elasticity = opts.elasticity || 6;
    return 1 - (Math.cos(pos * damping * Math.PI) * Math.exp(-pos * elasticity));
  },

  'sinusoidal': function(pos) {
    return (-Math.cos(pos * Math.PI) / 2) + 0.5;
  }

};
