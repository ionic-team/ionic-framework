import { IonRouterOutlet } from '@ionic/react';
import React from 'react';
import { Route, useNavigate } from 'react-router-dom';

/**
 * A component without IonPage wrapper.
 * When navigated away from, this should be cleaned up from the DOM.
 */
const NonIonPageSource: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div data-testid="non-ionpage-source">
      <h1>Non-IonPage Source</h1>
      <button id="go-to-target" onClick={() => navigate('/stale-view-cleanup/target')}>
        Go to Target
      </button>
    </div>
  );
};

const NonIonPageTarget: React.FC = () => {
  return (
    <div data-testid="non-ionpage-target">
      <div data-testid="target-loaded">Target page loaded</div>
    </div>
  );
};

const StaleViewCleanup: React.FC = () => {
  return (
    <IonRouterOutlet>
      <Route path="non-ionpage" element={<NonIonPageSource />} />
      <Route path="target" element={<NonIonPageTarget />} />
    </IonRouterOutlet>
  );
};

export default StaleViewCleanup;
