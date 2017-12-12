/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true}] */
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');

const PORT = 8080;
new WebpackDevServer(webpack(config), {
  publicPath: config.output.path,
  hot: true,
  stats: {colors: true},
  historyApiFallback: true,
}).listen(PORT, '0.0.0.0', (err, result) => {
  if (err) {
    return console.log('webpack server... ', err);
  }
  console.log(result);
  return console.log(`Listening at http://localhost:${PORT}/`);
});
