import {Component, View, bootstrap} from 'angular2/angular2'
import {FormBuilder, Validators, FormDirectives, ControlGroup} from 'angular2/forms';
//import {Button, Switch, Form, List, Label, Item, Input, Content} from 'ionic/ionic';
import {IONIC_DIRECTIVES} from 'ionic/ionic'

console.log([FormDirectives].concat(IONIC_DIRECTIVES));

@Component({ selector: '[ion-app]' })
@View({
  templateUrl: 'main.html',
  directives: [FormDirectives].concat(IONIC_DIRECTIVES)
})
class IonicApp {
  constructor() {
  }
}

bootstrap(IonicApp)
