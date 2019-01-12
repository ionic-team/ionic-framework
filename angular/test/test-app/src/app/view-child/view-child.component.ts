import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { IonTabs, IonButton } from '@ionic/angular';

@Component({
  selector: 'app-view-child',
  templateUrl: './view-child.component.html'
})
export class ViewChildComponent implements AfterViewInit {

  @ViewChild(IonButton) button: IonButton;
  @ViewChild(IonTabs) tabs: IonTabs;
  @ViewChild('div') div: ElementRef;

  ngAfterViewInit() {
    this.button.color = 'danger';
    if (this.tabs != null) {
      this.div.nativeElement.textContent = 'tabs found';
    }
  }
}
