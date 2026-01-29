#!/bin/sh

set -eu

TARGETS=$(cat <<'EOF'
ansi-styles@6.2.2
debug@4.4.2
chalk@5.6.1
supports-color@10.2.1
strip-ansi@7.1.1
ansi-regex@6.2.1
wrap-ansi@9.0.1
color-convert@3.1.1
color-name@2.0.1
is-arrayish@0.3.3
slice-ansi@7.1.1
color@5.0.1
color-string@2.1.1
simple-swizzle@0.2.3
supports-hyperlinks@4.1.1
has-ansi@6.0.1
chalk-template@1.1.1
backslash@0.2.1
error-ex@1.3.3
EOF
)

FOUND=""

warn() { printf "\033[33m%s\033[0m\n" "$*" >&2; }
ok()   { printf "\033[32m%s\033[0m\n" "$*"; }
bad()  { printf "\033[31m%s\033[0m\n" "$*"; }
info() { printf "\033[36m%s\033[0m\n" "$*"; }

has_file() { [ -f "$1" ]; }

check_pkgjson() {
  name="$1" ver="$2"
  if has_file package.json && grep -q "\"$name\"[[:space:]]*:[[:space:]]*\"$ver\"" package.json; then
    bad "package.json: $name@$ver (явно задекларирован)"
    FOUND="$FOUND\n$name@$ver [package.json]"
  fi
}

check_lock() {
  name="$1" ver="$2"
  if has_file package-lock.json && grep -q "$name.*$ver" package-lock.json; then
    bad "package-lock.json: $name@$ver (зафиксирован)"
    FOUND="$FOUND\n$name@$ver [package-lock.json]"
  fi
  if has_file yarn.lock && grep -q "^\"\\?$name@$ver" yarn.lock; then
    bad "yarn.lock: $name@$ver (зафиксирован)"
    FOUND="$FOUND\n$name@$ver [yarn.lock]"
  fi
  if has_file pnpm-lock.yaml && grep -q "/$name@$ver" pnpm-lock.yaml; then
    bad "pnpm-lock.yaml: $name@$ver (зафиксирован)"
    FOUND="$FOUND\n$name@$ver [pnpm-lock.yaml]"
  fi
}

check_node_modules() {
  name="$1" ver="$2"
  if command -v npm >/dev/null 2>&1; then
    if npm ls --all --parseable "$name@$ver" 2>/dev/null | grep -q "/node_modules/$name$"; then
      bad "node_modules: $name@$ver (фактически установлен)"
      FOUND="$FOUND\n$name@$ver [node_modules]"
    fi
  fi
}

info "Старт проверки в $(pwd)"

while IFS= read -r pair; do
  [ -z "$pair" ] && continue
  name=${pair%@*}
  ver=${pair#*@}
  echo "— Проверяю $name@$ver"
  check_pkgjson "$name" "$ver"
  check_lock "$name" "$ver"
  check_node_modules "$name" "$ver"
done <<EOF
$TARGETS
EOF

echo
if [ -n "$FOUND" ]; then
  bad "ОБНАРУЖЕНО совпадений:"
  printf "%b\n" "$FOUND" | sort -u
  echo
  exit 2
else
  ok "НЕ НАЙДЕНО совпадений с указанными скомпрометированными версиями."
  exit 0
fi
