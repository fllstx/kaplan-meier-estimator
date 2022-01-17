import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

import packageJson from './package.json';

const globals = {
	...packageJson.devDependencies,
	...packageJson.peerDependencies
};

// get the package name without the scope
const packageName = packageJson.name.includes('/')
	? packageJson.name.split('/')[1]
	: packageJson.name;

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
		plugins: [typescript()],
		external: Object.keys(globals)
	},
	{
		input: 'src/index.ts',
		output: [
			{
				file: `lib/${packageName}.cjs.js`,
				format: 'cjs',
				sourcemap: true
			}
		],
		plugins: [typescript()],
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
		plugins: [typescript(), terser()],
		external: Object.keys(globals)
	}
];
