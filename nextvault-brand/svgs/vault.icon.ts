import { svg } from "../svg";

// NextVault circle-N badge (Nextlink/NextPass orange), replacing the upstream
// Bitwarden safe illustration. Same viewBox as upstream so anon-layout sizing
// is unchanged. Copied over libs/assets/src/svg/svgs/vault.icon.ts by
// scripts/rebrand.sh before the web client is built.
export const VaultIcon = svg`
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 8.33 80 66.67">
    <defs>
      <linearGradient id="nv-hero" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#F7A82A"/>
        <stop offset="1" stop-color="#E8870E"/>
      </linearGradient>
    </defs>
    <g transform="translate(6.665 8.33) scale(1.11117)">
      <circle cx="30" cy="30" r="29" fill="url(#nv-hero)"/>
      <path fill="#FFFFFF" d="M17 45 L17 15 L25 15 L36 33 L36 15 L43 15 L43 45 L35 45 L24 27 L24 45 Z"/>
      <path fill="#E8870E" d="M17 45 L24 45 L24 36 Z"/>
    </g>
  </svg>
`;
