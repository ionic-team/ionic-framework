
export class NavController {

  constructor(nav) {
    this._nav = nav;
  }

  push() {
    return this._nav.push.apply(this._nav, arguments);
  }

  pop() {
    return this._nav.pop.apply(this._nav, arguments);
  }
}
