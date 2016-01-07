import {Component} from 'angular2/core';
import {IONIC_DIRECTIVES} from 'ionic/ionic';

@Component({
  selector: '<%= fileName %>',
  templateUrl: '<%= directory %>/<%= fileName %>/<%= fileName %>.html',
  directives: [IONIC_DIRECTIVES] // makes all Ionic directives available to your component
})
export class <%= jsClassName %> {
  constructor() {
    this.text = 'Hello World, I\'m <%= jsClassName %>';
  }
}
