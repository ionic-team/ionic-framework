import {Component, NgIf} from 'angular2/angular2';

@Component({
  directives: [NgIf],
  properties: ['value'], //Change to be whatever properties you want, ex: <<%= fileAndClassName %> value="5">
  selector: '<%= fileAndClassName %>',
  templateUrl: 'app/<%= fileAndClassName %>/<%= fileAndClassName %>.html'
})
export class <%= javascriptClassName %> {
  constructor() {
    this.nav = nav;
    this.popup = popup;
    this.dataService = dataService;
  }
}
