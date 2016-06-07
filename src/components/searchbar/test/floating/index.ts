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
    console.log("Clicked clear input on", searchbar.value);
  }

  onCancelSearchbar(searchbar) {
    console.log("Clicked cancel button with", searchbar.value);
  }

  triggerInput(searchbar) {
    console.log("Triggered input", searchbar.value);
  }

  inputBlurred(searchbar) {
    console.log("Blurred input", searchbar.value);
  }

  inputFocused(searchbar) {
    console.log("Focused input", searchbar.value);
  }
}

ionicBootstrap(E2EApp);
