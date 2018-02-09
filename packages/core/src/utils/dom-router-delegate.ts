

import { RouterDelegate } from '../index';

export class DomRouterDelegate implements RouterDelegate {

  pushUrlState(urlSegment: string, stateObject: any = null, title = ''): Promise<any> {
    history.pushState(stateObject, title, urlSegment);
    return Promise.resolve();
  }

  popUrlState() {
    history.back();
    return Promise.resolve();
  }
}
