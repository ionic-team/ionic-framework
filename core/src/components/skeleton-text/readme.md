# ion-skeleton-text

Skeleton Text is a component for rendering placeholder content. The element will render a gray block at the specified width.


<!-- Auto Generated Below -->


## Usage

### Angular

```html
<!-- Data to display after skeleton screen -->
<div *ngIf="data">
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
        <img src="./avatar.svg">
      </ion-avatar>
      <ion-label>
        <h3>
          {{ data.heading }}
        </h3>
        <p>
          {{ data.para1 }}
        </p>
        <p>
          {{ data.para2 }}
        </p>
      </ion-label>
    </ion-item>
    <ion-item>
      <ion-thumbnail slot="start">
        <img src="./thumbnail.svg">
      </ion-thumbnail>
      <ion-label>
        <h3>
          {{ data.heading }}
        </h3>
        <p>
          {{ data.para1 }}
        </p>
        <p>
          {{ data.para2 }}
        </p>
      </ion-label>
    </ion-item>
    <ion-item>
      <ion-icon name="call" slot="start"></ion-icon>
      <ion-label>
        <h3>
          {{ data.heading }}
        </h3>
        <p>
          {{ data.para1 }}
        </p>
        <p>
          {{ data.para2 }}
        </p>
      </ion-label>
    </ion-item>
  </ion-list>
</div>

<!-- Skeleton screen -->
<div *ngIf="!data">
  <div class="ion-padding custom-skeleton">
    <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
    <ion-skeleton-text animated></ion-skeleton-text>
    <ion-skeleton-text animated style="width: 88%"></ion-skeleton-text>
    <ion-skeleton-text animated style="width: 70%"></ion-skeleton-text>
    <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
  </div>

  <ion-list>
    <ion-list-header>
      <ion-label>
        <ion-skeleton-text animated style="width: 20%"></ion-skeleton-text>
      </ion-label>
    </ion-list-header>
    <ion-item>
      <ion-avatar slot="start">
        <ion-skeleton-text animated></ion-skeleton-text>
      </ion-avatar>
      <ion-label>
        <h3>
          <ion-skeleton-text animated style="width: 50%"></ion-skeleton-text>
        </h3>
        <p>
          <ion-skeleton-text animated style="width: 80%"></ion-skeleton-text>
        </p>
        <p>
          <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
        </p>
      </ion-label>
    </ion-item>
    <ion-item>
      <ion-thumbnail slot="start">
        <ion-skeleton-text animated></ion-skeleton-text>
      </ion-thumbnail>
      <ion-label>
        <h3>
          <ion-skeleton-text animated style="width: 50%"></ion-skeleton-text>
        </h3>
        <p>
          <ion-skeleton-text animated style="width: 80%"></ion-skeleton-text>
        </p>
        <p>
          <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
        </p>
      </ion-label>
    </ion-item>
    <ion-item>
      <ion-skeleton-text animated style="width: 27px; height: 27px" slot="start"></ion-skeleton-text>
      <ion-label>
        <h3>
          <ion-skeleton-text animated style="width: 50%"></ion-skeleton-text>
        </h3>
        <p>
          <ion-skeleton-text animated style="width: 80%"></ion-skeleton-text>
        </p>
        <p>
          <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
        </p>
      </ion-label>
    </ion-item>
  </ion-list>
</div>
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

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'skeleton-text-example',
  templateUrl: 'skeleton-text-example.html',
  styleUrls: ['./skeleton-text-example.css']
})
export class SkeletonTextExample {
  data: any;

  constructor() {}

  ionViewWillEnter() {
    setTimeout(() => {
      this.data = {
        'heading': 'Normal text',
        'para1': 'Lorem ipsum dolor sit amet, consectetur',
        'para2': 'adipiscing elit.'
      };
    }, 5000);
  }
}
```


### Javascript

