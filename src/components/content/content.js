import {NgElement, Component, Template, PropertySetter} from 'angular2/angular2';

@Component({
  selector: 'ion-content'
})
@Template({
  inline: `
    <div class="scroll-content">
      <content></content>
    </div>`
})
export class Content {
  constructor(
    @NgElement() ele:NgElement,
    @PropertySetter('style.transform') transformSetter: Function,
    @PropertySetter('class.notransition') noTransitionSetter: Function
  ) {
    this.domElement = ele.domElement;
    this.domElement.classList.add('content');

    this.noTransitionSetter = is => { this.domElement.classList[is?'add':'remove']('notransition'); }
    // this.noTransitionSetter = noTransitionSetter;
    
    this.transformSetter = transformSetter;
    this.setIsAside = is => { this.domElement.classList.add('aside-content'); };

    this.asideOpenSetter = (is, side) => {
      this.domElement.classList[is?'add':'remove'](`aside-open-${side}`);
    }
  }
}
