import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonRouterOutlet,
  IonSpinner,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React, { Suspense, use } from 'react';
import { Navigate, Route, useParams } from 'react-router-dom';

/**
 * React 19-specific Suspense test using the use() hook.
 *
 * This variant uses React 19's use() hook (instead of the throw-promise pattern)
 * to trigger Suspense. Combined with v7_startTransition and StrictMode, this
 * reproduces the "Maximum update depth exceeded" crash caused by
 * reappearLayoutEffects re-running componentDidMount.
 */

type Item = { id: string; name: string };

// Simulate an async data source with a longer delay to match real-world latency.
// The promise is cached at module level (like React Query / SWR).
let itemsPromise: Promise<Item[]> | undefined;

function loadItems(): Promise<Item[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'item-1', name: 'Item One' },
        { id: 'item-2', name: 'Item Two' },
        { id: 'item-3', name: 'Item Three' },
      ]);
    }, 300); // Longer delay to ensure Suspense boundary activates
  });
}

function getItemsPromise(): Promise<Item[]> {
  if (!itemsPromise) {
    itemsPromise = loadItems();
  }
  return itemsPromise;
}

// React 19 use() hook — triggers Suspense when the promise is pending
function useItems(): Item[] {
  return use(getItemsPromise());
}

/** Page components */

const ItemErrorPage: React.FC<{ message: string }> = ({ message }) => (
  <IonPage data-pageid="item-error-page">
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton defaultHref="/suspense-outlet/content" />
        </IonButtons>
        <IonTitle>Error</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent className="ion-padding">
      <p data-testid="error-message">{message}</p>
    </IonContent>
  </IonPage>
);

const ItemPage: React.FC = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const items = useItems(); // may suspend via use()
  const item = items.find((i) => i.id === itemId);

  if (!item) {
    return <ItemErrorPage message={`Item not found: ${itemId}`} />;
  }

  return (
    <IonPage data-pageid="item-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/suspense-outlet/content" />
          </IonButtons>
          <IonTitle>Item: {item.name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <p data-testid="item-id">Item ID: {item.id}</p>
      </IonContent>
    </IonPage>
  );
};

const ContentIndexPage: React.FC = () => {
  const items = useItems(); // may suspend via use()

  return (
    <IonPage data-pageid="content-index">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Content Index</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {items.map((item) => (
          <IonButton
            key={item.id}
            expand="block"
            routerLink={`/suspense-outlet/content/items/${item.id}`}
            data-testid={`go-to-${item.id}`}
          >
            {item.name}
          </IonButton>
        ))}
        <IonButton
          expand="block"
          routerLink="/suspense-outlet/content/items/not-found-item"
          data-testid="go-to-not-found"
        >
          Go to unknown item
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

// IonRouterOutlet inside a Suspense boundary — the key part of the repro
const ContentOutlet: React.FC = () => (
  <Suspense fallback={<IonSpinner data-testid="content-spinner" />}>
    <IonRouterOutlet id="suspense-content-outlet">
      <Route index element={<ContentIndexPage />} />
      <Route path="items/:itemId" element={<ItemPage />} />
      <Route path="items" element={<Navigate to="/suspense-outlet/content" replace />} />
    </IonRouterOutlet>
  </Suspense>
);

const Tab1Page: React.FC = () => (
  <IonPage data-pageid="suspense-tab1">
    <IonHeader>
      <IonToolbar>
        <IonTitle>Tab 1</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent className="ion-padding">
      <p>Tab 1 content</p>
    </IonContent>
  </IonPage>
);

const SuspenseOutletTabs: React.FC = () => (
  <IonTabs>
    <IonRouterOutlet id="suspense-tabs-outlet">
      <Route path="tab1" element={<Tab1Page />} />
      <Route path="content/*" element={<ContentOutlet />} />
      <Route index element={<Navigate to="tab1" replace />} />
    </IonRouterOutlet>
    <IonTabBar slot="bottom">
      <IonTabButton tab="tab1" href="/suspense-outlet/tab1">
        Tab 1
      </IonTabButton>
      <IonTabButton tab="content" href="/suspense-outlet/content">
        Content
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);

// Outer router outlet — uses catch-all like the customer repro
const SuspenseOutlet: React.FC = () => (
  <IonRouterOutlet id="suspense-outer-outlet">
    <Route path="*" element={<SuspenseOutletTabs />} />
  </IonRouterOutlet>
);

export default SuspenseOutlet;
