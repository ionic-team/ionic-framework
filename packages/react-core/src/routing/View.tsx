import React from 'react';
import { IonLifeCycleContext } from '../lifecycle/IonLifeCycleContext';

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

interface InternalProps extends React.HTMLAttributes<HTMLElement> {
  forwardedRef?: React.RefObject<HTMLElement>,
};

type ExternalProps = Props & {
  ref?: React.RefObject<HTMLElement>
};

interface StackViewState {
  ref: any;
}

class ViewInternal extends React.Component<InternalProps, StackViewState> {
  context!: React.ContextType<typeof IonLifeCycleContext>;

  constructor(props: InternalProps) {
    super(props);
    this.state = {
      ref: null
    }
  }

  componentDidMount() {
    const { forwardedRef } = this.props;
    this.setState({ ref: forwardedRef });
    if (forwardedRef && forwardedRef.current) {
      forwardedRef.current.addEventListener('ionViewWillEnter', this.ionViewWillEnterHandler.bind(this));
      forwardedRef.current.addEventListener('ionViewDidEnter', this.ionViewDidEnterHandler.bind(this));
      forwardedRef.current.addEventListener('ionViewWillLeave', this.ionViewWillLeaveHandler.bind(this));
      forwardedRef.current.addEventListener('ionViewDidLeave', this.ionViewDidLeaveHandler.bind(this));
    }
  }

  componentWillUnmount() {
    const { forwardedRef } = this.props;
    if (forwardedRef && forwardedRef.current) {
      forwardedRef.current.removeEventListener('ionViewWillEnter', this.ionViewWillEnterHandler.bind(this));
      forwardedRef.current.removeEventListener('ionViewDidEnter', this.ionViewDidEnterHandler.bind(this));
      forwardedRef.current.removeEventListener('ionViewWillLeave', this.ionViewWillLeaveHandler.bind(this));
      forwardedRef.current.removeEventListener('ionViewDidLeave', this.ionViewDidLeaveHandler.bind(this));
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

  render() {
    const { className, children, forwardedRef, ...rest } = this.props;
    const { ref } = this.state;
    return (
        <div
          className={className ? `ion-page ${className}` : 'ion-page'}
          ref={forwardedRef as any}
          {...rest}
        >
          {ref && children}
        </div>
    )
  }
}
ViewInternal.contextType = IonLifeCycleContext;

function forwardRef(props: InternalProps, ref: React.RefObject<HTMLElement>) {
  return <ViewInternal forwardedRef={ref} {...props} />;
}
forwardRef.displayName = 'View';

export const View = /*@__PURE__*/React.forwardRef<HTMLElement, ExternalProps>(forwardRef);