```html
<!-- Data to display after skeleton screen -->
<div id="data">
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
        <img src="./avatar.svg">
      </ion-avatar>
      <ion-label>
        <h3>
          Normal text
        </h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur
        </p>
        <p>
          adipiscing elit.
        </p>
      </ion-label>
    </ion-item>
    <ion-item>
      <ion-thumbnail slot="start">
        <img src="./thumbnail.svg">
      </ion-thumbnail>
      <ion-label>
        <h3>
          Normal text
        </h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur
        </p>
        <p>
          adipiscing elit.
        </p>
      </ion-label>
    </ion-item>
    <ion-item>
      <ion-icon name="call" slot="start"></ion-icon>
      <ion-label>
        <h3>
          Normal text
        </h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur
        </p>
        <p>
          adipiscing elit.
        </p>
      </ion-label>
    </ion-item>
  </ion-list>
</div>

<!-- Skeleton screen -->
<div id="skeleton">
  <div class="ion-padding custom-skeleton">
    <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
    <ion-skeleton-text animated></ion-skeleton-text>
    <ion-skeleton-text animated style="width: 88%"></ion-skeleton-text>
    <ion-skeleton-text animated style="width: 70%"></ion-skeleton-text>
    <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
  </div>

  <ion-list>
    <ion-list-header>
      <ion-label>
        <ion-skeleton-text animated style="width: 20%"></ion-skeleton-text>
      </ion-label>
    </ion-list-header>
    <ion-item>
      <ion-avatar slot="start">
        <ion-skeleton-text animated></ion-skeleton-text>
      </ion-avatar>
      <ion-label>
        <h3>
          <ion-skeleton-text animated style="width: 50%"></ion-skeleton-text>
        </h3>
        <p>
          <ion-skeleton-text animated style="width: 80%"></ion-skeleton-text>
        </p>
        <p>
          <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
        </p>
      </ion-label>
    </ion-item>
    <ion-item>
      <ion-thumbnail slot="start">
        <ion-skeleton-text animated></ion-skeleton-text>
      </ion-thumbnail>
      <ion-label>
        <h3>
          <ion-skeleton-text animated style="width: 50%"></ion-skeleton-text>
        </h3>
        <p>
          <ion-skeleton-text animated style="width: 80%"></ion-skeleton-text>
        </p>
        <p>
          <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
        </p>
      </ion-label>
    </ion-item>
    <ion-item>
      <ion-skeleton-text animated style="width: 27px; height: 27px" slot="start"></ion-skeleton-text>
      <ion-label>
        <h3>
          <ion-skeleton-text animated style="width: 50%"></ion-skeleton-text>
        </h3>
        <p>
          <ion-skeleton-text animated style="width: 80%"></ion-skeleton-text>
        </p>
        <p>
          <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
        </p>
      </ion-label>
    </ion-item>
  </ion-list>
</div>
```

```css
#data {
  display: none;
}

/* Custom Skeleton Line Height and Margin */
.custom-skeleton ion-skeleton-text {
  line-height: 13px;
}

.custom-skeleton ion-skeleton-text:last-child {
  margin-bottom: 5px;
}
```

```javascript
function onLoad() {
  const skeletonEl = document.getElementById('skeleton');
  const dataEl = document.getElementById('data');

  setTimeout(() => {
    skeletonEl.style.display = 'none';
    dataEl.style.display = 'block';
  }, 5000);
}
```


### React

