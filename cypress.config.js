const { defineConfig } = require('cypress')
require('dotenv').config({ path: './.env.local' })

module.exports = defineConfig({
  projectId: "hjgm2f",
  allowCypressEnv: false,
  watchForFileChanges: false,
  viewportWidth: 1920,
  viewportHeight: 1080,
  e2e: {
    specPattern: 'tests/cypress/e2e/**/*.cy.js',
    supportFile: 'tests/cypress/support/e2e.js', 
    fixturesFolder: 'tests/cypress/fixtures',
    expose: {
      baseUrl: process.env.TEST_BASE_URL,
      userEmail: process.env.TEST_USER_EMAIL,
      userPassword: process.env.TEST_USER_PASSWORD,
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
