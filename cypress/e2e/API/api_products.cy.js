describe("API-Checking the product card", () => {
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


  it("Should return the product card for a specified product ID", () => {
    cy.request({
      method: "GET",
      url: apiUrl + '/products/8',
      headers: {
        "Authorization": "Bearer " + token // Utilisez le token d'authentification dans les en-têtes
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      const productInfo = response.body
      expect(productInfo.id).to.eq(8);
      expect(productInfo.name).to.eq('Milkyway');
      expect(productInfo.skin).to.eq('Mature');
      expect(productInfo.aromas).to.eq('Lavande, rose');
      expect(productInfo.ingredients).to.eq('Huiles essentielles');
    })
  })
})