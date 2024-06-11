import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as Commerce from '@chec/commerce.js';

@Injectable({
  providedIn: 'root'
})


export class CommerceClientService {

  private mClient: any;

  constructor() {
    this.mClient = new Commerce(
      environment.commerceApiKey,
      !environment.production,
    );
  }

  get client(): any {
    return this.mClient;
  }

}







/*import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommerceClientService {

  constructor() { }
}
*/