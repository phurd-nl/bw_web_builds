import { svg } from "../svg";

// NextVault wordmark in the 800x200 Password Manager logo slot, replacing the
// upstream Vaultwarden product logo. Shown as the open side-nav logo on every
// authenticated page (user-layout). Copied over
// libs/assets/src/svg/svgs/password-manager.ts by scripts/rebrand.sh before
// the web client is built. Keeps the upstream export name so imports resolve.
const PasswordManagerLogo = svg`
<svg version="1.1" viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg">
  <title>NextVault</title>
  <defs>
    <linearGradient id="nv-pm" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#F7A82A"/>
      <stop offset="1" stop-color="#E8870E"/>
    </linearGradient>
  </defs>
  <g transform="translate(0 17.24) scale(2.7586)">
    <circle cx="30" cy="30" r="27" fill="url(#nv-pm)"/>
    <path fill="#FFFFFF" d="M18 44 L18 16 L25.5 16 L35.5 32.5 L35.5 16 L42 16 L42 44 L34.5 44 L24.5 27.5 L24.5 44 Z"/>
    <path fill="#E8870E" d="M18 44 L24.5 44 L24.5 35.5 Z"/>
    <text x="66" y="40" font-family="'Helvetica Neue',Arial,Helvetica,sans-serif" font-size="30" font-weight="800" letter-spacing="0.5">
      <tspan fill="#F49E1B">NEXT</tspan><tspan fill="#8A8D90" font-style="italic">VAULT</tspan>
    </text>
  </g>
</svg>
`;

export default PasswordManagerLogo;
