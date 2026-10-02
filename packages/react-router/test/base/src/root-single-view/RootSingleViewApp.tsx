import { IonApp, IonButton, IonContent, IonHeader, IonPage, IonRouterOutlet, IonTitle, IonToolbar } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

/* Ionic CSS and setupIonicReact */
import '../ionic-setup';
import { ROOT_SINGLE_VIEW_BASENAME } from './basename';
import TestDescription from '../components/TestDescription';

/**
 * The whole route table mounted as one Ionic view: the outlet holds a single splat route
 * whose element is a plain <Routes>, so every navigation swaps the IonPage inside the same
 * view item.
 *
 * A root catch-all swallows every pathname in its outlet, so this app gets its own basename
 * and index.tsx mounts it instead of App for that prefix.
 */

/**
 * "?splat=bare" runs the same flows against a bare "*" instead of "/*". Stamped onto each
 * page as data-splat so a test can confirm which spelling is live.
 */
const splatPath = new URLSearchParams(window.location.search).get('splat') === 'bare' ? '*' : '/*';

const pages = ['a', 'b', 'c'];

const SingleViewPage: React.FC<{ name: string }> = ({ name }) => (
  <IonPage data-pageid={`root-single-view-${name}`} data-splat={splatPath}>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Page {name.toUpperCase()}</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      {pages.map((target) => (
        <React.Fragment key={target}>
          <IonButton id={`root-to-${target}`} routerLink={`/${target}`} routerDirection="root">
            Root to {target.toUpperCase()}
          </IonButton>
          <IonButton id={`push-to-${target}`} routerLink={`/${target}`}>
            Push to {target.toUpperCase()}
          </IonButton>
        </React.Fragment>
      ))}
      <TestDescription>
        Every page here lives in the same Ionic view. Each button should leave its target page on screen, never a blank
        page.
      </TestDescription>
    </IonContent>
  </IonPage>
);

const RootSingleViewApp: React.FC = () => (
  <IonApp>
    <IonReactRouter basename={ROOT_SINGLE_VIEW_BASENAME}>
      <IonRouterOutlet id="root-single-view-outlet">
        <Route
          path={splatPath}
          element={
            <Routes>
              {/* Keyed so each route mounts its own IonPage, as distinct page components would. */}
              {pages.map((name) => (
                <Route key={name} path={name} element={<SingleViewPage key={name} name={name} />} />
              ))}
            </Routes>
          }
        />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default RootSingleViewApp;
