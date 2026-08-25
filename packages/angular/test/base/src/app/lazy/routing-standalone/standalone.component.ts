import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

import { IonicModule } from '@ionic/angular/lazy';

@Component({
  selector: 'app-standalone',
  templateUrl: './standalone.component.html',
  standalone: true,
  imports: [IonicModule, RouterModule]
})
export class StandaloneComponent { }
