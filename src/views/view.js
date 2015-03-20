import * as util from '../util';
import {ViewHistory} from './view-history';

export class View extends ViewSwitcher {
  constructor(el) {
    super(el);

    // A linear history of views that this switcher has gone 
    // through.
    this.history = new ViewHistory();
    this.currentChild = null;
  }

  setChild(view, options = {}) {
    var direction = options.direction || 'forward';
    var viewIndex = this.history.indexOf(view);

    if (viewIndex !== -1) {
      direction = 'back';
      this.history.popTo(viewIndex);
    } else {
      this.history.push(view);
    }

    if (this.currentView) {
      this.element.removeChild(this.currentView.element);
    }
    this.element.appendChild(view.element);
    this.currentView = view.element;
  }

}

