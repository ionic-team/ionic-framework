import * as util from 'ionic/util/util';


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

    this._beforeAddCls = [];
    this._beforeRmvCls = [];
    this._afterAddCls = [];
    this._afterRmvCls = [];

    this.elements(el);
  }

  elements(el) {
    if (el) {
      if (typeof el === 'string') {
        el = document.querySelectorAll(ele);
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

  addChild(childAnimation) {
    if (childAnimation) {
      childAnimation.parent(this);
      this._children.push(childAnimation);
    }
    return this;
  }

  children(arr) {
    arr = Array.isArray(arr) ? arr : arguments;
    for (let i = 0; i < arr.length; i++) {
      this.addChild(arr[i]);
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

  easing(value) {
    if (arguments.length) {
      this._easing = value;
      return this;
    }
    return this._easing || (this._parent && this._parent.easing());
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
    let promises = [];

    for (let i = 0; i < this._children.length; i++) {
      promises.push( this._children[i].play() );
    }

    if (!this._to) {
      // probably just add/removing classes, create bogus transition
      this._from = this._to = {'opacity': 1};
    }

    if (!this._players.length) {
      for (let i = 0; i < this._el.length; i++) {
        var ele = this._el[i];

        for (let j = 0; j < this._beforeAddCls.length; j++) {
          ele.classList.add(this._beforeAddCls[j]);
        }

        for (let j = 0; j < this._beforeRmvCls.length; j++) {
          ele.classList.remove(this._beforeRmvCls[j]);
        }

        var player = new Animate(ele, this._from, this._to, this.duration(), this.easing());
        this._players.push(player);

        promises.push(player.promise);
      }

    } else {
      for (let i = 0; i < this._players.length; i++) {
        this._players[i].play();
      }
    }

    var promise = Promise.all(promises);

    promise.then(() => {
      for (let i = 0; i < this._el.length; i++) {
        var ele = this._el[i];

        for (let j = 0; j < this._afterAddCls.length; j++) {
          ele.classList.add(this._afterAddCls[j]);
        }

        for (let j = 0; j < this._afterRmvCls.length; j++) {
          ele.classList.remove(this._afterRmvCls[j]);
        }
      }
    });

    return promise;
  }

  pause() {
    for (let i = 0; i < this._children.length; i++) {
      this._children[i].pause();
    }

    for (let i = 0; i < this._players.length; i++) {
      this._players[i].pause();
    }
  }

  progress(value) {
    for (let i = 0; i < this._children.length; i++) {
      this._children[i].progress(value);
    }

    if (!this._players.length) {
      this.play();
      this.pause();
    }

    for (let i = 0; i < this._players.length; i++) {
      this._players[i].progress(value);
    }
  }

}

class Animate {

  constructor(ele, fromEffect, toEffect, duration, easing) {
    // https://w3c.github.io/web-animations/
    // not using the direct API methods because they're still in flux
    // however, element.animate() seems locked in and uses the latest
    // and correct API methods under the hood, so really doesn't matter

    // fromEffect must be manually computed if it wasn't provided
    // https://github.com/web-animations/web-animations-js/issues/14
    fromEffect = fromEffect || {};
    let style = null;
    for (let prop in toEffect) {
      if (util.isBlank(fromEffect[prop])) {
        style = style || window.getComputedStyle(ele);
        fromEffect[prop] = style[prop];
      }
    }

    this._duration = duration;
    this._easing = easing;

    this.player = ele.animate([fromEffect, toEffect], {
      duration: duration,
      easing: easing,
      fill: 'both'
    });

    this.promise = new Promise(resolve => {
      this.player.onfinish = () => {
        resolve();
      };
    });

  }

  play() {
    this.player.play();
  }

  pause() {
    this.player.pause();
  }

  progress(value) {
    let player = this.player;

    // passed a number between 0 and 1
    value = Math.max(0, Math.min(1, parseFloat(value)));

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

}