```tsx
import React, { useState } from 'react';
import {
  IonContent,
  IonItem,
  IonAvatar,
  IonLabel,
  IonSkeletonText,
  IonListHeader,
  IonIcon,
  IonThumbnail,
  IonList
} from '@ionic/react';
import { call } from 'ionicons/icons';

import './SkeletonTextExample.css';

export const SkeletonTextExample: React.FC = () => {
  const [data, setData] = useState();

  setTimeout(() => {
    setData({
      heading: 'Normal text',
      para1: 'Lorem ipsum dolor sit amet, consectetur',
      para2: 'adipiscing elit.'
    });
  }, 5000);

  return (
    <IonContent>
      {data ? (
        <>
          <div className="ion-padding">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac eros est. Cras iaculis pulvinar
            arcu non vehicula. Fusce at quam a eros malesuada condimentum. Aliquam tincidunt tincidunt
            vehicula.
          </div>

          <IonList>
            <IonListHeader>
              <IonLabel>
                Data
              </IonLabel>
            </IonListHeader>
            <IonItem>
              <IonAvatar slot="start">
                <img src="./avatar.svg" />
              </IonAvatar>
              <IonLabel>
                <h3>{data.heading}</h3>
                <p>{data.para1}</p>
                <p>{data.para2}</p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonThumbnail slot="start">
                <img src="./thumbnail.svg" />
              </IonThumbnail>
              <IonLabel>
                <h3>{data.heading}</h3>
                <p>{data.para1}</p>
                <p>{data.para2}</p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonIcon icon={call} slot="start" />
              <IonLabel>
                <h3>{data.heading}</h3>
                <p>{data.para1}</p>
                <p>{data.para2}</p>
              </IonLabel>
            </IonItem>
          </IonList>
        </>
      ) : (
        <>
          <div className="ion-padding custom-skeleton">
            <IonSkeletonText animated style={{ width: '60%' }} />
            <IonSkeletonText animated />
            <IonSkeletonText animated style={{ width: '88%' }} />
            <IonSkeletonText animated style={{ width: '70%' }} />
            <IonSkeletonText animated style={{ width: '60%' }} />
          </div>

          <IonList>
            <IonListHeader>
              <IonLabel>
                <IonSkeletonText animated style={{ width: '20%' }} />
              </IonLabel>
            </IonListHeader>
            <IonItem>
              <IonAvatar slot="start">
                <IonSkeletonText animated />
              </IonAvatar>
              <IonLabel>
                <h3>
                  <IonSkeletonText animated style={{ width: '50%' }} />
                </h3>
                <p>
                  <IonSkeletonText animated style={{ width: '80%' }} />
                </p>
                <p>
                  <IonSkeletonText animated style={{ width: '60%' }} />
                </p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonThumbnail slot="start">
                <IonSkeletonText animated />
              </IonThumbnail>
              <IonLabel>
                <h3>
                  <IonSkeletonText animated style={{ width: '50%' }} />
                </h3>
                <p>
                  <IonSkeletonText animated style={{ width: '80%' }} />
                </p>
                <p>
                  <IonSkeletonText animated style={{ width: '60%' }} />
                </p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonSkeletonText animated style={{ width: '27px', height: '27px' }} slot="start" />
              <IonLabel>
                <h3>
                  <IonSkeletonText animated style={{ width: '50%' }} />
                </h3>
                <p>
                  <IonSkeletonText animated style={{ width: '80%' }} />
                </p>
                <p>
                  <IonSkeletonText animated style={{ width: '60%' }} />
                </p>
              </IonLabel>
            </IonItem>
          </IonList>
        </>
      )}
    </IonContent>
  );
};
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


### Stencil

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


### Vue

```html
<template>
  <!-- Data to display after skeleton screen -->
  <div v-if="data">
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
          <img src="./avatar.svg">
        </ion-avatar>
        <ion-label>
          <h3>
            {{ data.heading }}
          </h3>
          <p>
            {{ data.para1 }}
          </p>
          <p>
            {{ data.para2 }}
          </p>
        </ion-label>
      </ion-item>
      <ion-item>
        <ion-thumbnail slot="start">
          <img src="./thumbnail.svg">
        </ion-thumbnail>
        <ion-label>
          <h3>
            {{ data.heading }}
          </h3>
          <p>
            {{ data.para1 }}
          </p>
          <p>
            {{ data.para2 }}
          </p>
        </ion-label>
      </ion-item>
      <ion-item>
        <ion-icon name="call" slot="start"></ion-icon>
        <ion-label>
          <h3>
            {{ data.heading }}
          </h3>
          <p>
            {{ data.para1 }}
          </p>
          <p>
            {{ data.para2 }}
          </p>
        </ion-label>
      </ion-item>
    </ion-list>
  </div>

  <!-- Skeleton screen -->
  <div *ngIf="!data">
    <div class="ion-padding custom-skeleton">
      <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
      <ion-skeleton-text animated></ion-skeleton-text>
      <ion-skeleton-text animated style="width: 88%"></ion-skeleton-text>
      <ion-skeleton-text animated style="width: 70%"></ion-skeleton-text>
      <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
    </div>

    <ion-list>
      <ion-list-header>
        <ion-label>
          <ion-skeleton-text animated style="width: 20%"></ion-skeleton-text>
        </ion-label>
      </ion-list-header>
      <ion-item>
        <ion-avatar slot="start">
          <ion-skeleton-text animated></ion-skeleton-text>
        </ion-avatar>
        <ion-label>
          <h3>
            <ion-skeleton-text animated style="width: 50%"></ion-skeleton-text>
          </h3>
          <p>
            <ion-skeleton-text animated style="width: 80%"></ion-skeleton-text>
          </p>
          <p>
            <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
          </p>
        </ion-label>
      </ion-item>
      <ion-item>
        <ion-thumbnail slot="start">
          <ion-skeleton-text animated></ion-skeleton-text>
        </ion-thumbnail>
        <ion-label>
          <h3>
            <ion-skeleton-text animated style="width: 50%"></ion-skeleton-text>
          </h3>
          <p>
            <ion-skeleton-text animated style="width: 80%"></ion-skeleton-text>
          </p>
          <p>
            <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
          </p>
        </ion-label>
      </ion-item>
      <ion-item>
        <ion-skeleton-text animated style="width: 27px; height: 27px" slot="start"></ion-skeleton-text>
        <ion-label>
          <h3>
            <ion-skeleton-text animated style="width: 50%"></ion-skeleton-text>
          </h3>
          <p>
            <ion-skeleton-text animated style="width: 80%"></ion-skeleton-text>
          </p>
          <p>
            <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
          </p>
        </ion-label>
      </ion-item>
    </ion-list>
  </div>
</template>

<style>
  /* Custom Skeleton Line Height and Margin */
  .custom-skeleton ion-skeleton-text {
    line-height: 13px;
  }

  .custom-skeleton ion-skeleton-text:last-child {
    margin-bottom: 5px;
  }
</style>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component()
  export default class Example extends Vue {
    data: any;

    mounted() {
      setTimeout(() => {
        this.data = {
          'heading': 'Normal text',
          'para1': 'Lorem ipsum dolor sit amet, consectetur',
          'para2': 'adipiscing elit.'
        };
      }, 5000);
    }
  }
</script>
```



## Properties

| Property   | Attribute  | Description                                | Type      | Default |
| ---------- | ---------- | ------------------------------------------ | --------- | ------- |
| `animated` | `animated` | If `true`, the skeleton text will animate. | `boolean` | `false` |


## CSS Custom Properties

| Name               | Description                                   |
| ------------------ | --------------------------------------------- |
| `--background`     | Background of the skeleton text               |
| `--background-rgb` | Background of the skeleton text in rgb format |
| `--border-radius`  | Border radius of the skeleton text            |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
