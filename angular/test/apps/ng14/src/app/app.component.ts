import { Component, EnvironmentInjector } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(public environmentInjector: EnvironmentInjector) { }
}
