import React, { useRef, useEffect } from 'react';
import { IonApp, IonRouterOutlet, IonPage } from '@ionic/react';
import { IonReactMemoryRouter } from '../ReactRouter/IonReactMemoryRouter';
import { render, waitForElement } from '@testing-library/react';
import { Route } from 'react-router';
// import {Router} from '../Router';
import { MemoryHistory, createMemoryHistory } from 'history';

describe('Router', () => {
  // This test fails because the ion-router-outlet web component (from core)
  // isn't supported in JSDOM, so it never registers
  // TODO: figure out why they are failing on new router code when they worked before
  describe('on first page render', () => {
    let history: MemoryHistory;

    let IonTestApp: React.ComponentType<any>;

    beforeEach(() => {
      history = createMemoryHistory();
      IonTestApp = ({ Page }) => {
        return (
          <IonApp>
            <IonReactMemoryRouter history={history}>
              {/* <IonRouterOutlet> */}
              <Route path="/" component={Page} exact />
              {/* </IonRouterOutlet> */}
            </IonReactMemoryRouter>
          </IonApp>
        );
      };
    });

    it.skip('should be visible', () => {
      const MyPage = () => {
        return (
          <IonPage className="ion-page-invisible">
            <div>hello</div>
          </IonPage>
        );
      };

      const { container } = render(<IonTestApp Page={MyPage} />);
      console.log(container.outerHTML);
      const page = container.getElementsByClassName('ion-page')[0];
      expect(page).not.toHaveClass('ion-page-invisible');
      expect(page).toHaveStyle('z-index: 101');
    });

    it.skip('should fire initial lifecycle events', async () => {
      const ionViewWillEnterListener = jest.fn();
      const ionViewDidEnterListener = jest.fn();

      const MyPage = () => {
        const ref = useRef<HTMLDivElement>();

        useEffect(() => {
          ref.current.addEventListener('ionViewWillEnter', ionViewWillEnterListener);
          ref.current.addEventListener('ionViewDidEnter', ionViewDidEnterListener);
        }, []);

        return (
          <IonPage data-testid="mypage" ref={ref}>
            <div>hello</div>
          </IonPage>
        );
      };

      render(<IonTestApp Page={MyPage} />);
      expect(ionViewWillEnterListener).toHaveBeenCalledTimes(1);
      expect(ionViewDidEnterListener).toHaveBeenCalledTimes(1);
    });
  });
});
