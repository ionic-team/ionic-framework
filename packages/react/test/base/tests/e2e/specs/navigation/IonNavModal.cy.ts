describe('IonNav with IonModal', () => {
  beforeEach(() => {
    cy.visit('/navigation-modal');
  });

  // @see https://github.com/ionic-team/ionic-framework/issues/27843
  it('should fire click handlers inside a modal that lives in IonNav', () => {
    cy.get('#open-modal').click();
    cy.get('ion-modal').should('be.visible');

    cy.get('#increment-button').click();
    cy.get('#increment-button').click();

    cy.get('#page-click-count').should('have.text', '2');
  });

  // @see https://github.com/ionic-team/ionic-framework/issues/27843
  it('should fire input change handlers inside a modal that lives in IonNav', () => {
    cy.get('#open-modal').click();
    cy.get('ion-modal').should('be.visible');

    cy.get('#text-input').type('hello');

    cy.get('#page-input-value').should('have.text', 'hello');
  });

  // @see https://github.com/ionic-team/ionic-framework/issues/27843
  it('should dismiss the modal via a click handler inside it', () => {
    cy.get('#open-modal').click();
    cy.get('ion-modal').should('be.visible');

    cy.get('#close-modal').click();
    cy.get('ion-modal').should('not.be.visible');
  });
});
