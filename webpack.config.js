const webpack = require('@nativescript/webpack');
const { resolve } = require('path');
// const { NormalModuleReplacementPlugin, ProvidePlugin } = require('webpack');
// const { WebSocket } = require('ws');

module.exports = (env) => {
  webpack.init(env);

  // webpack.chainWebpack((config) => {
  // config.plugin('ProvidePlugin|Polyfills').use(ProvidePlugin, [
  //   {
  //     'isomorphic-ws': [resolve('isomorphic-ws/browser.js'), 'isomorphic-ws'],
  //   },
  // ]);
  // config.resolve.alias.set(
  //   'isomorphic-ws',
  //   resolve(
  //     webpack.Utils.project.getProjectFilePath('node_modules'),
  //     'isomorphic-ws/browser.js'
  //   )
  // );
  // config.resolve.alias.set(
  //   'isomorphic-ws',
  //   resolve(
  //     webpack.Utils.project.getProjectFilePath('node_modules'),
  //     '@herefishyfish/nativescript-rxdb/isomorphic-ws'
  //   )
  // );
  // config
  //   .plugin('NormalModuleReplacement|WebsocketPlugin')
  //   .use(
  //     new NormalModuleReplacementPlugin(
  //       /isomorphic-ws/,
  //       '@valor/nativescript-websockets'
  //     )
  //   );
  // config.plugin('DefinePlugin').tap((args) => {
  //   Object.assign(args, {
  //     '_isomorphicWs.default': WebSocket,
  //   });
  // });
  // });

  return webpack.resolveConfig();
};
