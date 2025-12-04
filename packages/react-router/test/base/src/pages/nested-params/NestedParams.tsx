import {
  IonButton,
  IonContent,
  IonHeader,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React from 'react';
import { Navigate, Route } from 'react-router';
import { useParams } from 'react-router-dom';

const NestedParamsRoot: React.FC = () => (
  <IonPage data-pageid="nested-params-root">
    <IonHeader>
      <IonToolbar>
        <IonTitle>Nested Params</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <IonRouterOutlet id="nested-params-root-outlet">
        <Route index element={<Landing />} />
        <Route path="user/:userId/*" element={<UserLayout />} />
      </IonRouterOutlet>
    </IonContent>
  </IonPage>
);

const Landing: React.FC = () => (
  <IonPage data-pageid="nested-params-landing">
    <IonHeader>
      <IonToolbar>
        <IonTitle>Select a User</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent className="ion-padding">
      <IonLabel>A nested route will try to read the parent :userId parameter.</IonLabel>
      <IonButton routerLink="/nested-params/user/42/details" id="go-to-user-42" className="ion-margin-top">
        Go to User 42 Details
      </IonButton>
      <IonButton routerLink="/nested-params/user/99/details" id="go-to-user-99" className="ion-margin-top">
        Go to User 99 Details
      </IonButton>
    </IonContent>
  </IonPage>
);

const UserLayout: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();

  return (
    <IonPage data-pageid={`nested-params-user-${userId ?? 'missing'}`}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>User {userId ?? 'missing'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLabel data-testid="user-layout-param">Layout sees user: {userId ?? 'missing'}</IonLabel>
        <IonRouterOutlet ionPage id="nested-params-user-outlet">
          <Route index element={<Navigate to="details" replace />} />
          <Route path="details" element={<UserDetails />} />
          <Route path="settings" element={<UserSettings />} />
        </IonRouterOutlet>
      </IonContent>
    </IonPage>
  );
};

const UserDetails: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();

  return (
    <IonPage data-pageid="nested-params-details">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLabel data-testid="user-details-param">Details view user: {userId ?? 'missing'}</IonLabel>
        <IonButton routerLink={`/nested-params/user/${userId}/settings`} id="go-to-settings">
          Go to Settings
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

const UserSettings: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();

  return (
    <IonPage data-pageid="nested-params-settings">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLabel data-testid="user-settings-param">Settings view user: {userId ?? 'missing'}</IonLabel>
        <IonButton routerLink={`/nested-params/user/${userId}/details`}>Back to Details</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default NestedParamsRoot;
