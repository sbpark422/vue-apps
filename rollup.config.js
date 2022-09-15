// import hubsTest1 from './src/Apps/HubsTest1/rollup.config.js';
// import hubsTest2 from './src/Apps/HubsTest2/rollup.config.js';

// export default [
//   hubsTest1,
//   hubsTest2
// ];
import replace from '@rollup/plugin-replace'
import vue from 'rollup-plugin-vue'
//import postcss from 'rollup-plugin-postcss';
import rollupPluginNodeResolve from '@rollup/plugin-node-resolve'
import rollupUrl from '@rollup/plugin-url';
import virtual from '@rollup/plugin-virtual';
import { terser } from "rollup-plugin-terser";
import sourcemaps from 'rollup-plugin-sourcemaps';
//import copy from 'rollup-plugin-copy'
import typescript from '@rollup/plugin-typescript'
import css from 'rollup-plugin-css-only'
//import { writeFileSync } from 'fs';
//import url from 'url';

// import cssImport from "postcss-import"
// import cssUrl from 'postcss-url'

var componentPath
var serverPath
if ((process.env.BUILD !== 'production')) {
  componentPath = ""
    // your ngrok host name for local testing
    serverPath = "https://blair-vue-apps.ngrok.io";
} else {
    serverPath = "https://jspark474.github.io/vue-apps/";
}
var componentPath = serverPath + '/vue-apps/'
export default [{//["HubsTest1", "HubsTest2"].map((name, index) => ({
    //input: ["src/apps/HubsTest1/hubs.js", "src/apps/HubsTest2/hubs.js"],
    //input: `src/apps/${name}/hubs.js`,
    input: "hubs.ts",
    external: ['three'],
    context: 'window',
    output: [{
        dir: 'docs/dist',
        //entryFileNames: `${name}-iife.js`,
        //entryFileNames: "[name].js",
        //assetFileNames: "[name].[ext]",
        // manualChunks(id) {
        //     if (id.includes('node_modules')) {
        //       return 'vendor';
        //     }
        // },
        
        format: 'iife',
        globals: {
          three: 'THREE'
        },
        name: "vueComponents",
        sourcemap: 'inline'
      },
      {
        //file: `docs/dist/${name}.min.js`, 
        file: "docs/dist/hubs.min.js",
        //entryFileNames: `${name}.js`,
        //entryFileNames: "[name].min.js",

        format: 'iife', 
        globals: {
          three: 'THREE'
        },
        name: "vueComponents",
        plugins: [terser()]
      }
    ], 

    plugins: [
      // virtual({
      //     three: `export default THREE`
      // }),
    //   copy({
    //     targets: [
    //         // { src: ['src/assets/theme/fonts/*/*.ttf','src/assets/theme/fonts/*/*.eot','src/assets/theme/fonts/*/*.woff'], dest: 'docs/dist/public/fonts' },
    //         { src: ['node_modules/reveal.js/dist/*'], dest: 'docs/public/reveal' }
    //     ],
    //     verbose: true
    //   }),
    typescript({
        typescript: require('typescript'),
    }),

      rollupPluginNodeResolve(),
      rollupUrl({
        // by default, rollup-plugin-url will not handle font files
        include: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.gif', '**/*.woff', '**/*.woff2'],
        // setting infinite limit will ensure that the files 
        // are always bundled with the code, not copied to /dist
        //limit: Infinity,
        limit: 1000,
        publicPath: serverPath + '/vue-apps/dist/',
      }),
      replace({
          preventAssignment: true,
          'process.env.NODE_ENV': JSON.stringify( 'production' ),
          'https://resources.realitymedia.digital/vue-apps/': componentPath,
          'var vueComponents = (': 'export const vueComponents = (',

      }),
      vue({
          preprocessStyles: true,
          css: false
      }),
      css({output: "hubs.css"}),
      //css(),
    //   css({
    //       output: function (styles, styleNodes) {
    //         const keys = Object.keys(styleNodes);

    //         keys.forEach((key, index) => {
    //             let u = new URL ("file://" + key)
    //             console.log(u)
    //             let p = u.pathname
    //             console.log(p)
    //             let ps = p.split('/')
    //             console.log(ps)
    //             console.log(key)
    //           writeFileSync(key, styleNodes[key])
    //         })
    //       }
    //     }),
    //   postcss({
        // plugins: [
        //     cssUrl({
        //         url: "inline", // enable inline assets using base64 encoding
        //         maxSize: 1000, // maximum file size to inline (in kilobytes)
        //         publicPath: serverPath + '/vue-apps/dist/',
        //     })

        //   cssImport({
        //     plugins: [
        //         cssUrl(
        //           { filter: [
        //             'data:*', 'inline'
        //           ]},
        //           { filter: [
        //             // '../../../node_modules/reveal.js/dist/reveal.css', 
        //             // '../../../node_modules/reveal.js/dist/theme/white.css',
        //             //'src/assets/theme/fonts/**/*.eot', 'src/assets/theme/fonts/**/*.ttf', 'src/assets/theme/fonts/**/*.woff'], 
        //             '*.eot', '*.ttf', '*.woff'], 
        //             url: (asset) => `${serverPath}/vue-apps/dist/public/fonts/${asset.relativePath}`             
        //           }
        //         )]
        //   })
   // ]
    //  }),
      sourcemaps(),

    ]
  }
//   ,
//   {
//     input: ["room.js", "room-dev-url.js"],
//     output: {
//         dir: 'docs',
//         entryFileNames: "[name].js",
//         chunkFileNames: '[name].js',
//         format: 'es'
//     },
//     plugins: [
//         replace({
//             'https://resources.realitymedia.digital/vue-apps/': componentPath 
//         })
//     ]

//   }
]//))
