import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonItem, IonRouterLink, IonRouterLinkWithHref } from '@ionic/angular/standalone';

@Component({
  selector: 'app-router-link',
  templateUrl: './router-link.component.html',
  standalone: true,
  imports: [RouterLink, IonItem, IonRouterLink, IonRouterLinkWithHref],
})
export class RouterLinkComponent {}
