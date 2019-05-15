import React, { ReactElement } from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history'
import { IonTabs, IonTab, IonTabBar, IonTabButton, IonLabel, IonIcon} from '../index';
import { render, cleanup } from 'react-testing-library';

afterEach(cleanup)

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

describe('IonTabs', () => {
  test('should render happy path', () => {
    const { container } = renderWithRouter(
      <IonTabs>
        <IonTab tab="schedule">Schedule Content</IonTab>
        <IonTab tab="speakers">Speakers Content</IonTab>
        <IonTab tab="map">Map Content</IonTab>
        <IonTab tab="about">About Content</IonTab>

        <IonTabBar slot="bottom">
          <IonTabButton tab="schedule">
            <IonLabel>Schedule</IonLabel>
            <IonIcon name="schedule"></IonIcon>
          </IonTabButton>
          <IonTabButton tab="speakers">
            <IonLabel>Speakers</IonLabel>
            <IonIcon name="speakers"></IonIcon>
          </IonTabButton>
          <IonTabButton tab="map">
            <IonLabel>Map</IonLabel>
            <IonIcon name="map"></IonIcon>
          </IonTabButton>
          <IonTabButton tab="about">
            <IonLabel>About</IonLabel>
            <IonIcon name="about"></IonIcon>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    );

    expect(container.children[0].children.length).toEqual(2);
    expect(container.children[0].children[0].tagName).toEqual('DIV');
    expect(container.children[0].children[0].className).toEqual('tabs-inner');

    expect(container.children[0].children[1].tagName).toEqual('ION-TAB-BAR');
    expect(container.children[0].children[1].children.length).toEqual(4);
    expect(Array.from(container.children[0].children[1].children).map(c => c.tagName)).toEqual(['ION-TAB-BUTTON', 'ION-TAB-BUTTON', 'ION-TAB-BUTTON', 'ION-TAB-BUTTON']);
  });

  test('should allow for conditional children', () => {
    const { container } = renderWithRouter(
      <IonTabs>
        {false &&
          <IonTab tab="schedule">Schedule Content</IonTab>
        }
        <IonTab tab="speakers">Speakers Content</IonTab>
        <IonTab tab="map">Map Content</IonTab>
        <IonTab tab="about">About Content</IonTab>

        <IonTabBar slot="bottom">
          {false &&
          <IonTabButton tab="schedule">
            <IonLabel>Schedule</IonLabel>
            <IonIcon name="schedule"></IonIcon>
          </IonTabButton>
          }
          <IonTabButton tab="speakers">
            <IonLabel>Speakers</IonLabel>
            <IonIcon name="speakers"></IonIcon>
          </IonTabButton>
          <IonTabButton tab="map">
            <IonLabel>Map</IonLabel>
            <IonIcon name="map"></IonIcon>
          </IonTabButton>
          <IonTabButton tab="about">
            <IonLabel>About</IonLabel>
            <IonIcon name="about"></IonIcon>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    );

    expect(container.children[0].children.length).toEqual(2);
    expect(container.children[0].children[0].tagName).toEqual('DIV');
    expect(container.children[0].children[0].className).toEqual('tabs-inner');

    expect(container.children[0].children[1].tagName).toEqual('ION-TAB-BAR');
    expect(container.children[0].children[1].children.length).toEqual(3);
    expect(Array.from(container.children[0].children[1].children).map(c => c.tagName)).toEqual(['ION-TAB-BUTTON', 'ION-TAB-BUTTON', 'ION-TAB-BUTTON']);
  });
});
