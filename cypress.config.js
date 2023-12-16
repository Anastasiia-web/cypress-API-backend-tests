const { defineConfig } = require("cypress");

module.exports = defineConfig({
  env: {
    "username": "",
    "password": "",
    "client_id": "",
    "client_secret": "",
    "ingressBaseUrl": "",
    "tokenBaseUrl": ""
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
