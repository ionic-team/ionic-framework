import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonRouterOutlet,
  IonButton,
} from '@ionic/react';
import React from 'react';
import { Route, useNavigate } from 'react-router-dom';

import TestDescription from '../../components/TestDescription';

/**
 * Test page for verifying that wildcard routes work correctly when
 * specific routes share a common prefix with the navigation target.
 *
 * Bug: couldSpecificRouteMatch uses a 3-char prefix heuristic that
 * falsely suppresses wildcard matches when routes share a prefix
 * (e.g., "settings" vs "setup" both start with "set").
 */

const SettingsPage: React.FC = () => (
  <IonPage data-pageid="prefix-settings">
    <IonHeader>
      <IonToolbar>
        <IonTitle>Settings</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <div data-testid="settings-content">Settings Page</div>
    </IonContent>
  </IonPage>
);

const CatchAllPage: React.FC = () => (
  <IonPage data-pageid="prefix-catchall">
    <IonHeader>
      <IonToolbar>
        <IonTitle>Catch All</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <div data-testid="catchall-content">Wildcard Catch-All Page</div>
    </IonContent>
  </IonPage>
);

const PrefixMatchHome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <IonPage data-pageid="prefix-home">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Prefix Match Test</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div data-testid="prefix-home-content">
          <IonButton id="go-to-settings" onClick={() => navigate('settings')}>
            Go to Settings
          </IonButton>
          <IonButton id="go-to-setup" onClick={() => navigate('setup')}>
            Go to Setup (should hit wildcard)
          </IonButton>
          <IonButton id="go-to-unknown" onClick={() => navigate('unknown')}>
            Go to Unknown (should hit wildcard)
          </IonButton>
        </div>
        <TestDescription>Tap "Go to Settings" and verify the Settings page loads. Go back, then tap "Go to Setup" and "Go to Unknown" -- both should land on the Catch-All page. If Setup incorrectly shows a blank page or the Settings page (because "setup" and "settings" share a prefix), the test fails.</TestDescription>
      </IonContent>
    </IonPage>
  );
};

const PrefixMatchWildcard: React.FC = () => {
  return (
    <IonRouterOutlet>
      <Route index element={<PrefixMatchHome />} />
      <Route path="settings" element={<SettingsPage />} />
      <Route path="*" element={<CatchAllPage />} />
    </IonRouterOutlet>
  );
};

export default PrefixMatchWildcard;
