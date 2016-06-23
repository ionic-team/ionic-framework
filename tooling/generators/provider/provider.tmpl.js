import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

/*
  Generated class for the <%= jsClassName %> provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class <%= jsClassName %> {
  static get parameters(){
    return [[Http]]
  }

  constructor(http) {
    this.http = http;
    this.data = null;
  }

  load() {
    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }

    // don't have the data yet
    return this.http.get('path/to/data.json')
      .map(res => res.json())
      .catch(this.handleError)
      .toPromise()
      .then(data => {
        // we've got back the raw data, now generate the core schedule data
        // and save the data for later reference
        this.data = data;
        return this.data;
      });
  }

  handleError(error) {
    return Observable.throw({
      message: error.json().error || 'Server error',
      status: error.status
    });
  }
}
