import {Component, NgElement, Template} from 'angular2/angular2';

@Component({
  selector: '[red-bg]'
})
@Template({
  inline: 'red template'
})
export class RedBgStyler {
  constructor(
    element:NgElement
  ) {
    element.domElement.style.background = 'red';
  }

}

@Component({
  selector: '[blue-bg]'
})
@Template({
  inline: 'blue template'
})
export class BlueTextStyler {
  constructor(
    element:NgElement
  ) {
    element.domElement.style.color = 'blue';
  }
}
