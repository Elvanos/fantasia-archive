# Fantasia Archive (fantasiaarchive)

A database manager for world building

# How to Install

## Install Node.JS

Simply install Node.JS for your system. You can get it straight from their site, or on Linux, install it through your package manager.

## Download the program

Click on the green code button above, and download the repository as a zip file. Extract the zip file and move the resulting fantasia-archive-master folder to your home directory.

## Install the dependencies

In the terminal, do the following:

```bash
cd fantasia-archive-master
npm install
```

## Optional: Start the app in development mode (hot-code reloading, error reporting, etc.)

If you don't know what's going on, skip this step.

```bash
npm run dev
```

## Build the app for production

Once again in the terminal, run the following:

```bash
npm run build
```

After it is complete, go to /dist/electron/Packaged and select the dmg or AppImage file there and run it. You have finished installing the program.

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
