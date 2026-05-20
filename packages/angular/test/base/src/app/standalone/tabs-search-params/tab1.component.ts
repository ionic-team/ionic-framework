import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-tabs-search-params-tab1',
  template: `
    <p>Tab 1</p>
    <p data-testid="tab1-query">{{ queryString$ | async }}</p>
    <p data-testid="tab1-foo">{{ foo$ | async }}</p>
  `,
  standalone: true,
  imports: [AsyncPipe],
})
export class TabsSearchParamsTab1Component {
  queryString$ = this.route.queryParamMap.pipe(
    map((m) => m.keys.map((k) => `${k}=${m.get(k)}`).join('&'))
  );

  foo$ = this.route.queryParamMap.pipe(map((m) => m.get('foo') ?? ''));

  constructor(private route: ActivatedRoute) {}
}
