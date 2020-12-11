import React, { useEffect, useRef, useState } from 'react';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { Route } from 'react-router';

interface DynamicIonpageClassnamesProps {}

const DynamicIonpageClassnames: React.FC<DynamicIonpageClassnamesProps> = () => {
  return (
    <IonRouterOutlet>
      <Route path="/dynamic-ionpage-classnames" component={Page} />
    </IonRouterOutlet>
  );
};

export default DynamicIonpageClassnames;

const Page: React.FC = (props) => {
  const [styleClass, setStyleClass] = useState('initial-class');
  const [divClasses, setDivClasses] = useState<string>();
  const ref = useRef<HTMLDivElement>();
  useEffect(() => {
    if(ref.current) {
      var observer = new MutationObserver(function (event) {
        setDivClasses(ref.current?.className)
      })

      observer.observe(ref.current, {
        attributes: true,
        attributeFilter: ['class'],
        childList: false,
        characterData: false
      })
    }
    return () => observer.disconnect()
  }, [])


  return (
    <IonPage className={styleClass} ref={ref} data-pageid="dynamic-ionpage-classnames">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Dynamic Ionpage Classnames</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton onClick={() => setStyleClass('other-class')}>Add Class</IonButton>
        <br />
        Div classes: {divClasses}
      </IonContent>
    </IonPage>
  );
};
