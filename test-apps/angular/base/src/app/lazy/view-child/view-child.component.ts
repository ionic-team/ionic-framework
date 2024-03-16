import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { IonTabs, IonButton } from '@ionic/angular';

@Component({
  selector: 'app-view-child',
  templateUrl: './view-child.component.html'
})
export class ViewChildComponent implements AfterViewInit {
  @ViewChild(IonButton, { static: true }) button!: IonButton;
  @ViewChild(IonTabs, { static: true }) tabs!: IonTabs;
  @ViewChild('div', { static: true }) div!: ElementRef;

  ngAfterViewInit() {
    const loaded = !!(this.button && this.tabs && this.div);
    this.button.color = 'danger';
    if (loaded) {
      this.div.nativeElement.textContent = 'all found';
    }
  }
}
