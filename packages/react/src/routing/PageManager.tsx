import type { PropsWithChildren } from 'react';
import React, { useContext, useEffect, useRef } from 'react';

import { mergeRefs } from '../components/react-component-lib/utils';
import { IonLifeCycleContext } from '../contexts/IonLifeCycleContext';
import type { RouteInfo } from '../models';

import { StackContext } from './StackContext';

interface PageManagerProps {
  className?: string;
  forwardedRef?: React.ForwardedRef<HTMLDivElement>;
  routeInfo?: RouteInfo;
}

const PageManager = ({ children, ...props }: PropsWithChildren<PageManagerProps>) => {
  const { className, forwardedRef, routeInfo, ...restProps } = props;

  const ionLifeCycleContext = useContext(IonLifeCycleContext);
  const context = useContext(StackContext);

  const ionPageElementRef = useRef<HTMLDivElement>(null);
  const stableMergedRefs = mergeRefs(ionPageElementRef, forwardedRef);

  useEffect(() => {
    const ionPageElement = ionPageElementRef.current;

    if (ionPageElement) {
      if (context.isInOutlet()) {
        ionPageElement.classList.add('ion-page-invisible');
      }

      context.registerIonPage(ionPageElement, routeInfo!);

      ionPageElement.addEventListener('ionViewWillEnter', ionViewWillEnterHandler);
      ionPageElement.addEventListener('ionViewDidEnter', ionViewDidEnterHandler);
      ionPageElement.addEventListener('ionViewWillLeave', ionViewWillLeaveHandler);
      ionPageElement.addEventListener('ionViewDidLeave', ionViewDidLeaveHandler);
    }

    return () => {
      if (ionPageElement) {
        ionPageElement.removeEventListener('ionViewWillEnter', ionViewWillEnterHandler);
        ionPageElement.removeEventListener('ionViewDidEnter', ionViewDidEnterHandler);
        ionPageElement.removeEventListener('ionViewWillLeave', ionViewWillLeaveHandler);
        ionPageElement.removeEventListener('ionViewDidLeave', ionViewDidLeaveHandler);
      }
    };
  }, []);

  const ionViewWillEnterHandler = () => {
    ionLifeCycleContext.ionViewWillEnter();
  };

  const ionViewDidEnterHandler = () => {
    ionLifeCycleContext.ionViewDidEnter();
  };

  const ionViewWillLeaveHandler = () => {
    ionLifeCycleContext.ionViewWillLeave();
  };

  const ionViewDidLeaveHandler = () => {
    ionLifeCycleContext.ionViewDidLeave();
  };

  return (
    <IonLifeCycleContext.Consumer>
      {() => {
        return (
          <div className={className ? `${className} ion-page` : 'ion-page'} ref={stableMergedRefs} {...restProps}>
            {children}
          </div>
        );
      }}
    </IonLifeCycleContext.Consumer>
  );
};

export default PageManager;
