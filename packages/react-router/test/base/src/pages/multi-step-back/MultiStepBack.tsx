import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonRouterOutlet,
  IonBackButton,
  IonButtons,
} from '@ionic/react';
import React from 'react';
import { Route, useNavigate } from 'react-router-dom';

import TestDescription from '../../components/TestDescription';

/**
 * Tests for navigate(-n) where n > 1 (multi-step back navigation).
 * Verifies that the correct view is shown when skipping multiple
 * entries in the history stack.
 */
const PageA: React.FC = () => {
  const navigate = useNavigate();
  return (
    <IonPage data-pageid="multi-step-page-a">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Page A</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton id="go-to-b" onClick={() => navigate('/multi-step-back/b')}>
          Go to Page B
        </IonButton>
        <TestDescription>Navigate A -&gt; B -&gt; C -&gt; D, then use the "Go Back N" buttons to skip multiple history entries. "Go Back 2" from D should land on B; "Go Back 3" from D should land on A. The correct page should display with no blank screen.</TestDescription>
      </IonContent>
    </IonPage>
  );
};

const PageB: React.FC = () => {
  const navigate = useNavigate();
  return (
    <IonPage data-pageid="multi-step-page-b">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Page B</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton id="go-to-c" onClick={() => navigate('/multi-step-back/c')}>
          Go to Page C
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

const PageC: React.FC = () => {
  const navigate = useNavigate();
  return (
    <IonPage data-pageid="multi-step-page-c">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Page C</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton id="go-to-d" onClick={() => navigate('/multi-step-back/d')}>
          Go to Page D
        </IonButton>
        <IonButton id="page-c-go-back-2" onClick={() => navigate(-2)}>
          Go Back 2 (to A)
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

const PageD: React.FC = () => {
  const navigate = useNavigate();
  return (
    <IonPage data-pageid="multi-step-page-d">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Page D</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton id="page-d-go-back-2" onClick={() => navigate(-2)}>
          Go Back 2 (to B)
        </IonButton>
        <IonButton id="page-d-go-back-3" onClick={() => navigate(-3)}>
          Go Back 3 (to A)
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

const MultiStepBack: React.FC = () => {
  return (
    <IonRouterOutlet>
      <Route path="a" element={<PageA />} />
      <Route path="b" element={<PageB />} />
      <Route path="c" element={<PageC />} />
      <Route path="d" element={<PageD />} />
    </IonRouterOutlet>
  );
};

export default MultiStepBack;
