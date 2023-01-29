import typescript from 'rollup-plugin-typescript2';
import terser from '@rollup/plugin-terser';

import packageJson from './package.json' assert { type: "json" };

const DEPENDENCIES = {
	...packageJson.devDependencies,
	...packageJson.peerDependencies,
};

export default [
	{
		input: 'src/index.ts',
		output: [
			{
				file: packageJson.module,
				format: 'esm',
				sourcemap: true,
			},
		],
		plugins: [typescript()],
		external: Object.keys(DEPENDENCIES),
	},
	{
		input: 'src/index.ts',
		output: [
			{
				file: packageJson.main,
				format: 'cjs',
				sourcemap: true,
			},
		],
		plugins: [typescript()],
		external: Object.keys(DEPENDENCIES),
	},
	{
		input: 'src/index.ts',
		output: [
			{
				file: packageJson.browser,
				name: 'KME',
				format: 'umd',
				sourcemap: true,
			},
		],
		plugins: [typescript(), terser()],
		external: Object.keys(DEPENDENCIES),
	},
];
