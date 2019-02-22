import React, { SFC, ReactElement } from 'react';
import { Route, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render, cleanup } from 'react-testing-library';
import { IonRouterOutlet } from '../navigation/IonRouterOutlet';

afterEach(cleanup)

function createReactPage(text: string) {
  const ReactPage: SFC = () => <span>{text}</span>;
  return ReactPage;
}

function renderWithRouter(
  ui: ReactElement<any>,
  {
    route = '/',
    history = createMemoryHistory({ initialEntries: [route] }),
  } = {}
) {
  return {
    ...render(<Router history={history}>{ui}</Router>),
    history
  }
}

test('landing on a bad page', () => {
  const { container } = renderWithRouter(
  <IonRouterOutlet>
    <Route path="/:tab(schedule)" component={createReactPage('Schedule Home')} exact={true} />
    <Route path="/:tab(speakers)" component={createReactPage('Speakers Home')} exact={true} />
    <Route path="/:tab(speakers)/speaker/:id" component={createReactPage('Speaker Detail')} />
    <Route path="/:tab(schedule|speakers)/sessions/:id" component={createReactPage('Session Detail')} />
  </IonRouterOutlet>
  , {
    route: '/schedule',
  });

  expect(container.innerHTML).toContain('<ion-router-outlet><div class="ion-page"><span>Schedule Home</span></div></ion-router-outlet>');
})
