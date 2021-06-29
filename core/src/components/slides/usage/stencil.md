```tsx
import { Component, h } from '@stencil/core';

@Component({
  tag: 'slides-example',
  styleUrl: 'slides-example.css'
})
export class SlidesExample {
  // Optional parameters to pass to the swiper instance.
  // See http://idangero.us/swiper/api/ for valid options.
  private slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  render() {
    return [
      <ion-content>
        <ion-slides pager={true} options={this.slideOpts}>
          <ion-slide>
            <h1>Slide 1</h1>
          </ion-slide>

          <ion-slide>
            <h1>Slide 2</h1>
          </ion-slide>

          <ion-slide>
            <h1>Slide 3</h1>
          </ion-slide>
        </ion-slides>
      </ion-content>
    ];
  }
}
```

```css
/* Without setting height the slides will take up the height of the slide's content */
ion-slides {
  height: 100%;
}
```