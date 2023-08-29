import React from 'react';

import { mergeRefs } from '../components/react-component-lib/utils';
import { IonLifeCycleContext } from '../contexts/IonLifeCycleContext';
import type { RouteInfo } from '../models';

import { StackContext } from './StackContext';

interface PageManagerProps {
  className?: string;
  forwardedRef?: React.ForwardedRef<HTMLDivElement>;
  routeInfo?: RouteInfo;
}

export class PageManager extends React.PureComponent<PageManagerProps> {
  ionLifeCycleContext!: React.ContextType<typeof IonLifeCycleContext>;
  context!: React.ContextType<typeof StackContext>;
  ionPageElementRef: React.RefObject<HTMLDivElement>;
  stableMergedRefs: React.RefCallback<HTMLDivElement>;

  constructor(props: PageManagerProps) {
    super(props);
    this.ionPageElementRef = React.createRef();
    // React refs must be stable (not created inline).
    this.stableMergedRefs = mergeRefs(this.ionPageElementRef, this.props.forwardedRef);
  }

  componentDidMount() {
    if (this.ionPageElementRef.current) {
      if (this.context.isInOutlet()) {
        this.ionPageElementRef.current.classList.add('ion-page-invisible');
      }
      console.log('registerIonPage from PageManager');

      this.context.registerIonPage(this.props.routeInfo!, this.ionPageElementRef.current);

      // this.context.registerIonPage(this.ionPageElementRef.current, this.props.routeInfo!);
      this.ionPageElementRef.current.addEventListener('ionViewWillEnter', this.ionViewWillEnterHandler.bind(this));
      this.ionPageElementRef.current.addEventListener('ionViewDidEnter', this.ionViewDidEnterHandler.bind(this));
      this.ionPageElementRef.current.addEventListener('ionViewWillLeave', this.ionViewWillLeaveHandler.bind(this));
      this.ionPageElementRef.current.addEventListener('ionViewDidLeave', this.ionViewDidLeaveHandler.bind(this));
    }
  }

  componentWillUnmount() {
    if (this.ionPageElementRef.current) {
      this.ionPageElementRef.current.removeEventListener('ionViewWillEnter', this.ionViewWillEnterHandler.bind(this));
      this.ionPageElementRef.current.removeEventListener('ionViewDidEnter', this.ionViewDidEnterHandler.bind(this));
      this.ionPageElementRef.current.removeEventListener('ionViewWillLeave', this.ionViewWillLeaveHandler.bind(this));
      this.ionPageElementRef.current.removeEventListener('ionViewDidLeave', this.ionViewDidLeaveHandler.bind(this));
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { className, children, routeInfo, forwardedRef, ...props } = this.props;

    return (
      <IonLifeCycleContext.Consumer>
        {(context) => {
          this.ionLifeCycleContext = context;
          return (
            <div className={className ? `${className} ion-page` : `ion-page`} ref={this.stableMergedRefs} {...props}>
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
