import {Query, ViewQuery, QueryList, bootstrap, ElementRef, Component, Directive, View, Injectable, Renderer} from 'angular2/angular2';


@Component({
  selector: 'icon'
})
@View({
  template: '♠'
})
class Icon {}


@Directive({
  selector: 'button'
})
class Button {
  constructor(@Query(Icon) public icon: QueryList<Icon>) {
    icon.onChange( ()=> {
      console.log('button icon', icon);
    });
  }
  onInit() {
    console.log('Button icon', this.icon);
  }
}

@Component({
  selector: 'ion-app'
})
@View({
  template: `
    <button><icon></icon> Button</button>
  `,
  directives: [Button, Icon]
})
export class HelloCmp {

}


bootstrap(HelloCmp);
