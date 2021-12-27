import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
//import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

// this override is needed because Module format cjs does not support top-level await
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('./package.json');

const globals = {
  ...packageJson.devDependencies,
};

/*
export default {
  input: 'src/index.ts',
  output: [
    {
      file: packageJson.browser,
      name: 'KME',
      format: 'umd',
      sourcemap: true
    },
    {
      file: packageJson.main,
      format: 'esm',
      sourcemap: true
    },
  ],
  plugins: [
    typescript(),
    resolve()
  ],
	external: Object.keys(globals),
}
*/

export default [{
  input: 'src/index.ts',
  output: [
    {
      file: packageJson.browser,
      name: 'KME',
      format: 'umd',
      sourcemap: true
    }
  ],
  plugins: [
    typescript(),
    resolve()
  ]
},
{
  input: 'src/index.ts',
  output: [
    {
      file: packageJson.main,
      format: 'esm',
      sourcemap: true
    },
  ],
  plugins: [
    peerDepsExternal(),
    typescript(),
    resolve()
  ],
	external: Object.keys(globals),
}];

// Other useful plugins you might want to add are:
// @rollup/plugin-images - import image files into your components
// @rollup/plugin-json - import JSON files into your components
// rollup-plugin-terser - minify the Rollup bundle