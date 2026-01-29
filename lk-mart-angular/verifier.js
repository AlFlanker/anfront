const fs = require('fs');
// node verifier.js
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const lock = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'));

for (const [name, range] of Object.entries(pkg.devDependencies || {})) {
    const locked = lock.packages?.[`node_modules/${name}`]?.version;
    if (!locked) {
        console.error(`❌ ${name} отсутствует в package-lock.json`);
    } else {
        console.log(`✔ ${name} зафиксирован как ${locked} (package.json: ${range})`);
    }
}
