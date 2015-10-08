
/**
 * @private
 * Map of possible pages that can be navigated to using an Ionic NavController
 */
export class NavRegistry {
  constructor(pages=[]) {
    this._pages = new Map(pages.map(page => [page.name, page]));
  }

  get(pageName) {
    return this._pages.get(pageName);
  }

  set(page) {
    this._pages.set(page.name, page);
  }
}
