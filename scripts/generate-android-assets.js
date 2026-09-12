import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Garante que os diretórios existam
const dirs = [
  path.resolve('public'),
  path.resolve('public/icons'),
  path.resolve('public/icons/android'),
  path.resolve('store-assets'),
];
dirs.forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// 1. SVG Oficial da Play Store (512x512, Square, Full bleed)
const playStoreSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1A252F"/>
      <stop offset="60%" stop-color="#2C3E50"/>
      <stop offset="100%" stop-color="#243342"/>
    </linearGradient>
    <linearGradient id="greenGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#27AE60"/>
      <stop offset="50%" stop-color="#2ECC71"/>
      <stop offset="100%" stop-color="#58D68D"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="16" flood-color="#27AE60" flood-opacity="0.45"/>
    </filter>
  </defs>
  <rect width="512" height="512" fill="url(#bgGrad)"/>
  <circle cx="256" cy="236" r="160" fill="none" stroke="#34495E" stroke-width="4" stroke-dasharray="10 8" opacity="0.7"/>
  <g filter="url(#glow)">
    <path d="M256 100 C256 100, 175 180, 175 260 C175 312, 210 350, 256 360 C302 350, 337 312, 337 260 C337 180, 256 100, 256 100 Z" fill="url(#greenGrad)"/>
    <path d="M256 140 C256 195, 235 242, 216 272" fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" opacity="0.85"/>
    <path d="M256 200 C266 226, 282 250, 294 266" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" opacity="0.75"/>
    <circle cx="256" cy="236" r="128" fill="none" stroke="#2ECC71" stroke-width="12" stroke-linecap="round" stroke-dasharray="440 70" transform="rotate(-40 256 236)"/>
    <circle cx="256" cy="96" r="13" fill="#FFFFFF"/>
  </g>
  <text x="256" y="440" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="54" fill="#ECF0F1" letter-spacing="4">
    na<tspan fill="#2ECC71">On</tspan>
  </text>
  <text x="256" y="475" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="600" font-size="16" fill="#BDC3C7" letter-spacing="3">
    SOBRIEDADE
  </text>
</svg>`;

// 2. SVG Splash Screen (1080x1920 Portrait)
const splashSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs>
    <radialGradient id="splashBg" cx="50%" cy="45%" r="60%">
      <stop offset="0%" stop-color="#34495E"/>
      <stop offset="60%" stop-color="#2C3E50"/>
      <stop offset="100%" stop-color="#1A252F"/>
    </radialGradient>
    <linearGradient id="splashGreen" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#27AE60"/>
      <stop offset="50%" stop-color="#2ECC71"/>
      <stop offset="100%" stop-color="#58D68D"/>
    </linearGradient>
    <filter id="splashGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#27AE60" flood-opacity="0.5"/>
    </filter>
  </defs>
  <rect width="1080" height="1920" fill="url(#splashBg)"/>
  <circle cx="540" cy="850" r="320" fill="none" stroke="#3D566E" stroke-width="2" stroke-dasharray="16 12" opacity="0.4"/>
  <circle cx="540" cy="850" r="420" fill="none" stroke="#27AE60" stroke-width="1.5" stroke-dasharray="8 16" opacity="0.2"/>
  <g filter="url(#splashGlow)" transform="translate(540, 820) scale(1.6) translate(-256, -256)">
    <path d="M256 100 C256 100, 175 180, 175 260 C175 312, 210 350, 256 360 C302 350, 337 312, 337 260 C337 180, 256 100, 256 100 Z" fill="url(#splashGreen)"/>
    <path d="M256 140 C256 195, 235 242, 216 272" fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" opacity="0.85"/>
    <path d="M256 200 C266 226, 282 250, 294 266" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" opacity="0.75"/>
    <circle cx="256" cy="236" r="128" fill="none" stroke="#2ECC71" stroke-width="12" stroke-linecap="round" stroke-dasharray="440 70" transform="rotate(-40 256 236)"/>
    <circle cx="256" cy="96" r="13" fill="#FFFFFF"/>
  </g>
  <text x="540" y="1180" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="88" fill="#ECF0F1" letter-spacing="6">
    na<tspan fill="#2ECC71">On</tspan>
  </text>
  <text x="540" y="1240" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="600" font-size="28" fill="#BDC3C7" letter-spacing="4">
    SUPORTE À SOBRIEDADE
  </text>
  <text x="540" y="1740" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="500" font-size="24" fill="#7F8C8D" letter-spacing="2">
    Só por hoje • Um dia de cada vez
  </text>
</svg>`;

