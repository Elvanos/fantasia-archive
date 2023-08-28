# Fantasia Archive (fantasia-archive)

A worldbuilding database manager

Use Yarn 1.22.19 or stuff is gonna bug out.

Make sure you are running this with Node v16.17.0 ("nvm" is great for these older versions)

## Install Quasar CLI for smoothest experience
##### Details found here: https://quasar.dev/start/quasar-cli

##### Ensure that the Yarn global install location is in your PATH after install. (details in article linked above)

```
yarn global add @quasar/cli
```

## Install the dependencies and set up the project
```
yarn
```

### Start the app in Quasar development mode (hot-code reloading, error reporting, etc.)
```
quasar dev -m electron
```

### Build the app for production
```
quasar build
```

### Testing:

> Keep in mind that Cypress tests are limited to front-end testing due to the nature of Electron's nodeJS-based backend. Anything in Electron's main and preload will NOT work.

#### Unit test - with pretty web-UI
```
test:unit:ui
```
#### Unit test - without any UI, fully in a terminal
```
test:unit:ci
```
#### Component test, Frontend - via Cypress, pick Electron on the config screen (I suggest turning on the electron dev window first, the test is a bit buggy sometimes)
```
test:component:frontend
```
#### E2E test, Froentend - via Cypress, pick Electron on the config screen (I suggest turning on the electron dev window first, the test is a bit buggy sometimes)
```
test:e2e:frontend
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
