import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from '@ionic/react';
import React from 'react';
import { Route } from 'react-router-dom';

import TestDescription from '../../components/TestDescription';

/**
 * Regression page for ionic-team/ionic-framework#31708: in iOS mode, an
 * `ionPage` child outlet can end up with two visible pages. The page that
 * was active when the user left the outlet (Step 2) is never hidden, so
 * when the user later returns to a different page in the same outlet
 * (Step 1), the old page stays on screen and covers the new one.
 *
 * Each page has its own background color, matching the issue reproduction:
 * Step 1 green, Step 2 red, Home blue, Settings purple. All navigation
 * uses `router.push(path, 'forward')`.
 */
const Step1: React.FC = () => {
  const router = useIonRouter();
  return (
    <IonPage data-pageid="swipe-step-1" style={{ background: 'green' }}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Step 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <TestDescription>
          Go Step 1 -&gt; Step 2 -&gt; Home -&gt; Settings -&gt; Step 1. Only Step 1 should be visible at the end; Step
          2 must be hidden.
        </TestDescription>
        <IonButton
          id="go-to-step2"
          onClick={() => router.push('/swipe-preserved-page/onboarding/step2', 'forward', 'push')}
        >
          Next
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

const Step2: React.FC = () => {
  const router = useIonRouter();
  return (
    <IonPage data-pageid="swipe-step-2" style={{ background: 'red' }}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Step 2</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton id="go-to-home" onClick={() => router.push('/swipe-preserved-page/home', 'forward', 'push')}>
          Finish
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

const HomePage: React.FC = () => {
  const router = useIonRouter();
  return (
    <IonPage data-pageid="swipe-home" style={{ background: 'blue' }}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton id="go-to-settings" onClick={() => router.push('/swipe-preserved-page/settings', 'forward', 'push')}>
          Settings
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

const SettingsPage: React.FC = () => {
  const router = useIonRouter();
  return (
    <IonPage data-pageid="swipe-settings" style={{ background: 'purple' }}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton
          id="back-to-step1"
          onClick={() => router.push('/swipe-preserved-page/onboarding/step1', 'forward', 'push')}
        >
          Back to Step 1
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

const SwipePreservedPage: React.FC = () => {
  return (
    <IonRouterOutlet>
      <Route
        path="onboarding/*"
        element={
          <IonRouterOutlet ionPage>
            <Route path="step1" element={<Step1 />} />
            <Route path="step2" element={<Step2 />} />
          </IonRouterOutlet>
        }
      />
      <Route path="home" element={<HomePage />} />
      <Route path="settings" element={<SettingsPage />} />
    </IonRouterOutlet>
  );
};

export default SwipePreservedPage;
