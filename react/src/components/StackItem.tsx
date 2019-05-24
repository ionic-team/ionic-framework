import React from 'react';
import { LifeCycleContext, LifeCycleContextInterface } from './navigation/LifeCycleContext';


type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

interface InternalProps extends React.HTMLAttributes<HTMLDivElement> {
  forwardedRef?: React.RefObject<HTMLDivElement>,
  activateView?: any;
};

type ExternalProps = Props & {
  ref?: React.RefObject<HTMLDivElement>
  activateView?: any;
};

interface StackItemState {
  ref: any;
}

class StackItem extends React.Component<InternalProps, StackItemState> {
  // context!: React.ContextType<typeof LifeCycleContext>;
  lifeCycleContext = new DefaultLifeCycleContext();

  constructor(props: InternalProps) {
    super(props);
    this.state = {
      ref: null
    }
  }

  componentWillMount() {
    // this.lifeCycleContext.ionViewWillEnter();
  }

  componentDidMount() {
    const { forwardedRef, activateView } = this.props;
    this.setState({ref: forwardedRef});
    if(forwardedRef && forwardedRef.current) {
      forwardedRef.current.addEventListener('ionViewWillEnter', this.ionViewWillEnterHandler.bind(this));
      forwardedRef.current.addEventListener('ionViewDidEnter', this.ionViewDidEnterHandler.bind(this));
      forwardedRef.current.addEventListener('ionViewWillLeave', this.ionViewWillLeaveHandler.bind(this));
      forwardedRef.current.addEventListener('ionViewDidLeave', this.ionViewDidLeaveHandler.bind(this));
      if(activateView) {
        activateView(forwardedRef.current);
      }
    }
  }

  componentDidUpdate() {
    // const { forwardedRef, activateView } = this.props;
    // if(activateView && forwardedRef) {
    //   activateView(forwardedRef.current);
    // }
  }

  componentWillUnmount() {
    const { forwardedRef } = this.props;
    if(forwardedRef && forwardedRef.current) {
      forwardedRef.current.removeEventListener('ionViewWillEnter', this.ionViewWillEnterHandler.bind(this));
      forwardedRef.current.removeEventListener('ionViewDidEnter', this.ionViewDidEnterHandler.bind(this));
      forwardedRef.current.removeEventListener('ionViewWillLeave', this.ionViewWillLeaveHandler.bind(this));
      forwardedRef.current.removeEventListener('ionViewDidLeave', this.ionViewDidLeaveHandler.bind(this));
    }
  }

  ionViewWillEnterHandler() {
    this.lifeCycleContext.ionViewWillEnter();
  }

  ionViewDidEnterHandler() {
    this.lifeCycleContext.ionViewDidEnter();
  }

  ionViewWillLeaveHandler() {
    this.lifeCycleContext.ionViewWillLeave();
  }

  ionViewDidLeaveHandler() {
    this.lifeCycleContext.ionViewDidLeave();
  }

  render() {
    const { className, children, forwardedRef, activateView, ...rest } = this.props;
    const { ref } = this.state;
    return (
      <LifeCycleContext.Provider value={this.lifeCycleContext}>
      <div
        className={className ? `ion-page ${className}` : 'ion-page'}
        ref={forwardedRef}
        {...rest}
      >
        {ref && children}
      </div>
      </LifeCycleContext.Provider>
    )
  }
}

function forwardRef(props: InternalProps, ref: React.RefObject<HTMLDivElement>) {
  return <StackItem forwardedRef={ref} {...props}  />;
}
forwardRef.displayName = 'StackItem';

StackItem.contextType = LifeCycleContext;

export default React.forwardRef<HTMLDivElement, ExternalProps>(forwardRef);

class DefaultLifeCycleContext implements LifeCycleContextInterface {

  stackItemRef: null;

  ionViewWillEnterCallback: Function;
  ionViewDidEnterCallback: Function;
  ionViewWillLeaveCallback: Function;
  ionViewDidLeaveCallback: Function;

  queueIonViewWillEnter = false;
  queueIonViewDidEnter = false;

  constructor() {
    console.log('dlcc ctor');
  }

  onIonViewWillEnter(callback: Function) {
    this.ionViewWillEnterCallback = callback;
    if(this.queueIonViewWillEnter) {
      callback();
      this.queueIonViewWillEnter = false;
    }
  }

  ionViewWillEnter() {
    if (this.ionViewWillEnterCallback) {
      this.ionViewWillEnterCallback();
    } else {
      this.queueIonViewWillEnter = true;
    }
  }

  onIonViewDidEnter(callback: Function) {
    this.ionViewDidEnterCallback = callback;
    if(this.queueIonViewDidEnter) {
      callback();
      this.queueIonViewDidEnter = false;
    }
  }

  ionViewDidEnter() {
    if (this.ionViewDidEnterCallback) {
      this.ionViewDidEnterCallback();
    } else {
      this.queueIonViewDidEnter = true;
    }
  }

  onIonViewWillLeave(callback: Function) {
    this.ionViewWillLeaveCallback = callback;
  }

  ionViewWillLeave() {
    if (this.ionViewWillLeaveCallback) {
      this.ionViewWillLeaveCallback();
    }
  }

  onIonViewDidLeave(callback: Function) {
    this.ionViewDidLeaveCallback = callback;
  }

  ionViewDidLeave() {
    if (this.ionViewDidLeaveCallback) {
      this.ionViewDidLeaveCallback();
    }
  }
}
