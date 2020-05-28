```tsx
import { Component, h } from '@stencil/core';

@Component({
  tag: 'img-example',
  styleUrl: 'img-example.css'
})
export class ImgExample {
  private items = [{
    'text': 'Item 1',
    'src': '/path/to/external/file.png'
  }, {
    'text': 'Item 2',
    'src': '/path/to/external/file.png'
  }, {
    'text': 'Item 3',
    'src': '/path/to/external/file.png'
  }];

  render() {
    return [
      <ion-list>
        {this.items.map(item =>
          <ion-item>
            <ion-thumbnail slot="start">
              <ion-img src={item.src}></ion-img>
            </ion-thumbnail>
            <ion-label>{item.text}</ion-label>
          </ion-item>
        )}
      </ion-list>
    ];
  }
}
```