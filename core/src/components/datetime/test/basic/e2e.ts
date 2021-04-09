describe('datetime: basic', () => {
  beforeEach(() => {
    cy.visit('components/datetime/test/basic?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-datetime').should('have.class', 'hydrated');

    // cy.screenshot();
  });

  it('should open the custom picker', () => {
    cy.get('#customPickerOptions').click();

    cy.get('ion-picker').should('be.visible');

    // cy.screenshot();
  });
});

describe('datetime: basic, rtl', () => {
  beforeEach(() => {
    cy.visit('components/datetime/test/basic?ionic:_testing=true&rtl=true');
  })

  it('should render', () => {
    cy.get('ion-datetime').should('have.class', 'hydrated');

    // cy.screenshot();
  });

  it('should open the custom picker', () => {
    cy.get('#customPickerOptions').click();

    cy.get('ion-picker').should('be.visible');

    // cy.screenshot();
  });
});
