# Fantasia Archive (fantasia-archive)

A worldbuilding database manager

Use Yarn 1.22.19 or stuff is gonna bug out.

Make sure you are running this with Node v16.17.0 ("nvm" is great for these older versions)

## Install the dependencies and set up the project
```bash
yarn
```

### Start the app in Quasar development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev -m electron
```

### Lint the files manually (you can do this, but like... use an plugin of some kind in your IDE please T_T)
```bash
yarn lint
```

### Build the app for production
```bash
quasar build
```

### Testing:

##### Unit test - with pretty web-UI
```bash
test:unit:ui
```
##### Unit test - without any UI, fully in a terminal
```bash
test:unit
```
##### Component test - via Cypress, pick Electron on the config screen (I suggest turning on the electron dev window first, the test is a bit buggy sometimes)
```bash
test:component
```
##### e2e test - via Cypress, pick Electron on the config screen (I suggest turning on the electron dev window first, the test is a bit buggy sometimes)
```bash
test:e2e
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
