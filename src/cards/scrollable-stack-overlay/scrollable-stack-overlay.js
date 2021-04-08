import { LitElement, html } from 'lit-element';
import * as smoothscroll from 'smoothscroll-polyfill';

import Styles from './scrollable-stack-overlay.scss';

class ScrollableStackOverlay extends LitElement {
  static get styles () {
    return [ Styles ];
  }

  render () {
    return html `
      <div class="overlaid">
        ${typeof this._overlaidCard === 'node'
          ? html `${this._overlaidCard}`
          : ''
        }
      </div>

      <div class="container">
        <div class="column-0"></div>
        <div class="column-1"></div>

        <!-- Columns starts here -->
        ${this._columns.map(column => html `
          <div class="column">
            ${column}
          </div>
        `)}
        <!-- Columns ends here -->

        <div class="column-x"></div>
      </div>

      <div
        @click="${this._scrollToNext}"
        class="shadow shadow__right"
      ></div>
    `
  }

  static get properties () {
    return {
      _columns: {
        type: Array
      },

      _columnWidth: {
        type: Number
      },

      _config: {
        type: Object
      },

      _hostWidth: {
        type: Number
      },

      _scrollLayout: {
        type: Array
      },

      _shadowWidth: {
        type: Number
      },

      hass: {
        type: Object
      }
    };
  }

  constructor () {
    super();

    this._columns = [];
    this._columnWidth = 0;
    this._config = {};
    this._hostWidth = 0;
    this._overlaidCard = {};
    this._overlayTimeout = null;
    this._scrollLayout = [];
    this._shadowWidth = 0;
    this.hass = {};

    smoothscroll.polyfill();
  }

  disconnectedCallback () {
    this._scrollableArea.removeEventListener('scroll', e => this._dispatchStopScrollEvent(e), false);
    this._scrollableArea.removeEventListener('scroll-stop', () => this._autosetScrollPosition());

    this._resizeObserver.unobserve(this);

    super.disconnectedCallback();
  }

  firstUpdated () {
    this._updateScrollLayout();

    this._scrollableArea.addEventListener('scroll', e => this._dispatchStopScrollEvent(e), false);
    this._scrollableArea.addEventListener('scroll-stop', () => this._autosetScrollPosition());
    
    this._resizeObserver = new ResizeObserver(() => {
      this._updateScrollLayout();
    });

    this._resizeObserver.observe(this);

  }

  get _overlaidContainer () {
    return this.shadowRoot.querySelector('.overlaid');
  }

  get _scrollableArea () {
    return this.shadowRoot.querySelector('.container');
  }

  _autosetScrollPosition () {
    const scrollLeft = this._scrollableArea.scrollLeft;

    try {
      this._scrollLayout.forEach((column, index) => {
        if (scrollLeft > column.end) {
          return;
        }

        if (scrollLeft <= column.end ) {
          clearTimeout(this._overlayTimeout);

          if (index > 0) {
            this._overlaidContainer.classList.add('is-overlaid');

            this._overlayTimeout = setTimeout(() => {
              this._overlaidContainer.classList.add('in');
            }, 10);
          } else {
            this._overlaidContainer.classList.remove('in');

            this._overlayTimeout = setTimeout(() => {
              this._overlaidContainer.classList.remove('is-overlaid');
            }, 300);
          }

          this._scrollableArea.scroll({
            left: column.scrollTo,
            behavior: 'smooth'
          });

          throw 'Scrolled to active column';
        }
      })
    } catch (e) {
      return;
    }
  }

  _dispatchStopScrollEvent (e) {
    // Clear our timeout throughout the scroll
    window.clearTimeout(this.isScrolling);

    // Set a timeout to run after scrolling ends
    this.isScrolling = setTimeout(() => {

      // Dispatch scroll-stop event
      const scrollStopEvent = new Event('scroll-stop');
      this._scrollableArea.dispatchEvent(scrollStopEvent);
    }, 100);
  }

  _getActiveColumn () {
    const scrollLeft = this._scrollableArea.scrollLeft;
    let activeColumn = null;

    try {
      this._scrollLayout.forEach(column => {
        if (scrollLeft > column.end) {
          return;
        }

        if (scrollLeft <= column.end ) {
          activeColumn = column;

          throw 'Scrolled to active column';
        }
      })
    } finally {
      return activeColumn;
    }
  }

  _scrollToNext () {
    const activeColumn = this._getActiveColumn();
    const activeIndex = this._scrollLayout.indexOf(activeColumn);
    
    if (activeIndex <= this._scrollLayout.length) {
      const nextColumn = this._scrollLayout[activeIndex + 1];

      this._scrollableArea.scroll({
        left: nextColumn.scrollTo,
        behavior: 'smooth'
      });
    }
  }

  _scrollToPrevious () {
    const activeColumn = this._getActiveColumn();
    const activeIndex = this._scrollLayout.indexOf(activeColumn);
    
    if (activeIndex > 0) {
      const previousColumn = this._scrollLayout[activeIndex - 1];

      this._scrollableArea.scroll({
        left: previousColumn.scrollTo,
        behavior: 'smooth'
      });
    }
  }

  _updateScrollLayout () {
    const offset = this.shadowRoot.querySelector('.column-0').offsetWidth || 0;
    const columns = this._scrollableArea.querySelectorAll('.column');
    const column1 = this._scrollableArea.querySelector('.column-1');

    this._scrollLayout = [
      {
        end: column1.offsetLeft + (column1.offsetWidth / 2) - offset,
        scrollTo: 0,
        elem: column1
      }
    ];

    columns.forEach(column => {
      this._scrollLayout.push({
        end: column.offsetLeft + (column.offsetWidth / 2) - offset,
        scrollTo: column.offsetLeft - offset,
        elem: column
      });
    })

    this._autosetScrollPosition();
  }

  set hass (hass) {
    this._columns.forEach(column => {
      column.hass = hass;
    });

    this._overlaidCard.hass = hass;
  }

  getCardSize() {
    return Math.max(this.columnEntityCount);
  }

  setConfig (config) {
    this._config = config;

    if (config && config.overlaid_card) {
      this._overlaidCard = (config.overlaid_card.type.startsWith("custom:"))
        ? document.createElement(`${config.overlaid_card.type.substr("custom:".length)}`)
        : document.createElement(`hui-${config.overlaid_card.type}-card`);

        this._overlaidCard.setConfig(config.overlaid_card);

      if (this.hass)
        this._overlaidCard.hass = this.hass;
    }

    if (!config || !config.cards || !Array.isArray(config.cards)) {
      throw new Error('Cards config incorrect');
    }

    this._columns = config.cards.map((card) => {
      let element;

      if (card.type.startsWith("custom:")) {
        element = document.createElement(`${card.type.substr("custom:".length)}`);
      } else {
        element = document.createElement(`hui-${card.type}-card`);
      }

      element.setConfig(card);

      if (this.hass)
        element.hass = this.hass;

      return element;
    });
  }
}

window.customElements.define('scrollable-stack-overlay', ScrollableStackOverlay);