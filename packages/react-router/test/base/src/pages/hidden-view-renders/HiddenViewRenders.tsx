import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  useIonRouter,
} from '@ionic/react';
import React, { useEffect } from 'react';
import { Route, Navigate, useParams } from 'react-router-dom';

import TestDescription from '../../components/TestDescription';
import { countRender } from '../../utils';

/**
 * Counts committed renders. An effect with no dependency list runs once per
 * commit, so a render that bails out isn't counted.
 */
const useCommitCounter = (id: string) => {
  useEffect(() => countRender(id));
};

const ParamsReader: React.FC<{ tab: string }> = ({ tab }) => {
  useParams();
  useCommitCounter(`${tab}:params`);
  return null;
};

const IonRouterReader: React.FC<{ tab: string }> = ({ tab }) => {
  useIonRouter();
  useCommitCounter(`${tab}:ionRouter`);
  return null;
};

const TabPage: React.FC<{ tab: string }> = ({ tab }) => {
  return (
    <IonPage data-pageid={`hidden-view-renders-${tab}`}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab {tab.toUpperCase()}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <ParamsReader tab={tab} />
        <IonRouterReader tab={tab} />
        <TestDescription>
          Switch between Tabs A, B and C a few times. Hidden pages that read useParams should not re-render, and ones
          that read useIonRouter should re-render once per switch. Counts are in window.renderCounts.
        </TestDescription>
      </IonContent>
    </IonPage>
  );
};

const SplatPage: React.FC = () => {
  const params = useParams();
  useCommitCounter('d:params');

  return (
    <IonPage data-pageid="hidden-view-renders-d">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab D</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div id="splat-param">{params['*']}</div>
        <IonButton routerLink="/hidden-view-renders/d/two" id="go-to-d-two">
          Go to D Two
        </IonButton>
        <TestDescription>
          Tap Go to D Two. The splat param above should change to "two", and window.renderCounts['d:params'] should go
          up by 1.
        </TestDescription>
      </IonContent>
    </IonPage>
  );
};

const HiddenViewRenders: React.FC = () => {
  return (
    <IonTabs data-pageid="hidden-view-renders">
      <IonRouterOutlet id="hidden-view-renders">
        <Route index element={<Navigate to="/hidden-view-renders/a" replace />} />
        <Route path="a" element={<TabPage tab="a" />} />
        <Route path="b" element={<TabPage tab="b" />} />
        <Route path="c" element={<TabPage tab="c" />} />
        <Route path="d/*" element={<SplatPage />} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="a" href="/hidden-view-renders/a">
          <IonLabel>Tab A</IonLabel>
        </IonTabButton>
        <IonTabButton tab="b" href="/hidden-view-renders/b">
          <IonLabel>Tab B</IonLabel>
        </IonTabButton>
        <IonTabButton tab="c" href="/hidden-view-renders/c">
          <IonLabel>Tab C</IonLabel>
        </IonTabButton>
        <IonTabButton tab="d" href="/hidden-view-renders/d/one">
          <IonLabel>Tab D</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default HiddenViewRenders;
