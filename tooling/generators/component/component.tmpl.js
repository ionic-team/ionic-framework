import {Component, NgIf} from 'angular2/angular2';
import {NavController} from 'ionic/ionic';

@Component({
  directives: [NgIf],
  properties: ['value'], //Change to be whatever properties you want, ex: <<%= fileName %> value="5">
  selector: '<%= fileName %>',
  templateUrl: 'app/<%= fileName %>/<%= fileName %>.html'
})
export class <%= jsClassName %> {
  constructor(nav: NavController) {
    this.nav = nav;
  }
}
