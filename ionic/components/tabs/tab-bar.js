import {Parent} from 'angular2/src/core/annotations_impl/visibility';
import {Component} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {NgFor} from 'angular2/angular2';

import {TabButton} from './tab-button';
import {Icon} from '../icon/icon';


@Component({
  selector: 'ion-tab-bar'
})
@View({
  template: `
    <div class="tab-bar" role="tablist">
      <button *ng-for="#t of tabs" [tab]="t" class="tab-button" role="tab">
        <icon [name]="t.tabIcon" class="tab-button-icon"></icon>
        <span class="tab-button-text">{{t.tabTitle}}</span>
      </button>
    </div>
  `,
  directives: [NgFor, TabButton, Icon]
})
export class TabBar {
  constructor(@Parent() tabs: Tabs) {
    console.log('TabBar constructor', this.id);
  }
}
