import {Component, View} from 'angular2/angular2';

import {Query, QueryList, NgFor} from 'angular2/angular2';
// import {FormBuilder, Validators, NgFormControl, Control, NgControlName, NgControlGroup, ControlContainer} from 'angular2/forms';
import {
  Control,
  ControlGroup,
  NgForm,
  formDirectives,
  Validators,
  NgControl,
  ControlValueAccessor,
  NgControlName,
  NgFormModel,
  FormBuilder
} from 'angular2/forms';
import {Checkbox, Content, List} from 'ionic/ionic';
//import {IONIC_DIRECTIVES} from 'ionic/ionic'

// @Component({
//   selector: 'checkbox-wrapper',
//   properties: [
//     'ctrl'
//   ]
// })
// @View({ //TODO: Pass in component property as checkbox content?
//   template: `<ion-checkbox [ng-form-control]="ctrl">
//     {{ctrlname}}
//   </ion-checkbox>`,
//   directives: [IonicApp, Checkbox, NgFormControl]
// })
// class CheckboxWrapper{
//   constructor(@Query(Checkbox, {descendants: true}) checkboxes: QueryList){
//     this.checkboxes = checkboxes;
//
//     //doesn't work
//     this.checkboxes.onChange(this.onCheckboxChange);
//     setTimeout(() => console.log(this.ctrlname));
//
//     //setTimeout(() => this.onCheckboxChange(), 3000);
//   }
//
//   onCheckboxChange(val) {
//     debugger;
//   }
// }

@Component({ selector: 'ion-app' })
@View({
  templateUrl: 'main.html',
  directives: [Checkbox, List, Content, NgControlName, NgFormModel]
})
class IonicApp {
  constructor() {
    //  var fb = new FormBuilder();
    //  this.controls = {
    //    appleCtrl : ['', Validators.required],
    //    bananaCtrl: ['', Validators.required],
    //    grapeCtrl: ['', Validators.required],
    //    cherryCtrl: ['', Validators.required]
    //  };
    //
    //  this.fruitsForm = fb.group(this.controls);

    this.fruitsForm = new ControlGroup({
      "appleCtrl": new Control("APPLE", isChecked),
      "bananaCtrl": new Control("BANANA", isChecked),
      "grapeCtrl": new Control("GRAPE", isChecked),
      "cherryCtrl":  new Control("CHERRY", isChecked)
    });
    this.appleCtrl = "appleCtrl";
    this.bananaCtrl = "bananaCtrl";
    this.grapeCtrl = "grapeCtrl";
    this.cherryCtrl = "cherryCtrl";

    function isChecked(ctrl) {
      if (ctrl.checked) {
        return null;
      } else {
        return {
          'notChecked': true
        }
      }
    }
  }

  doSubmit(event) {
    console.log('Submitting form', this.fruitsForm.value);
    event.preventDefault();
  }
}


export function main(ionicBootstrap) {
  ionicBootstrap(IonicApp);
}
