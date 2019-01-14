import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-slides',
  templateUrl: './slides.component.html',
})
export class SlidesComponent implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;

  slideIndex = 0;

  constructor() { }

  ngOnInit() {
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
