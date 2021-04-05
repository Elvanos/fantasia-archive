# Fantasia archive (fantasiaarchive)

A database manager for world building

## Install the dependencies

```bash
npm install
```

- **IMPORTAN NOTE:** Due to issues with this package being written in somewhat older version of nodeJS, the script will fizzle out upon building due to wrong version of `.d.ts` file in one of the included NPM packages.
  - The proper replacement file can be found in `_typeFix/index.d.ts`
  - The faulty file can be found in `node_modules\builder-util\node_modules\@types\fs-extra\index.d.ts`
  - To fix this issue, simply copy the contents of the proper replacement over the buggy faulty file (or just replace its contents)
  - Once this is done, the build should run as normal without any issues

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
npm dev
```

### Build the app for production

```bash
npm build
```

### New object files go into

```
src\databaseManager\blueprints
```

### Document configuration details can be found in the following file

```
I_Blueprint.ts
```

### Customize the configuration

See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).
