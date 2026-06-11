import { svg } from "../svg";

// NextVault circle-N badge, replacing the upstream Vaultwarden gear-shield.
// Shown as the collapsed side-nav logo (nav-logo closedIcon). Copied over
// libs/assets/src/svg/svgs/shield.ts by scripts/rebrand.sh before the web
// client is built. Keeps the upstream export name so imports resolve.
const BitwardenShield = svg`
<svg version="1.1" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
  <title>NextVault</title>
  <defs>
    <linearGradient id="nv-shield" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#F7A82A"/>
      <stop offset="1" stop-color="#E8870E"/>
    </linearGradient>
  </defs>
  <circle cx="30" cy="30" r="29" fill="url(#nv-shield)"/>
  <path fill="#FFFFFF" d="M17 45 L17 15 L25 15 L36 33 L36 15 L43 15 L43 45 L35 45 L24 27 L24 45 Z"/>
  <path fill="#E8870E" d="M17 45 L24 45 L24 36 Z"/>
</svg>
`;

export { BitwardenShield };
