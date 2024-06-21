
describe("Smoke Tests", () => {
    it("Checking the presence of fields and connection button", () => {
        cy.visit('http://localhost:8080/#/login')
        // Vérification si les champs et le bouton de connexion sont visibles
        cy.getBySel("login-input-username").should("be.visible")
        cy.getBySel("login-input-password").should("be.visible")
        cy.getBySel("login-submit").should("be.visible")
    })

    it("Checking the presence of the add to cart buttons when I'm connected", () => {
        //Se connecter au site Web
        cy.login() // Le code de la commande de connexion est dans le fichier commands.js
        //Accédez à la page produit et sélectionnez-en un
        cy.getBySel("nav-link-products").click()
        cy.getBySel("product-link").first().click()
        //Vérification si le bouton est visible
        cy.getBySel("detail-product-add").should("be.visible")
    })

    it("Checking the presence of the product availability field", () => {
        cy.visit("http://localhost:8080/#/products")
        cy.getBySel("product-link").first().click()
        //Vérification si le champ disponibilité du produit est visible
        cy.getBySel("detail-product-stock").should("be.visible")
    })
})