describe('Slides', () => {
  beforeEach(() => {
    cy.visit('/slides');
    cy.wait(30);
  })

  it('should change index on slide change', () => {
    cy.get('ion-slide').should('have.length', 0);

    cy.get('#add-slides').click();

    cy.get('ion-slide').should('have.length', 3);

    // Should be on the first slide
    checkIndex('0');

    // Swipe to the second slide
    nextSlide();
    checkIndex('1');

    // Swipe to the third slide
    nextSlide();
    checkIndex('2');

    // Go back to the second slide
    prevSlide();
    checkIndex('1');
  });
});

function checkIndex(index) {
  cy.get('#slide-index').should('have.text', index);
  cy.get('#slide-index-2').should('have.text', index);
}

function nextSlide() {
  cy.get('#btn-next').click();
  cy.wait(800);
}

function prevSlide() {
  cy.get('#btn-prev').click();
  cy.wait(800);
}
