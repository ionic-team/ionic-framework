import {Component, View, bootstrap} from 'angular2/angular2'
import {FormBuilder, Validators, FormDirectives, ControlGroup} from 'angular2/forms';
import {Button, Form, Item, Input, Content} from 'ionic/ionic';

@Component({ selector: '[ion-app]' })
@View({
  templateUrl: 'main.html',
  directives: [FormDirectives, Item, Button, Input, Content]
})
class IonicApp {
  constructor() {
    var fb = new FormBuilder();
    this.form = fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
}

bootstrap(IonicApp)
