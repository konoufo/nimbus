var path = require("path");
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');
var buildPath = path.resolve(__dirname, './clientapp/assets/bundles/');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var TransferWebpackPlugin = require('transfer-webpack-plugin');

module.exports = {
  context: __dirname,

  entry: {
	   devServer: 'webpack/hot/dev-server',
	   devServerOnly: 'webpack/hot/only-dev-server',
	   home_app: './clientapp/apps/mgt_app/src/app/app',
  
  }, // entry point of our app. clientapp/components/index.jsx should require other jsx/js modules and dependencies it needs

  output: {
      path: buildPath,
      filename: "[name]-[hash].js",
	  publicPath: 'http://localhost:3000/assets/bundles/'
  },
    //Server Configuration options
  devServer:{
    publicPath: 'http://localhost:3000/assets/bundles/',  //Relative directory for base of server
    devtool: 'eval',
    hot: true,        //Live-reload
    inline: true,
    port: 3000        //Port Number
  },
  
  devtool: 'eval',
  
  plugins: [
	//Enables Hot Modules Replacement
    new webpack.HotModuleReplacementPlugin(),
	//Allows error warnings but does not stop compiling. Will remove when eslint is added
    new webpack.NoErrorsPlugin(),
    new BundleTracker({filename: './webpack-stats.json'}),
	new webpack.OldWatchingPlugin(),
  ],

  module: {
    //Loaders to interpret non-vanilla javascript code as well as most other extensions including images and text.
    preLoaders: [
      {
        //Eslint loader
        test: /\.(js|jsx)$/,
        loader: 'eslint-loader',
        include: [path.resolve(__dirname, "/clientapp/apps/[name]/src/app")],
        exclude: [nodeModulesPath]
      },
    ],
    loaders: [
      {
        //React-hot loader and
        test: /\.(js|jsx)$/,  //All .js and .jsx files
        loaders: ['react-hot','babel-loader?presets[]=react,presets[]=es2015,presets[]=stage-0'], //react-hot is like browser sync and babel loads jsx and es6-7
        exclude: [nodeModulesPath],
      },
      { test: /\.json$/, loader: 'json' },
    ]
  },
  //eslint config options. Part of the eslint-loader package
  eslint: {
    configFile: '.eslintrc'
  },

  resolve: {
    modulesDirectories: ['node_modules', 'bower_components', 'client_app'],
    extensions: ['', '.js', '.jsx', 'json']
  },
}