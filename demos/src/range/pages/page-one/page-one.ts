import { Component } from '@angular/core';

@Component({
  templateUrl: 'page-one.html'
})
export class PageOne {
  brightness: number = 20;
  saturation: number = 0;
  warmth: number = 1300;
  structure: any = {lower: 33, upper: 60};

  onChange(ev: any) {
    console.log('Changed', ev);
  }
}
