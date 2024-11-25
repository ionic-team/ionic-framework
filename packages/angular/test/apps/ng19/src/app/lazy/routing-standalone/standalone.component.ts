import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-standalone',
    templateUrl: './standalone.component.html',
    imports: [IonicModule, RouterModule]
})
export class StandaloneComponent { }
