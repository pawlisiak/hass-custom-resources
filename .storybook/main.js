const path = require('path');

module.exports = {
  addons: [
    {
      name: '@storybook/addon-essentials',
      options: {
        backgrounds: false,
        viewport: false
      }
    }
  ],

  stories: [
    '../cards/**/*.stories.@(js|mdx)'
  ],

  webpackFinal: async (config) => {
    config.module.rules.push(
      {
        test: /\.css|\.s(c|a)ss$/,
        include: [
          path.resolve(__dirname, '../cards')
        ],
        use: [
          {
            loader: 'lit-scss-loader',
            options: {
              minify: true
            }
          },
          'extract-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.css|\.s(c|a)ss$/,
        exclude: [
          path.resolve(__dirname, '../cards')
        ],
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      }
    );

    // Return the altered config
    return config;
  },
};
