const fs = require('fs');

const packageFile = fs.readFileSync('./package.json');
const pack = JSON.parse(packageFile);

const v = pack.version.split('.');
v[v.length-1] = Number(v[v.length-1]) + 1;
pack.version = v.join('.');

const newPack = JSON.stringify(pack, null, 4);

fs.writeFileSync('./package.json', newPack);
