import {extend} from '../../util/util';

/**
 * TODO
 */
export class NavController {
  /**
   * TODO
   * @param {TODO} nav  TODO
   */
  constructor(nav) {
    this._nav = nav;
  }

  /**
   * Set the history stack to match the list of component items.
   * @param {TODO} items  TODO
   * @return {TODO} TODO
   */
  setItems(items) {
    return this._nav.setItems(items);
  }

  /**
   * Clear the history stack.
   * @return {TODO} TODO
   */
  clear() {
    return this._nav.clear();
  }

  /**
   * Push a new component onto the history stack.
   * @return {TODO} TODO
   */
  push() {
    return this._nav.push.apply(this._nav, arguments);
  }

  /**
   * Pop the top most (visible) component off the history stack.
   * @return {TODO} TODO
   */
  pop() {
    return this._nav.pop.apply(this._nav, arguments);
  }
}

/**
 * TODO
 */
export class NavParams {
  /**
   * TODO
   * @param {TODO} data  TODO
   */
  constructor(data) {
    this.data = data || {};
  }

  /**
   * TODO
   * @param {TODO} param  TODO
   */
  get(param) {
    return this.data[param];
  }
}
