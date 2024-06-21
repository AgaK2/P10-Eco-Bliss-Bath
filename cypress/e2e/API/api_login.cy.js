describe("API-Login checking", () => {
    const apiUrl = `${Cypress.env("apiUrl")}`

    it("Correct login to the website", () => {
        cy.request("POST", apiUrl + "/login", {
            "username": "test2@test.fr",
            "password": "testtest"
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('token') // Token devrait apparaître dans la réponse
        })
    })

    it("Incorrect login to the website", () => {
        cy.request({
            method: "POST",
            url: apiUrl + "/login",
            body: {
                username: "test2test.fr",
                password: "test123"
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401);
        })
    })
})