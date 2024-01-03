/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const esbuildPluginPino = require('esbuild-plugin-pino');
const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');
const pkg = require('./package.json');

let fileArray = [];
const getFilesRecursively = (dir) => {
	const files = fs.readdirSync(dir);
	files.forEach((file) => {
		const filePath = path.join(dir, file);
		if (fs.statSync(filePath).isDirectory()) {
			getFilesRecursively(filePath);
		} else {
			fileArray.push(filePath);
		}
	});
};

getFilesRecursively('src');

const entryPoints = fileArray.filter((file) => file.endsWith('.ts'));

esbuild.build({
	entryPoints,
	logLevel: 'info',
	outdir: 'dist',
	bundle: true,
	platform: 'node',
	format: 'cjs',
	minify: true,
	sourcemap: true,
	external: [
		...Object.keys(pkg.dependencies || {}),
		...Object.keys(pkg.peerDependencies || {}),
	],
	plugins: [esbuildPluginPino({ transports: ['pino-pretty'] })],
});
