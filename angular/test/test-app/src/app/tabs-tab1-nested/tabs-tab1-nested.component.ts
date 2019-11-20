import { ActivatedRoute } from '@angular/router';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tabs-tab1-nested',
  templateUrl: './tabs-tab1-nested.component.html',
})
export class TabsTab1NestedComponent {
  id = '';
  constructor(
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  next() {
    return parseInt(this.id, 10) + 1;
  }
}
