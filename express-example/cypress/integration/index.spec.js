describe('index page tests', () => {
  it('visits the index page', () => {
    cy.visit('/');
  });

  it('finds class with on treatment', function() {
    cy.get('.my_feature-on').should('exist');
    cy.get('.my_feature-off').should('not.exist');
  });
  
  it('visits page with my_feature off', function () {
    cy.setCookie('splitTreatment', 'my_feature=off')
    cy.visit('/')
  });
  
  it('finds class with off treatment', function() {
    cy.get('.my_feature-off').should('exist');
    cy.get('.my_feature-on').should('not.exist');
  });
});
