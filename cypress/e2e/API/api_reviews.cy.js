describe("API-Checking the review", () => {
  let token;
  const apiUrl = `${Cypress.env("apiUrl")}`

  before(() => {
    cy.request("POST", apiUrl + "/login", {
      "username": "test2@test.fr",
      "password": "testtest"
    }).then((response) => {
      token = response.body.token;
      // Stockez le token dans la variable
    })
  })


  it("Should add a review", () => {
    cy.request({
      method: "POST",
      url: apiUrl + '/reviews',
      headers: {
        "Authorization": "Bearer " + token // Utilisez le token d'authentification dans les en-têtes
      },
      body: {
        title: 'TEST-Bon produit',
        comment: 'TEST-Je recommande vivement, qualité et service au top !',
        rating: 5
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('id');
      expect(response.body.title).to.eq('TEST-Bon produit')
      expect(response.body.comment).to.eq('TEST-Je recommande vivement, qualité et service au top !')
      expect(response.body.rating).to.eq(5)
    })
  })
})