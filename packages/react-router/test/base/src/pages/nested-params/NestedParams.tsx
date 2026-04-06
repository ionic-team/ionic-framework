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

import TestDescription from '../../components/TestDescription';

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
      <TestDescription>Navigate to User 42 Details, then Settings, then Profile Edit and Profile View. At every level, the displayed userId should match the URL (e.g., "42"). This verifies that 4 levels of nested outlets with relative paths correctly inherit parent route params.</TestDescription>
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
          <Route path="profile/*" element={<ProfileLayout />} />
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
        <IonButton routerLink="/nested-params" id="back-to-landing">
          Back to Landing
        </IonButton>
        <IonButton routerLink={`/nested-params/user/${userId}/settings`} id="go-to-settings">
          Go to Settings
        </IonButton>
        <IonButton routerLink={`/nested-params/user/${userId}/profile/edit`} id="go-to-profile-edit">
          Go to Profile Edit
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

/**
 * Deeply nested layout: /nested-params/user/:userId/profile/*
 * This tests 4 levels of outlet nesting with relative paths to validate
 * that derivePathnameToMatch correctly handles depth > 2 parent segments.
 */
const ProfileLayout: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();

  return (
    <IonPage data-pageid="nested-params-profile-layout">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile Layout</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLabel data-testid="profile-layout-param">Profile layout user: {userId ?? 'missing'}</IonLabel>
        <IonRouterOutlet ionPage id="nested-params-profile-outlet">
          <Route index element={<Navigate to="edit" replace />} />
          <Route path="edit" element={<ProfileEdit />} />
          <Route path="view" element={<ProfileView />} />
        </IonRouterOutlet>
      </IonContent>
    </IonPage>
  );
};

const ProfileEdit: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();

  return (
    <IonPage data-pageid="nested-params-profile-edit">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile Edit</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLabel data-testid="profile-edit-param">Profile edit user: {userId ?? 'missing'}</IonLabel>
        <IonButton routerLink={`/nested-params/user/${userId}/profile/view`} id="go-to-profile-view">
          Go to Profile View
        </IonButton>
        <IonButton routerLink={`/nested-params/user/${userId}/details`} id="back-to-details">
          Back to Details
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

const ProfileView: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();

  return (
    <IonPage data-pageid="nested-params-profile-view">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile View</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLabel data-testid="profile-view-param">Profile view user: {userId ?? 'missing'}</IonLabel>
        <IonButton routerLink={`/nested-params/user/${userId}/profile/edit`} id="back-to-profile-edit">
          Back to Profile Edit
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
