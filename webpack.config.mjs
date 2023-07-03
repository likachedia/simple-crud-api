import { fileURLToPath } from "url";
import path, { dirname } from "path";
import nodeExternals from 'webpack-node-externals';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// const nodeExternals = require('webpack-node-externals');

// const path = require('path');

const config = {
  entry: path.resolve(__dirname, "src/index.ts"),
  mode: 'production',
  externals: [nodeExternals()],
  target: 'node',
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "./bundle.cjs",
    library: {
        type: "module",
    },
    libraryTarget: "commonjs-module"
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".cjs"],
  },
  plugins: [],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
      },
    ],
  },
};

export default config;
// module.export = {config} ;
