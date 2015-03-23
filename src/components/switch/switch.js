import {NgElement, Component, Template} from 'angular2/angular2';
import {Ion} from '../ion';

@Component({
  selector: 'ion-switch',
  bind: {
    checked: 'checked'
  }
})
@Template({
  inline: `
<div class="item item-switch">
  <div ng-transclude></div>
  <label class="switch">
    <input type="checkbox" (click)="onClick(input)" #input>
    <div class="track">
      <div class="handle"></div>
    </div>
  </label>
</div>
`
})
export class Switch extends IonElement {
  constructor(
    @NgElement() el : NgElement,
    @EventEmitter('change') emitChange: Function
  ) {
    this.ngElement = el;
    this.emitChange = emitChange;
  }
  onClick() {
    this.emitChange(this.checked);
  }
}

/*
<ion-view>

  <aside/>

  <tabs>
    <my-page-3 title="My Page 3" />
    <tab>
      static content
    </tab>
  </tabs>

</ion-view>

@Component({
  selector: 'my-page-3',
  defaults: {
    title: 'My Page 3',
    icon: 'Super icon'
  },
})
@Template( {
  url: 'my-page-3.html'
})
@Route({
  name: 'my-page-3'
})
class MyPage3 extends TabComponent {

}


1) Sign in page, 1 view
2) Navigate to a tabs view, 3 tabs, all have the same side menu
3) Tab 2, page 2 navigates to nested tabs with it's own side menu

*/
