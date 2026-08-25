import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonButtons,
  IonBackButton,
} from '@ionic/react';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import TestDescription from '../../components/TestDescription';

/**
 * Test for issue #25640: Replace navigation with parameterized routes
 * should properly clean up leaving views from the DOM.
 *
 * Flow: step1 → (replace) step2/:id → (replace) step3/:id → (push) step4/:id
 *       → (back) → step1 → (replace) step2/:id → (replace) step3/:id
 *
 * On the second visit to step3, it should be a fresh component instance
 * with updated params (verified via a unique mount ID).
 */

const Step1: React.FC = () => {
  const navigate = useNavigate();

  return (
    <IonPage data-pageid="replace-params-step1">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Step 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton
          id="go-step2-first"
          onClick={() => navigate('/replace-params/step2/first', { replace: true })}
        >
          Replace to Step 2 (first)
        </IonButton>
        <IonButton
          id="go-step2-second"
          onClick={() => navigate('/replace-params/step2/second', { replace: true })}
        >
          Replace to Step 2 (second)
        </IonButton>
        <TestDescription>Tap "Replace to Step 2 (first)" -&gt; "Replace to Step 3" -&gt; "Push to Step 4" -&gt; go back to Step 1. Then repeat with "second". On the second visit to Step 3, it should show the "second" param and a different mount ID, confirming the old view was cleaned up from the DOM (issue #25640).</TestDescription>
      </IonContent>
    </IonPage>
  );
};

const Step2: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  return (
    <IonPage data-pageid="replace-params-step2">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Step 2</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <p data-testid="step2-param">{id}</p>
        <IonButton
          id="go-step3"
          onClick={() => navigate(`/replace-params/step3/${id}`, { replace: true })}
        >
          Replace to Step 3
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

const Step3: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [mountId] = useState(() => Math.random().toString(36).slice(2, 8));

  return (
    <IonPage data-pageid="replace-params-step3">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Step 3</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <p data-testid="step3-param">{id}</p>
        <p data-testid="step3-mount-id">{mountId}</p>
        <IonButton
          id="go-step4"
          onClick={() => navigate(`/replace-params/step4/${id}`)}
        >
          Push to Step 4
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

const Step4: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  return (
    <IonPage data-pageid="replace-params-step4">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/replace-params/step1" />
          </IonButtons>
          <IonTitle>Step 4</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <p data-testid="step4-param">{id}</p>
        <IonButton
          id="go-to-step1"
          onClick={() => navigate('/replace-params/step1')}
        >
          Go to Step 1
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

const ReplaceParams: React.FC = () => null;
export default ReplaceParams;
export { Step1, Step2, Step3, Step4 };
