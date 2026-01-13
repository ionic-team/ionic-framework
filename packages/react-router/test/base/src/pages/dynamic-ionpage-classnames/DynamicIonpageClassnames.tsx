import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';

/**
 * Test page for verifying that dynamically changing className on IonPage
 * preserves framework-added classes (can-go-back, ion-page-invisible, etc.).
 *
 * Related issue: https://github.com/ionic-team/ionic-framework/issues/22631
 */
const DynamicIonpageClassnames: React.FC = () => {
  return <Page />;
};

export default DynamicIonpageClassnames;

const Page: React.FC = () => {
  const [styleClass, setStyleClass] = useState('initial-class');
  const [divClasses, setDivClasses] = useState<string>();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new MutationObserver(() => {
      setDivClasses(ref.current?.className);
    });

    observer.observe(ref.current, {
      attributes: true,
      attributeFilter: ['class'],
      childList: false,
      characterData: false,
    });

    return () => observer.disconnect();
  }, []);

  return (
    <IonPage className={styleClass} ref={ref} data-pageid="dynamic-ionpage-classnames">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Dynamic Ionpage Classnames</IonTitle>
          <button slot="end" onClick={() => setStyleClass('other-class')}>Add Class</button>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <p>
          This page tests that dynamically changing the className prop on IonPage
          preserves framework classes (ion-page, ion-page-hidden, ion-page-invisible).
        </p>
        <p>
          <strong>Test:</strong> Click "Add Class" and verify the classes below include
          both "other-class" AND "ion-page". If only "other-class" appears,
          the framework classes were incorrectly removed.
        </p>
        <p>Current classes: {divClasses}</p>
      </IonContent>
    </IonPage>
  );
};
