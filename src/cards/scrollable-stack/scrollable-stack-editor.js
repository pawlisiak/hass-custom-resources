import { LitElement, html, css } from 'lit-element';
import { fireEvent } from '../../utils/fire-event';

class ScrollableStackEditor extends LitElement {

  static get styles () {
    return css `
      .toolbar {
        display: flex;
        --paper-tabs-selection-bar-color: var(--primary-color);
        --paper-tab-ink: var(--primary-color);
      }
      paper-tabs {
        display: flex;
        font-size: 14px;
        flex-grow: 1;
      }
      #add-card {
        max-width: 32px;
        padding: 0;
      }
      #card-options {
        display: flex;
        justify-content: flex-end;
        width: 100%;
      }
      #editor {
        border: 1px solid var(--divider-color);
        padding: 12px;
      }
      @media (max-width: 450px) {
        #editor {
          margin: 0 -12px;
        }
      }
      .gui-mode-button {
        margin-right: auto;
      }
    `;
  }

  render () {
    if (!this.hass || !this._config) {
      return html ``;
    }

    const selected = this._selectedCard || 0;
    const numcards = (Array.isArray(this._config.cards))
      ? this._config.cards.length
      : 0;
  
    return html `
      <div class="card-config">
        <div class="toolbar">
          <paper-tabs
            .selected="${selected}"
            scrollable
            @iron-activate="${this._handleSelectedCard}"
          >
            ${this._config.cards.map((_card, i) => {
              return html`
                <paper-tab>
                  ${i + 1}
                </paper-tab>
              `;
            })}
          </paper-tabs>

          <paper-tabs
            id="add-card"
            .selected="${selected}"
            @iron-activate="${this._handleSelectedCard}"
          >
            <paper-tab>
              <ha-icon icon="hass:plus"></ha-icon>
            </paper-tab>
          </paper-tabs>
        </div>
        <div id="editor">
            ${selected < numcards
              ? html `
                <div id="card-options">
                  <mwc-button
                    @click="${this._toggleMode}"
                    .disabled="${!this._guiModeAvailable}"
                    class="gui-mode-button"
                  >
                    ${this.hass.localize(
                      !this._cardEditorEl || this._GUImode
                        ? "ui.panel.lovelace.editor.edit_card.show_code_editor"
                        : "ui.panel.lovelace.editor.edit_card.show_visual_editor"
                    )}
                  </mwc-button>
                  <ha-icon-button
                    id="move-before"
                    title="Move card before"
                    icon="hass:arrow-left"
                    .disabled="${selected === 0}"
                    @click="${this._handleMove}"
                  ></ha-icon-button>
                  <ha-icon-button
                    id="move-after"
                    title="Move card after"
                    icon="hass:arrow-right"
                    .disabled="${selected === numcards - 1}"
                    @click="${this._handleMove}"
                  ></ha-icon-button>
                  <ha-icon-button
                    icon="hass:delete"
                    @click="${this._handleDeleteCard}"
                  ></ha-icon-button>
                </div>

                <hui-card-element-editor
                  .hass="${this.hass}"
                  .value="${this._config.cards[selected]}"
                  .lovelace="${this.lovelace}"
                  @config-changed="${this._handleConfigChanged}"
                  @GUImode-changed="${this._handleGUIModeChanged}"
                ></hui-card-element-editor>
              `
              : html `
                <hui-card-picker
                  .hass="${this.hass}"
                  .lovelace="${this.lovelace}"
                  @config-changed="${this._handleCardPicked}"
                ></hui-card-picker>
              `
            }
        </div>
      </div>
    `
  }

  constructor () {
    super();

    this._config = {};
    this._selectedCard = 0;
    this._GUImode = true;
    this._guiModeAvailable = true;
    this.hass = {};
    this.lovelace = {};
  }

  setConfig (config) {
    this._config = config;
  }

  get _cardEditorEl () {
    return this.shadowRoot.querySelector('hui-card-element-editor');
  }

  _handleCardPicked (e) {
    e.stopPropagation();
  
    if (!this._config) {
      return;
    }

    const config = e.detail.config;
    this._config.cards.push(config);
  
    fireEvent(this, "config-changed", {
      config: this._config
    });

    this.requestUpdate();
  }

  _handleConfigChanged(e) {
    e.stopPropagation();

    if (!this._config) {
      return;
    }

    this._config.cards[this._selectedCard] = e.detail.config;
    this._guiModeAvailable = e.detail.guiModeAvailable;

    fireEvent(this, "config-changed", {
      config: this._config
    });
  }

  _handleDeleteCard () {
    if (!this._config) {
      return;
    }

    this._config.cards.splice(this._selectedCard, 1);
    this._selectedCard = Math.max(0, this._selectedCard - 1);

    fireEvent(this, "config-changed", {
      config: this._config
    });
  }

  _handleGUIModeChanged(e) {
    e.stopPropagation();
  
    this._GUImode = e.detail.guiMode;
    this._guiModeAvailable = e.detail.guiModeAvailable;
  }

  _handleMove (e) {
    if (!this._config) {
      return;
    }

    const source = this._selectedCard;
    const target = e.target.id === "move-before"
      ? source - 1
      : source + 1;
    
    const card = this._config.cards.splice(this._selectedCard, 1)[0];
    this._config.cards.splice(target, 0, card);
    this._selectedCard = target;

    fireEvent(this, "config-changed", {
      config: this._config
    });
  }

  _handleSelectedCard (e) {
    if (e.target.id === "add-card") {
      this._selectedCard = this._config.cards.length;
      return;
    }

    this._setMode(true);
    this._guiModeAvailable = true;
    this._selectedCard = parseInt(e.detail.selected, 10);
  }

  _setMode(value) {
    this._GUImode = value;
  
    if (this._cardEditorEl) {
      this._cardEditorEl.GUImode = value;
    }
  }

  _toggleMode() {
    this._cardEditorEl.toggleMode();
  }
}

customElements.define("scrollable-stack-editor", ScrollableStackEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "scrollable-stack",
  name: "_Pawlisiak: Scrollable Stack",
  preview: false
});