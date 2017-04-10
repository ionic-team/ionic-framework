import { Injectable } from '@angular/core';
import { Config } from '../../../../../..';

@Injectable()
export class SomeComponentProvider {
  constructor(public config: Config) {
  }

  getName() {
    return 'Jenny';
  }
}
