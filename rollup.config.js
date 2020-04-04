import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import replace from '@rollup/plugin-replace';
import terser from 'rollup-plugin-terser-js';
import sucrase from '@rollup/plugin-sucrase';
import alias from '@rollup/plugin-alias';
import pkg from "./package.json";
import nodePolyfills from 'rollup-plugin-node-polyfills';

const name = 'ModelXData';
const external = [
  // "natural",
  // "react-dom",
  'wordnet-db',
  'webworker-threads',
  'webworkerThreads',
];
const serverExternal = [
  'valid-url',
  'http',
  'https',
  "csvtojson",
  "js-grid-search-lite",
  "lodash.range",
  "lodash.rangeright",
  "ml-confusion-matrix",
  "ml-matrix",
  "ml-stat",
  "natural",
  "node-fpgrowth",
  "probability-distributions",
  "random-js",
  "valid-url",
  'wordnet-db',
  'webworker-threads',
  'lapack'
];
const windowGlobals = {
  // react: "React",
  // natural: "natural",
  'webworker-threads':'webworkerThreads',
  'wordnet-db': 'wordnetDb',
  'global':'window',
};

function getOutput({ minify = false, server = false, }) {
  const output = server ?
    [ {
      file: pkg.main,
      format: "cjs",
      exports: "named",
      name,
      sourcemap: true
    },
    {
      file: pkg.esm,
      format: "es",
      exports: "named",
      name,
      sourcemap: true
    }
    ] :
    [ {
      file: pkg.browser,
      format: "umd",
      exports: "named",
      name,
      globals:windowGlobals,
      sourcemap: true
    },
    {
      file: pkg.web,
      format: "iife",
      exports: "named",
      name,
      globals: windowGlobals,
      sourcemap: true
    }
  ];
    if (minify) {
        return output.map(item => {
            const itemFileArray = item.file.split('.');
            itemFileArray.splice(itemFileArray.length - 1, 0, 'min');
            item.file = itemFileArray.join('.');
            item.sourcemap = false;
            return item;
        })
    }
    return output;
}

function getPlugins({
  minify = false,
  browser = false,
}) {
  const plugins = [
    
  ];
  if (browser) {
    plugins.push(
      ...[
        replace({
          // 'csvtojson': 'http',
          // 'natural': 'http',
          // 'natural': './stub',
          // 'import { default as natural, } from \'natural\';': 'const natural = {};',
        }),
        // nodePolyfills(),
        alias({
          // resolve: ['.js', '.ts'],
          entries: {
            'natural': './stub',
          }
          // csvtojson:'util'
      // csvtojson:'node_modules/csvtojson/browser/csvtojson.min.js'
      // entries: {
      //   find: /csv$/,
      //   replacement: 'http'
      // }
        })
      ]);
  } 
  
  plugins.push(...[
    sucrase({
      exclude: ['node_modules/**'],
      transforms: ['typescript']
    }),
    // external(),
    replace({
      'process.env.NODE_ENV': minify ?
        JSON.stringify('production') : JSON.stringify('development'),
      // 'global.': '(typeof global!=="undefined" ? global : window).'
    }),

    // typescript({
    //   noEmitOnError: false,
    //   declaration: false,
    //   declarationDir: null,
    // }),
    
    resolve({
      extensions: ['.js', '.ts'],
      preferBuiltins: true,
    }),
    builtins({}),
    commonjs({
      // extensions: [ '.js', '.ts','.jsx' ,'.tsx' ]
      // namedExports: {
      //     // 'node_modules/react-is/index.js': ['isValidElementType'],
      //     // 'node_modules/react/index.js': [
      //     //     'Children',
      //     // ],
      // }
    }), // so Rollup can convert `ms` to an ES module
    globals({
      // react: 'React',
      'webworker-threads':'webworkerThreads',
      'wordnet-db':'wordnetDb'
    }),
  ]);
  if (minify) {
    const minifyPlugins = [

    ].concat(plugins,
      [
        terser({
          sourcemaps: true,
          compress: true,
          mangle: true,
          verbose: true,
        }),
      ]);
    return minifyPlugins;
  }
  return plugins;
}


export default [
  {
    input: "src/index.web.ts",
    output: getOutput({
      minify: false,
      server: false,
    }),
    context:'window',
    external,
    plugins: getPlugins({
      minify: false,
      browser: true,
    }),
  },
  {
    input: "src/index.ts",
    output: getOutput({
      minify: false,
      server: true,
    }),
    external:serverExternal,
    plugins: getPlugins({
      minify: false,
      browser:false,
    }),
  },
  {
    input: "src/index.web.ts",
    output: getOutput({
      minify: true,
      server: false,
    }),
    external,
    plugins: getPlugins({
      minify: true,
      browser:true,
    }),
  },
  {
    input: "src/index.ts",
    output: getOutput({
      minify: true,
      server: true,
    }),
    external:serverExternal,
    plugins: getPlugins({
      minify: true,
    }),
  },
];