```tsx
import { Component, h } from '@stencil/core';

@Component({
  tag: 'content-example',
  styleUrl: 'content-example.css'
})
export class ContentExample {
  logScrollStart() {
    console.log('Scroll start');
  }

  logScrolling(ev) {
    console.log('Scrolling', ev);
  }

  logScrollEnd() {
    console.log('Scroll end');
  }

  render() {
    return [
      <ion-content
        scrollEvents={true}
        onIonScrollStart={() => this.logScrollStart()}
        onIonScroll={(ev) => this.logScrolling(ev)}
        onIonScrollEnd={() => this.logScrollEnd()}>
          <h1>Main Content</h1>

          <div slot="fixed">
            <h1>Fixed Content</h1>
          </div>
      </ion-content>
    ];
  }
}
```
