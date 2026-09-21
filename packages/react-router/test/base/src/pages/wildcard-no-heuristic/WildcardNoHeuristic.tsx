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
 * Test page that validates wildcard routing works without relying on
 * string-similarity heuristics. The route names are intentionally chosen
 * to be very similar to navigation targets so that any prefix/similarity
 * heuristic would produce false positives.
 *
 * Routes: "page", "ab", and "*"
 * Navigation targets that should hit wildcard:
 *   - "page2" (shares 4-char prefix "page" with route "page")
 *   - "abc" (shares 2-char prefix "ab" with route "ab")
 *   - "pager" (shares 4-char prefix "page" with route "page")
 */

const SpecificPageA: React.FC = () => (
  <IonPage data-pageid="heuristic-page">
    <IonHeader>
      <IonToolbar>
        <IonTitle>Page</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <div data-testid="page-content">Page Route</div>
    </IonContent>
  </IonPage>
);

const SpecificPageB: React.FC = () => (
  <IonPage data-pageid="heuristic-ab">
    <IonHeader>
      <IonToolbar>
        <IonTitle>AB</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <div data-testid="ab-content">AB Route</div>
    </IonContent>
  </IonPage>
);

const CatchAllPage: React.FC = () => (
  <IonPage data-pageid="heuristic-catchall">
    <IonHeader>
      <IonToolbar>
        <IonTitle>Catch All</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <div data-testid="heuristic-catchall-content">Wildcard Catch-All Page</div>
    </IonContent>
  </IonPage>
);

const HeuristicHome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <IonPage data-pageid="heuristic-home">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Wildcard No Heuristic Test</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton id="go-to-page" onClick={() => navigate('page')}>
          Go to Page (specific)
        </IonButton>
        <IonButton id="go-to-ab" onClick={() => navigate('ab')}>
          Go to AB (specific)
        </IonButton>
        <IonButton id="go-to-page2" onClick={() => navigate('page2')}>
          Go to Page2 (wildcard)
        </IonButton>
        <IonButton id="go-to-abc" onClick={() => navigate('abc')}>
          Go to ABC (wildcard)
        </IonButton>
        <IonButton id="go-to-pager" onClick={() => navigate('pager')}>
          Go to Pager (wildcard)
        </IonButton>
        <IonButton id="go-to-unknown" onClick={() => navigate('unknown')}>
          Go to Unknown (wildcard)
        </IonButton>
        <TestDescription>"Page" and "AB" buttons should navigate to their specific pages. "Page2", "ABC", "Pager", and "Unknown" should all land on the Catch-All page. If any wildcard target incorrectly shows a specific page (e.g., "Page2" shows the "Page" route because the names are similar), the test fails.</TestDescription>
      </IonContent>
    </IonPage>
  );
};

const WildcardNoHeuristic: React.FC = () => {
  return (
    <IonRouterOutlet>
      <Route index element={<HeuristicHome />} />
      <Route path="page" element={<SpecificPageA />} />
      <Route path="ab" element={<SpecificPageB />} />
      <Route path="*" element={<CatchAllPage />} />
    </IonRouterOutlet>
  );
};

export default WildcardNoHeuristic;
