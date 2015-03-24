import {Component, Template, Foreach, Parent} from 'angular2/angular2';
import {Inject} from 'angular2/di';

@Component({
  selector: 'ion-tabs'
})
@Template({
  inline: `
  <div class="content">
    <content></content>
  </div>
  <div class="tabs">
  <a *foreach="#tab in tabs" (click)="select(tab)" 
    class="tab-item" 
    [class.active]="tab.isSelected">
      {{tab.title}}
    </a>
  </div>
  `,
  directives: [Foreach],
})
export class Tabs {
  // constructor() {
  //   this.tabs = [];
  // }

  addTab(tab: Tab) {
    this.tabs.push(tab);
    if (this.tabs.length === 1) {
      this.select(tab);
    }
  }

  select(tab: Tab) {
    this.tabs.forEach(otherTab => {
      otherTab.setSelected(false);
    });
    tab.setSelected(true);
  }
}

@Component({
  selector: 'ion-tab',
  bind: {
    title: 'title'
  }
})
@Template({
  inline: `
  <div [hidden]="!isSelected">
    <content></content>
  </div>
  `
})
export class Tab {
  // constructor(
  //   @Parent() tabs: Tabs
  // ) {
  //   tabs.addTab(this);
  //   this.isSelected = false;
  // }
  setSelected(isSelected: Boolean) {
    this.isSelected = isSelected;
  }
}
