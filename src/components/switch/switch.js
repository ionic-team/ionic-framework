import {NgElement, Component, Template} from 'angular2/angular2';
import {Ion} from '../ion';

@Component({
  selector: 'ion-switch'
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
export class Switch extends Ion {
  constructor(@NgElement() el : NgElement) {
    this.element = el
    console.log('element', el)
  }
  onClick(el) {
    //el.checked = !el.checked;
    console.log(el.checked);
  }
}
