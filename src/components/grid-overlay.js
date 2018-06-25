/* eslint-disable react/no-array-index-key */

import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';

const s = () => {};

// Keys to store visibility state of the grid overlay
const LOCAL_STORAGE_KEY_COLUMNS = 'next-starter:devtoolsHorizontalGridVisible';
const LOCAL_STORAGE_KEY_BASELINE = 'next-starter:devtoolsVerticalGridVisible';

/**
 * React component to display a layout grid or baseline grid over top of the base. Each grid can
 * be shown and hidden with a button.
 */
export default class GridOverlay extends PureComponent {

  /**
   * PropTypes for `<GridOverlay />`.
   * @prop {Boolean} [noPanel=true] - Hide component controls.
   */
  static propTypes = {
    noPanel: PropTypes.bool,
  }

  /**
   * Default props for `<GridOverlay />`.
   */
  static defaultProps = {
    noPanel: true,
  }

  /**
   * Internal state for `<GridOverlay />`.
   * @prop {Number} columns - Number of columns in the layout grid.
   * @prop {Boolean} columnsVisible - Display layout grid.
   * @prop {Boolean} baselineVisible - Display baseline grid.
   */
  state = {
    columns: 12,
    columnsVisible: false,
    baselineVisible: false,
  }

  /**
   * When the component mounts, run initial setup and set event listeners.
   */
  componentDidMount() {
    this.setup();

    document.addEventListener('keydown', this.handleKeyDown);
  }

  /**
   * When the component updates, save the grid visibility state in localStorage.
   */
  componentDidUpdate() {
    const { columnsVisible, baselineVisible } = this.state;

    localStorage.setItem(LOCAL_STORAGE_KEY_COLUMNS, columnsVisible);
    localStorage.setItem(LOCAL_STORAGE_KEY_BASELINE, baselineVisible);
  }

  /**
   * When the component unmounts, clean up event listeners.
   */
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  /**
   * `Ctrl + L` can be used to toggle the grid. It's the same keyboard shortcut as Sketch.
   * @param {KeyboardEvent} e - `keydown` event.
   */
  handleKeyDown = (e) => {
    if (e.ctrlKey && e.keyCode === 76) {
      this.handleToggleColumns();
    }
  }

  /**
   * Toggle visibility of the layout grid.
   */
  handleToggleColumns = () => {
    this.setState(state => ({
      columnsVisible: !state.columnsVisible,
    }));
  }

  /**
   * Toggle visibility of the baseline grid.
   */
  handleToggleBaseline = () => {
    this.setState(state => ({
      baselineVisible: !state.baselineVisible,
    }));
  }

  /**
   * Get the column count from a CSS variable and store it in state, and get the grid visibility
   * status from localStorage and store it in state. This method is called by `componentDidMount()`.
   */
  setup() {
    // This picks up CSS variables set on the `:root` selector
    const rootStyle = getComputedStyle(document.documentElement);

    this.setState({
      columns: rootStyle.getPropertyValue('--grid-column-count'),
      columnsVisible: localStorage.getItem(LOCAL_STORAGE_KEY_COLUMNS) === 'true',
      baselineVisible: localStorage.getItem(LOCAL_STORAGE_KEY_BASELINE) === 'true',
    });
  }

  /**
   * Render the grid overlays and controls.
   * @returns {Object} JSX.
   */
  render() {
    const { noPanel } = this.props;
    const { columns, baselineVisible, columnsVisible } = this.state;

    return (
      <div
        className={s('grid', { columnsVisible }, { baselineVisible })}
        ref={(el) => { this.grid = el; }}
      >
        <div className={s.grid__container}>
          <div className={s.grid__row} data-columns={columns}>
            {Array(columns).fill(0).map((_, i) => (
              <div key={`grid_column_${i}`} className={s.grid__column}>
                <div className={s.grid__visualize} />
              </div>
            ))}
          </div>
        </div>

        {!noPanel && (
          <Fragment>
            <button key="v" className={s('grid__button', { baselineVisible })} onClick={this.handleToggleBaseline}>
              <svg className={s.grid__button__svg} width="14px" height="14px" viewBox="0 0 14 14">
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <rect x="0" y="0" width="2" height="14" />
                  <rect x="4" y="0" width="2" height="14" />
                  <rect x="8" y="0" width="2" height="14" />
                  <rect x="12" y="0" width="2" height="14" />
                </g>
              </svg>
            </button>
            <button key="h" className={s('grid__button', { columnsVisible })} onClick={this.handleToggleColumns}>
              <svg className={s.grid__button__svg} width="14px" height="14px" viewBox="0 0 14 14">
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(7.000000, 7.000000) rotate(-270.000000) translate(-7.000000, -7.000000)">
                  <rect x="0" y="0" width="2" height="14" />
                  <rect x="4" y="0" width="2" height="14" />
                  <rect x="8" y="0" width="2" height="14" />
                  <rect x="12" y="0" width="2" height="14" />
                </g>
              </svg>
            </button>
          </Fragment>
        )}
      </div>
    );
  }
}
