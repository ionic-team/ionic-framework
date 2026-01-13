import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { Route } from 'react-router';

const DynamicIonpageClassnames: React.FC = () => {
  return (
    <IonRouterOutlet>
      <Route path="/dynamic-ionpage-classnames" element={<Page />} />
    </IonRouterOutlet>
  );
};

export default DynamicIonpageClassnames;

const Page: React.FC = (props) => {
  const [styleClass, setStyleClass] = useState('initial-class');
  const [divClasses, setDivClasses] = useState<string>();
  const ref = useRef<HTMLDivElement>();
  useEffect(() => {
    let observer: MutationObserver | undefined;
    if(ref.current) {
      observer = new MutationObserver(function (event) {
        setDivClasses(ref.current?.className)
      })

      observer.observe(ref.current, {
        attributes: true,
        attributeFilter: ['class'],
        childList: false,
        characterData: false
      })
    }
    return () => observer?.disconnect()
  }, [])


  return (
    <IonPage className={styleClass} ref={ref} data-pageid="dynamic-ionpage-classnames">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Dynamic Ionpage Classnames</IonTitle>
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
        <IonButton onClick={() => setStyleClass('other-class')}>Add Class</IonButton>
        <p>Current classes: {divClasses}</p>
      </IonContent>
    </IonPage>
  );
};
