import React from 'react';

import { mergeRefs } from '../components/react-component-lib/utils';
import { IonLifeCycleContext } from '../contexts/IonLifeCycleContext';
import type { RouteInfo } from '../models';

import { StackContext } from './StackContext';

interface PageManagerProps {
  className?: string;
  forwardedRef?: React.ForwardedRef<HTMLDivElement>;
  routeInfo?: RouteInfo;
  // TODO: Refactor type with PropsWithChildren when moving to React v18
  children?: React.ReactNode;
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
    if (this.ionPageElementRef.current) {
      if (this.context.isInOutlet()) {
        this.ionPageElementRef.current.classList.add('ion-page-invisible');
      }
      this.context.registerIonPage(this.ionPageElementRef.current, this.props.routeInfo!);
      this.ionPageElementRef.current.addEventListener('ionViewWillEnter', this.ionViewWillEnterHandler);
      this.ionPageElementRef.current.addEventListener('ionViewDidEnter', this.ionViewDidEnterHandler);
      this.ionPageElementRef.current.addEventListener('ionViewWillLeave', this.ionViewWillLeaveHandler);
      this.ionPageElementRef.current.addEventListener('ionViewDidLeave', this.ionViewDidLeaveHandler);
    }
  }

  componentWillUnmount() {
    if (this.ionPageElementRef.current) {
      this.ionPageElementRef.current.removeEventListener('ionViewWillEnter', this.ionViewWillEnterHandler);
      this.ionPageElementRef.current.removeEventListener('ionViewDidEnter', this.ionViewDidEnterHandler);
      this.ionPageElementRef.current.removeEventListener('ionViewWillLeave', this.ionViewWillLeaveHandler);
      this.ionPageElementRef.current.removeEventListener('ionViewDidLeave', this.ionViewDidLeaveHandler);
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
