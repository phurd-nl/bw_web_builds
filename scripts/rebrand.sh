#!/usr/bin/env bash
# NextVault rebrand: overlay brand assets + swap user-visible "Vaultwarden" display strings
# in the checked-out web client BEFORE it is built. Runs inside the container build between
# checkout_web_vault.sh and build_web_vault.sh.
#
# Fails loudly if an expected source string is missing — a future web-vault version bump that
# moves these strings must be noticed, not silently ship upstream branding on the login page.
set -o pipefail -o errexit
BASEDIR=$(RL=$(readlink -n "$0"); SP="${RL:-$0}"; dirname "$(cd "$(dirname "${SP}")"; pwd)/$(basename "${SP}")")

# Load default script environment variables (provides VAULT_FOLDER)
# shellcheck source=.script_env
. "${BASEDIR}/.script_env"

SRC="${VAULT_FOLDER}/apps/web/src"
OVERLAY="${BASEDIR}/../nextvault-brand/overlay"

if [ ! -d "${SRC}" ]; then
  echo "rebrand: web client src not found at ${SRC}" >&2
  exit 1
fi
if [ ! -d "${OVERLAY}" ]; then
  echo "rebrand: brand overlay not found at ${OVERLAY}" >&2
  exit 1
fi

echo "==> NextVault rebrand: overlaying brand assets"
cp -rv "${OVERLAY}/." "${SRC}/"

# Inline-SVG brand components live outside apps/web/src, so they can't ride the
# overlay copy above. Every file in nextvault-brand/svgs/ replaces its namesake
# in libs/assets/src/svg/svgs/ (vault.icon.ts = login hero, bitwarden-logo.icon.ts
# = login/landing header, shield.ts = collapsed side-nav, password-manager.ts =
# open side-nav). Exports keep upstream names so imports resolve unchanged.
SVGS_DST="${VAULT_FOLDER}/libs/assets/src/svg/svgs"
for src in "${BASEDIR}/../nextvault-brand/svgs/"*.ts; do
  name="$(basename "$src")"
  if [ ! -f "${SVGS_DST}/${name}" ]; then
    echo "rebrand: expected upstream SVG component not found: ${SVGS_DST}/${name}" >&2
    echo "rebrand: web client structure likely changed across versions — update scripts/rebrand.sh" >&2
    exit 1
  fi
  cp -v "$src" "${SVGS_DST}/${name}"
  echo "    rebranded: libs/assets/src/svg/svgs/${name}"
done

# replace OLD NEW FILE  — verifies OLD exists, replaces, verifies NEW lands.
replace() {
  local old="$1" new="$2" file="$3"
  if ! grep -qF -- "$old" "$file"; then
    echo "rebrand: expected string not found in ${file}: '${old}'" >&2
    echo "rebrand: web client structure likely changed across versions — update scripts/rebrand.sh" >&2
    exit 1
  fi
  # Use a non-/ delimiter; escape & and \ in replacement, | in both.
  local o n
  o=$(printf '%s' "$old" | sed -e 's/[|\\]/\\&/g')
  n=$(printf '%s' "$new" | sed -e 's/[|\\&]/\\&/g')
  sed -i "s|${o}|${n}|g" "$file"
  grep -qF -- "$new" "$file" || { echo "rebrand: replacement failed in ${file}" >&2; exit 1; }
  echo "    rebranded: ${file#"${SRC}"/}"
}

# Theme overrides: appended to the end of the component-library theme so they
# win the cascade. Sentinel checks fail loudly if upstream moves/renames the
# variables this file overrides.
TW_THEME="${VAULT_FOLDER}/libs/components/src/tw-theme.css"
if ! grep -q -- '--color-brand-600:' "${TW_THEME}" 2>/dev/null; then
  echo "rebrand: theme variables not found in ${TW_THEME}" >&2
  echo "rebrand: web client theme structure likely changed — update theme-overrides.css + rebrand.sh" >&2
  exit 1
fi
cat "${BASEDIR}/../nextvault-brand/theme-overrides.css" >> "${TW_THEME}"
grep -q 'NextVault theme overrides' "${TW_THEME}" || { echo "rebrand: theme append failed" >&2; exit 1; }
echo "    rebranded: libs/components/src/tw-theme.css (NextVault theme appended)"

echo "==> NextVault rebrand: swapping display strings"

# Browser tab title + logo alt + brand accent colors (Bitwarden blue -> NextVault orange)
replace '>Vaultwarden Web<' '>NextVault Web<' "${SRC}/index.html"
replace 'alt="Vaultwarden"' 'alt="NextVault"' "${SRC}/index.html"
replace 'content="#175DDC"' 'content="#E8870E"' "${SRC}/index.html"
replace 'color="#175DDC"'   'color="#E8870E"'   "${SRC}/index.html"

# PWA manifest name
replace '"name": "Vaultwarden Web"' '"name": "NextVault Web"' "${SRC}/manifest.json"

# In-app logo alt
replace 'alt="Vaultwarden"' 'alt="NextVault"' "${SRC}/app/app.component.html"

# Default document title
replace '"Vaultwarden Web"' '"NextVault Web"' "${SRC}/app/core/router.service.ts"

# Footer brand line + legal disclaimer (keep the Bitwarden trademark attribution intact)
replace '>Vaultwarden Web<' '>NextVault Web<' "${SRC}/app/layouts/frontend-layout.component.html"
replace 'for Vaultwarden (an' 'for NextVault (an' "${SRC}/app/layouts/frontend-layout.component.html"
replace 'Vaultwarden is not associated' 'NextVault is not associated' "${SRC}/app/layouts/frontend-layout.component.html"

# Login page (anon-layout) footer — shared component lib, same strings as the app footer.
# This is the most visible surface (unauthenticated landing/login page).
ANON="${VAULT_FOLDER}/libs/components/src/anon-layout/anon-layout.component.html"
replace '>Vaultwarden Web<' '>NextVault Web<' "$ANON"
replace 'for Vaultwarden (an' 'for NextVault (an' "$ANON"
replace 'Vaultwarden is not associated' 'NextVault is not associated' "$ANON"

# Duo 2FA redirect logo alt
replace 'alt="Vaultwarden"' 'alt="NextVault"' "${SRC}/connectors/duo-redirect.html"

# TOTP issuer label shown in authenticator apps for account 2FA
replace 'otpauth://totp/Vaultwarden:' 'otpauth://totp/NextVault:' "${SRC}/app/auth/settings/two-factor/two-factor-setup-authenticator.component.ts"
replace '&issuer=Vaultwarden' '&issuer=NextVault' "${SRC}/app/auth/settings/two-factor/two-factor-setup-authenticator.component.ts"

# Safety net: no user-facing "Vaultwarden Web" text node may survive in any HTML
# template across apps/ or libs/. Catches strings that move/appear in a future
# web-vault version bump before they ship to the login page.
if grep -rn '>Vaultwarden Web<' "${VAULT_FOLDER}/apps" "${VAULT_FOLDER}/libs" 2>/dev/null; then
  echo "rebrand: residual '>Vaultwarden Web<' template text above — add the file to rebrand.sh" >&2
  exit 1
fi

echo "==> NextVault rebrand: done"
