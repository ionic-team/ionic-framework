import {NgElement, Component, Template, Parent} from 'angular2/angular2';
import {History} from '../../history';
import {View} from 'ionic/components/view/view';


@Component({
  selector: 'ion-tabs'
})
@Template({
  inline: `
    <div class="tool-bar">
      Tabs
    </div>

    <div class="tool-bar tab-bar">
      <a class="tab-item">1</a>
      <a class="tab-item">2</a>
      <a class="tab-item">3</a>
    </div>

    <div class="container">

      <content select="ion-tab"></content>

    </div>
    `
})
export class Tabs {

  constructor(@NgElement() ele:NgElement) {
    ele.domElement.classList.add('pane');
    ele.domElement.classList.add('tabs-container');

    this.tabs = [];
  }

  add(tab) {
    this.tabs.push(tab);
    tab.show(this.tabs.length === 1);

  }

  selectTab(tab) {
    this.showHistory(tab.history);
  }

}
