import path from 'path';

import { babel } from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const { data } = require('json-file').read('./package.json');

const year = new Date().getFullYear();

function getHeader() {
    return `/*!
 * Lieu v${data.version} (${data.homepage})
 * Copyright ${year} ${data.author}
 * Licensed under MIT (https://github.com/LeadrateMSK/lieu/blob/master/LICENSE)
 */`;
}

const pathCore = path.join(__dirname, 'src/lieu.js');
const pathUmd = path.join(__dirname, 'src/lieu.umd.js');

const bundles = [
    {
        input: pathCore,
        output: {
            banner: getHeader(),
            file: path.join(__dirname, 'dist/lieu.es.js'),
            format: 'esm',
        },
    },
    {
        input: pathCore,
        output: {
            banner: getHeader(),
            file: path.join(__dirname, 'dist/lieu.es.min.js'),
            format: 'esm',
        },
    },
    {
        input: pathUmd,
        output: {
            banner: getHeader(),
            name: 'lieu',
            file: path.join(__dirname, 'dist/lieu.umd.js'),
            format: 'umd',
        },
    },
    {
        input: pathUmd,
        output: {
            banner: getHeader(),
            name: 'lieu',
            file: path.join(__dirname, 'dist/lieu.umd.min.js'),
            format: 'umd',
        },
    },
    {
        input: pathCore,
        output: {
            banner: getHeader(),
            name: 'lieu.cjs',
            file: path.join(__dirname, 'dist/lieu.cjs'),
            format: 'cjs',
        },
    },
];

const configs = bundles.map(({ input: inputPath, output }) => ({
    input: inputPath,
    output,
    plugins: [
        nodeResolve(),
        babel({
            babelHelpers: 'bundled',
            plugins: ['annotate-pure-calls'],
        }),
        replace({
            __DEV__: false,
            preventAssignment: true,
        }),
        output.file.includes('.min.') && terser(),
    ],
}));

export default configs;
