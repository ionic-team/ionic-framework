import { Component } from '@angular/core';
// import { RouterLink, RouterLinkWithHref } from '@angular/router';
import { IonRouterLink, IonRouterLinkWithHref } from '@ionic/angular/standalone';

@Component({
  selector: 'app-router-link',
  templateUrl: './router-link.component.html',
  standalone: true,
  imports: [IonRouterLink, IonRouterLinkWithHref],
  // providers: [RouterLink, RouterLinkWithHref]
})
export class RouterLinkComponent {}