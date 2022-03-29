'use strict';
const path = require('path');
module.exports = (env, argv) => {
  const IS_DEVELOPMENT = argv.mode === 'development';
  const IS_NONE = argv.mode === 'none';
  let config = {
    target: 'node',
    devtool: IS_DEVELOPMENT || IS_NONE ? 'source-map' : 'none',
    externals: /^(?![.]+\/)/,
    context: path.join(__dirname, 'src'),
    entry: './index.ts',
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'index.js',
      libraryTarget: 'commonjs2',
    },
    node: {
      __dirname: false,
      __filename: false,
    },
    resolve: {
      extensions: ['.ts', '.json'],
      alias: {
        config: path.resolve(__dirname, './config'),
      },
    },
    module: {
      rules: [
        {
          use: [
            {
              loader: 'ts-loader',
            },
          ],
        },
        {
          test: /\.(txt|csv|json)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                emitFile: false,
              },
            },
          ],
        },
      ],
    },
  };
  if (IS_NONE) {
    config.optimization = { nodeEnv: false };
  }
  return config;
};
