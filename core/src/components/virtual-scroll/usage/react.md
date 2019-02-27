```tsx
import React from 'react';

import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonVirtualScroll } from '@ionic/react';

let rotateImg = 0;
const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, seddo eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

const images = [
  'bandit',
  'batmobile',
  'blues-brothers',
  'bueller',
  'delorean',
  'eleanor',
  'general-lee',
  'ghostbusters',
  'knight-rider',
  'mirth-mobile'
];

function getImgSrc() {
  const src = 'https://dummyimage.com/600x400/${Math.round( Math.random() * 99999)}/fff.png';
  rotateImg++;
  if (rotateImg === images.length) {
    rotateImg = 0;
  }
  return src;
}

const items: any[] = [];

for (let i = 0; i < 1000; i++) {
  items.push({
    name: i + ' - ' + images[rotateImg],
    imgSrc: getImgSrc(),
    avatarSrc: getImgSrc(),
    imgHeight: Math.floor(Math.random() * 50 + 150),
    content: lorem.substring(0, Math.random() * (lorem.length - 100) + 100)
  });

  rotateImg++;
  if (rotateImg === images.length) {
    rotateImg = 0;
  }
}

const Example: React.SFC<{}> = () => (

  <IonContent>
    <IonVirtualScroll items="items" approxItemHeight="320px">
      <IonCard virtualItem="let item; let itemBounds = bounds;">
        <div>
          <img src="item.imgSrc" height="item.imgHeight" alt="item.name" />
        </div>
        <IonCardHeader>
          <IonCardTitle>{{ name }}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>{{ content }}</IonCardContent>
      </IonCard>
    </IonVirtualScroll>
  </IonContent>
);

export default Example;
```
