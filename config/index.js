const path = require('path');
const config = {
  projectName: 'taro-plu',
  date: '2019-6-20',
  designWidth: 375,
  deviceRatio: {
    '640': 2.34 / 2,
    '750': 1,
    '828': 1.81 / 2,
    '375': 0.5
  },
  sourceRoot: 'src',
  outputRoot: 'miniprogram',
  alias: {
    '@/plugin': path.resolve(__dirname, '..', 'src/plugin'),
    '@/components': path.resolve(__dirname, '..', 'src/plugin/components'),
    '@/lib': path.resolve(__dirname, '..', 'src/plugin/lib'),
    '@/action': path.resolve(__dirname, '..', 'src/plugin/action')
  },
  plugins: {
    babel: {
      sourceMap: true,
      presets: [
        ['env', {
          modules: false
        }]
      ],
      plugins: [
        'transform-decorators-legacy',
        'transform-class-properties',
        'transform-object-rest-spread'
      ]
    }
  },
  defineConstants: {
  },
  copy: {
    patterns: [
      { from: 'src/plugin/components/ParserRichText/Parser/trees/cssHandler.wxs', to: 'plugin/components/ParserRichText/Parser/trees/cssHandler.wxs' }
    ],
    options: {
    }
  },
  weapp: {
    compile: {
      exclude: ['src/plugin/vendors/nim/NIM_Web_NIM_weixin_v6.6.6.js','src/plugin/vendors/nim/NIM_Web_NIM_weixin.test.min.js']
    },
    module: {
      postcss: {
        autoprefixer: {
          enable: true,
          config: {
            browsers: [
              'last 3 versions',
              'Android >= 4.1',
              'ios >= 8'
            ]
          }
        },
        pxtransform: {
          enable: true,
          config: {

          }
        },
        url: {
          enable: true,
          config: {
            limit: 10240 // 设定转换尺寸上限
          }
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    module: {
      postcss: {
        autoprefixer: {
          enable: true,
          config: {
            browsers: [
              'last 3 versions',
              'Android >= 4.1',
              'ios >= 8'
            ]
          }
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      }
    }
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
