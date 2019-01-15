import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { IonTabs, IonButton, IonSlides, IonSlide } from '@ionic/angular';

@Component({
  selector: 'app-view-child',
  templateUrl: './view-child.component.html'
})
export class ViewChildComponent implements AfterViewInit {

  @ViewChild(IonSlides) slides: IonSlides;
  @ViewChild(IonButton) button: IonButton;
  @ViewChild(IonTabs) tabs: IonTabs;
  @ViewChild('div') div: ElementRef;
  @ViewChild('slide') slide: IonSlide;

  ngAfterViewInit() {
    const loaded = !!(this.slides && this.button && this.tabs && this.div && this.slide);
    this.button.color = 'danger';
    if (loaded) {
      this.div.nativeElement.textContent = 'all found';
    }
  }
}
