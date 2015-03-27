import {NgElement, Component, Template, Parent} from 'angular2/angular2';
import {Tabs} from 'ionic2/components/tabs/tabs';
import {NavView} from 'ionic2/components/nav-view/nav-view';

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
export class Tab extends NavView {

  constructor(@NgElement() ele:NgElement, @Parent() tabs: Tabs) {
    super();
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
