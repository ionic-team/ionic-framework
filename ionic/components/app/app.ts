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
  private _titleSrv: Title = new Title();
  private _title: string = '';
  private _disTime: number = 0;
  private _scrollTime: number = 0;

  // Our component registry map
  private components: {[id: string] : any} = {};

  constructor(
    private _config: Config,
    private _clickBlock: ClickBlock,
    private _zone: NgZone
  ) {}

  /**
   * Sets the document title.
   * @param {string} val  Value to set the document title to.
   */
  setTitle(val: string) {
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
  setEnabled(isEnabled: boolean, duration: number=700) {
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
  isEnabled(): boolean {
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
  isScrolling(): boolean {
    return (this._scrollTime + 64 > Date.now());
  }

  /**
   * @private
   * Register a known component with a key, for easy lookups later.
   * @param {string} id  The id to use to register the component
   * @param {Object} component  The component to register
   */
  register(id: string, component: any) {
    if (this.components[id] && this.components[id] !== component) {
      //console.error('Component id "' + id + '" already registered.');
    }
    this.components[id] = component;
  }

  /**
   * @private
   * Unregister a known component with a key.
   * @param {string} id  The id to use to unregister
   */
  unregister(id: string) {
    delete this.components[id];
  }

  /**
   * @private
   * Get a registered component with the given type (returns the first)
   * @param {Object} cls the type to search for
   * @return {Object} the matching component, or undefined if none was found
   */
  getRegisteredComponent(cls: any): any {
    for (let key in this.components) {
      const component = this.components[key];
      if (component instanceof cls) {
        return component;
      }
    }
  }

  /**
   * @private
   * Get the component for the given key.
   * @param {string} id  TODO
   * @return {Object} TODO
   */
  getComponent(id: string): any {
    return this.components[id];
  }

}
