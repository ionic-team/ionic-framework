import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-tabs-search-params-tab3',
  template: `
    <p>Tab 3</p>
    <p data-testid="tab3-x">{{ x$ | async }}</p>
    <p data-testid="tab3-y">{{ y$ | async }}</p>
    <p data-testid="tab3-fragment">{{ fragment$ | async }}</p>
  `,
  standalone: true,
  imports: [AsyncPipe],
})
export class TabsSearchParamsTab3Component {
  x$ = this.route.queryParamMap.pipe(map((m) => m.get('x') ?? ''));
  y$ = this.route.queryParamMap.pipe(map((m) => m.get('y') ?? ''));
  fragment$ = this.route.fragment.pipe(map((f) => f ?? ''));

  constructor(private route: ActivatedRoute) {}
}
