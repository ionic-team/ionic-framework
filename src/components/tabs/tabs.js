import {NgElement, Component, Template, Parent} from 'angular2/angular2';
import {Ion} from '../ion';


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
export class Tabs extends Ion {

  constructor(@NgElement() ele:NgElement) {
    ele.domElement.classList.add('view');
    ele.domElement.classList.add('tabs-container');

    this.tabs = [];
  }

  add(tab) {
    this.tabs.push(tab);
    tab.show(this.tabs.length === 1);
  }

}


@Component({
  selector: 'ion-tab',
  bind: {
    tabTitle: 'tab-title'
  }
})
@Template({
  inline: `
    <div class="container">
      <div class="content">
        <div class="scroll-content">
          <content></content>
        </div>
      </div>
    </div>
    `
})
export class Tab extends Ion {

  constructor(@NgElement() ele:NgElement, @Parent() tabs: Tabs) {
    this.ele = ele;

    ele.domElement.classList.add('view');
    ele.domElement.classList.add('tab-view');

    tabs.add(this);

    setTimeout(() => {
      // HACK!!!!! "this" doesn't have tabTitle when not in setTimeout
      console.log(this.tabTitle)
    })

  }

  show(shouldShow) {
    this.ele.domElement.classList[shouldShow ? 'remove' : 'add']('hide');
  }
}
