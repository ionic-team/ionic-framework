import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IonContent, IonRouterLinkWithHref } from '@ionic/angular';

@Component({
  selector: 'app-router-outlet-query-params',
  template: `
    <ion-content>
      <h1>Page One</h1>
      <a id="set-query-params" [routerLink]="[]" [queryParams]="{ foo: 'bar' }">Stay with query params</a><br />
      <a id="go-to-details" [routerLink]="['details']">Go to details</a><br />
      <button id="read-snapshot" (click)="readSnapshot()">Read snapshot</button>
      <p id="snapshot-foo">{{ snapshotFoo }}</p>
    </ion-content>
  `,
  standalone: true,
  imports: [RouterLink, IonContent, IonRouterLinkWithHref],
})
export class RouterOutletQueryParamsComponent {
  private route = inject(ActivatedRoute);

  snapshotFoo = '';

  readSnapshot() {
    this.snapshotFoo = this.route.snapshot.queryParamMap.get('foo') ?? 'none';
  }
}
