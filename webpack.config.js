const glob = require('glob');
const path = require('path');

const toObject = (paths) => {
  let ret = {};

  paths.forEach((loc) => {
    const fileName = loc.split('/').slice(-1)[0];
    ret[fileName.split('.').slice(0, -1).join('.')] = loc;
  });

  return ret;
}
 
module.exports = ({ mode }) => {
  let webpackConfig = {
    entry: {
      ...toObject(glob.sync('./src/**/*.js*', {
        ignore: [
          './src/**/*.stories.js*'
        ]
      }))
    },

    output: {
      filename: '[name].js',
      library: 'home-assistant',
      libraryTarget: 'umd'
    },

    mode,
    target: 'web',

    stats: {
      children: false,
      entrypoints: false,
      hash: false,
      modules: false
    },

    module: {
      rules: [
        {
          test: /\.s(c|a)ss$/,
          include: [
            path.resolve(__dirname, './src')
          ],
          use: [
            {
              loader: 'lit-scss-loader',
              options: {
                minify: (mode === 'production')
              }
            },
            'extract-loader',
            'css-loader',
            'sass-loader'
          ]
        }
      ]
    }
  };

  return webpackConfig;
};