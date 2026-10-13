import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React, { useState } from 'react';
import { Route, useParams } from 'react-router-dom';

import TestDescription from '../../components/TestDescription';

/**
 * A splat ("*") route that is a real container page rather than a 404, sharing an outlet
 * with a more specific sibling. Pushing the sibling must leave the splat's page mounted
 * behind it.
 */

const Home: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <IonPage data-pageid="splat-sibling-home">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Splat Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton data-testid="increment" onClick={() => setCount((c) => c + 1)}>
          Increment
        </IonButton>
        <div data-testid="count">{count}</div>
        <IonList>
          <IonItem detail routerLink="/splat-sibling/detail/12" data-testid="open-detail">
            <IonLabel>Open item 12</IonLabel>
          </IonItem>
        </IonList>
        <TestDescription>
          Increment the counter, then open item 12. The detail page should push over this page, leaving it mounted
          behind. Going back should reveal this same page with the counter unchanged.
        </TestDescription>
      </IonContent>
    </IonPage>
  );
};

const Detail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <IonPage data-pageid="splat-sibling-detail">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/splat-sibling" />
          </IonButtons>
          <IonTitle>Detail</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div data-testid="detail-id">{id}</div>
      </IonContent>
    </IonPage>
  );
};

const SplatSibling: React.FC = () => {
  return (
    <IonRouterOutlet id="splat-sibling-outlet">
      <Route path="detail/:id" element={<Detail />} />
      <Route path="*" element={<Home />} />
    </IonRouterOutlet>
  );
};

export default SplatSibling;
