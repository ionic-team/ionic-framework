import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-slides',
  templateUrl: './slides.component.html',
})
export class SlidesComponent implements AfterViewInit, OnDestroy {
  @ViewChild(IonSlides, { static: true }) slides: IonSlides;
  @ViewChild(IonSlides, { static: true, read: ElementRef }) slidesEl: ElementRef;

  slideIndex = 0;
  slideIndex2 = 0;
  slidesData = [];

  private destroy$ = new Subject<void>();

  constructor() { }

  ngAfterViewInit() {
    fromEvent(this.slidesEl.nativeElement, 'ionSlideDidChange')
      .pipe(takeUntil(this.destroy$))
      .subscribe(async () => {
        this.slideIndex2 = await this.slides.getActiveIndex();
      })
  }

  ngOnDestroy() {
    this.destroy$.next();
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
