# Fantasia archive (fantasiaarchive)

A database manager for world building

## Install the dependencies

```bash
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
npm dev
```

### Build the app for production

```bash
npm build
```

### Lint the files (installing ES-lint for insta-checking recommended)

```bash
npm run lint
```

### New object files go into

```
src\databaseManager\blueprints
```

Do not forget to add default export to the newly created files, the program will auto-load all files in the directory that way.

### Document configuration details can be found in the following file

```
I_Blueprint.ts
```

### Customize the configuration

See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).
