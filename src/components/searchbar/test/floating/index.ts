import {Component} from '@angular/core';
import {FormBuilder, Validators, Control, ControlGroup} from '@angular/common';
import {ionicBootstrap} from '../../../../../src';


@Component({
  templateUrl: 'main.html'
})
class E2EApp {
  defaultSearch: string = 'test';
  customPlaceholder: string = '';
  defaultCancel: string = '';

  onClearSearchbar(searchbar) {
    console.log("ionClear", searchbar.value);
  }

  onCancelSearchbar(searchbar) {
    console.log("ionCancel", searchbar.value);
  }

  triggerInput(searchbar) {
    console.log("ionInput", searchbar.value);
  }

  inputBlurred(searchbar) {
    console.log("ionBlur", searchbar.value);
  }

  inputFocused(searchbar) {
    console.log("ionFocus", searchbar.value);
  }
}

ionicBootstrap(E2EApp);
