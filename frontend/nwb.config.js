const path = require('path');

module.exports = {
  type: 'react-app',
  babel: {
    plugins: [
      'babel-plugin-lodash'
    ]
  },
  webpack: {
    aliases: {
      components: path.resolve('src/components'),
      scenes: path.resolve('src/scenes'),
      menus: path.resolve('src/menus'),
      store: path.resolve('src/store'),
      shared: path.resolve('src/shared'),
      orm: path.resolve('src/orm'),
      services: path.resolve('src/services'),
      utils: path.resolve('src/utils'),
      src: path.resolve('src'),
    },
    // uglify: {
    //     uglifyOptions: {
    //         cache: true,
    //         parallel: true,
    //         sourceMap: false
    //     }
    // },
    extra: {
      resolve: {
        mainFields: ['browser', 'main']
      }
    }
  }
};
