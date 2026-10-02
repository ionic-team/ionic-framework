jest.mock('../../IonRouterOutlet', () => ({
  IonRouterOutlet: () => null,
}));
jest.mock('../../components', () => ({
  IonTab: () => null,
}));
jest.mock('../../inner-proxies', () => ({
  IonTabsInner: () => null,
}));
jest.mock('../../../routing/PageManager', () => ({
  __esModule: true,
  default: () => null,
}));

import { render } from '@testing-library/react';
import { Fragment } from 'react';

import { IonRouterOutlet } from '../../IonRouterOutlet';
import { IonTabs } from '../IonTabs';

describe('IonTabs', () => {
  it('handles a single router outlet inside a fragment', () => {
    expect(() =>
      render(
        <IonTabs>
          <Fragment>
            <IonRouterOutlet />
          </Fragment>
        </IonTabs>
      )
    ).not.toThrow();
  });
});
