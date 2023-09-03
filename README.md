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


#### Unit test - with pretty web-UI
```
test:unit:ui
```
#### Unit test - Without any UI, fully in a terminal
```
test:unit:ci
```
#### Component test - via Playwright
```
test:component
```
#### E2E test - via Playwright
```
test:e2e
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
