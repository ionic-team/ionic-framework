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
 * Companion to SplatSibling for the pathless shapes. An index route and an
 * empty-path route both carry no path of their own, so they can be handed a
 * pathname that a more specific sibling owns, the same way a splat can.
 */

const Home: React.FC<{ pageId: string; detailHref: string }> = ({ pageId, detailHref }) => {
  const [count, setCount] = useState(0);

  return (
    <IonPage data-pageid={pageId}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton data-testid="increment" onClick={() => setCount((c) => c + 1)}>
          Increment
        </IonButton>
        <div data-testid="count">{count}</div>
        <IonList>
          <IonItem detail routerLink={detailHref} data-testid="open-detail">
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

const Detail: React.FC<{ pageId: string; backHref: string }> = ({ pageId, backHref }) => {
  const { id } = useParams<{ id: string }>();

  return (
    <IonPage data-pageid={pageId}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={backHref} />
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

/** Outlet whose home page is an index route. */
export const IndexSibling: React.FC = () => {
  return (
    <IonRouterOutlet>
      <Route index element={<Home pageId="index-sibling-home" detailHref="/index-sibling/detail/12" />} />
      <Route path="detail/:id" element={<Detail pageId="index-sibling-detail" backHref="/index-sibling" />} />
    </IonRouterOutlet>
  );
};

/** Outlet whose home page is an empty-path route. */
export const EmptyPathSibling: React.FC = () => {
  return (
    <IonRouterOutlet>
      <Route path="" element={<Home pageId="empty-path-sibling-home" detailHref="/empty-path-sibling/detail/12" />} />
      <Route path="detail/:id" element={<Detail pageId="empty-path-sibling-detail" backHref="/empty-path-sibling" />} />
    </IonRouterOutlet>
  );
};
