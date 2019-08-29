import React from 'react';
import { IonLifeCycleContext, NavContext } from '@ionic/react';
import { ViewItem } from './ViewItem';
// import { Route } from 'react-router-dom';

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

interface InternalProps extends React.HTMLAttributes<HTMLElement> {
  onViewSync: (page: HTMLElement, viewId: string) => void;
  view: ViewItem;
  forwardedRef?: React.RefObject<HTMLElement>,
};

type ExternalProps = Props & {
  onViewSync: (page: HTMLElement, viewId: string) => void;
  view: ViewItem;
  ref?: React.RefObject<HTMLElement>
};

interface StackViewState {
  ref: any;
}

class ViewInternal extends React.Component<InternalProps, StackViewState> {
  context!: React.ContextType<typeof IonLifeCycleContext>;
  ionPage?: HTMLElement;

  constructor(props: InternalProps) {
    super(props);
    this.state = {
      ref: null
    }
  }

  componentWillUnmount() {
    // const { forwardedRef } = this.props;
    if (this.ionPage) {
      this.ionPage.removeEventListener('ionViewWillEnter', this.ionViewWillEnterHandler.bind(this));
      this.ionPage.removeEventListener('ionViewDidEnter', this.ionViewDidEnterHandler.bind(this));
      this.ionPage.removeEventListener('ionViewWillLeave', this.ionViewWillLeaveHandler.bind(this));
      this.ionPage.removeEventListener('ionViewDidLeave', this.ionViewDidLeaveHandler.bind(this));
    }
  }

  ionViewWillEnterHandler() {
    this.context.ionViewWillEnter();
  }

  ionViewDidEnterHandler() {
    this.context.ionViewDidEnter();
  }

  ionViewWillLeaveHandler() {
    this.context.ionViewWillLeave();
  }

  ionViewDidLeaveHandler() {
    this.context.ionViewDidLeave();
  }

  registerIonPage(page: HTMLElement) {
    this.ionPage = page;
    this.ionPage.addEventListener('ionViewWillEnter', this.ionViewWillEnterHandler.bind(this));
    this.ionPage.addEventListener('ionViewDidEnter', this.ionViewDidEnterHandler.bind(this));
    this.ionPage.addEventListener('ionViewWillLeave', this.ionViewWillLeaveHandler.bind(this));
    this.ionPage.addEventListener('ionViewDidLeave', this.ionViewDidLeaveHandler.bind(this));
    this.props.onViewSync(page, this.props.view.id);
  }

  render() {
    return (
      <NavContext.Consumer>
        {value => {
          const newProvider = {
            ...value,
            registerIonPage: this.registerIonPage.bind(this)
          }
          return (
            <NavContext.Provider value={newProvider}>
              {this.props.children}
            </NavContext.Provider>
          );

        }}
      </NavContext.Consumer>
    );
    // const { className, children, forwardedRef, ...rest } = this.props;
    // const route = React.Children.only(this.props.children) as React.ReactElement;

    // const component = route.props.component || route.props.render;

    // return React.cloneElement(component, {
    //   ref: forwardRef
    // });

    // const { ref } = this.state;
    // return (
    //     <div
    //       className={className ? `ion-page ${className}` : 'ion-page'}
    //       ref={forwardedRef as any}
    //       {...rest}
    //     >
    //       {ref && children}
    //     </div>
    // )
  }

  static get contextType() {
    return IonLifeCycleContext;
  }
}

function forwardRef(props: InternalProps, ref: React.RefObject<HTMLElement>) {
  return <ViewInternal forwardedRef={ref} {...props} />;
}
forwardRef.displayName = 'View';

export const View = /*@__PURE__*/React.forwardRef<HTMLElement, ExternalProps>(forwardRef as any);
