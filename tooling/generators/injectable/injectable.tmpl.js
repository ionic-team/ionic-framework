import {Injectable} from 'angular2/angular2';
import {Http} from 'angular2/http';

@Injectable()
export class <%= jsClassName %> {
  constructor(http: Http) {
    this.http = http;
    this.data = null;
  }

  retrieveData() {
    //Here, we're going to get a JSON data file, use the `map` call to parse json
    // and finally subscribe to the observable and set our data
    //to the value it provides once the http request is complete.
    this.http.get('path/to/data.json')
      .map(res => res.json())
      .subscribe(data => {
        this.data = data;
      });
  }
}
