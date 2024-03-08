import { Component } from '@angular/core';
import { Config } from '@ionic/angular/standalone';

@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
  standalone: true,
})
export class ProvidersComponent {
  keyboardHeight?: number;

  constructor(private config: Config) {
    this.keyboardHeight = config.get('keyboardHeight');
  }
}
