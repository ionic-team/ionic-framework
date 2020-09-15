
const path = require('path');
const { rollup } = require('rollup');
const virtual = require('@rollup/plugin-virtual');
const fs = require('fs');

async function main() {
  const input = process.argv[2] || getMainEntry();
	const result = await check(input);
	const relative = path.relative(process.cwd(), input);

	if (result.shaken) {
		console.error(`Success! ${relative} is fully tree-shakeable`);
	} else {
		error(`Failed to tree-shake ${relative}`);
	};
}


function error(msg) {
	console.error(msg);
	process.exit(1);
}

function getMainEntry() {
	if (!fs.existsSync('package.json')) {
		error(`Could not find package.json`);
	}

	const pkg = JSON.parse(fs.readFileSync('package.json'), 'utf-8');

	const unresolved = pkg.module || pkg.main || 'index';
	const resolved = resolve(unresolved);

	if (!resolved) {
		error(`Could not resolve entry point`);
	}

	return resolved;
}

function resolve(file) {
	if (isDirectory(file)) {
		return if_exists(`${file}/index.cjs.js`) || if_exists(`${file}/index.js`);
	}

	return if_exists(file) || if_exists(`${file}.cjs.js`) || if_exists(`${file}.js`);
}

function isDirectory(file) {
	try {
		const stats = fs.statSync(file);
		return stats.isDirectory();
	} catch (err) {
		return false;
	}
}

function if_exists(file) {
	return fs.existsSync(file) ? file : null;
}

const check = input => {
	const resolved = path.resolve(input);

	return rollup({
		input: '__agadoo__',
		plugins: [
			virtual({
				__agadoo__: `import ${JSON.stringify(resolved)}`,
				'tslib': '',
			})
		],
		onwarn: (warning, handle) => {
			if (warning.code !== 'EMPTY_BUNDLE') handle(warning);
		}
	}).then(bundle => bundle.generate({
		format: 'es'
	})).then(o => {
		const output = o.output;
		console.log(output);
		return {
			shaken: output.length === 1 && output[0].code.trim() === ''
		};
	});
};

main();
