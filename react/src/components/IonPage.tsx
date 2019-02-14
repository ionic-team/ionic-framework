import React from 'react';


type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;


const IonPage: React.SFC<Props> = ({ children, className, ...props }) => (
  <div
    className={className ? `ion-page ${className}` : 'ion-page'}
    {...props}
  >
    {children}
  </div>
);

export default IonPage;
