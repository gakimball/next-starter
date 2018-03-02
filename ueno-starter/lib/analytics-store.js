import Router from 'next/router';
import ReactGA from 'react-ga';
import getConfig from 'next/config';

const { publicRuntimeConfig: config } = getConfig();

/**
 * Store to handle analytics tracking. A pageview event is sent each time a page is loaded.
 * @private
 */
export default class AnalyticsStore {

  /**
   * Initialize the analytics store.
   */
  constructor() {
    if (typeof window !== 'undefined') {
      if (config.gaId) {
        ReactGA.initialize(config.gaId);
      }

      // The router doesn't fire an event for the first page loaded from a server, so we do it
      // manually
      this.track(Router.pathname);
    }

    // Track every time the route changes
    Router.onRouteChangeComplete = (url) => {
      this.track(url);
    };
  }

  /**
   * Dispatch tracking events to whatever analytics services are turned on.
   * @param {String} url - Path of URL.
   */
  track(url) {
    // Google Analytics
    if (config.gaId) {
      ReactGA.set({ page: url });
      ReactGA.pageview(url);
    }

    // Facebook
    if (window.fbq) {
      window.fbq('track', 'PageView');
    }

    // Twitter
    if (window.twq) {
      window.twq('track', 'PageView');
    }
  }
}
