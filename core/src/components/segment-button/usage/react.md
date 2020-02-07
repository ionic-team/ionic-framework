```tsx
import React from 'react';
import { IonSegment, IonSegmentButton, IonLabel, IonIcon, IonContent } from '@ionic/react';

export const SegmentButtonExample: React.FC = () => (
  <IonContent>
    {/*-- Segment buttons with text and click listeners --*/}
    <IonSegment>
      <IonSegmentButton onIonSelect={() => console.log('Friends segment selected')}>
        <IonLabel>Friends</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton onIonSelect={() => console.log('Enemies segment selected')}>
        <IonLabel>Enemies</IonLabel>
      </IonSegmentButton>
    </IonSegment>

    {/*-- Segment buttons with the first checked and the last disabled --*/}
    <IonSegment value="paid">
      <IonSegmentButton value="paid">
        <IonLabel>Paid</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="free">
        <IonLabel>Free</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton disabled value="top">
        <IonLabel>Top</IonLabel>
      </IonSegmentButton>
    </IonSegment>

    {/*-- Segment buttons with values and icons --*/}
    <IonSegment>
      <IonSegmentButton value="camera">
        <IonIcon name="camera" />
      </IonSegmentButton>
      <IonSegmentButton value="bookmark">
        <IonIcon name="bookmark" />
      </IonSegmentButton>
    </IonSegment>

    {/*-- Segment with a value that checks the last button --*/}
    <IonSegment value="shared">
      <IonSegmentButton value="bookmarks">
        <IonLabel>Bookmarks</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="reading">
        <IonLabel>Reading List</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="shared">
        <IonLabel>Shared Links</IonLabel>
      </IonSegmentButton>
    </IonSegment>

    {/*-- Label only --*/}
    <IonSegment value="1">
      <IonSegmentButton value="1">
        <IonLabel>Item One</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="2">
        <IonLabel>Item Two</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="3">
        <IonLabel>Item Three</IonLabel>
      </IonSegmentButton>
    </IonSegment>

    {/*-- Icon only --*/}
    <IonSegment value="heart">
      <IonSegmentButton value="call">
        <IonIcon name="call" />
      </IonSegmentButton>
      <IonSegmentButton value="heart">
        <IonIcon name="heart" />
      </IonSegmentButton>
      <IonSegmentButton value="pin">
        <IonIcon name="pin" />
      </IonSegmentButton>
    </IonSegment>

    {/*-- Icon top --*/}
    <IonSegment value="2">
      <IonSegmentButton value="1">
        <IonLabel>Item One</IonLabel>
        <IonIcon name="call" />
      </IonSegmentButton>
      <IonSegmentButton value="2">
        <IonLabel>Item Two</IonLabel>
        <IonIcon name="heart" />
      </IonSegmentButton>
      <IonSegmentButton value="3">
        <IonLabel>Item Three</IonLabel>
        <IonIcon name="pin" />
      </IonSegmentButton>
    </IonSegment>

    {/*-- Icon bottom --*/}
    <IonSegment value="1">
      <IonSegmentButton value="1" layout="icon-bottom">
        <IonIcon name="call" />
        <IonLabel>Item One</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="2" layout="icon-bottom">
        <IonIcon name="heart" />
        <IonLabel>Item Two</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="3" layout="icon-bottom">
        <IonIcon name="pin" />
        <IonLabel>Item Three</IonLabel>
      </IonSegmentButton>
    </IonSegment>

    {/*-- Icon start --*/}
    <IonSegment value="1">
      <IonSegmentButton value="1" layout="icon-start">
        <IonLabel>Item One</IonLabel>
        <IonIcon name="call" />
      </IonSegmentButton>
      <IonSegmentButton value="2" layout="icon-start">
        <IonLabel>Item Two</IonLabel>
        <IonIcon name="heart" />
      </IonSegmentButton>
      <IonSegmentButton value="3" layout="icon-start">
        <IonLabel>Item Three</IonLabel>
        <IonIcon name="pin" />
      </IonSegmentButton>
    </IonSegment>

    {/*-- Icon end --*/}
    <IonSegment value="1">
      <IonSegmentButton value="1" layout="icon-end">
        <IonIcon name="call" />
        <IonLabel>Item One</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="2" disabled layout="icon-end">
        <IonIcon name="heart" />
        <IonLabel>Item Two</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="3" layout="icon-end">
        <IonIcon name="pin" />
        <IonLabel>Item Three</IonLabel>
      </IonSegmentButton>
    </IonSegment>
  </IonContent>
);
```
