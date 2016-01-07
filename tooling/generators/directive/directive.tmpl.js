import {Directive} from 'angular2/core';

/*
  Generated class for the <%= jsClassName %> directive.

  See https://angular.io/docs/ts/latest/api/core/DirectiveMetadata-class.html
  for more info on Angular 2 Directives.
*/
@Directive({
  selector: '[<%= fileName %>]' // Attribute selector
})
export class <%= jsClassName %> {
  constructor() {
    console.log('Hello World');
  }
}
