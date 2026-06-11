import { svg } from "../svg";

// NextVault wordmark (circle-N + NEXT/VAULT), replacing the upstream
// Vaultwarden logo. Shown in the login-page (anon-layout) and landing headers.
// Copied over libs/assets/src/svg/svgs/bitwarden-logo.icon.ts by
// scripts/rebrand.sh before the web client is built.
export const BitwardenLogo = svg`
<svg version="1.1" viewBox="0 0 290 60" xmlns="http://www.w3.org/2000/svg">
  <title>NextVault</title>
  <defs>
    <linearGradient id="nv-logo" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#F7A82A"/>
      <stop offset="1" stop-color="#E8870E"/>
    </linearGradient>
  </defs>
  <circle cx="30" cy="30" r="27" fill="url(#nv-logo)"/>
  <path fill="#FFFFFF" d="M18 44 L18 16 L25.5 16 L35.5 32.5 L35.5 16 L42 16 L42 44 L34.5 44 L24.5 27.5 L24.5 44 Z"/>
  <path fill="#E8870E" d="M18 44 L24.5 44 L24.5 35.5 Z"/>
  <text x="66" y="40" font-family="'Helvetica Neue',Arial,Helvetica,sans-serif" font-size="30" font-weight="800" letter-spacing="0.5">
    <tspan fill="#F49E1B">NEXT</tspan><tspan fill="#8A8D90" font-style="italic">VAULT</tspan>
  </text>
</svg>
`;
