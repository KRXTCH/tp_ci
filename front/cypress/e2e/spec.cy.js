const baseUrl = 'http://localhost:80';
const mongoUrl = `${baseUrl}/#mongo`;
const mysqlUrl = `${baseUrl}/#mysql`;

const urls = [mongoUrl, mysqlUrl];

describe('App', () => {
  it("should display home page", () => {
    cy.visit(baseUrl);
    cy.contains('Welcome !');
    cy.contains("You can accessed to both backend by '#/mongo' or '#/mysql'");
  });

  it("should display UserManager page on both backends", () => {
    urls.forEach((url) => {
      cy.visit(url);
      cy.contains('User manager');
    });
  });
});

describe('UserManagers', () => {
  urls.forEach((url) => {
    describe(url, () => {
      it("should create a user successfuly", () => {
        cy.visit(url);
        
        cy.intercept('POST', '/users').as('createUser');
    
        cy.get('#birthDate').type('1001-09-07');
        cy.get('#surname').type('Doe');
        cy.get('#name').type('John');
        cy.get('#email').type('john.doe@example.com');
        cy.get('#city').type('New York');
        cy.get('#postalCode').type('10001');
        cy.get('button').contains('Submit').click();
    
        cy.wait('@createUser').then((interception) => {
          expect(interception.response.statusCode).to.equal(201);
          cy.contains('Formulaire soumis avec succès !');
        });
      });
    
      it("should failed when create a user", () => {
        cy.visit(url);
        
        cy.intercept('POST', '/users', {
          statusCode: 500
        }).as('createUser');
    
        cy.get('#birthDate').type('1001-09-07');
        cy.get('#surname').type('Doe');
        cy.get('#name').type('John');
        cy.get('#email').type('john.doe@example.com');
        cy.get('#city').type('New York');
        cy.get('#postalCode').type('10001');
        cy.get('button').contains('Submit').click();
    
        cy.wait('@createUser').then((interception) => {
          expect(interception.response.statusCode).to.equal(500);
          cy.contains(`Erreur lors de l'envoie du formulaire.`);
        });
      });
  
      it("should display error toast when form is invalid", () => {
        cy.visit(url);
    
        cy.get('#birthDate').type('invalid-date');
        cy.get('#surname').type('Doe');
        cy.get('#name').type('John');
        cy.get('#email').type('john.doe@example.com');
        cy.get('#city').type('New York');
        cy.get('#postalCode').type('10001');
        cy.get('button').contains('Submit').click();
        
        cy.contains('Veuillez remplir correctement tous les champs du formulaire.');
      });
  
      it("should display delete modal on click delete user button", () => {
        cy.visit(url);
  
        cy.get('.modal').should('not.exist');
        cy.get('button').contains('Delete').first().click();
        cy.get('.modal').should('be.visible');
      });
  
      it("should hide modal on click Cancel button", () => {
        cy.visit(url);
  
        cy.get('.modal').should('not.exist');
        cy.get('button').contains('Delete').first().click();
        cy.get('.modal').should('be.visible');
  
        cy.get('button').contains('Cancel').first().click();
        cy.get('.modal').should('not.exist');
      });
  
      it("should display success toats when delete a user", () => {
        cy.intercept('DELETE', '/users/*', "Utilisateur supprimé avec succès !").as('deleteUser');
  
        cy.visit(url);
  
        cy.get('.modal').should('not.exist');
        cy.get('button').contains('Delete').first().click();
        cy.get('.modal').should('be.visible');
  
        cy.get('#delete-password').type('delete');
        cy.get('button').contains('Confirm').first().click();
  
        cy.wait('@deleteUser').then((interception) => {
          expect(interception.response.statusCode).to.equal(200);
          cy.contains(`Utilisateur supprimé avec succès !`);
        });
      });
  
      it("should display error toast when delete a user", () => {
        cy.intercept('DELETE', '/users/*', {
          statusCode: 500
        }).as('deleteUser');
  
        cy.visit(url);
  
        cy.get('.modal').should('not.exist');
        cy.get('button').contains('Delete').first().click();
        cy.get('.modal').should('be.visible');
  
        cy.get('#delete-password').type('delete');
        cy.get('button').contains('Confirm').first().click();
  
        cy.wait('@deleteUser').then((interception) => {
          expect(interception.response.statusCode).to.equal(500);
          cy.contains(`Une erreur est survenue lors de la suppression.`);
        });
      });

      it("should display wrong password error toast when delete a user with a wrong password", () => {
        cy.intercept('DELETE', '/users/*', {
          statusCode: 401
        }).as('deleteUser');
  
        cy.visit(url);
  
        cy.get('.modal').should('not.exist');
        cy.get('button').contains('Delete').first().click();
        cy.get('.modal').should('be.visible');
  
        cy.get('#delete-password').type('incorrect');
        cy.get('button').contains('Confirm').first().click();
  
        cy.wait('@deleteUser').then((interception) => {
          expect(interception.response.statusCode).to.equal(401);
          cy.contains(`Le mot de passe que vous avez saisi(e) est incorrect.`);
        });
      });
    })
  });
});