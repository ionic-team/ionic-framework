import React from 'react';

import { IonLifeCycleContext } from '../contexts/IonLifeCycleContext';
import { RouteInfo } from '../models';

import { StackContext } from './StackContext';

interface PageManagerProps {
  className?: string;
  forwardedRef?: React.RefObject<HTMLDivElement>;
  routeInfo?: RouteInfo;
}

export class PageManager extends React.PureComponent<PageManagerProps> {
  ionLifeCycleContext!: React.ContextType<typeof IonLifeCycleContext>;
  context!: React.ContextType<typeof StackContext>;
  ionPageElementRef: React.RefObject<HTMLDivElement>;

  constructor(props: PageManagerProps) {
    super(props);
    this.ionPageElementRef = this.props.forwardedRef || React.createRef();
  }

  componentDidMount() {
    if (this.ionPageElementRef.current) {
      if (this.context.isInOutlet()) {
        this.ionPageElementRef.current.classList.add('ion-page-invisible');
      }
      this.context.registerIonPage(this.ionPageElementRef.current, this.props.routeInfo!);
      this.ionPageElementRef.current.addEventListener(
        'ionViewWillEnter',
        this.ionViewWillEnterHandler.bind(this)
      );
      this.ionPageElementRef.current.addEventListener(
        'ionViewDidEnter',
        this.ionViewDidEnterHandler.bind(this)
      );
      this.ionPageElementRef.current.addEventListener(
        'ionViewWillLeave',
        this.ionViewWillLeaveHandler.bind(this)
      );
      this.ionPageElementRef.current.addEventListener(
        'ionViewDidLeave',
        this.ionViewDidLeaveHandler.bind(this)
      );
    }
  }

  componentWillUnmount() {
    if (this.ionPageElementRef.current) {
      this.ionPageElementRef.current.removeEventListener(
        'ionViewWillEnter',
        this.ionViewWillEnterHandler.bind(this)
      );
      this.ionPageElementRef.current.removeEventListener(
        'ionViewDidEnter',
        this.ionViewDidEnterHandler.bind(this)
      );
      this.ionPageElementRef.current.removeEventListener(
        'ionViewWillLeave',
        this.ionViewWillLeaveHandler.bind(this)
      );
      this.ionPageElementRef.current.removeEventListener(
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
    const { className, children, routeInfo, forwardedRef, ...props } = this.props;

    return (
      <IonLifeCycleContext.Consumer>
        {(context) => {
          this.ionLifeCycleContext = context;
          return (
            <div
              className={
                className ? `${className} ion-page` : `ion-page`
              }
              ref={this.ionPageElementRef}
              {...props}
            >
              {children}
            </div>
          );
        }}
      </IonLifeCycleContext.Consumer>
    );
  }

  static get contextType() {
    return StackContext;
  }
}
export default PageManager;
