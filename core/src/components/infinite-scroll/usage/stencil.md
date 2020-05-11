```tsx
import { Component, State, h } from '@stencil/core';

@Component({
  tag: 'infinite-scroll-example',
  styleUrl: 'infinite-scroll-example.css'
})
export class InfiniteScrollExample {
  private infiniteScroll: HTMLIonInfiniteScrollElement;

  @State() data = [];

  componentWillLoad() {
    this.pushData();
  }

  pushData() {
    const max = this.data.length + 20;
    const min = max - 20;

    for (var i = min; i < max; i++) {
      this.data.push('Item ' + i);
    }

    // Stencil does not re-render when pushing to an array
    // so create a new copy of the array
    // https://stenciljs.com/docs/reactive-data#handling-arrays-and-objects
    this.data = [
      ...this.data
    ];
  }

  loadData(event) {
    setTimeout(() => {
      this.pushData();
      console.log('Loaded data');
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.data.length == 1000) {
        event.target.disabled = true;
      }
    }, 500);
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  render() {
    return [
      <ion-content>
        <ion-button onClick={() => this.toggleInfiniteScroll()} expand="block">
          Toggle Infinite Scroll
        </ion-button>

        <ion-list>
          {this.data.map(item =>
            <ion-item>
              <ion-label>{item}</ion-label>
            </ion-item>
          )}
        </ion-list>

        <ion-infinite-scroll
          ref={el => this.infiniteScroll = el}
          onIonInfinite={(event) => this.loadData(event)}>
          <ion-infinite-scroll-content
            loadingSpinner="bubbles"
            loadingText="Loading more data...">
          </ion-infinite-scroll-content>
        </ion-infinite-scroll>
      </ion-content>
    ];
  }
}
```