import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { IonTabs, IonButton, IonSlides, IonSlide } from '@ionic/angular';

@Component({
  selector: 'app-view-child',
  templateUrl: './view-child.component.html'
})
export class ViewChildComponent implements AfterViewInit {

  @ViewChild(IonSlides, { static: true }) slides: IonSlides;
  @ViewChild(IonButton, { static: true }) button: IonButton;
  @ViewChild(IonTabs, { static: true }) tabs: IonTabs;
  @ViewChild('div', { static: true }) div: ElementRef;
  @ViewChild('slide', { static: true }) slide: IonSlide;

  ngAfterViewInit() {
    const loaded = !!(this.slides && this.button && this.tabs && this.div && this.slide);
    this.button.color = 'danger';
    if (loaded) {
      this.div.nativeElement.textContent = 'all found';
    }
  }
}
