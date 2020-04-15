import React, { useRef, useEffect } from 'react';
import { IonApp, IonRouterOutlet, IonPage } from '@ionic/react';
import { IonReactRouter } from '../IonReactRouter';
import { render } from '@testing-library/react';
import { Route } from 'react-router';
// import {Router} from '../Router';

describe('Router', () => {


  describe('on first page render', () => {

    let IonTestApp: React.ComponentType<any>;

    beforeEach(() => {
      IonTestApp = ({ Page }) => {
        return (
          <IonApp>
            <IonReactRouter>
              <IonRouterOutlet>
                <Route path="/" component={Page}></Route>
              </IonRouterOutlet>
            </IonReactRouter>
          </IonApp>
        );
      };
    });

    it('should be visible', () => {

      const MyPage = () => {
        return (
          <IonPage className="ion-page-invisible">
            <div>hello</div>
          </IonPage>
        );
      };

      const { container } = render(<IonTestApp Page={MyPage} />);
      const page = container.getElementsByClassName('ion-page')[0];
      expect(page).not.toHaveClass('ion-page-invisible');
      expect(page).toHaveStyle('z-index: 101')

    });

    it('should fire initial lifecycle events', () => {
      const ionViewWillEnterListener = jest.fn();
      const ionViewDidEnterListener = jest.fn();

      const MyPage = () => {
        const ref = useRef<HTMLDivElement>();

        useEffect(() => {
          ref.current.addEventListener('ionViewWillEnter', ionViewWillEnterListener);
          ref.current.addEventListener('ionViewDidEnter', ionViewDidEnterListener);
        }, []);

        return (
          <IonPage ref={ref}>
            <div>hello</div>
          </IonPage>
        );
      };


      render(<IonTestApp Page={MyPage} />);
      expect(ionViewWillEnterListener).toHaveBeenCalledTimes(1);
      expect(ionViewDidEnterListener).toHaveBeenCalledTimes(1);

    });

  });


});;