```tsx
import React from 'react';
import { IonSegment, IonSegmentButton, IonLabel, IonIcon, IonToolbar, IonContent } from '@ionic/react';

export const SegmentExample: React.FunctionComponent = () => (
  <IonContent>
    {/*-- Default Segment --*/}
    <IonSegment onIonChange={e => console.log('Segment selected', e.detail.value)}>
      <IonSegmentButton value="friends">
        <IonLabel>Friends</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="enemies">
        <IonLabel>Enemies</IonLabel>
      </IonSegmentButton>
    </IonSegment>

    {/*-- Disabled Segment --*/}
    <IonSegment onIonChange={e => console.log('Segment selected', e.detail.value)} disabled>
      <IonSegmentButton value="sunny" checked>
        <IonLabel>Sunny</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="rainy">
        <IonLabel>Rainy</IonLabel>
      </IonSegmentButton>
    </IonSegment>

    {/*-- Segment with anchors --*/}
    <IonSegment onIonChange={e => console.log('Segment selected', e.detail.value)}>
      <IonSegmentButton value="dogs">
        <IonLabel>Dogs</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="cats">
        <IonLabel>Cats</IonLabel>
      </IonSegmentButton>
    </IonSegment>

    {/*-- Scrollable Segment --*/}
    <IonSegment scrollable>
      <IonSegmentButton>
        <IonIcon name="home" />
      </IonSegmentButton>
      <IonSegmentButton checked>
        <IonIcon name="heart" />
      </IonSegmentButton>
      <IonSegmentButton>
        <IonIcon name="pin" />
      </IonSegmentButton>
      <IonSegmentButton>
        <IonIcon name="star" />
      </IonSegmentButton>
      <IonSegmentButton>
        <IonIcon name="call" />
      </IonSegmentButton>
      <IonSegmentButton>
        <IonIcon name="globe" />
      </IonSegmentButton>
      <IonSegmentButton>
        <IonIcon name="basket" />
      </IonSegmentButton>
    </IonSegment>

    {/*-- Segment with secondary color --*/}
    <IonSegment onIonChange={e => console.log('Segment selected', e.detail.value)} color="secondary">
      <IonSegmentButton value="standard">
        <IonLabel>Standard</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="hybrid">
        <IonLabel>Hybrid</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="sat">
        <IonLabel>Satellite</IonLabel>
      </IonSegmentButton>
    </IonSegment>

    {/*-- Segment in a toolbar --*/}
    <IonToolbar>
      <IonSegment onIonChange={e => console.log('Segment selected', e.detail.value)}>
        <IonSegmentButton value="camera">
          <IonIcon name="camera" />
        </IonSegmentButton>
        <IonSegmentButton value="bookmark">
          <IonIcon name="bookmark" />
        </IonSegmentButton>
      </IonSegment>
    </IonToolbar>

    {/*-- Segment with default selection --*/}
    <IonSegment onIonChange={e => console.log('Segment selected', e.detail.value)} value="javascript">
      <IonSegmentButton value="python">
        <IonLabel>Python</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="javascript">
        <IonLabel>Javascript</IonLabel>
      </IonSegmentButton>
    </IonSegment>
  </IonContent>
);
```