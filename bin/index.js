#!/usr/bin/env node

const path = require('path');
const { writeFileSync, existsSync, mkdirSync } = require('fs');

const brandTokensPath = path.resolve(process.cwd(), '.jota', 'brand.scss').replace(/\\/g, '/');
const globalTokensPath = path.resolve(process.cwd(), '.jota', 'global.scss').replace(/\\/g, '/');

let bridge = '';

if (existsSync(brandTokensPath)) bridge += `@import "${brandTokensPath}";\n`;
if (existsSync(globalTokensPath)) bridge += `@import "${globalTokensPath}";\n`;

if (bridge) {
  const bridgeDir = path.resolve(__dirname, '../', 'build');
  if (!existsSync(bridgeDir)) {
    mkdirSync(bridgeDir, { recursive: true });
    writeFileSync(path.resolve(bridgeDir, 'bridge.scss'), bridge);
  }
}

require('./sass-render');
