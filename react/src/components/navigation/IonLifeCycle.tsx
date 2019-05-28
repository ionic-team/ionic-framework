import React, { useContext } from 'react';
import { IonLifeCycleContext } from './IonLifeCycleContext';

export const withIonLifeCycle = (WrappedComponent: React.ComponentType<any>) => {
  return class IonLifeCycle extends React.Component<any, any> {
    context!: React.ContextType<typeof IonLifeCycleContext>;
    componentRef = React.createRef<any>();

    constructor(props: any) {
      super(props);
    }

    componentDidMount() {
      this.context.onIonViewWillEnter(() => {
        if (this.componentRef.current.ionViewWillEnter) {
          this.componentRef.current.ionViewWillEnter();
        }
      });

      this.context.onIonViewDidEnter(() => {
        if (this.componentRef.current.ionViewDidEnter) {
          this.componentRef.current.ionViewDidEnter();
        }
      });

      this.context.onIonViewWillLeave(() => {
        if (this.componentRef.current.ionViewWillLeave) {
          this.componentRef.current.ionViewWillLeave();
        }
      });

      this.context.onIonViewDidLeave(() => {
        if (this.componentRef.current.ionViewDidLeave) {
          this.componentRef.current.ionViewDidLeave();
        }
      });
    }

    render() {
      return (
        <IonLifeCycleContext.Consumer>
          {context => {
            this.context = context;
            return (
              <WrappedComponent ref={this.componentRef} {...this.props} />
            )
          }
          }
        </IonLifeCycleContext.Consumer>
      );
    }
  }
};

export const useIonViewWillEnter = (callback: Function) => {
  const value = useContext(IonLifeCycleContext);
  value.onIonViewWillEnter(callback);
}

export const useIonViewDidEnter = (callback: Function) => {
  const value = useContext(IonLifeCycleContext);
  value.onIonViewDidEnter(callback);
}

export const useIonViewWillLeave = (callback: Function) => {
  const value = useContext(IonLifeCycleContext);
  value.onIonViewWillLeave(callback);
}

export const useIonViewDidLeave = (callback: Function) => {
  const value = useContext(IonLifeCycleContext);
  value.onIonViewDidLeave(callback);
}
