var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');
var path = require('path');
var buildPath = path.resolve(__dirname, './clientapp/assets/bundles/');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var TransferWebpackPlugin = require('transfer-webpack-plugin');

var config = {
  entry: {
	home_app: './clientapp/apps/mgt_app/src/app/app',
  },
  resolve: {
    modulesDirectories: ['node_modules', 'bower_components', 'clientapp'],
    //When require, do not have to add these extensions to file's name
    extensions: ["", ".js", ".jsx", ".json"]
    //node_modules: ["web_modules", "node_modules"]  (Default Settings)
  },
  //Render source-map file for final build
  devtool: 'source-map',
  //output config
  output: {
    path: buildPath,    //Path of output file
    filename: "[name]-[hash].js",  //Name of output file
  },
  plugins: [
	
	new BundleTracker({filename: './webpack-prod-stats.json'}),

	// removes a lot of debugging code in React
	new webpack.DefinePlugin({
	'process.env': {
	  'NODE_ENV': JSON.stringify('production')
	}}),
	//
	new webpack.optimize.DedupePlugin(),
	// keeps hashes consistent between compilations
	new webpack.optimize.OccurenceOrderPlugin(),
    
	//Minify the bundle
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        //supresses warnings, usually from module minification
        warnings: false
      }
    }),
    //Allows error warnings but does not stop compiling. Will remove when eslint is added
    new webpack.NoErrorsPlugin(),
   
  ],
  module: {
    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'eslint-loader',
        include: [path.resolve(__dirname, "/clientapp/apps/[name]/src/app")],
        exclude: [nodeModulesPath]
      },
    ],
    loaders: [
      {
        test: /\.(js|jsx)$/, //All .js and .jsx files
        loader: 'babel-loader?presets[]=react,presets[]=es2015,presets[]=stage-0', //react-hot is like browser sync and babel loads jsx and es6-7
        exclude: [nodeModulesPath]
      },
      { test: /\.json$/, loader: 'json' },
    ]
  },
  //Eslint config
  eslint: {
    configFile: '.eslintrc' //Rules for eslint
  },
};

module.exports = config;
