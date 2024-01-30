import { componentOnReady } from '@ionic/core/components';
import React from 'react';

import { IonRouterOutletInner } from '../components/inner-proxies';
import { IonLifeCycleContext } from '../contexts/IonLifeCycleContext';
import type { RouteInfo } from '../models';

import { StackContext } from './StackContext';

interface OutletPageManagerProps {
  className?: string;
  forwardedRef?: React.ForwardedRef<HTMLIonRouterOutletElement>;
  routeInfo?: RouteInfo;
  StackManager: any; // TODO(FW-2959): type
  // TODO: Refactor type with PropsWithChildren when moving to React v18
  children?: React.ReactNode;
}

export class OutletPageManager extends React.Component<OutletPageManagerProps> {
  ionLifeCycleContext!: React.ContextType<typeof IonLifeCycleContext>;
  context!: React.ContextType<typeof StackContext>;
  ionRouterOutlet: HTMLIonRouterOutletElement | undefined;
  outletIsReady: boolean;

  constructor(props: OutletPageManagerProps) {
    super(props);

    this.outletIsReady = false;

    /**
     * This binds the scope of the following methods to the class scope.
     * The `.bind` method returns a new function, so we need to assign it
     * in the constructor rather than when adding or removing the listeners
     * to avoid creating a new function.
     */
    this.ionViewWillEnterHandler = this.ionViewWillEnterHandler.bind(this);
    this.ionViewDidEnterHandler = this.ionViewDidEnterHandler.bind(this);
    this.ionViewWillLeaveHandler = this.ionViewWillLeaveHandler.bind(this);
    this.ionViewDidLeaveHandler = this.ionViewDidLeaveHandler.bind(this);
  }

  componentDidMount() {
    if (this.ionRouterOutlet) {
      /**
       * This avoids multiple raf calls
       * when React unmounts + remounts components.
       */
      if (!this.outletIsReady) {
        componentOnReady(this.ionRouterOutlet, () => {
          this.outletIsReady = true;
          this.context.registerIonPage(this.ionRouterOutlet!, this.props.routeInfo!);
        });
      }

      this.ionRouterOutlet.addEventListener('ionViewWillEnter', this.ionViewWillEnterHandler);
      this.ionRouterOutlet.addEventListener('ionViewDidEnter', this.ionViewDidEnterHandler);
      this.ionRouterOutlet.addEventListener('ionViewWillLeave', this.ionViewWillLeaveHandler);
      this.ionRouterOutlet.addEventListener('ionViewDidLeave', this.ionViewDidLeaveHandler);
    }
  }

  componentWillUnmount() {
    if (this.ionRouterOutlet) {
      this.ionRouterOutlet.removeEventListener('ionViewWillEnter', this.ionViewWillEnterHandler);
      this.ionRouterOutlet.removeEventListener('ionViewDidEnter', this.ionViewDidEnterHandler);
      this.ionRouterOutlet.removeEventListener('ionViewWillLeave', this.ionViewWillLeaveHandler);
      this.ionRouterOutlet.removeEventListener('ionViewDidLeave', this.ionViewDidLeaveHandler);
    }
  }

  ionViewWillEnterHandler() {
    this.ionLifeCycleContext.ionViewWillEnter();
  }

  ionViewDidEnterHandler() {
    this.ionLifeCycleContext.ionViewDidEnter();
  }

  ionViewWillLeaveHandler() {
    this.ionLifeCycleContext.ionViewWillLeave();
  }

  ionViewDidLeaveHandler() {
    this.ionLifeCycleContext.ionViewDidLeave();
  }

  render() {
    const { StackManager, children, routeInfo, ...props } = this.props;
    return (
      <IonLifeCycleContext.Consumer>
        {(context) => {
          this.ionLifeCycleContext = context;
          return (
            <StackManager routeInfo={routeInfo}>
              <IonRouterOutletInner
                setRef={(val: HTMLIonRouterOutletElement) => (this.ionRouterOutlet = val)}
                {...props}
              >
                {children}
              </IonRouterOutletInner>
            </StackManager>
          );
        }}
      </IonLifeCycleContext.Consumer>
    );
  }

  static get contextType() {
    return StackContext;
  }
}
export default OutletPageManager;
