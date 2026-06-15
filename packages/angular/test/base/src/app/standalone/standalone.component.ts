import { Component } from "@angular/core";

import { IonicModule } from '@ionic/angular/lazy';

@Component({
  selector: 'app-standalone',
  templateUrl: './standalone.component.html',
  standalone: true,
  imports: [IonicModule]
})
export class StandaloneComponent { }
