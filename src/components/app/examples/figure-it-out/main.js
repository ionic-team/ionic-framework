import {DynamicComponent, Component, Template, bootstrap, NgElement} from 'angular2/angular2';
import {Inject} from 'angular2/di';
import {PrivateComponentLoader} from 'angular2/src/core/compiler/private_component_loader';
import {PrivateComponentLocation} from 'angular2/src/core/compiler/private_component_location';
import {RedBgStyler, BlueTextStyler} from './components/stylers';

class Testy {
  constructor(@Inject() element: NgElement) {
    element.domElement.style.border = '3px solid pink;'
  }
}

@DynamicComponent({
  selector: 'dynamic-component',
  services: [PrivateComponentLoader, PrivateComponentLocation]
})
class MyDynamic {

  constructor(
    loader:PrivateComponentLoader, 
    location:PrivateComponentLocation
  ) {
    // loader.load(RedBgStyler, location);
    // loader.load(BlueTextStyler, location);
    Testy.annotations = [
      new Component({ selector: 'testy' }),
      new Template({ inline: 'testy-template' })
    ];
  }
}


@Component({
  selector: 'my-app'
})
@Template({
  inline: `
  <dynamic-component>Hello!</dynamic-component>
  `,
  directives: [MyDynamic],
})
class MyApp {
  constructor() {
    console.log('MyApp loaded');
  }
}

bootstrap(MyApp);
