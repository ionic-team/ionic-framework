import React from 'react';

import { IonRouterOutletInner } from '../components/inner-proxies';
import { IonLifeCycleContext } from '../contexts/IonLifeCycleContext';
import { RouteInfo } from '../models';

import { StackContext } from './StackContext';

interface OutletPageManagerProps {
  className?: string;
  forwardedRef?: React.RefObject<HTMLIonRouterOutletElement>;
  routeInfo?: RouteInfo;
  StackManager: any;
}

export class OutletPageManager extends React.Component<OutletPageManagerProps> {
  ionLifeCycleContext!: React.ContextType<typeof IonLifeCycleContext>;
  context!: React.ContextType<typeof StackContext>;
  ionRouterOutlet: HTMLIonRouterOutletElement | undefined;

  constructor(props: OutletPageManagerProps) {
    super(props);
  }

  componentDidMount() {
    if (this.ionRouterOutlet) {
      setTimeout(() => {
        this.context.registerIonPage(this.ionRouterOutlet!, this.props.routeInfo!);
      }, 25);

      this.ionRouterOutlet.addEventListener(
        'ionViewWillEnter',
        this.ionViewWillEnterHandler.bind(this)
      );
      this.ionRouterOutlet.addEventListener(
        'ionViewDidEnter',
        this.ionViewDidEnterHandler.bind(this)
      );
      this.ionRouterOutlet.addEventListener(
        'ionViewWillLeave',
        this.ionViewWillLeaveHandler.bind(this)
      );
      this.ionRouterOutlet.addEventListener(
        'ionViewDidLeave',
        this.ionViewDidLeaveHandler.bind(this)
      );
    }
  }

  componentWillUnmount() {
    if (this.ionRouterOutlet) {
      this.ionRouterOutlet.removeEventListener(
        'ionViewWillEnter',
        this.ionViewWillEnterHandler.bind(this)
      );
      this.ionRouterOutlet.removeEventListener(
        'ionViewDidEnter',
        this.ionViewDidEnterHandler.bind(this)
      );
      this.ionRouterOutlet.removeEventListener(
        'ionViewWillLeave',
        this.ionViewWillLeaveHandler.bind(this)
      );
      this.ionRouterOutlet.removeEventListener(
        'ionViewDidLeave',
        this.ionViewDidLeaveHandler.bind(this)
      );
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
