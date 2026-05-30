import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonButton, IonButtons, IonContent, IonHeader, IonMenuButton, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-split-pane-page',
  templateUrl: './split-pane-page.component.html',
  imports: [ IonButton, IonButtons, IonContent, IonHeader, IonMenuButton, IonTitle, IonToolbar ],
  standalone: true,
})
export class SplitPanePageComponent implements OnInit {
  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);

  constructor() {}

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }

  onClick(val: string) {
    console.log(val);
  }
}
