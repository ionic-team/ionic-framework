import {Component} from '@angular/core';
import {ionicBootstrap} from '../../../../../src';


@Component({
  templateUrl: 'main.html'
})
class E2EPage {
  myParam = '';

  myValues = {
    value1: 'Dynamic Input',
    value2: 'Dynamic Textarea'
  };
}

ionicBootstrap(E2EPage);
