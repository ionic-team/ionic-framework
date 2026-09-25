import {
  IonApp,
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, triangle } from 'ionicons/icons';
import React, { useState } from 'react';
import { Navigate, Route, useParams } from 'react-router-dom';

/* Ionic CSS and setupIonicReact */
import '../ionic-setup';
import { ROOT_SPLAT_SIBLING_BASENAME } from './basename';
import TestDescription from '../components/TestDescription';

/**
 * A splat container page holding tabs, next to a more specific sibling that gets pushed over
 * the whole tab bar, in the root outlet.
 *
 * A root catch-all can't live in the shared route tree in App.tsx without swallowing every
 * other spec's pathname, so this app gets its own basename and index.tsx mounts it instead
 * of App for that prefix.
 */

/**
 * The two spellings of a root splat fail differently, so "?splat=bare" runs the same flows
 * against a bare "*" instead of "/*". Stamped onto the tabs page as data-splat so a test can
 * confirm which spelling is live.
 */
const splatPath = new URLSearchParams(window.location.search).get('splat') === 'bare' ? '*' : '/*';

/** A fresh mount gets a fresh instance id, which tells a remount apart from a reveal. */
let instanceCounter = 0;
const nextInstanceId = () => `tabs-${++instanceCounter}`;

const Feed: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <IonContent>
      <IonList>
        <IonItem button data-testid="increment" onClick={() => setCount((c) => c + 1)}>
          <IonLabel>Increment</IonLabel>
        </IonItem>
        <IonItem detail routerLink="/feed/12" data-testid="open-detail">
          <IonLabel>Open item 12</IonLabel>
        </IonItem>
      </IonList>
      <div data-testid="count">{count}</div>
      <TestDescription>
        Increment the counter, then open item 12. The detail page should push over the whole tab bar, leaving these tabs
        mounted behind it. Going back should reveal the same tabs with the counter unchanged.
      </TestDescription>
    </IonContent>
  );
};

const FeedTab: React.FC = () => (
  <IonPage data-pageid="root-splat-sibling-feed">
    <IonHeader>
      <IonToolbar>
        <IonTitle>Feed</IonTitle>
      </IonToolbar>
    </IonHeader>
    <Feed />
  </IonPage>
);

const ProfileTab: React.FC = () => (
  <IonPage data-pageid="root-splat-sibling-profile">
    <IonHeader>
      <IonToolbar>
        <IonTitle>Profile</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <div data-testid="profile-content">Profile</div>
    </IonContent>
  </IonPage>
);

/** The container page the splat route renders. */
const Tabs: React.FC = () => {
  const [instanceId] = useState(nextInstanceId);

  return (
    // These land on both the .ion-page div and the ion-tabs element, so select with div.ion-page.
    <IonTabs data-pageid="root-splat-sibling-tabs" data-instance={instanceId} data-splat={splatPath}>
      <IonRouterOutlet id="root-splat-sibling-tabs-outlet">
        <Route path="/feed" element={<FeedTab />} />
        <Route path="/profile" element={<ProfileTab />} />
        <Route path="/" element={<Navigate to="/feed" replace />} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="feed" href="/feed" data-testid="tab-feed">
          <IonIcon icon={triangle} />
          <IonLabel>Feed</IonLabel>
        </IonTabButton>
        <IonTabButton tab="profile" href="/profile" data-testid="tab-profile">
          <IonIcon icon={ellipse} />
          <IonLabel>Profile</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

const Detail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <IonPage data-pageid="root-splat-sibling-detail">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/feed" />
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

const RootSplatSiblingApp: React.FC = () => (
  <IonApp>
    <IonReactRouter basename={ROOT_SPLAT_SIBLING_BASENAME}>
      <IonRouterOutlet id="root-splat-sibling-outlet">
        <Route path="/feed/:id" element={<Detail />} />
        <Route path={splatPath} element={<Tabs />} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default RootSplatSiblingApp;
