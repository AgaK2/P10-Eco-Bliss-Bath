describe("Checking the operation of the shopping cart", () => {

    // Connexion au site Web
    beforeEach("Website login", () => {
        cy.login() // Le code de la commande de connexion est dans le fichier commands.js
    })


    it("Checking if the product has been added to the cart (stock greater than 1; verification of the reduction the stock)", () => {
        // Vider le panier s'il n'est pas vide
        cy.clearCartIfNotEmpty()

        // Cliquez sur un des produits
        cy.getBySel("nav-link-products").click()
        cy.getBySel("product-link").last().click()
        cy.getBySel("detail-product-name")
            .invoke('text')

        cy.getBySel("detail-product-stock")
            .invoke('text')
            .should((text) => {
                // Extraire le nombre de la chaîne de caractères
                const match = text.match(/(-?\d+) en stock/)
                const stockNr = parseInt(match[1], 10) // Conversion en entier à l'aide de la méthode parseInt
                expect(stockNr).to.be.gte(1) // Vérifiez que le stock est supérieur à 1 pour pouvoir être ajouté
            })
            .then((text) => {
                const stockText = text.trim();
                const stockNr = parseInt(stockText.match(/\d+/))
                cy.log(`Stock: ${stockNr}`)

                cy.getBySel("detail-product-add").click() // Cliquez sur "Ajouter au panier"
                cy.getBySel("nav-link-cart").click()
                cy.getBySel("cart-line-name").should("be.visible") // Vérifier s'il y a des produits dans le panier
                cy.go('back') // Retour à la page produit 

                // Vérifier si le niveau de stock a été réduit
                const newStock = stockNr - 1
                cy.getBySel("detail-product-stock")
                    .invoke('text')
                    .should('match', new RegExp(`^${newStock} en stock$`))
            })
    })

    it("Checking the limits - enter a negative number", () => {
        // Vider le panier
        cy.clearCart()
        // Sélectionner un produit
        cy.getBySel("nav-link-products").click()
        cy.getBySel("product-link").eq(5).click()
        cy.getBySel("detail-product-quantity").click()
        cy.getBySel("detail-product-quantity").clear()
        // Définir un numéro de produit négatif
        cy.getBySel("detail-product-quantity").type("-2")
        cy.getBySel("detail-product-add").click()
        cy.getBySel("nav-link-cart").click()
        // Vérifier si le panier est vide
        cy.getBySel("cart-empty").should("be.visible")
    })

    it("Checking the limits - enter a number greater than 20", () => {
        // Sélectionner un produit
        cy.getBySel("nav-link-products").click()
        cy.getBySel("product-link").eq(6).click()
        cy.getBySel("detail-product-quantity").click()
        cy.getBySel("detail-product-quantity").clear()
        // Définir le numéro de produit supérieur à 20
        cy.getBySel("detail-product-quantity").type("21")
        cy.getBySel("detail-product-add").click()
        cy.getBySel("nav-link-cart").click()
        // vérifier si le panier ne contient pas de produit
        cy.getBySel("cart-line-name").should("not.contain", "Mousse de rêve")
    })
})


describe("Checking cart contents via API ", () => {
    let token
    let orderLines

    it("Adding a product to the cart", () => {
        // Connexion au site Web
        cy.login()

        // Vider le panier s'il n'est pas vide
        cy.clearCartIfNotEmpty()

        // Sélectionner un produit
        cy.getBySel("nav-link-products").click()
        cy.getBySel("product-link").eq(4).click()
        cy.getBySel("detail-product-quantity").click()
        cy.getBySel("detail-product-quantity").clear()
        cy.getBySel("detail-product-quantity").type("1")
        cy.getBySel("detail-product-add").click()
        cy.getBySel("nav-link-cart").click()
        cy.getBySel("cart-line-name").should("be.visible").contains("Extrait de nature")
    })


    it('Login to check if the product is in the cart via API', () => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:8081/login',
            body: {
                username: 'test2@test.fr',
                password: 'testtest'
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('token');

            token = response.body.token;
        })
    })

    //On vérifie le contenu du panier via l'API
    it('Checking if the product is in the cart via API', () => {
        cy.request({
            method: 'GET',
            url: 'http://localhost:8081/orders',
            headers: {
                Authorization: `Bearer ${token}`
            },

        }).then((response) => {
            expect(response.status).to.eq(200);
            orderLines = response.body.orderLines
            orderLines.forEach((orderLine) => {
                if (orderLine.product.id === 7) {
                    // Vérification si la quantité de produit avec l'identifiant 7 est 1
                    expect(orderLine.quantity).to.be.equal(1)
                } else {
                    throw new Error('Product with id 7 not found in the cart');
                }
            })
        })
    })
})