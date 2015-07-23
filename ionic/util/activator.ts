import {raf} from './dom';

var queueElements = {};   // elements that should get an active state in XX milliseconds
var activeElements = {};  // elements that are currently active
var keyId = 0;            // a counter for unique keys for the above ojects
var ACTIVATED_CLASS = 'activated';
var DEACTIVATE_TIMEOUT = 180;


export class Activator {

  static start(ele) {
    queueElements[++keyId] = ele;
    if (keyId > 9) keyId = 0;
    raf(Activator.activate);
  }

  static activate() {
    // activate all elements in the queue
    for (var key in queueElements) {
      if (queueElements[key]) {
        queueElements[key].classList.add(ACTIVATED_CLASS);
        activeElements[key] = queueElements[key];
      }
    }
    queueElements = {};
  }

  static end() {
    setTimeout(Activator.clear, DEACTIVATE_TIMEOUT);
  }

  static clear() {
    // clear out any elements that are queued to be set to active
    queueElements = {};

    // in the next frame, remove the active class from all active elements
    raf(Activator.deactivate);
  }

  static deactivate() {

    for (var key in activeElements) {
      if (activeElements[key]) {
        activeElements[key].classList.remove(ACTIVATED_CLASS);
      }
      delete activeElements[key];
    }
  }

  static moveListeners(pointerMove, shouldAdd) {
    document.removeEventListener('touchmove', pointerMove);
    document.removeEventListener('mousemove', pointerMove);

    if (shouldAdd) {
      document.addEventListener('touchmove', pointerMove);
      document.addEventListener('mousemove', pointerMove);
    }
  }

}
