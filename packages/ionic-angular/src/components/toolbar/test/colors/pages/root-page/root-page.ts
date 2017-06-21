import { Component } from '@angular/core';

@Component({
  templateUrl: 'root-page.html'
})
export class RootPage {

  buttonClick(button: any) {
    console.log(button);
  }

}
