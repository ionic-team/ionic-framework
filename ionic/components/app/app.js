import {ApplicationRef} from 'angular2/angular2';

export class Ionic {
  constructor() {

  }

  setAppRef(appRef: ApplicationRef) {
    this.appRef = appRef;
    console.log('Got app ref', appRef);
  }
  getAppRef() {
    return this.appRef;
  }
}
