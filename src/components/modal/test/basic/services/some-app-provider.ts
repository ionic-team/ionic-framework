import { Injectable } from '@angular/core';
import { Config } from '../../../../..';

@Injectable()
export class SomeAppProvider {
  constructor(public config: Config) {
    console.log('SomeAppProvider constructor');
  }

  getData() {
    return 'Some data';
  }
}
