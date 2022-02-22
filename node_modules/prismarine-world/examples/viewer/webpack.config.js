const webpack = require('webpack')
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

const config = {
  entry: path.resolve(__dirname, './index.js'),
  output: {
    path: path.resolve(__dirname, './public'),
    filename: './index.js'
  },
  resolve: {
    fallback: {
      zlib: require.resolve('browserify-zlib'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer/'),
      events: require.resolve('events/'),
      assert: require.resolve('assert/')
    }
  },
  plugins: [
    // fix "process is not defined" error:
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    }),
    new webpack.NormalModuleReplacementPlugin(
      /.*prismarine-viewer\/viewer\/lib\/utils/,
      './utils.web.js'
    ),
    new CopyPlugin({
      patterns: [
        { from: 'node_modules/prismarine-viewer/public/blocksStates/', to: './blocksStates/' },
        { from: 'node_modules/prismarine-viewer/public/textures/', to: './textures/' },
        { from: 'node_modules/prismarine-viewer/public/worker.js', to: './' },
        { from: 'node_modules/prismarine-viewer/public/supportedVersions.json', to: './' }
      ]
    })
  ],

  devServer: {
    contentBase: path.resolve(__dirname, './public'),
    compress: true,
    inline: true,
    // open: true,
    hot: true,
    watchOptions: {
      ignored: /node_modules/
    }
  },
  devtool: 'eval-source-map'
}

module.exports = config
