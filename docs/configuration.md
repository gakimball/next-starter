# Configuration

To tweak the starter kit, add a file called `app-config.js` at the root of your project that exports an object.

```
module.exports = {
  ueno: {
    enforceHttps: true,
  },
}
```

Next has some [configuration options](https://nextjs.org/docs#custom-configuration) that you can add here. There's also some specific to this starter kit, listed below. All of these options should be put inside a `ueno` property on the config object.

- `baseUrl`: base URL for the app. By default, this combines the `HOST` and `PORT` environment variables, or uses the `BASE_URL` environment variable if it exists.
- `csp`: extend the Content Security Policy. Each key should be a CSP category, and each value should be an array of things to whitelist.
- `enforceHttps`: redirect HTTP requests to HTTPS. If `true`, this is only enabled in production.
- `facebookPixel`: account ID for Facebook analytics.
- `gaId`: account ID for Google Analytics.
- `helmet`: react-helmet configuration.
- `notifier`: display errors or other logging info as OS notifications.
- `polyfillIO`: enables loading of browser polyfills through polyfill.io. Set to `null` to turn off.
  - `polyfillIO.url`: URL to fetch. Defaults to `//cdn.polyfill.io/v2/polyfill.min.js`.
  - `polyfillIO.features`: JavaScript features to polyfill. Defaults to `['default', 'es6']`.
- `remoteDevtools`: enable grid/MobX dev tools in production.
- `serviceWorker`: enables offline support through service workers.
- `twitterPixel`: account ID for Twitter analytics.

## Environment variables

Some configuration is stored in super secret environment variables.

- `BASE_URL`: base URL for the app.
- `HOST`: hostname for the app.
- `PASSWORD_PROTECT`: enable Basic Auth for all requests. The format of this variable is either `password` or `username:password`.
- `PORT`: port to listen on.
