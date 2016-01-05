import {Injectable, NgZone} from 'angular2/core';
import {Title} from 'angular2/platform/browser';

import {Config} from '../../config/config';
import {ClickBlock} from '../../util/click-block';
import {rafFrames} from '../../util/dom';


/**
 * @private
 * Component registry service.  For more information on registering
 * components see the [IdRef API reference](../id/IdRef/).
 */
@Injectable()
export class IonicApp {

  constructor(
    private _config: Config,
    private _clickBlock: ClickBlock,
    private _zone: NgZone
  ) {
    this._titleSrv = new Title();
    this._title = '';
    this._disTime = 0;
    this._scrollTime = 0;

    // Our component registry map
    this.components = {};
  }

  /**
   * Sets the document title.
   * @param {string} val  Value to set the document title to.
   */
  setTitle(val) {
    let self = this;
    if (val !== self._title) {
      self._title = val;
      this._zone.runOutsideAngular(() => {
        function setAppTitle() {
          self._titleSrv.setTitle(self._title);
        }
        rafFrames(4, setAppTitle);
      });
    }
  }

  /**
   * @private
   * Sets if the app is currently enabled or not, meaning if it's
   * available to accept new user commands. For example, this is set to `false`
   * while views transition, a modal slides up, an action-sheet
   * slides up, etc. After the transition completes it is set back to `true`.
   * @param {bool} isEnabled
   * @param {bool} fallback  When `isEnabled` is set to `false`, this argument
   * is used to set the maximum number of milliseconds that app will wait until
   * it will automatically enable the app again. It's basically a fallback incase
   * something goes wrong during a transition and the app wasn't re-enabled correctly.
   */
  setEnabled(isEnabled, duration=700) {
    this._disTime = (isEnabled ? 0 : Date.now() + duration);

    if (duration > 32 || isEnabled) {
      // only do a click block if the duration is longer than XXms
      this._clickBlock.show(!isEnabled, duration + 64);
    }
  }

  /**
   * @private
   * Boolean if the app is actively enabled or not.
   * @return {bool}
   */
  isEnabled() {
    return (this._disTime < Date.now());
  }

  /**
   * @private
   */
  setScrolling() {
    this._scrollTime = Date.now();
  }

  /**
   * @private
   * Boolean if the app is actively scrolling or not.
   * @return {bool}
   */
  isScrolling() {
    return (this._scrollTime + 64 > Date.now());
  }

  /**
   * @private
   * Register a known component with a key, for easy lookups later.
   * @param {TODO} id  The id to use to register the component
   * @param {TODO} component  The component to register
   */
  register(id, component) {
    if (this.components[id] && this.components[id] !== component) {
      //console.error('Component id "' + id + '" already registered.');
    }
    this.components[id] = component;
  }

  /**
   * @private
   * Unregister a known component with a key.
   * @param {TODO} id  The id to use to unregister
   */
  unregister(id) {
    delete this.components[id];
  }

  /**
   * @private
   * Get a registered component with the given type (returns the first)
   * @param {Object} cls the type to search for
   * @return the matching component, or undefined if none was found
   */
  getRegisteredComponent(cls) {
    for(let component of this.components) {
      if(component instanceof cls) {
        return component;
      }
    }
  }

  /**
   * @private
   * Get the component for the given key.
   * @param {TODO} key  TODO
   * @return {TODO} TODO
   */
  getComponent(id) {
    return this.components[id];
  }

}
