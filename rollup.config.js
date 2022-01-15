import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

import packageJson from './package.json';

const globals = {
	...packageJson.devDependencies,
	...packageJson.peerDependencies
};

export default [
	{
		input: 'src/index.ts',
		output: [
			{
				file: packageJson.main,
				format: 'esm',
				sourcemap: true
			}
		],
		plugins: [commonjs(), resolve(), typescript()],
		external: Object.keys(globals)
	},
	{
		input: 'src/index.ts',
		output: [
			{
				file: `lib/${packageJson.name}.cjs.js`,
				format: 'cjs',
				sourcemap: true
			}
		],
		plugins: [commonjs(), resolve(), typescript()],
		external: Object.keys(globals)
	},
	{
		input: 'src/index.ts',
		output: [
			{
				file: packageJson.browser,
				name: 'KME',
				format: 'umd',
				sourcemap: true
			}
		],
		plugins: [commonjs(), resolve(), typescript(), terser()],
		external: Object.keys(globals)
	},
	{
		input: 'src/index.ts',
		output: [
			{
				file: `lib/${packageJson.name}.iife.js`,
				name: 'KME',
				format: 'iife',
				sourcemap: true
			}
		],
		plugins: [commonjs(), resolve(), typescript(), terser()],
		external: Object.keys(globals)
	}
];
