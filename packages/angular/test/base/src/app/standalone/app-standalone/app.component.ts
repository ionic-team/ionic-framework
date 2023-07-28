import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-root-standalone',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterModule]
})
export class AppComponent {
}
