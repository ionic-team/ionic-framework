import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-tabs-search-params-tab4',
  template: `
    <p>Tab 4</p>
    <p data-testid="tab4-q">{{ q$ | async }}</p>
  `,
  standalone: true,
  imports: [AsyncPipe],
})
export class TabsSearchParamsTab4Component {
  q$ = this.route.queryParamMap.pipe(map((m) => m.get('q') ?? ''));

  constructor(private route: ActivatedRoute) {}
}
