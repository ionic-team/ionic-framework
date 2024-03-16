import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonRouterLink, IonRouterLinkWithHref } from '@ionic/angular/standalone';

@Component({
  selector: 'app-router-link',
  templateUrl: './router-link.component.html',
  standalone: true,
  imports: [RouterModule, IonRouterLink, IonRouterLinkWithHref],
})
export class RouterLinkComponent {}
