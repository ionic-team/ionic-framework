describe('Angular Output Target', () => {
  beforeEach(() => {
    cy.visit('/output-target');
  });

  it('should emit one event per emission', () => {
    /**
     * Angular @Output() events aren't actual DOM events,
     * instead they are an "EventEmitter" (RxJS Subject)
     * that emits a change.
     *
     * In the Angular output target, we manually create
     * a RxJS Subject (EventEmitter) for each DOM event,
     * so that developers can use the same binding syntax
     * and have the expected behavior that Angular events
     * do not bubble up the DOM tree.
     *
     * We additionally "trick" Angular by creating
     * @Output decorated properties for each DOM event
     * on the component proxy class and manually clearing
     * the decorated metadata. This allows Angular to
     * not add its own event listener and cause duplicate
     * event emissions for the web component events.
     */
    cy.get('#ionChangeInput').type('a');
    cy.get('#ionChangeEmittedCount').should('have.text', '1');
  });
});