// 3. SVG Feature Graphic Play Store (1024x500)
const featureGraphicSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 500" width="1024" height="500">
  <defs>
    <linearGradient id="featBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1A252F"/>
      <stop offset="50%" stop-color="#2C3E50"/>
      <stop offset="100%" stop-color="#1E2B37"/>
    </linearGradient>
    <linearGradient id="featGreen" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#27AE60"/>
      <stop offset="50%" stop-color="#2ECC71"/>
      <stop offset="100%" stop-color="#58D68D"/>
    </linearGradient>
    <filter id="featGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#27AE60" flood-opacity="0.4"/>
    </filter>
  </defs>
  <rect width="1024" height="500" fill="url(#featBg)"/>
  <circle cx="260" cy="250" r="180" fill="none" stroke="#3D566E" stroke-width="2" stroke-dasharray="12 10" opacity="0.4"/>
  <g filter="url(#featGlow)" transform="translate(260, 250) scale(0.9) translate(-256, -256)">
    <path d="M256 100 C256 100, 175 180, 175 260 C175 312, 210 350, 256 360 C302 350, 337 312, 337 260 C337 180, 256 100, 256 100 Z" fill="url(#featGreen)"/>
    <path d="M256 140 C256 195, 235 242, 216 272" fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" opacity="0.85"/>
    <path d="M256 200 C266 226, 282 250, 294 266" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" opacity="0.75"/>
    <circle cx="256" cy="236" r="128" fill="none" stroke="#2ECC71" stroke-width="12" stroke-linecap="round" stroke-dasharray="440 70" transform="rotate(-40 256 236)"/>
    <circle cx="256" cy="96" r="13" fill="#FFFFFF"/>
  </g>
  <g transform="translate(480, 180)">
    <text x="0" y="50" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="64" fill="#ECF0F1" letter-spacing="4">
      na<tspan fill="#2ECC71">On</tspan>
    </text>
    <text x="0" y="95" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="22" fill="#2ECC71" letter-spacing="2">
      SUPORTE À SOBRIEDADE
    </text>
    <text x="0" y="140" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="400" font-size="18" fill="#BDC3C7">
      Cronômetros ao vivo • Apoio Mútuo • Botão SOS 188
    </text>
    <rect x="0" y="170" width="220" height="42" rx="12" fill="#27AE60"/>
    <text x="110" y="197" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="15" fill="#FFFFFF">
      Disponível no Google Play
    </text>
  </g>
</svg>`;

// 4. Adaptive Foreground & Background
const adaptiveFgSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 432 432" width="432" height="432">
  <defs>
    <linearGradient id="afGreen" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#27AE60"/>
      <stop offset="50%" stop-color="#2ECC71"/>
      <stop offset="100%" stop-color="#58D68D"/>
    </linearGradient>
  </defs>
  <g transform="translate(216, 200) scale(0.65) translate(-256, -256)">
    <path d="M256 100 C256 100, 175 180, 175 260 C175 312, 210 350, 256 360 C302 350, 337 312, 337 260 C337 180, 256 100, 256 100 Z" fill="url(#afGreen)"/>
    <path d="M256 140 C256 195, 235 242, 216 272" fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" opacity="0.85"/>
    <path d="M256 200 C266 226, 282 250, 294 266" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" opacity="0.75"/>
    <circle cx="256" cy="236" r="128" fill="none" stroke="#2ECC71" stroke-width="12" stroke-linecap="round" stroke-dasharray="440 70" transform="rotate(-40 256 236)"/>
    <circle cx="256" cy="96" r="13" fill="#FFFFFF"/>
    <text x="256" y="440" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="52" fill="#ECF0F1">
      na<tspan fill="#2ECC71">On</tspan>
    </text>
  </g>
</svg>`;

const adaptiveBgSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 432 432" width="432" height="432">
  <rect width="432" height="432" fill="#2C3E50"/>
</svg>`;

async function run() {
  console.log('Iniciando geração de todos os ícones Android e Play Store...');

  const playStoreBuffer = Buffer.from(playStoreSvg);
  const splashBuffer = Buffer.from(splashSvg);
  const featureGraphicBuffer = Buffer.from(featureGraphicSvg);
  const adaptiveFgBuffer = Buffer.from(adaptiveFgSvg);
  const adaptiveBgBuffer = Buffer.from(adaptiveBgSvg);

  // 1. Google Play Store Hi-Res Icon (512x512 PNG, 32-bit, unmasked square)
  await sharp(playStoreBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.resolve('store-assets/google-play-icon-512x512.png'));

  await sharp(playStoreBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.resolve('public/playstore-icon-512x512.png'));

  // 2. Google Play Feature Graphic (1024x500 PNG)
  await sharp(featureGraphicBuffer)
    .resize(1024, 500)
    .png()
    .toFile(path.resolve('store-assets/google-play-feature-graphic-1024x500.png'));

  await sharp(featureGraphicBuffer)
    .resize(1024, 500)
    .png()
    .toFile(path.resolve('public/feature-graphic-1024x500.png'));

  // 3. Android Splash Screens
  await sharp(splashBuffer)
    .resize(1080, 1920)
    .png()
    .toFile(path.resolve('store-assets/android-splash-1080x1920.png'));

  await sharp(splashBuffer)
    .resize(1080, 1920)
    .png()
    .toFile(path.resolve('public/splash-screen.png'));

  await sharp(splashBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.resolve('public/splash-512x512.png'));

  // 4. Android Mipmap launcher icons
  const androidMipmaps = [
    { name: 'icon-48x48.png', size: 48 },    // mdpi
    { name: 'icon-72x72.png', size: 72 },    // hdpi
    { name: 'icon-96x96.png', size: 96 },    // xhdpi
    { name: 'icon-144x144.png', size: 144 }, // xxhdpi
    { name: 'icon-192x192.png', size: 192 }, // xxxhdpi
    { name: 'icon-512x512.png', size: 512 }, // store
  ];

  for (const item of androidMipmaps) {
    await sharp(playStoreBuffer)
      .resize(item.size, item.size)
      .png()
      .toFile(path.resolve(`public/icons/android/${item.name}`));
  }

  // 5. Android Adaptive Icons (Foreground & Background 432x432)
  await sharp(adaptiveFgBuffer)
    .resize(432, 432)
    .png()
    .toFile(path.resolve('public/icons/android/adaptive-foreground.png'));

  await sharp(adaptiveBgBuffer)
    .resize(432, 432)
    .png()
    .toFile(path.resolve('public/icons/android/adaptive-background.png'));

  console.log('✅ Todos os ícones Android, Splash Screen e ativos da Play Store foram gerados com sucesso!');
}

run().catch((err) => {
  console.error('Erro na geração:', err);
  process.exit(1);
});
