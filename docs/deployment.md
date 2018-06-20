# Deployment

To build your app for production, run `ueno-starter build`. This will set `NODE_ENV=production` for you. To run the app after it's built, use `ueno-starter start`.

A typical `package.json` with these commands will look something like this:

```json
{
  "scripts": {
    "start": "ueno-starter start",
    "build": "ueno-starter build"
  }
}
```

## Static Deployment

Next.js supports the creation of static sites. Each page in the `pages/` folder will be rendered once, using the data from `getInitialProps()` on each page if applicable.

To create a static site, run `ueno-starter build`, and then `ueno-starter export`. An `out/` folder will be created containing the static HTML.

Keep in mind that, if you plan on creating a static site, you can't depend on any of the features of the Express server. It can't be deployed standalone, as it's designed to serve Next.js pages.
