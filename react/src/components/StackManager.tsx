import React from 'react';
import { LifeCycleContext } from './navigation/LifeCycleContext';


type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

interface InternalProps extends React.HTMLAttributes<HTMLDivElement> {
  forwardedRef?: React.RefObject<HTMLDivElement>
};

type ExternalProps = Props & {
  ref?: React.RefObject<HTMLDivElement>
};

interface StackItemState {
  ref: any;
}

class StackItem extends React.Component<InternalProps, StackItemState> {
  context!: React.ContextType<typeof LifeCycleContext>;

  constructor(props: InternalProps) {
    super(props);
    this.state = {
      ref: null
    }
  }

  componentDidMount() {
    const { forwardedRef } = this.props;
    this.setState({ref: forwardedRef});
  }

  // componentWillUnmount() {
  //   const { forwardedRef } = this.props;
  //   if(forwardedRef && forwardedRef.current) {
  //     forwardedRef.current.removeEventListener('ionViewWillEnter', this.ionViewWillEnterHandler.bind(this));
  //   }
  // }

  ionViewWillEnterHandler() {
    // this.context.ionViewWillEnter();
  }

  render() {
    const { className, children, forwardedRef, ...rest } = this.props;
    const { ref } = this.state;
    return (
      <LifeCycleContext.Provider value={{parent: ref}}>
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
forwardRef.displayName = 'IonPage';

StackItem.contextType = LifeCycleContext;

export default React.forwardRef<HTMLDivElement, ExternalProps>(forwardRef);

// class DefaultLifeCycleContext implements LifeCycleContextInterface {

//   callback: Function;

//   constructor() {
//     console.log('dlcc ctor');
//   }

//   onIonViewWillEnter(callback: Function) {
//     this.callback = callback;
//   }

//   ionViewWillEnter() {
//     console.log('ionViewWillEnter in context')
//     if (this.callback) {
//       this.callback();
//     }
//   }
// }
