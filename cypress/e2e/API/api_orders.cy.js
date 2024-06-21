describe("API-Checking the error before logging", () => {
  const apiUrl = `${Cypress.env("apiUrl")}`

  it("Before logging - to check if an error occurred", () => {
    cy.request({
      method: "GET",
      url: apiUrl + "/orders",
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(403) // Le statut 403 signifie que l'accès à la ressource demandée est refusé
    })
  })
})


describe("API-Checking the basket", () => {
  let token
  const apiUrl = `${Cypress.env("apiUrl")}`

  // Connexion d'abord au site Web
  before(() => {
    cy.request("POST", apiUrl + "/login", {
      "username": "test2@test.fr",
      "password": "testtest"
    }).then((response) => {
      token = response.body.token;
      // Stockez le token dans la variable
    })
  })

  // Vérification de l'affichage de la liste des produits inclus dans le panier.
  it("Checking if there are products in the basket", () => {
    cy.request({
      method: "GET",
      url: apiUrl + "/orders",
      headers: {
        "Authorization": "Bearer " + token // Utilisez le token d'authentification dans les en-têtes
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.orderLines).to.have.lengthOf.above(0) // Vérifier si le tableau "orderLines" contient des éléments
    })
  })


  // Ajouter un produit disponible au panier (méthode PUT)
  it("Should add an available product to basket (method PUT)", () => {
    cy.request({
      method: "PUT",
      url: apiUrl + "/orders/add",
      headers: {
        "Authorization": "Bearer " + token // Utilisez le token
      },
      body: {
        product: 6, // ID du produit disponible 
        quantity: 1
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
    })
  })

  // Ajouter un produit disponible au panier (méthode POST)
  it("Should add an available product to basket (method POST)", () => {
    cy.request({
      method: "POST",   // La documentation de l'API inclut la méthode PUT
      url: apiUrl + "/orders/add",
      headers: {
        "Authorization": "Bearer " + token // Utilisez le token
      },
      body: {
        product: 6, // ID du produit disponible 
        quantity: 1
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(405)
    })
  })

  // Ajouter un produit en rupture de stock (méthode PUT)
  it("Add an out of stock product (method PUT)", () => {
    cy.request({
      method: 'PUT',
      url: apiUrl + "/orders/add",
      headers: {
        "Authorization": "Bearer " + token
      },
      body: {
        product: 3, // ID du produit indisponible 
        quantity: 1
      }
    })
      .then((response) => {
        expect(response.status).to.eq(200)
      })
  })

  // Ajouter un produit en rupture de stock (méthode POST)
  it("Add an out of stock product (method POST)", () => {
    cy.request({
      method: 'POST', // La documentation de l'API inclut la méthode PUT
      url: apiUrl + "/orders/add",
      headers: {
        "Authorization": "Bearer " + token
      },
      body: {
        product: 3, // ID du produit indisponible 
        quantity: 1
      },
      failOnStatusCode: false
    })
      .then((response) => {
        expect(response.status).to.eq(405) // Le statut 405 signifie que le serveur ne prend pas en charge la méthode de requête HTTP utilisée
      })
  })
})