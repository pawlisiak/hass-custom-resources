import { html } from 'lit-html';

// Import template and component
import './scrollable-stack';

export default {
  title: 'Cards/ScrollableStack',
  component: 'pwlsk-scrollable-stack'
}

const Template = (args) => {
  let component = `
    <pwlsk-scrollable-stack>
      <div>
        <div class="card">
          <h2>Card 1</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean a convallis nisi. Duis euismod maximus metus, vel semper justo lacinia at. Vivamus urna nibh, malesuada non justo et, iaculis mollis ex. Donec fermentum elementum porta. Praesent imperdiet nulla mi, nec commodo felis elementum non.</p>
        </div>
      </div>

      <div>
        <div class="card">
          <h2>Card 2</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean a convallis nisi. Duis euismod maximus metus, vel semper justo lacinia at. Vivamus urna nibh, malesuada non justo et, iaculis mollis ex. Donec fermentum elementum porta. Praesent imperdiet nulla mi, nec commodo felis elementum non.</p>
        </div>
      </div>

      <div>
        <div class="card">
          <h2>Card 3</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean a convallis nisi. Duis euismod maximus metus, vel semper justo lacinia at. Vivamus urna nibh, malesuada non justo et, iaculis mollis ex. Donec fermentum elementum porta. Praesent imperdiet nulla mi, nec commodo felis elementum non.</p>
        </div>
      </div>

      <div>
        <div class="card">
          <h2>Card 4</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean a convallis nisi. Duis euismod maximus metus, vel semper justo lacinia at. Vivamus urna nibh, malesuada non justo et, iaculis mollis ex. Donec fermentum elementum porta. Praesent imperdiet nulla mi, nec commodo felis elementum non.</p>
        </div>
      </div>

      <div>
        <div class="card">
          <h2>Card 5</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean a convallis nisi. Duis euismod maximus metus, vel semper justo lacinia at. Vivamus urna nibh, malesuada non justo et, iaculis mollis ex. Donec fermentum elementum porta. Praesent imperdiet nulla mi, nec commodo felis elementum non.</p>
        </div>
      </div>

      <div>
        <div class="card">
          <h2>Card 6</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean a convallis nisi. Duis euismod maximus metus, vel semper justo lacinia at. Vivamus urna nibh, malesuada non justo et, iaculis mollis ex. Donec fermentum elementum porta. Praesent imperdiet nulla mi, nec commodo felis elementum non.</p>
        </div>
      </div>

      <div>
        <div class="card">
          <h2>Card 7</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean a convallis nisi. Duis euismod maximus metus, vel semper justo lacinia at. Vivamus urna nibh, malesuada non justo et, iaculis mollis ex. Donec fermentum elementum porta. Praesent imperdiet nulla mi, nec commodo felis elementum non.</p>
        </div>
      </div>

      <div>
        <div class="card">
          <h2>Card 8</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean a convallis nisi. Duis euismod maximus metus, vel semper justo lacinia at. Vivamus urna nibh, malesuada non justo et, iaculis mollis ex. Donec fermentum elementum porta. Praesent imperdiet nulla mi, nec commodo felis elementum non.</p>
        </div>
      </div>
    </pwlsk-scrollable-stack>
  `;

  return html([component]);
};

export const ScrollableStack = Template.bind({});
