
export class NavController {

  constructor(nav) {
    this._nav = nav;
  }

  /**
   * Clear the history stack.
   */
  clear() {
    return this._nav.clear();
  }

  /**
   * Push an ew component onto the history stack.
   */
  push() {
    return this._nav.push.apply(this._nav, arguments);
  }

  /**
   * Pop the top most (visible) component off the history stack.
   */
  pop() {
    return this._nav.pop.apply(this._nav, arguments);
  }
}
