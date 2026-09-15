/**
 * Reproduces the bug where changing view content while navigating causes
 * an invalid view to be rendered.
 */

import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonRouterOutlet,
  IonButtons,
  IonBackButton,
} from '@ionic/react';
import React, { useState } from 'react';
import { Route, Navigate, useNavigate } from 'react-router-dom';

import TestDescription from '../../components/TestDescription';

const ListPage: React.FC = () => {
  const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3']);
  const navigate = useNavigate();

  const clearItemsAndNavigate = () => {
    setItems([]);
    navigate('/content-change-navigation/home');
  };

  // Using different keys forces React to unmount/remount IonPage
  if (items.length === 0) {
    return (
      <IonPage key="empty" data-pageid="list-empty-page">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/content-change-navigation/home" />
            </IonButtons>
            <IonTitle>Empty List</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div data-testid="empty-view">There are no items</div>
          <IonButton routerLink="/content-change-navigation/home" data-testid="go-home-from-empty">
            Go Home
          </IonButton>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage key="list" data-pageid="list-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/content-change-navigation/home" />
          </IonButtons>
          <IonTitle>Item List</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {items.map((item, index) => (
            <IonItem key={index}>
              <IonLabel>{item}</IonLabel>
            </IonItem>
          ))}
        </IonList>
        <br />
        <IonButton onClick={clearItemsAndNavigate} data-testid="clear-and-navigate">
          Remove all items and navigate to home
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

const HomePage: React.FC = () => {
  return (
    <IonPage data-pageid="content-nav-home">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div data-testid="home-content">Home Page Content</div>
        <IonButton routerLink="/content-change-navigation/list" data-testid="go-to-list">
          Go to list page
        </IonButton>
        <TestDescription>Go to the list page and tap "Remove all items and navigate to home". This clears the list content and navigates simultaneously. You should land back on this Home page cleanly, not on a stale or invalid list view.</TestDescription>
      </IonContent>
    </IonPage>
  );
};

const ContentChangeNavigation: React.FC = () => {
  return (
    <IonRouterOutlet>
      <Route index element={<Navigate to="home" replace />} />
      <Route path="home" element={<HomePage />} />
      <Route path="list" element={<ListPage />} />
    </IonRouterOutlet>
  );
};

export default ContentChangeNavigation;
