import { Component, VERSION } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './app-landing.component.html',
  standalone: false
})
export class AppLandingComponent {
  angularVersion = VERSION;

  constructor() {}

}
