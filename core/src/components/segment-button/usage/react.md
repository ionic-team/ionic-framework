```tsx
import React from 'react';
import { IonSegment, IonSegmentButton, IonLabel, IonIcon, IonContent } from '@ionic/react';

export const SegmentButtonExample: React.FunctionComponent = () => (
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
    <IonSegment>
      <IonSegmentButton checked>
        <IonLabel>Paid</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton>
        <IonLabel>Free</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton disabled>
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
    <IonSegment>
      <IonSegmentButton checked>
        <IonLabel>Item One</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton>
        <IonLabel>Item Two</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton>
        <IonLabel>Item Three</IonLabel>
      </IonSegmentButton>
    </IonSegment>

    {/*-- Icon only --*/}
    <IonSegment>
      <IonSegmentButton>
        <IonIcon name="call" />
      </IonSegmentButton>
      <IonSegmentButton checked>
        <IonIcon name="heart" />
      </IonSegmentButton>
      <IonSegmentButton>
        <IonIcon name="pin" />
      </IonSegmentButton>
    </IonSegment>

    {/*-- Icon top --*/}
    <IonSegment>
      <IonSegmentButton>
        <IonLabel>Item One</IonLabel>
        <IonIcon name="call" />
      </IonSegmentButton>
      <IonSegmentButton checked>
        <IonLabel>Item Two</IonLabel>
        <IonIcon name="heart" />
      </IonSegmentButton>
      <IonSegmentButton>
        <IonLabel>Item Three</IonLabel>
        <IonIcon name="pin" />
      </IonSegmentButton>
    </IonSegment>

    {/*-- Icon bottom --*/}
    <IonSegment>
      <IonSegmentButton checked layout="icon-bottom">
        <IonIcon name="call" />
        <IonLabel>Item One</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton layout="icon-bottom">
        <IonIcon name="heart" />
        <IonLabel>Item Two</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton layout="icon-bottom">
        <IonIcon name="pin" />
        <IonLabel>Item Three</IonLabel>
      </IonSegmentButton>
    </IonSegment>

    {/*-- Icon start --*/}
    <IonSegment>
      <IonSegmentButton checked layout="icon-start">
        <IonLabel>Item One</IonLabel>
        <IonIcon name="call" />
      </IonSegmentButton>
      <IonSegmentButton layout="icon-start">
        <IonLabel>Item Two</IonLabel>
        <IonIcon name="heart" />
      </IonSegmentButton>
      <IonSegmentButton layout="icon-start">
        <IonLabel>Item Three</IonLabel>
        <IonIcon name="pin" />
      </IonSegmentButton>
    </IonSegment>

    {/*-- Icon end --*/}
    <IonSegment>
      <IonSegmentButton checked layout="icon-end">
        <IonIcon name="call" />
        <IonLabel>Item One</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton disabled layout="icon-end">
        <IonIcon name="heart" />
        <IonLabel>Item Two</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton layout="icon-end">
        <IonIcon name="pin" />
        <IonLabel>Item Three</IonLabel>
      </IonSegmentButton>
    </IonSegment>
  </IonContent>
);
```
