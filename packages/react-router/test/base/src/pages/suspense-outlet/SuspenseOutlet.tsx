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
import React, { Suspense } from 'react';
import { Navigate, Route, useParams } from 'react-router-dom';

import TestDescription from '../../components/TestDescription';

/** Simulated Suspense-enabled data source (mimics React Query / SWR behavior) */

type Item = { id: string; name: string };

// Simulate a promise that resolves after a brief delay (like a network call)
let resolvedItems: Item[] | null = null;
let pendingPromise: Promise<Item[]> | null = null;

function fetchItems(): Promise<Item[]> {
  if (!pendingPromise) {
    pendingPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolvedItems = [
          { id: 'item-1', name: 'Item One' },
          { id: 'item-2', name: 'Item Two' },
          { id: 'item-3', name: 'Item Three' },
        ];
        resolve(resolvedItems);
      }, 50);
    });
  }
  return pendingPromise;
}

// Suspense-compatible resource — throws a promise when not yet resolved
function createItemsResource() {
  const promise = fetchItems();
  return {
    read(): Item[] {
      if (resolvedItems !== null) {
        return resolvedItems;
      }
      throw promise;
    },
  };
}

// Create one resource instance — shared across components to simulate a cache
const itemsResource = createItemsResource();

function useItems(): Item[] {
  return itemsResource.read();
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
  const items = useItems(); // may suspend
  const item = items.find((i) => i.id === itemId);

  if (!item) {
    // Item not found — renders IonPage via a child component (not directly)
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
  const items = useItems(); // may suspend

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
      <TestDescription>Switch to the Content tab. A spinner should briefly appear while data loads via React Suspense, then a list of items renders. Tap an item to view its detail page, then go back. Try the "unknown item" link and verify the error page renders. Switch between tabs and confirm the Content tab preserves its navigation stack.</TestDescription>
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

// Outer router outlet — uses catch-all like the repro
const SuspenseOutlet: React.FC = () => (
  <IonRouterOutlet id="suspense-outer-outlet">
    <Route path="*" element={<SuspenseOutletTabs />} />
  </IonRouterOutlet>
);

export default SuspenseOutlet;
