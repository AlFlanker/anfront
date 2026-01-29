const fs = require('fs');
const path = require('path');

const BLACKLIST = new Map(Object.entries({
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
    "error-ex": ["1.3.3"],
}));

function isBad(name, version) {
    const list = BLACKLIST.get(name);
    if (Array.isArray(list)) {
        if (list.includes(version)) {
            console.error(`⛔ Найден запрещённый пакет: ${name}, текущая версия ${version} == проблемная версия ${list} ❗`)
        } else {
            console.log(`✅ Обнаружил проблемный пакет: ${name}, текущая версия ${version}, проблемная версия ${list} - пропускаем`);
        }

    }
    return Array.isArray(list) && list.includes(version);
}

const lock = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'));
const hits = [];

// npm v7+ (lockfile v2/v3): lock.packages
if (lock.packages && typeof lock.packages === 'object') {
    for (const [key, val] of Object.entries(lock.packages)) {
        if (!val || !val.version) continue;
        let name = val.name;
        if (!name) {
            const parts = key.split('node_modules/').filter(Boolean);
            if (parts.length) name = parts[parts.length - 1].replace(/\/$/, '');
        }
        if (!name) continue;
        if (isBad(name, val.version)) {
            hits.push({ name, version: val.version, where: key || '(root)' });
        }
    }
} else if (lock.dependencies) {
    const walk = (deps, prefix = '') => {
        for (const [name, meta] of Object.entries(deps)) {
            if (!meta || !meta.version) continue;
            if (isBad(name, meta.version)) {
                hits.push({ name, version: meta.version, where: path.posix.join(prefix, name) });
            }
            if (meta.dependencies) walk(meta.dependencies, path.posix.join(prefix, name));
        }
    };
    walk(lock.dependencies);
} else {
    console.error('Неизвестный формат package-lock.json');
    process.exit(2);
}

if (hits.length === 0) {
    console.log('✅ В lock-файле транзитивных совпадений не найдено.');
    process.exit(0);
} else {
    console.error('❌ Найдены совпадения в lock-файле:');
    for (const h of hits) {
        console.error(` - ${h.name}@${h.version}  [${h.where}]`);
    }
    process.exit(2);
}
