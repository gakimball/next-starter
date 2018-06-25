import React, { Component, Fragment } from 'react';
import getConfig from 'next/config';
import MobxDevTools from 'mobx-react-devtools';
import GridOverlay from './components/grid-overlay';

const { publicRuntimeConfig } = getConfig();
const showDevTools = process.env.NODE_ENV !== 'production' || publicRuntimeConfig.remoteDevTools;
const LOCAL_STORAGE_KEY_VISIBLE = 'next-starter:devToolsVisible';

/**
 * React component that renders a toolbar of dev tools: the MobX dev tools, and the grid overlay.
 */
class DevTools extends Component {

  /**
   * Internal state for `<DevTools />`.
   * @prop {Boolean} display - Toolbar is visible.
   */
  state = {
    display: false,
  }

  /**
   * When the component mounts, run initial setup and set event listeners.
   */
  componentDidMount() {
    this.setup();

    document.addEventListener('keydown', this.handleKeyDown);
  }

  /**
   * When the component updates, save the visibility state in localStorage.
   */
  componentDidUpdate() {
    localStorage.setItem(LOCAL_STORAGE_KEY_VISIBLE, this.state.display);
  }

  /**
   * When the component unmounts, clean up event listeners.
   */
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Pull initial state from localStorage if it exists. This method is called by
   * `componentDidMount()`.
   */
  setup() {
    this.setState({
      display: localStorage.getItem(LOCAL_STORAGE_KEY_VISIBLE) === 'true',
    });
  }

  /**
   * 
   */
  handleKeyDown = (e) => {
    if (e.ctrlKey && e.keyCode === 75) {
      this.onToggleDisplay();
    }
  }

  toggleDisplay() {
    this.setState(state => ({
      display: !state.display,
    }));
  }

  render() {
    const { display } = this.state;

    return (
      <Fragment>
        <MobxDevTools noPanel={!display} />
        <GridOverlay noPanel={!display} />
      </Fragment>
    );
  }
}

export default showDevTools ? DevTools : (() => null);
