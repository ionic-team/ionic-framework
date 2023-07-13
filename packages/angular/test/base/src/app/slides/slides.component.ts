import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-slides',
  templateUrl: './slides.component.html',
})
export class SlidesComponent implements AfterViewInit {
  @ViewChild(IonSlides, { static: true }) slides!: IonSlides;

  slideIndex = 0;
  slideIndex2 = 0;
  slidesData: string[] = [];

  constructor() { }

  ngAfterViewInit() {
    this.slides.ionSlideDidChange.subscribe(async () => {
      this.slideIndex2 = await this.slides.getActiveIndex();
    });
  }

  addSlides() {
    const start = this.slidesData.length + 1;
    this.slidesData.push(`Slide ${start}`, `Slide ${start + 1}`, `Slide ${start + 2}`);
  }

  prevSlide() {
    this.slides.slidePrev();
  }

  nextSlide() {
    this.slides.slideNext();
  }

  async checkIndex() {
    this.slideIndex = await this.slides.getActiveIndex();
  }

}
