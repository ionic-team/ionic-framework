import {Component} from '@angular/core';
import {ionicBootstrap} from '../../../../../src';


@Component({
  templateUrl: 'main.html'
})
class E2EPage {
  people = [
    {"name": "Burt", "components": [ "all the things"]},
    {"name": "Mary", "components": [ "checkbox", "content", "form"]},
    {"name": "Albert", "components": [ "tabs"]}
  ];
}

ionicBootstrap(E2EPage);
