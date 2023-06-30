import { componentOnReady } from '@ionic/core/components';
import type { PropsWithChildren } from 'react';
import React, { useContext, useEffect, useRef, useState } from 'react';

import { IonRouterOutletInner } from '../components/inner-proxies';
import type { IonLifeCycleContextInterface } from '../contexts/IonLifeCycleContext';
import { IonLifeCycleContext } from '../contexts/IonLifeCycleContext';
import type { RouteInfo } from '../models';

import { StackContext } from './StackContext';

interface OutletPageManagerProps {
  className?: string;
  forwardedRef?: React.ForwardedRef<HTMLIonRouterOutletElement>;
  routeInfo?: RouteInfo;
  // TODO @sean I don't think we can get the type, it comes from @ionic/react, but we don't have a dep against it for react-router
  StackManager: any; // TODO(FW-2959): type
}

const OutletPageManager = ({ children, ...props }: PropsWithChildren<OutletPageManagerProps>) => {
  const { registerIonPage } = useContext(StackContext);

  const ionRouterOutlet = useRef<HTMLIonRouterOutletElement>(null);
  const ionLifeCycleContext = useRef<IonLifeCycleContextInterface>();

  const [outletIsReady, setOutletIsReady] = useState(false);

  const { routeInfo, StackManager } = props;

  useEffect(() => {
    const routerOutlet = ionRouterOutlet.current;

    if (routerOutlet) {
      /**
       * This avoids multiple raf calls
       * when React unmounts + remounts components.
       */
      if (!outletIsReady) {
        componentOnReady(routerOutlet, () => {
          registerIonPage(routerOutlet!, routeInfo!);
          setOutletIsReady(true);
        });
      }

      routerOutlet.addEventListener('ionViewWillEnter', ionViewWillEnterHandler);
      routerOutlet.addEventListener('ionViewDidEnter', ionViewDidEnterHandler);
      routerOutlet.addEventListener('ionViewWillLeave', ionViewWillLeaveHandler);
      routerOutlet.addEventListener('ionViewDidLeave', ionViewDidLeaveHandler);
    }

    return () => {
      if (routerOutlet) {
        routerOutlet.removeEventListener('ionViewWillEnter', ionViewWillEnterHandler);
        routerOutlet.removeEventListener('ionViewDidEnter', ionViewDidEnterHandler);
        routerOutlet.removeEventListener('ionViewWillLeave', ionViewWillLeaveHandler);
        routerOutlet.removeEventListener('ionViewDidLeave', ionViewDidLeaveHandler);
      }
    };
  }, [ionRouterOutlet, outletIsReady, routeInfo]);

  const ionViewWillEnterHandler = () => {
    ionLifeCycleContext.current!.ionViewWillEnter();
  };

  const ionViewDidEnterHandler = () => {
    ionLifeCycleContext.current!.ionViewDidEnter();
  };

  const ionViewWillLeaveHandler = () => {
    ionLifeCycleContext.current!.ionViewWillLeave();
  };

  const ionViewDidLeaveHandler = () => {
    ionLifeCycleContext.current!.ionViewDidLeave();
  };

  return (
    <IonLifeCycleContext.Consumer>
      {(context) => {
        ionLifeCycleContext.current = context;
        return (
          <StackManager routeInfo={routeInfo}>
            <IonRouterOutletInner ref={ionRouterOutlet} {...props}>
              {children}
            </IonRouterOutletInner>
          </StackManager>
        );
      }}
    </IonLifeCycleContext.Consumer>
  );
};

export default OutletPageManager;
