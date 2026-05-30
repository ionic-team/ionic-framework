import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-router-link-page2',
    templateUrl: './router-link-page2.component.html',
    standalone: false
})
export class RouterLinkPage2Component implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log('ngOnInit')
  }

}
