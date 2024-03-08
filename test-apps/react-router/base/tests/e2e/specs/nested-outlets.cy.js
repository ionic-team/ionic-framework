const port = 3000;

describe('Nested Outlets', () => {
  /*
    This spec tests nested router outlets working properly
    and to be able to transition to/from one nested outlet.
    Utilizes `ionPage` prop on `IonRouterOutlet` to make the router outlet
    a target of the transition.
    Fixes bug https://github.com/ionic-team/ionic/issues/20597
  */

  it('/nested-outlet > First Page should be visible', () => {
    cy.visit(`http://localhost:${port}/nested-outlet`);
    cy.ionPageVisible('firstpage');
  });

  it('/nested-outlet > Go to second page Button click, Second Page should be visible', () => {
    cy.visit(`http://localhost:${port}/nested-outlet`);
    cy.ionPageVisible('firstpage');
    cy.ionNav('ion-button', 'Go to second page');
    cy.ionPageVisible('secondpage');
  });

  it('/nested-outlet > Go to second page Button click, Back with direction "back" Button click, FirstPage should be visible', () => {
    cy.visit(`http://localhost:${port}/nested-outlet`);
    cy.ionPageVisible('firstpage');
    cy.ionNav('ion-button', 'Go to second page');
    cy.ionPageVisible('secondpage');
    cy.ionNav('ion-button', 'Back with direction "back"');
    cy.ionPageVisible('firstpage');
  });

  it('/nested-outlet > Go to second page Button click, Back with direction "root" Button click, FirstPage should be visible', () => {
    cy.visit(`http://localhost:${port}/nested-outlet`);
    cy.ionPageVisible('firstpage');
    cy.ionNav('ion-button', 'Go to second page');
    cy.ionPageVisible('secondpage');
    cy.ionNav('ion-button', 'Back with direction "root"');
    cy.ionPageVisible('firstpage');
  });

  it('/nested-outlet/secondpage > Back with direction "root" Button click, FirstPage should be visible', () => {
    cy.visit(`http://localhost:${port}/nested-outlet/secondpage`);
    cy.ionPageVisible('secondpage');
    cy.ionNav('ion-button', 'Back with direction "root"');
    cy.ionPageVisible('firstpage');
  });
});

describe('Nested Outlets 2', () => {
  /*
  This spec tests another nested router outlets working properly
  and to be able to transition to/from one nested outlet.
  Utilizes `ionPage` prop on `IonRouterOutlet` to make the router outlet
  a target of the transition.
  This one uses a few more nested outlets.
  Note: There is a limitation when going back to the Home page from Welcome in
  that the transition doesn't do a backwards animation. This is because the top level
  outlet is transition from and to itself, therefore it can't animate.
  I think the same issue exists when going from a item page back to the list page.
  This should be fixable through configuring a less complicated route structure in the app.
  Fixes bug https://github.com/ionic-team/ionic/issues/20219
*/

  it('/nested-outlet2 > First Page should be visible', () => {
    cy.visit(`http://localhost:${port}/nested-outlet2`);
    cy.ionPageVisible('home');
  });

  it('/nested-outlet2 > Go to Welcome IonItem click > Welcome page should be visible', () => {
    cy.visit(`http://localhost:${port}/nested-outlet2`);
    cy.ionPageVisible('home');
    cy.ionNav('ion-item', 'Go to Welcome');
    cy.ionPageVisible('welcome');
  });

  it('/nested-outlet2 > Go to Welcome IonItem click > Go to list from Welcome IonItem click > List page should be visible', () => {
    cy.visit(`http://localhost:${port}/nested-outlet2`);
    cy.ionPageVisible('home');
    cy.ionNav('ion-item', 'Go to Welcome');
    cy.ionPageVisible('welcome');
    cy.ionNav('ion-item', 'Go to list from Welcome');
    cy.ionPageVisible('list');
  });

  it(`/nested-outlet2 >
    Go to Welcome IonItem click >
    Go to list from Welcome IonItem click >
    Item#1 IonItem Click >
    Item page should be visible
`, () => {
    cy.visit(`http://localhost:${port}/nested-outlet2`);
    cy.ionPageVisible('home');
    cy.ionNav('ion-item', 'Go to Welcome');
    cy.ionPageVisible('welcome');
    cy.ionNav('ion-item', 'Go to list from Welcome');
    cy.ionPageVisible('list');
    cy.ionNav('ion-item', 'Item #1');
    cy.ionPageVisible('item');
  });

  it(`/nested-outlet2 >
    Go to list from Home IonItem click >
    Item#1 IonItem Click >
    Item page should be visible >
    Back >
    List page should be visible
`, () => {
    cy.visit(`http://localhost:${port}/nested-outlet2`);
    cy.ionPageVisible('home');
    cy.ionNav('ion-item', 'Go to list from Home');
    cy.ionPageVisible('list');
    cy.ionNav('ion-item', 'Item #1');
    cy.ionPageVisible('item');
    cy.ionBackClick('item');
    cy.ionPageVisible('list');
});

  it(`/nested-outlet2 >
    Go to list from Home IonItem click >
    Item#1 IonItem Click >
    Item page should be visible >
    Back >
    List page should be visible
    Back >
    Home page should be visible
`, () => {
    cy.visit(`http://localhost:${port}/nested-outlet2`);
    cy.ionPageVisible('home');
    cy.ionNav('ion-item', 'Go to list from Home');
    cy.ionPageVisible('list');
    cy.ionNav('ion-item', 'Item #1');
    cy.ionPageVisible('item');
    cy.ionBackClick('item');
    cy.ionPageVisible('list');
    cy.ionBackClick('list');
    cy.ionPageVisible('home');
  });
});
