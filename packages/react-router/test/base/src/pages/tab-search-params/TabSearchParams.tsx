import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/react';
import { triangle, square } from 'ionicons/icons';
import React from 'react';
import { Route, Navigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';

const TabSearchParams: React.FC = () => {
  return (
    <IonTabs data-pageid="tab-search-params">
      <IonRouterOutlet id="tab-search-params-outlet">
        <Route index element={<Navigate to="/tab-search-params/tab1?foo=bar" replace />} />
        <Route path="tab1" element={<Tab1 />} />
        <Route path="tab2" element={<Tab2 />} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/tab-search-params/tab1?foo=bar">
          <IonIcon icon={triangle} />
          <IonLabel>Tab1</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab2" href="/tab-search-params/tab2?baz=qux">
          <IonIcon icon={square} />
          <IonLabel>Tab2</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

const Tab1 = () => {
  const [searchParams] = useSearchParams();
  const foo = searchParams.get('foo') || '';

  return (
    <IonPage data-pageid="tab-search-tab1">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div id="tab1-foo-value">{foo}</div>
        <div id="tab1-search">{searchParams.toString()}</div>
      </IonContent>
    </IonPage>
  );
};

const Tab2 = () => {
  const [searchParams] = useSearchParams();
  const baz = searchParams.get('baz') || '';

  return (
    <IonPage data-pageid="tab-search-tab2">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 2</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div id="tab2-baz-value">{baz}</div>
        <div id="tab2-search">{searchParams.toString()}</div>
      </IonContent>
    </IonPage>
  );
};

export default TabSearchParams;
