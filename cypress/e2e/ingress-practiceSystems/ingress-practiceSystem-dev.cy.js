/// <reference types="cypress" />

// using 'password secret' approach
describe.only('Given ingress practice system api', () => {
  // getting token
  beforeEach(() => {
    const username = Cypress.env('username')
    const password = Cypress.env('password')
    const client_id = Cypress.env('client_id')
    const client_secret = Cypress.env('client_secret')
    const tokenBaseUrl = Cypress.env('tokenBaseUrl')

    expect(username, 'username was set').to.be.a('string').and.not.be.empty
    expect(password, 'password was set').to.be.a('string').and.not.be.empty
    expect(client_id, 'client_id was set').to.be.a('string').and.not.be.empty
    expect(client_secret, 'client_secret was set').to.be.a('string').and.not.be.empty
    expect(tokenBaseUrl, 'client_secret was set').to.be.a('string').and.not.be.empty

    cy.request({
      method: 'POST',
      url: `${tokenBaseUrl}/oauth/token`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: {
        grant_type: "client_credentials",
        username: username,
        password: password,
        client_id: client_id,
        client_secret: client_secret,
        response_type: "token"
      }
    })
      .then((response) => {
        expect(response.status).eq(200)
        expect(response.body.access_token).not.empty
        expect(response.body.token_type).eq("bearer")
        expect(response.body.scope).contain("ingress-connector")

        Cypress.env('access_token', JSON.stringify(response.body.access_token))
      });
  })
    context('When I send POST /ingress/ingressPracticeSystems', () => {
      it('Then practice systems should be successfully ingressed', () => {
        const ingressBaseUrl = Cypress.env('ingressBaseUrl')
        const access_token = JSON.parse(Cypress.env('access_token'))
          cy.request({
            method: 'POST',
            url: `${ingressBaseUrl}/ingress/ingressPracticeSystems`,
            headers: { 'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${access_token}` },
            body: {
              "workspaceId": "lsc_core"
            }
          })
            .should((response) => {
              expect(response.status).eq(200)
              expect(response.body.value).contain("Successfully ingressed")
            });      
      });
    });
})
