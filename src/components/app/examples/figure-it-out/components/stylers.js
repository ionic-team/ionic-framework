import {Decorator, NgElement, Template, Component} from 'angular2/angular2';

@Decorator({
  selector: '[red-bg]'
})
@Template({
  inline: 'test'
})
export class TestRedDecorator {
  constructor(
    element:NgElement
  ) {
    element.domElement.style.background = 'red';
  }

}

@Decorator({
  selector: '[blue-bg]'
})
@Template({
  inline: 'test'
})
export class BlueTextStyler {
  constructor(
    element:NgElement
  ) {
    element.domElement.style.color = 'blue';
  }
}
