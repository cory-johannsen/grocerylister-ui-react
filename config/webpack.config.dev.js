var path = require('path');
var autoprefixer = require('autoprefixer');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var cssModules = '?modules&localIdentName=[name]__[local]___[hash:base64:5]'

const NODE_ENV = process.env.NODE_ENV;
const dotenv = require('dotenv');


// TODO: hide this behind a flag and eliminate dead code on eject.
// This shouldn't be exposed to the user.
var isInNodeModules = 'node_modules' ===
  path.basename(path.resolve(path.join(__dirname, '..', '..')));
var relativePath = isInNodeModules ? '../../..' : '..';
var isInDebugMode = process.argv.some(arg =>
  arg.indexOf('--debug-template') > -1
);
if (isInDebugMode) {
  relativePath = '../template';
}
var srcPath = path.resolve(__dirname, relativePath, 'src');
var nodeModulesPath = path.join(__dirname, '..', 'node_modules');
var indexHtmlPath = path.resolve(__dirname, relativePath, 'index.html');
var faviconPath = path.resolve(__dirname, relativePath, 'favicon.ico');
var buildPath = path.join(__dirname, isInNodeModules ? '../../..' : '..', 'build');

const dotEnvVars = dotenv.config();
const environmentEnv = dotenv.config({
  path: path.join(__dirname, '.', `${NODE_ENV}.config.js`),
  silent: false,
});
const envVariables = Object.assign({}, dotEnvVars, environmentEnv);

// console.log('__dirname', __dirname)
// console.log('dotEnvVars', dotEnvVars)
// console.log('environmentEnv', environmentEnv)
// console.log('envVariables', envVariables)

const defines =
  Object.keys(envVariables)
  .reduce((memo, key) => {
    const val = JSON.stringify(envVariables[key]);
    memo[`__${key.toUpperCase()}__`] = val;
    return memo;
  }, {
    __NODE_ENV__: JSON.stringify(NODE_ENV)
  });


console.log('defines', defines)
console.log('srcPath', srcPath)
console.log('nodeModulesPath', nodeModulesPath)
console.log('indexHtmlPath', indexHtmlPath)

module.exports = {
  devtool: 'eval',
  entry: [
    require.resolve('webpack-dev-server/client') + '?http://localhost:8000',
    require.resolve('webpack/hot/dev-server'),
    path.join(srcPath, 'index')
  ],
  output: {
    // Next line is not used in dev but WebpackDevServer crashes without it:
    path: buildPath,
    pathinfo: true,
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.haml', '.scss'],
  },
  resolveLoader: {
    root: nodeModulesPath,
    moduleTemplates: ['*-loader']
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint',
        include: srcPath,
      }
    ],
    loaders: [
      { test: /\.jsx?$/, loaders: ['react-hot', 'babel'], exclude: /node_modules/ },
      // { test: /\.jsx?$/, loaders: ['source-map'], include: /node_modules\/@datanerd/ },
      { test: /\.scss$/, loader: 'style!css!sass', include: /node_modules/ },
      {
        test: /\.scss$/,
        loader: 'style!css' + cssModules + '!sass',
        exclude: /node_modules/
      }, {
        test: /\.png$/,
        loader: 'url'
      }
    ]
  },
  eslint: {
    configFile: path.join(__dirname, 'eslint.js'),
    useEslintrc: false
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: indexHtmlPath,
      favicon: faviconPath,
    }),
    new webpack.DefinePlugin(defines),
    // Note: only CSS is currently hot reloaded
    new webpack.HotModuleReplacementPlugin()
  ]
};
