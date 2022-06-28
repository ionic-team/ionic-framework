import { IonNav } from '@ionic/react';
import React from 'react';

const NavComponent: React.FC = () => {
  return (
    <IonNav
      root={() => {
        return <div>Hello</div>;
      }}
    ></IonNav>
  );
};

export default NavComponent;
