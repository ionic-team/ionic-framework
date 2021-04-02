describe('item: inputs', () => {
  beforeEach(() => {
    cy.visit('components/item/test/inputs?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-item').should('have.class', 'hydrated');

    // cy.screenshot();
  });

  it('should check form', () => {
    cy.get('[data-cy="submit"]').click();
    checkFormResult('{"date":"","select":"n64","toggle":"","input":"","input2":"","checkbox":"","range":"10"}');

    // cy.screenshot();
  });

  it('should disable inputs', () => {
    cy.get('[data-cy="toggle-disabled"]').click();
    cy.get('[data-cy="submit"]').click();
    checkFormResult('{}');

    // cy.screenshot();
  });

  it('should enable and set values', () => {
    // disable
    cy.get('[data-cy="toggle-disabled"]').click();

    // enable
    cy.get('[data-cy="toggle-disabled"]').click();

    // set some values
    cy.get('[data-cy="set-some-value"]').click();
    cy.get('[data-cy="submit"]').click();

    checkFormResult('{"date":"2016-12-09","select":"nes","toggle":"on","input":"Some text","input2":"Some text","checkbox":"on","range":"20"}');

    // cy.screenshot();
  });

  it('should set to null', () => {
    cy.get('[data-cy="set-null-value"]').click();

    // cy.screenshot();
  });

  it('should set to empty', () => {
    cy.get('[data-cy="set-empty-value"]').click();

    // cy.screenshot();
  });

  it('should set to undefined', () => {
    cy.get('[data-cy="set-undefined-value"]').click();

    // cy.screenshot();
  });

  it('should test multiple', () => {
    cy.get('[data-cy="checkbox-start"]').click();
    cy.get('[data-cy="datetime-end"]').click();

    // cy.screenshot();
  });

  it('should change button color to red', () => {
    cy.get('#button-end').click();

    // cy.screenshot();
  });
});

const checkFormResult = (content: string) => {
  cy.get('#form-result').contains(content);
};
