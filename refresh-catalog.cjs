#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const root = path.resolve(__dirname);
const manifestPath = path.join(root, 'catalog.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
for (const game of manifest.games) {
  const rel = game.ipk;
  if (typeof rel !== 'string' || rel.includes('..') || path.isAbsolute(rel)) throw new Error('Unsafe package path');
  const file = path.join(root, rel);
  const digest = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  if (game.sha256 && game.sha256 !== 'TO_BE_GENERATED' && game.sha256 !== digest) throw new Error(`Digest mismatch: ${game.id}`);
  game.sha256 = digest;
  if (game.architecture !== 'arm' || game.appId !== game.id) throw new Error(`Invalid target metadata: ${game.id}`);
}
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(`Indexed ${manifest.games.length} ARM IPKs`);
