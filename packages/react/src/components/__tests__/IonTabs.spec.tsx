import React from 'react';
import { IonTabs, IonTabButton, IonLabel, IonIcon, IonTabBar } from '../index';
import { render, cleanup } from '@testing-library/react';
import { IonRouterOutlet } from '../IonRouterOutlet';

afterEach(cleanup);

describe('IonTabs', () => {
  test('should render happy path', () => {
    const { container } = render(
      <IonTabs>
        <IonRouterOutlet></IonRouterOutlet>
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
    expect(Array.from(container.children[0].children[1].children).map((c) => c.tagName)).toEqual([
      'ION-TAB-BUTTON',
      'ION-TAB-BUTTON',
      'ION-TAB-BUTTON',
      'ION-TAB-BUTTON',
    ]);
  });

  test('should allow for conditional children', () => {
    const { container } = render(
      <IonTabs>
        <IonRouterOutlet></IonRouterOutlet>
        <IonTabBar slot="bottom">
          {false && (
            <IonTabButton tab="schedule">
              <IonLabel>Schedule</IonLabel>
              <IonIcon name="schedule"></IonIcon>
            </IonTabButton>
          )}
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
    expect(Array.from(container.children[0].children[1].children).map((c) => c.tagName)).toEqual([
      'ION-TAB-BUTTON',
      'ION-TAB-BUTTON',
      'ION-TAB-BUTTON',
    ]);
  });
});
