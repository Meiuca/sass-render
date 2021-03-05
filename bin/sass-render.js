#!/usr/bin/env node

/* eslint-disable no-console */

const path = require('path');
const glob = require('glob');
const { promisify } = require('util');
const fs = require('fs');
const sass = require('sass');
const { argv } = require('process');

let compiledFiles = 0;

function css(sassFile) {
  return sass
    .renderSync({
      file: sassFile,
      includePaths: [path.resolve(process.cwd(), 'node_modules')],
      outputStyle: 'expanded',
    })
    .css.toString();
}

const template = "import { css } from 'lit-element';\n\nexport default css` {c} `;";

/**
 *
 * @param {string} sassFile
 * @returns
 */
function render(sassFile) {
  if (path.basename(sassFile).startsWith('_')) return;

  console.log(`Rendering ${sassFile}...`);

  const newContent = template.replace('{c}', css(sassFile));

  fs.writeFileSync(sassFile.replace(/\.\w*$/, '-css.js'), newContent);

  compiledFiles += 1;
}

const globPromise = promisify(glob);

(async () => {
  try {
    // 'src/**/*.scss'
    const files = await globPromise(argv[argv.length - 1]);

    files.forEach(render);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }

  console.log(`Compiled ${compiledFiles} file(s)`);
})();
