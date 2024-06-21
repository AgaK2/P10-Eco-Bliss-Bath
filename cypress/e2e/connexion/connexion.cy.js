describe("Test-Connection", () => {
    it("Website login", () => {
        cy.visit("http://localhost:8080/#/")
        cy.getBySel("nav-link-login").click()
        cy.getBySel("login-input-username").type("test2@test.fr")
        cy.getBySel("login-input-password").type("testtest")
        cy.getBySel("login-submit").click()
        cy.getBySel("nav-link-cart").should("be.visible")
    })
})