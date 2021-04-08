import { LitElement, html } from 'lit-element';
import { querySelectorAllDeep, querySelectorDeep } from 'query-selector-shadow-dom';


import Styles from './touch-sidebar.scss';

class TouchSidebar extends LitElement {
  static get styles () {
    return [ Styles ];
  }

  itemTemplate (item) {
    return html `
      <a
        @click="${(e) => this.handleItemClick(e, item)}"
        href="${item.url}"
      >
        <ha-icon icon="${item.icon}"></ha-icon>
      </a>
    `;
  }

  render () {
    return html `
      <style>
        ${this.parentOffsetLeft
          ? html `
            .container {
              left: ${this.parentOffsetLeft}px !important;
            }
          `
          : ''
        }
      </style>

      <div class="container">
        ${this.items.map(item => html `
          ${this.hasChildren(item)
            ? html `
              <div class="dropdown">
                <div class="dropdown-container">
                  ${this.itemTemplate(item)}

                  ${item.items.map(subitem => this.itemTemplate(subitem))}
                </div>
              </div>
            `
            : this.itemTemplate(item)
          }
        `)}
      </div>
    `
  }

  static get properties () {
    return {
      items: {
        type: Array
      }
    }
  }

  constructor () {
    super();

    this.isOpened = {};
  }

  connectedCallback () {
    super.connectedCallback();

    this.items = [
      {
        label: 'Pulpit',
        icon: 'mdi:gauge',
        url: '/lovelace/dash'
      },
      {
        label: 'Dom',
        icon: 'mdi:home-variant-outline',
        url: '/home-dash/home',
        items: [
          {
            label: 'Salon',
            icon: 'mdi:sofa-single-outline',
            url: '/home-dash/living-room'
          },
          {
            label: 'Jadalnia',
            icon: 'mdi:silverware',
            url: '/home-dash/dining-room'
          },
          {
            label: 'Pokój Mikołaja',
            icon: 'mdi:face',
            url: '/home-dash/mikolaj'
          }
        ]
      },
      {
        label: 'Urządzenia',
        icon: 'mdi:devices',
        url: '/home-devices/devices'
      },
      {
        label: 'Alarm',
        icon: 'mdi:lock',
        url: '/home-alarm/alarm'
      },
      {
        label: 'Kamery',
        icon: 'mdi:cctv',
        url: '/home-cams/cams'
      },
      {
        label: 'Opcje',
        icon: 'mdi:dots-grid',
        url: '/profile',
        items: [
          {
            label: 'Zaawansowany sidebar',
            icon: 'mdi:dock-left',
            callback: () => {
              const sidebar = querySelectorDeep('app-drawer');
    
              if (!sidebar) {
                return;
              }
    
              if (!sidebar.getAttribute('opened')) {
                sidebar.setAttribute('opened', true);
              } else {
                sidebar.removeAttribute('opened');
              }
            },
          }
        ]
      }
    ];

    const editButton = querySelectorDeep('app-toolbar ha-button-menu mwc-list-item:not(:only-child)');

    if (!!editButton) {
      this.items[this.items.length - 1].items.push({
        label: 'Edytuj dashboard',
        icon: 'mdi:square-edit-outline',
        callback: () => {
          editButton.click();
        }
      });
    }

    this.items.forEach((item, index) => {
      if (this.hasChildren(item)) {
        this.items[index].isOpened = false;
      }
    });
  }

  disconnectedCallback () {
    this._panelObserver.disconnect();
    this._panelDescendantsObserver.disconnect();

    super.disconnectedCallback();
  }

  firstUpdated () {
    this._observedNode = querySelectorDeep('partial-panel-resolver');
    this._panelObserver = new MutationObserver(() => {
      this.updateIndicator();

      clearTimeout(this._descendantObserverTimeout);

      this._descendantObserverTimeout = setTimeout(() => {
        this._observedDescendants = querySelectorDeep('hui-root #view');
        
        if (this._panelDescendantsObserver) {
          this._panelDescendantsObserver.disconnect();
        }

        if (!this._observedDescendants) {
          return;
        }

        this._panelDescendantsObserver = new MutationObserver(() => this.updateIndicator());
        this._panelDescendantsObserver.observe(this._observedDescendants, {
          attributes: true,
          childList: true,
          subtree: true,
          characterData: true
        });
      }, 100);
    });
    
    this._panelObserver.observe(this._observedNode, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true
    });
    
    this.updateIndicator();
  }

  get containerElem () {
    return this.shadowRoot.querySelector('.container');
  }

  handleItemClick (e, item) {
    if (!item) {
      return;
    }

    const dropdown = e.composedPath().filter(node => (node.classList && node.classList.contains('dropdown')));

    if (dropdown.length > 0) {
      if (dropdown[0].classList.contains('is-opened')) {
        if (item.callback && typeof item.callback === 'function') {
          e.preventDefault();
          item.callback();
        }

        this.closeDropdown(dropdown[0]);
      } else {
        e.preventDefault();
        this.openDropdown(dropdown[0]);

        const items = this.containerElem.querySelectorAll('.dropdown');

        items.forEach(item => {
          if (item !== dropdown[0]) {
            this.closeDropdown(item);
          }
        });
      }
    }
  }

  openDropdown (item) {
    const container = item.querySelector('.dropdown-container');
    
    item.classList.add('is-opened');
    container.style.width = `${container.children.length * 48}px`;
  }

  closeDropdown (item) {
    const container = item.querySelector('.dropdown-container');

    item.classList.remove('is-opened');
    container.style.removeProperty('width');
  }

  dropdownIsOpened (item) {
    return !!item.isOpened;
  }

  hasChildren (item) {
    return (item.items && Array.isArray(item.items))
  }

  updateIndicator () {
    const items = this.containerElem.querySelectorAll('a');
    const dropdowns = this.containerElem.querySelectorAll('.dropdown');

    items.forEach(item => {
      const href = item.getAttribute('href');

      if (href && href !== undefined && window.location.pathname.includes(href)) {
        item.classList.add('is-active');
      } else {
        item.classList.remove('is-active');
      }
    });

    dropdowns.forEach(dropdown => {
      const activeElem = dropdown.querySelector('.is-active');

      if (!activeElem) {
        dropdown.style.removeProperty('--default-negative-margin');

        return;
      }

      const children = dropdown.querySelectorAll('a');
      const index = Array.prototype.indexOf.call(children, activeElem);

      dropdown.style.setProperty('--default-negative-margin', `-${index * 48}px`);
    })
  }

  get parentOffsetLeft () {
    const rect = this.parentNode.getBoundingClientRect();

    return rect.left;
  }
};

window.customElements.define('touch-sidebar', TouchSidebar);