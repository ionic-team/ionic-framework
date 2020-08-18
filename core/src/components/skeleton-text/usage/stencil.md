```tsx
import { Component, State, h } from '@stencil/core';

@Component({
  tag: 'skeleton-text-example',
  styleUrl: 'skeleton-text-example.css'
})
export class SkeletonTextExample {
  @State() data: any;

  componentWillLoad() {
    // Data will show after 5 seconds
    setTimeout(() => {
      this.data = {
        'heading': 'Normal text',
        'para1': 'Lorem ipsum dolor sit amet, consectetur',
        'para2': 'adipiscing elit.'
      };
    }, 5000);
  }

  // Render skeleton screen when there is no data
  renderSkeletonScreen() {
    return [
      <ion-content>
        <div class="ion-padding custom-skeleton">
          <ion-skeleton-text animated style={{ 'width': '60%' }}></ion-skeleton-text>
          <ion-skeleton-text animated></ion-skeleton-text>
          <ion-skeleton-text animated style={{ 'width': '88%' }}></ion-skeleton-text>
          <ion-skeleton-text animated style={{ 'width': '70%' }}></ion-skeleton-text>
          <ion-skeleton-text animated style={{ 'width': '60%' }}></ion-skeleton-text>
        </div>

        <ion-list>
          <ion-list-header>
            <ion-label>
              <ion-skeleton-text animated style={{ 'width': '20%' }}></ion-skeleton-text>
            </ion-label>
          </ion-list-header>
          <ion-item>
            <ion-avatar slot="start">
              <ion-skeleton-text animated></ion-skeleton-text>
            </ion-avatar>
            <ion-label>
              <h3>
                <ion-skeleton-text animated style={{ 'width': '50%' }}></ion-skeleton-text>
              </h3>
              <p>
                <ion-skeleton-text animated style={{ 'width': '80%' }}></ion-skeleton-text>
              </p>
              <p>
                <ion-skeleton-text animated style={{ 'width': '60%' }}></ion-skeleton-text>
              </p>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-thumbnail slot="start">
              <ion-skeleton-text animated></ion-skeleton-text>
            </ion-thumbnail>
            <ion-label>
              <h3>
                <ion-skeleton-text animated style={{ 'width': '50%' }}></ion-skeleton-text>
              </h3>
              <p>
                <ion-skeleton-text animated style={{ 'width': '80%' }}></ion-skeleton-text>
              </p>
              <p>
                <ion-skeleton-text animated style={{ 'width': '60%' }}></ion-skeleton-text>
              </p>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-skeleton-text animated style={{ 'width': '27p', 'height': '27px' }} slot="start"></ion-skeleton-text>
            <ion-label>
              <h3>
                <ion-skeleton-text animated style={{ 'width': '50%' }}></ion-skeleton-text>
              </h3>
              <p>
                <ion-skeleton-text animated style={{ 'width': '80%' }}></ion-skeleton-text>
              </p>
              <p>
                <ion-skeleton-text animated style={{ 'width': '60%' }}></ion-skeleton-text>
              </p>
            </ion-label>
          </ion-item>
        </ion-list>
      </ion-content>
    ];
  }

  // Render the elements with data
  renderDataScreen() {
    return [
      <ion-content>
        <div class="ion-padding">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac eros est. Cras iaculis pulvinar arcu non vehicula. Fusce at quam a eros malesuada condimentum. Aliquam tincidunt tincidunt vehicula.
        </div>

        <ion-list>
          <ion-list-header>
            <ion-label>
              Data
            </ion-label>
          </ion-list-header>
          <ion-item>
            <ion-avatar slot="start">
              <img src="./avatar.svg"/>
            </ion-avatar>
            <ion-label>
              <h3>
                { this.data.heading }
              </h3>
              <p>
                { this.data.para1 }
              </p>
              <p>
                { this.data.para2 }
              </p>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-thumbnail slot="start">
              <img src="./thumbnail.svg"/>
            </ion-thumbnail>
            <ion-label>
              <h3>
                { this.data.heading }
              </h3>
              <p>
                { this.data.para1 }
              </p>
              <p>
                { this.data.para2 }
              </p>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-icon name="call" slot="start"></ion-icon>
            <ion-label>
              <h3>
                { this.data.heading }
              </h3>
              <p>
                { this.data.para1 }
              </p>
              <p>
                { this.data.para2 }
              </p>
            </ion-label>
          </ion-item>
        </ion-list>
      </ion-content>
    ];
  }

  render() {
    if (this.data) {
      return this.renderDataScreen();
    } else {
      return this.renderSkeletonScreen();
    }
  }
}
```

```css
/* Custom Skeleton Line Height and Margin */
.custom-skeleton ion-skeleton-text {
  line-height: 13px;
}

.custom-skeleton ion-skeleton-text:last-child {
  margin-bottom: 5px;
}
```