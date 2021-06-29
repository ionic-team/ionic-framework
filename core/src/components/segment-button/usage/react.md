```tsx
import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSegment, IonSegmentButton, IonLabel, IonIcon } from '@ionic/react';
import { call, camera, bookmark, heart, pin } from 'ionicons/icons';

export const SegmentButtonExamples: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>SegmentButton</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/*-- Segment buttons with text and click listener --*/}
        <IonSegment onIonChange={(e) => console.log(`${e.detail.value} segment selected`)}>
          <IonSegmentButton value="Friends">
            <IonLabel>Friends</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="Enemies">
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
            <IonIcon icon={camera} />
          </IonSegmentButton>
          <IonSegmentButton value="bookmark">
            <IonIcon icon={bookmark} />
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
            <IonIcon icon={call} />
          </IonSegmentButton>
          <IonSegmentButton value="heart">
            <IonIcon icon={heart} />
          </IonSegmentButton>
          <IonSegmentButton value="pin">
            <IonIcon icon={pin} />
          </IonSegmentButton>
        </IonSegment>

        {/*-- Icon top --*/}
        <IonSegment value="2">
          <IonSegmentButton value="1">
            <IonLabel>Item One</IonLabel>
            <IonIcon icon={call} />
          </IonSegmentButton>
          <IonSegmentButton value="2">
            <IonLabel>Item Two</IonLabel>
            <IonIcon icon={heart} />
          </IonSegmentButton>
          <IonSegmentButton value="3">
            <IonLabel>Item Three</IonLabel>
            <IonIcon icon={pin} />
          </IonSegmentButton>
        </IonSegment>

        {/*-- Icon bottom --*/}
        <IonSegment value="1">
          <IonSegmentButton value="1" layout="icon-bottom">
            <IonIcon icon={call} />
            <IonLabel>Item One</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="2" layout="icon-bottom">
            <IonIcon icon={heart} />
            <IonLabel>Item Two</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="3" layout="icon-bottom">
            <IonIcon icon={pin} />
            <IonLabel>Item Three</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {/*-- Icon start --*/}
        <IonSegment value="1">
          <IonSegmentButton value="1" layout="icon-start">
            <IonLabel>Item One</IonLabel>
            <IonIcon icon={call} />
          </IonSegmentButton>
          <IonSegmentButton value="2" layout="icon-start">
            <IonLabel>Item Two</IonLabel>
            <IonIcon icon={heart} />
          </IonSegmentButton>
          <IonSegmentButton value="3" layout="icon-start">
            <IonLabel>Item Three</IonLabel>
            <IonIcon icon={pin} />
          </IonSegmentButton>
        </IonSegment>

        {/*-- Icon end --*/}
        <IonSegment value="1">
          <IonSegmentButton value="1" layout="icon-end">
            <IonIcon icon={call} />
            <IonLabel>Item One</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="2" disabled layout="icon-end">
            <IonIcon icon={heart} />
            <IonLabel>Item Two</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="3" layout="icon-end">
            <IonIcon icon={pin} />
            <IonLabel>Item Three</IonLabel>
          </IonSegmentButton>
        </IonSegment>
      </IonContent>
    </IonPage>
  );
};
```
