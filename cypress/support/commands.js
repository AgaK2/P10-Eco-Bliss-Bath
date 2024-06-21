Cypress.Commands.add("getBySel", (selector, ...args) => {
  return cy.get(`[data-cy=${selector}]`, ...args)
})

// Commande de connexion
Cypress.Commands.add("login", () => {
  cy.visit("http://localhost:8080/#/")
  cy.getBySel("nav-link-login").click()
  cy.getBySel("login-input-username").type("test2@test.fr")
  cy.getBySel("login-input-password").type("testtest")
  cy.getBySel("login-submit").click()
  cy.getBySel("nav-link-cart").should('be.visible')
})

// Commande pour vider le panier
Cypress.Commands.add("clearCart", () => {
  cy.getBySel("nav-link-cart").click()
  cy.getBySel("cart-line-delete").click({ multiple: true })
  cy.getBySel("cart-empty").should("be.visible")
})

// Commande pour vider le panier s'il n'est pas vide
 Cypress.Commands.add("clearCartIfNotEmpty", () => {
   cy.getBySel("nav-link-cart").click()
   cy.getBySel("cart-line").then(($cartLines) => {
     if ($cartLines.length > 0) {
       cy.getBySel("cart-line-delete").click({ multiple: true })
     }else{
       cy.getBySel("cart-empty").should("be.visible")
     }
   })
   cy.getBySel("cart-empty").should("be.visible")
 })




// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })