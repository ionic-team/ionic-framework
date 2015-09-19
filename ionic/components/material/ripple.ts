import * as dom from '../../util/dom';


export function start(key, ele, pointerX, pointerY) {
  // ensure this key is cleaned up
  removeRipple(key);

  // throttle how many ripples can happen quickly
  if (lastRipple + 150 > Date.now()) return;
  lastRipple = Date.now();

  let r = ele.getBoundingClientRect();
  let rippleSize = Math.sqrt(r.width * r.width + r.height * r.height) * 2 + 2;

  let rippleEle = activeElements[key] = document.createElement('md-ripple');
  rippleEle.style.width = rippleSize + 'px';
  rippleEle.style.height = rippleSize + 'px';
  rippleEle.style.marginTop = -(rippleSize / 2) + 'px';
  rippleEle.style.marginLeft = -(rippleSize / 2) + 'px';
  rippleEle.style.left = (pointerX - r.left) + 'px';
  rippleEle.style.top = (pointerY - r.top) + 'px';

  let centerX = (r.width / 2);
  let hitX = (pointerX - r.left);
  let distanceFromCenter = Math.abs(centerX - hitX);
  let percent = 1 - (distanceFromCenter / centerX);
  let duration = 300 + (300 * percent);
  rippleEle.style.transitionDuration = rippleEle.style.webkitTransitionDuration = (duration + 'ms');

  ele.classList.add('ripple-wave');
  ele.appendChild(rippleEle);

  // kick off animaiton
  setTimeout(function() {
    rippleEle.classList.add('ripple-animate');
  }, 32);
}

export function end(key) {
  let rippleEle = activeElements[key];

  if (rippleEle) {
    rippleEle.classList.add('ripple-animate-out');
    rippleEle.classList.remove('ripple-animate');

    removeElements[key] = rippleEle;
    setTimeout(function() {
      removeRipple(key);
    }, 500);
  }

  delete activeElements[key];
}

function removeRipple(key) {
  let rippleEle = removeElements[key];

  if (rippleEle) {
    rippleEle.parentNode.removeChild(rippleEle);
  }

  delete removeElements[key];
}

let lastRipple = 0;
let activeElements = {};
let removeElements = {};
