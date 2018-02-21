import {
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';

import { MenuController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})

export class TutorialPage {
  showSkip = true;

  @ViewChild('slides') slidesRef: ElementRef;

  constructor(
    public navCtrl: NavController,
    public menu: MenuController,
    public storage: Storage
  ) { }

  startApp() {
    // this.navCtrl.push(TabsPage).then(() => {
      // this.storage.set('hasSeenTutorial', 'true');
    // });
  }

  onSlideChangeStart(slider: any) {
    this.showSkip = !slider.isEnd();
  }

  ionViewWillEnter() {
    return getHydratedSlides(this.slidesRef).then((slides) => {
      slides.update();
    });
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

  ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }

}

function getHydratedSlides(slidesRef: ElementRef): Promise<HTMLIonSlidesElement> {
  return slidesRef.nativeElement.componentOnReady().then(() => {
    return slidesRef.nativeElement as HTMLIonSlidesElement;
  });
}
