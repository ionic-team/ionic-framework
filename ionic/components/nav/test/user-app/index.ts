import {
  Directive,
  Component,
  View,
  bootstrap,
  Injectable,
  Inject,
  forwardRef,
  Inject,
  DynamicComponentLoader,
  ElementRef,
  Query,
  QueryList,
  ComponentRef
  } from 'angular2/angular2';


@Injectable()
class IonicModal {
  constructor() {
    console.log('IonicModal constructor');
  }
  open(componentType) {
    console.log('IonicModal open:', componentType.name);
  }
}

@Injectable()
class UserService {
  constructor() {
    console.log('UserService constructor');
    this.id = Math.random();
  }
}

@Directive({
  selector: 'button',
  host: {
    'ionic-button': 'true'
  }
})
class IonicButton {
  constructor() {
    console.log('IonicButton')
  }
}

@Directive({
  selector: 'button',
  host: {
    'user-button': 'true'
  }
})
class UserButton {
  constructor() {
    console.log('UserButton')
  }
}

var IonicDirectives = [IonicButton];

@Component({
  selector: 'user-modal'
})
@View({
  template: `
    <div style="position:absolute;top:0;right:0;bottom:0;left:0;background:#ddd;">
      <h2>user modal</h2>
      <p>UserService: {{userService.id}}
    </div>
  `
})
class UserModal {
  constructor(userService: UserService) {
    console.log('UserModal constructor');
    this.userService = userService;
  }
}



@Component({
  selector: 'user-app',
  hostInjector: [UserService]
})
@View({
  template: `
    <h1>user root component</h1>
    <button primary (click)="openModal()">Open Modal</button>
    <ng-content></ng-content>
  `,
  directives: IonicDirectives.concat([UserButton])
})
class UserRootComponent {
  constructor(ionicModal: IonicModal, userService: UserService) {
    console.log('UserRootComponent constructor');
    this.ionicModal = ionicModal;
  }
  openModal(){
    this.ionicModal.open(UserModal);
  }
}


@Directive({
  selector: 'overlay-anchor'
})
class OverlayAnchor {
  constructor(
    userService: UserService,
    public elementRef: ElementRef,
    loader: DynamicComponentLoader)
  {
    console.log('OverlayAnchor constructor', userService);
    loader.loadNextToLocation(UserModal, elementRef).then((ref: ComponentRef) => {
    });
  }
}



function ionicApp(userApp: Type) {
  function IonicRootComponent() {}
  IonicRootComponent.annotations = [
    new Component({
      selector: 'ion-app',
      viewInjector: [IonicModal]
    }),
    new View({
      template: `
        <user-app>
          <overlay-anchor></overlay-anchor>
        </user-app>`,
      directives: [userApp, OverlayAnchor]
    })
  ];
  return IonicRootComponent;
}

console.log('bootstrap')
bootstrap(ionicApp(UserRootComponent)).catch(err => {
  console.error('bootstrap', err);
});
