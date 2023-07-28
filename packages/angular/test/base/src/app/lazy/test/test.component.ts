import { Component } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  standalone: true
})
export class TestComponent {
  constructor() {
    console.log('This should be undefined:', customElements.get('ion-app'));
  }
}
