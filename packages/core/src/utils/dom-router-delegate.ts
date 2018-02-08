

import { RouterDelegate } from '../index';

export class DomRouterDelegate implements RouterDelegate {

  updateUrlState(urlSegment: string, stateObject: any = null, title = ''): Promise<any> {
    history.pushState(stateObject, title, urlSegment);
    return Promise.resolve();
  }
}
