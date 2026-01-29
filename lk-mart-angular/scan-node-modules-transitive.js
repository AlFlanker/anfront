
const { execSync } = require('child_process');

const bad = {
    "ansi-styles": ["6.2.2"],
    "debug": ["4.4.2"],
    "chalk": ["5.6.1"],
    "supports-color": ["10.2.1"],
    "strip-ansi": ["7.1.1"],
    "ansi-regex": ["6.2.1"],
    "wrap-ansi": ["9.0.1"],
    "color-convert": ["3.1.1"],
    "color-name": ["2.0.1"],
    "is-arrayish": ["0.3.3"],
    "slice-ansi": ["7.1.1"],
    "color": ["5.0.1"],
    "color-string": ["2.1.1"],
    "simple-swizzle": ["0.2.3"],
    "supports-hyperlinks": ["4.1.1"],
    "has-ansi": ["6.0.1"],
    "chalk-template": ["1.1.1"],
    "backslash": ["0.2.1"],
    "error-ex": ["1.3.3"]
};

let json;
try {
    json = execSync('npm ls --all --json', { stdio: ['ignore', 'pipe', 'pipe'] }).toString();
} catch (e) {
    json = e.stdout?.toString() || '{}';
}
const tree = JSON.parse(json);

const hits = [];
let total = 0;

function walk(name, node, pathChain = []) {
    if (!node || !node.version) return;
    total++;
    const coord = `${name}@${node.version}`;
    const pathStr = pathChain.concat(name).join(' > ');

    if (bad[name]) {
        const pack = bad[name];
        if (bad[name].includes(node.version)) {
            console.error(`⛔ Найден запрещённый пакет: ${name}, версия ${node.version}, путь: ${pathStr}`);
            hits.push({ name, version: node.version, path: pathStr });
        } else {
            console.log(`✅ Обнаружил проблемный пакет: ${name}, версия ${node.version}, проблемная версия ${pack}, путь: ${pathStr} - пропускаем`);
        }
    }

    const deps = node.dependencies || {};
    for (const [childName, childNode] of Object.entries(deps)) {
        walk(childName, childNode, pathChain.concat(name));
    }
}

for (const [name, node] of Object.entries(tree.dependencies || {})) {
    walk(name, node, []);
}

console.log(`\nВсего просмотрено зависимостей: ${total}`);

if (hits.length === 0) {
    console.log('✅ В node_modules транзитивных совпадений не найдено.');
    process.exit(0);
} else {
    console.error('\n❌ Найдены установленные совпадения:');
    for (const h of hits) {
        console.error(` - ${h.name}@${h.version}  via ${h.path}`);
    }
    process.exit(2);
}
