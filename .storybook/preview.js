import { setCustomElements } from '@storybook/web-components';
import customElements from '../custom-elements.json';

import './global.module.scss';

setCustomElements(customElements);

// Add some parameters to Storybook
export const parameters = {
  options: {
    showPanel: true
  }
};