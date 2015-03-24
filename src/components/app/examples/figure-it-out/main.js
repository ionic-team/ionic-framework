import {DynamicComponent, Component, Template, bootstrap} from 'angular2/angular2';
import {PrivateComponentLoader} from 'angular2/src/core/compiler/private_component_loader';
import {PrivateComponentLocation} from 'angular2/src/core/compiler/private_component_location';

@DynamicComponent({
  selector: 'dynamic-component',
  services: [PrivateComponentLoader, PrivateComponentLocation]
})
class MyDynamic {

  constructor(
    loader:PrivateComponentLoader, 
    location:PrivateComponentLocation
  ) {
    loader.load(RedBgStyler, location);
    loader.load(BlueTextStyler, location);
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
}

bootstrap(MyApp);
