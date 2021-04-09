describe('Virtual Scroll', () => {
  beforeEach(() => {
    cy.visit('/virtual-scroll');
    cy.wait(30);
  })

  it('should open virtual-scroll', () => {
    cy.document().then((doc) => {
      const virtualElements = doc.querySelectorAll('ion-virtual-scroll > *');
      expect(virtualElements.length).to.be.greaterThan(0);
    });
  });
});

