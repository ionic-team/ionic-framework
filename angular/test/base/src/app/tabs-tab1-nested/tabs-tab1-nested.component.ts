import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tabs-tab1-nested',
  templateUrl: './tabs-tab1-nested.component.html',
})
export class TabsTab1NestedComponent implements OnInit {
  id: string | null = '';
  constructor(
    private route: ActivatedRoute,
    public navCtrl: NavController
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  next() {
    if (this.id === null) {
      return '1';
    }
    return parseInt(this.id, 10) + 1;
  }

}
