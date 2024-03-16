describe('IonModal', () => {
  beforeEach(() => {
    cy.visit('/overlay-components/modal');
  });

  it('display modal', () => {
    //show modal
    cy.get('ion-button').contains('Show Modal').click();
    cy.get('ion-modal ion-title').contains('My Modal');

    //increment count
    cy.get('ion-button').contains('Increment Count').click();
    cy.get('ion-button').contains('Increment Count').click();
    cy.get('ion-modal').contains('Count in modal: 2');

    //close modal
    cy.get('ion-button').contains('Close').click();

    //verify count on main page was updated
    cy.contains('Count: 2');
  });

  it('display modal and call dismiss to close it', () => {
    //show modal
    cy.get('ion-button').contains('Show Modal, hide after 250 ms').click();
    cy.get('ion-modal ion-title').contains('My Modal');
  });

  it('display modal with context', () => {
    //show modal
    cy.get('ion-button').contains('Show Modal with Context').click();

    //verify context value is overriden value
    cy.get('ion-modal div').contains('overriden value')
  });
});

describe('IonModal: conditional rendering', () => {

  // Issue: https://github.com/ionic-team/ionic-framework/issues/25590
  it('should push a new IonCard when dismissed', () => {
    cy.visit('/overlay-components/modal-conditional-sibling');
    // Renders a card before and after the modal
    cy.get('ion-card').should('have.length', 2);

    cy.get('ion-button').click();

    cy.get('ion-card').should('have.length', 4);
  });

  // Issue: https://github.com/ionic-team/ionic-framework/issues/25590
  it('should be conditionally rendered', () => {
    cy.visit('/overlay-components/modal-conditional');

    cy.get('ion-modal').should('not.exist');
    cy.get('ion-button#renderModalBtn').click();

    cy.get('ion-modal').should('be.visible');

    cy.get('ion-button#dismissModalBtn').click();
    cy.get('ion-button#renderModalBtn').should('be.visible');
  });

  it('should display an inline modal within a modal', () => {
    cy.visit('/overlay-components/modal-datetime-button');

    cy.get('ion-modal').should('not.exist');
    cy.get('ion-button#renderModalBtn').click();

    cy.get('ion-modal').should('be.visible');

    cy.get('ion-datetime-button').click();

    cy.get('ion-modal#datetimeModal').should('be.visible');
    cy.get('ion-datetime').should('be.visible');
  });

});

describe('IonModal: multiple children', () => {
  it('should render a root .ion-page when passed multiple children', () => {
    cy.visit('/overlay-components/modal-multiple-children');

    cy.get('ion-button#show-modal').click();

    cy.get('ion-modal').should('be.visible');

    cy.get('ion-modal .ion-page').should('have.length', 1);
    cy.get('ion-modal .ion-page .child-content').should('have.length', 2);
  });
});
