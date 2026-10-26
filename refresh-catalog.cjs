#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const root = path.resolve(__dirname);
const manifestPath = path.join(root, 'catalog.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
function readIpkMembers(buffer, packageId) {
  const magic = Buffer.from('!<arch>\n', 'ascii');
  if (!buffer.subarray(0, magic.length).equals(magic)) throw new Error(`Invalid ar magic: ${packageId}`);
  const members = [];
  let offset = magic.length;
  while (offset < buffer.length) {
    const header = buffer.subarray(offset, offset + 60);
    if (header.length !== 60 || header.subarray(58, 60).toString('ascii') !== '`\n') throw new Error(`Invalid ar header: ${packageId}`);
    const name = header.subarray(0, 16).toString('ascii').trim().replace(/\/$/, '');
    const sizeText = header.subarray(48, 58).toString('ascii').trim();
    const size = Number(sizeText);
    if (!/^\d+$/.test(sizeText) || !Number.isSafeInteger(size)) throw new Error(`Invalid ar member size: ${packageId}/${name}`);
    if (header.subarray(48, 58).toString('ascii') !== String(size).padEnd(10, ' ')) throw new Error(`Noncanonical ar size field: ${packageId}/${name}`);
    const start = offset + 60;
    const end = start + size;
    if (end > buffer.length) throw new Error(`Truncated ar member: ${packageId}/${name}`);
    members.push({name, body:buffer.subarray(start, end)});
    offset = end + (size & 1);
  }
  const expectedNames = ['debian-binary', 'control.tar.gz', 'data.tar.gz'];
  if (members.map(member => member.name).join(',') !== expectedNames.join(',')) throw new Error(`Unexpected IPK members: ${packageId}`);
  if (!members[0].body.equals(Buffer.from('2.0\n', 'ascii'))) throw new Error(`Invalid debian-binary marker: ${packageId}`);
  for (const member of members.slice(1)) {
    if (member.body[0] !== 0x1f || member.body[1] !== 0x8b) throw new Error(`Invalid gzip member: ${packageId}/${member.name}`);
  }
}
for (const game of manifest.games) {
  const rel = game.ipk;
  if (typeof rel !== 'string' || rel.includes('..') || path.isAbsolute(rel)) throw new Error('Unsafe package path');
  const file = path.join(root, rel);
  const packageData = fs.readFileSync(file);
  readIpkMembers(packageData, game.id);
  const digest = crypto.createHash('sha256').update(packageData).digest('hex');
  if (game.sha256 && game.sha256 !== 'TO_BE_GENERATED' && game.sha256 !== digest) throw new Error(`Digest mismatch: ${game.id}`);
  game.sha256 = digest;
  if (game.architecture !== 'arm' || game.appId !== game.id) throw new Error(`Invalid target metadata: ${game.id}`);
}
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(`Indexed ${manifest.games.length} ARM IPKs`);
