import {Type} from '@angular/core';

/**
 * @private
 * Map of possible pages that can be navigated to using an Ionic NavController
 */
export class NavRegistry {
  private _pages: Map<string, Type>;

  constructor(pages: Type[] = []) {
    var pagePairs = pages.map(page => [page['name'], page]);
    this._pages = new Map<string, Type>();
    for (var i = 0; i < pagePairs.length; i++) {
      var pair = pagePairs[i];
      this._pages.set(pair[0], pair[1]);
    }
  }

  get(pageName: any) {
    return this._pages.get(pageName);
  }

  set(page: any) {
    this._pages.set(page.name, page);
  }
}
