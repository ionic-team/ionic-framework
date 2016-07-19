import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the <%= jsClassName %> provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class <%= jsClassName %> {
  static get parameters() {
    return [[Http]]
  }

  constructor(http) {
    this.http = http;
  }

}

