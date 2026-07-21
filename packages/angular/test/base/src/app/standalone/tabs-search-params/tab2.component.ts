import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-tabs-search-params-tab2',
  template: `
    <p>Tab 2</p>
    <p data-testid="tab2-query">{{ queryString$ | async }}</p>
    <p data-testid="tab2-baz">{{ baz$ | async }}</p>
  `,
  standalone: true,
  imports: [AsyncPipe],
})
export class TabsSearchParamsTab2Component {
  queryString$ = this.route.queryParamMap.pipe(
    map((m) => m.keys.map((k) => `${k}=${m.get(k)}`).join('&'))
  );

  baz$ = this.route.queryParamMap.pipe(map((m) => m.get('baz') ?? ''));

  constructor(private route: ActivatedRoute) {}
}
