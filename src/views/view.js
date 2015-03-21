import * as util from '../util';
import {ViewHistory} from './view-history';
// import {Children} from 'angular2/angular2';

export class View {
  constructor(
    // @Children() views: View
  ) {
    super(el);
    this.children = [];
    this.history = new ViewHistory();
  }

  setSelected(isSelected) {
    this.isSelected = isSelected;
  }

  selectChild(child) {
    if (this.selectedChild) {
      this.selectedChild.setSelected(false);
    }
    child.setSelected(true);
    this.selectedChild = child;
  }
}
