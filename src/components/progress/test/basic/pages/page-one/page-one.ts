import { Component } from '@angular/core';

@Component({
  templateUrl: 'page-one.html',
  styles: [`
    ion-progress{
      margin:24px 0px;
    }
  `]
})
export class PageOne {
  public value: number = 40;
  public buffer: number = 60;
}
