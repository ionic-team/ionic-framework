import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
} from '@ionic/react';
import React from 'react';

const Main: React.FC = () => {
  return (
    <IonPage data-pageid="home">
      <IonHeader>
        <IonToolbar>
          <IonTitle>React Router Test App</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonListHeader>
            <IonLabel>Navigation</IonLabel>
          </IonListHeader>
          <IonItem routerLink="/routing">
            <IonLabel>Routing</IonLabel>
          </IonItem>
          <IonItem routerLink="/dynamic-routes">
            <IonLabel>Dynamic Routes</IonLabel>
          </IonItem>
          <IonItem routerLink="/relative-paths">
            <IonLabel>Relative Paths</IonLabel>
          </IonItem>
          <IonItem routerLink="/nested-outlet">
            <IonLabel>Nested Outlet</IonLabel>
          </IonItem>
          <IonItem routerLink="/nested-outlet2">
            <IonLabel>Nested Outlet 2</IonLabel>
          </IonItem>
          <IonItem routerLink="/navigate-root/page-a">
            <IonLabel>Navigate Root</IonLabel>
          </IonItem>
          <IonItem routerLink="/replace-action">
            <IonLabel>Replace Action</IonLabel>
          </IonItem>
          <IonItem routerLink="/content-change-navigation">
            <IonLabel>Content Change Navigation</IonLabel>
          </IonItem>
          <IonItem routerLink="/router-link-modifier-click">
            <IonLabel>Router Link Modifier Click</IonLabel>
          </IonItem>
          <IonItem routerLink="/ion-route-props">
            <IonLabel>IonRoute Props</IonLabel>
          </IonItem>
          <IonItem routerLink="/suspense-outlet/content" id="go-to-suspense-outlet">
            <IonLabel>Suspense Outlet</IonLabel>
          </IonItem>
        </IonList>

        <IonList>
          <IonListHeader>
            <IonLabel>Tabs</IonLabel>
          </IonListHeader>
          <IonItem routerLink="/tabs" id="go-to-tabs">
            <IonLabel>Tabs</IonLabel>
          </IonItem>
          <IonItem routerLink="/multiple-tabs">
            <IonLabel>Multiple Tabs</IonLabel>
          </IonItem>
          <IonItem routerLink="/dynamic-tabs">
            <IonLabel>Dynamic Tabs</IonLabel>
          </IonItem>
          <IonItem routerLink="/tab-context">
            <IonLabel>Tab Context</IonLabel>
          </IonItem>
          <IonItem routerLink="/tab-history-isolation">
            <IonLabel>Tab History Isolation</IonLabel>
          </IonItem>
          <IonItem routerLink="/nested-tabs-relative-links">
            <IonLabel>Nested Tabs Relative Links</IonLabel>
          </IonItem>
          <IonItem routerLink="/root-splat-tabs">
            <IonLabel>Root Splat Tabs</IonLabel>
          </IonItem>
          <IonItem routerLink="/tab-search-params">
            <IonLabel>Tab Search Params</IonLabel>
          </IonItem>
          <IonItem routerLink="/tab-lifecycle">
            <IonLabel>Tab Lifecycle</IonLabel>
          </IonItem>
        </IonList>

        <IonList>
          <IonListHeader>
            <IonLabel>Back Navigation & Gestures</IonLabel>
          </IonListHeader>
          <IonItem routerLink="/swipe-to-go-back">
            <IonLabel>Swipe to Go Back</IonLabel>
          </IonItem>
          <IonItem routerLink="/swipe-to-go-back-disabled">
            <IonLabel>Swipe to go back (disabled)</IonLabel>
          </IonItem>
          <IonItem routerLink="/multi-step-back/a">
            <IonLabel>Multi-Step Back</IonLabel>
          </IonItem>
          <IonItem routerLink="/direction-none-back/a">
            <IonLabel>Direction None Back</IonLabel>
          </IonItem>
          <IonItem routerLink="/param-swipe-back">
            <IonLabel>Param Swipe Back</IonLabel>
          </IonItem>
        </IonList>

        <IonList>
          <IonListHeader>
            <IonLabel>Parameters</IonLabel>
          </IonListHeader>
          <IonItem routerLink="/params/0">
            <IonLabel>Params</IonLabel>
          </IonItem>
          <IonItem routerLink="/nested-params">
            <IonLabel>Nested Params</IonLabel>
          </IonItem>
          <IonItem routerLink="/search-params">
            <IonLabel>Search Params</IonLabel>
          </IonItem>
          <IonItem routerLink="/redirect-params">
            <IonLabel>Redirect Params</IonLabel>
          </IonItem>
          <IonItem routerLink="/replace-params/step1">
            <IonLabel>Replace Params</IonLabel>
          </IonItem>
          <IonItem routerLink="/index-param-priority">
            <IonLabel>Index Param Priority</IonLabel>
          </IonItem>
        </IonList>

        <IonList>
          <IonListHeader>
            <IonLabel>Route Matching</IonLabel>
          </IonListHeader>
          <IonItem routerLink="/prefix-match-wildcard">
            <IonLabel>Prefix Match Wildcard</IonLabel>
          </IonItem>
          <IonItem routerLink="/index-route-reuse">
            <IonLabel>Index Route Reuse</IonLabel>
          </IonItem>
          <IonItem routerLink="/tail-slice-ambiguity">
            <IonLabel>Tail Slice Ambiguity</IonLabel>
          </IonItem>
          <IonItem routerLink="/wildcard-no-heuristic">
            <IonLabel>Wildcard No Heuristic</IonLabel>
          </IonItem>
        </IonList>

        <IonList>
          <IonListHeader>
            <IonLabel>Overlays</IonLabel>
          </IonListHeader>
          <IonItem routerLink="/overlays">
            <IonLabel>Overlays</IonLabel>
          </IonItem>
          <IonItem routerLink="/modal-aria-hidden">
            <IonLabel>Modal Aria Hidden</IonLabel>
          </IonItem>
        </IonList>

        <IonList>
          <IonListHeader>
            <IonLabel>Miscellaneous</IonLabel>
          </IonListHeader>
          <IonItem routerLink="/dynamic-ionpage-classnames">
            <IonLabel>Dynamic IonPage Classnames</IonLabel>
          </IonItem>
          <IonItem routerLink="/refs">
            <IonLabel>Refs</IonLabel>
          </IonItem>
          <IonItem routerLink="/outlet-ref">
            <IonLabel>Outlet Ref</IonLabel>
          </IonItem>
          <IonItem routerLink="/stale-view-cleanup/non-ionpage">
            <IonLabel>Stale View Cleanup</IonLabel>
          </IonItem>
          <IonItem routerLink="/route-context-shape">
            <IonLabel>Route Context Shape</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Main;
