import { Injectable } from '@angular/core';

@Injectable()
export class NavController {

  private goback = false;

  setGoback() {
    this.goback = true;
  }

  consumeGoBack() {
    const goback = this.goback;
    this.goback = false;
    return goback;
  }
}
