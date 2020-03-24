
import React from 'react';

import { IonLifeCycleContext } from '../contexts/IonLifeCycleContext';

import { StackContext } from './StackManager';

interface PageManagerProps {
  className?: string;
  forwardedRef?: React.RefObject<HTMLDivElement>;
}

export class PageManager extends React.Component<PageManagerProps> {
  ionLifeCycleContext!: React.ContextType<typeof IonLifeCycleContext>;
  context!: React.ContextType<typeof StackContext>;
  ionPageElementRef: React.RefObject<HTMLDivElement>;

  constructor(props: PageManagerProps) {
    super(props);
    this.ionPageElementRef = this.props.forwardedRef || React.createRef();
  }

  componentDidMount() {
    if (this.ionPageElementRef.current) {
      this.context.registerIonPage(this.ionPageElementRef.current);
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
    const { className, children } = this.props;
    return (
      <IonLifeCycleContext.Consumer>
        {context => {
          this.ionLifeCycleContext = context;
          return (
            <div className={className ? `ion-page ion-page-invisible ${className}` : 'ion-page ion-page-invisible'} ref={this.ionPageElementRef}>
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
