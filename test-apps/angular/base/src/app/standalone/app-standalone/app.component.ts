import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonRouterOutlet, IonApp } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root-standalone',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterModule, IonRouterOutlet, IonApp]
})
export class AppComponent {
}
