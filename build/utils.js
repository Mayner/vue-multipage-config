'use strict'
const path = require('path')
const config = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const packageConfig = require('../package.json')

/* 此处添加引进三个模块=================开始================= */
// 1、glob模块允许你使用 *等符号, 例如lib/*.js就是获取lib文件夹下的所有js后缀名的文件
const glob = require('glob')
// 2、html-webpack-plugin模块根据页面模板生成html
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 3、webpack-merge模块用于做相应的合并处理
const merge = require('webpack-merge')
/* 此处添加引进三个模块=================结束================= */

exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

/* 此处是添加多页面配置的部分=================开始================= */

// 取得多页面项目的根目录，一般放在src文件夹下的pages文件夹
const PAGE_PATH = path.join(__dirname, '..', 'src/pages')

// 多入口js配置
exports.entries = function () {
  // 通过glob模块读取pages文件夹下的所有对应文件夹下的js后缀文件，如果该文件存在，那么就作为入口处理
  let entryFiles = glob.sync(PAGE_PATH + '/*/*.js')
  let entriesObj = {}
  entryFiles.forEach(filePath => {
    let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
    entriesObj[filename] = filePath
  })
  return entriesObj
}

// 多页面输出配置
exports.htmlPlugins = function () {
  // 与上面的多页面入口配置相同，读取pages文件夹下的对应的html后缀文件，然后放入数组中
  let entryHtml = glob.sync(PAGE_PATH + '/*/*.html')
  let arr = []
  entryHtml.forEach(filePath => {
    let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
    let conf = {
      // 产出到dist目录下的入口html的文件名
      filename: filename + '.html',
      // 多页面入口html模板来源
      template: filePath,
      inject: true,
      // 页面模板需要加对应的js脚本，如果不加chunks这句代码则每个页面都会引入所有的js脚本
      // 此处的filename必须跟上面的多页面入口配置entries里的filename相一致，
      // 即pages文件夹里各个模块的入口html模板和js的文件名必须相同
      chunks: ['manifest', 'vendor', filename]
    }
    if (process.env.NODE_ENV === 'production') {
      conf = merge(conf, {
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
        },
        chunksSortMode: 'dependency'
      })
    }
    arr.push(new HtmlWebpackPlugin(conf))
  })
  return arr
}

/* 此处是添加多页面配置的部分=================结束================= */

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}
