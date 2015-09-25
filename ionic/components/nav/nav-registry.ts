
/**
 * Map of possible views that can be navigated to using an Ionic NavController
 */
export class NavRegistry {
  constructor(views=[]) {
    this._views = new Map(views.map(view => [view.name, view]));
  }

  get(viewName) {
    return this._views.get(viewName);
  }

  set(view) {
    this._views.set(view.name, view);
  }
}
