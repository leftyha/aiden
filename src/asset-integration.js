const assetMap = new Map([
  ['/assets/backgrounds/dawn.webp', '/dia.png'],
  ['/assets/backgrounds/clearing.webp', '/selva.png'],
  ['/assets/backgrounds/night.webp', '/noche.png'],
  ['/assets/backgrounds/party.webp', '/fiesta dia.png'],
  ['/assets/decor/foreground.webp', '/marco-dia.png'],
  ['/assets/decor/night-frame.webp', '/marco-noche.png'],
  ['/assets/characters/aiden-sitting-lion.webp', '/aiden-sentado.png'],
  ['/assets/characters/aiden-crawling.webp', '/aiden gateando.png'],
  ['/assets/characters/aiden-standing-green.webp', '/aiden de pie.png'],
  ['/assets/characters/aiden-standing-blue.webp', '/aiden de pie.png'],
  ['/assets/characters/aiden-waving.webp', '/aiden saludando.png'],
  ['/assets/animals/elephant.webp', '/elefante.png'],
  ['/assets/animals/giraffe.webp', '/jirafa.png'],
  ['/assets/animals/zebra.webp', '/Cebra.png'],
  ['/assets/animals/toucan.webp', '/tucan.png'],
  ['/assets/photos/aiden-01.webp', '/aiden-sentado.png'],
  ['/assets/photos/aiden-02.webp', '/aiden gateando.png'],
  ['/assets/photos/aiden-03.webp', '/aiden de pie.png'],
  ['/assets/photos/aiden-04.webp', '/aiden saludando.png'],
  ['/assets/photos/aiden-05.webp', '/aiden-sentado.png'],
  ['/assets/photos/aiden-07.webp', '/aiden saludando.png'],
  ['/assets/photos/aiden-08.webp', '/aiden gateando.png'],
  ['/assets/photos/aiden-09.webp', '/aiden de pie.png'],
]);

const hiddenAssets = new Set([
  '/assets/animals/lion.webp',
  '/assets/animals/monkey.webp',
]);

function resolveImageAssets() {
  document.querySelectorAll('img[src]').forEach((image) => {
    const source = image.getAttribute('src');
    if (hiddenAssets.has(source)) {
      image.hidden = true;
      image.setAttribute('aria-hidden', 'true');
      return;
    }
    const replacement = assetMap.get(source);
    if (replacement) image.setAttribute('src', replacement);
  });
}

const decorations = {
  dawn: [
    ['lianas/sprite_0004.png', 'decor decor--top-left', 1.6],
    ['lianas/sprite_0012.png', 'decor decor--top-right', 1.2],
    ['arbustos-plantas/sprite_0002.png', 'decor decor--bottom-left', 0.8],
    ['flores/sprite_0001.png', 'decor decor--bottom-right decor--small', 1.3],
  ],
  arrival: [
    ['arbustos-plantas/sprite_0010.png', 'decor decor--bottom-left', 1.1],
    ['flores/sprite_0004.png', 'decor decor--bottom-right decor--small', 1.5],
    ['lianas/sprite_0018.png', 'decor decor--top-right', 1.4],
  ],
  night: [
    ['lianas/sprite_0008.png', 'decor decor--top-left decor--night', 1.4],
    ['deco-2-small/sprite_0007.png', 'decor decor--float-left decor--tiny', 1.8],
    ['deco-2-small/sprite_0014.png', 'decor decor--float-right decor--tiny', 2.1],
  ],
  personality: [
    ['flores/sprite_0006.png', 'decor decor--bottom-left decor--small', 1.1],
    ['arbustos-plantas/sprite_0015.png', 'decor decor--bottom-right', 0.8],
  ],
  awakening: [
    ['decorativos-fiesta/sprite_0000.png', 'decor decor--top-left decor--party', 1.4],
    ['decorativos-fiesta/sprite_0003.png', 'decor decor--top-right decor--party', 1.7],
    ['decorativos-fiesta/sprite_0011.png', 'decor decor--bottom-center decor--party-small', 1.2],
  ],
  invitation: [
    ['carteles/sprite_0002.png', 'decor decor--sign', 0.9],
    ['decorativos-fiesta/sprite_0017.png', 'decor decor--top-right decor--party-small', 1.6],
    ['flores/sprite_0012.png', 'decor decor--bottom-right decor--small', 1.3],
  ],
  details: [
    ['carteles/sprite_0010.png', 'decor decor--top-left decor--sign-small', 1.1],
    ['arbustos-plantas/sprite_0020.png', 'decor decor--bottom-right', 0.8],
  ],
  closing: [
    ['decorativos-fiesta/sprite_0021.png', 'decor decor--bottom-left decor--party-small', 1.2],
    ['decorativos-fiesta/sprite_0028.png', 'decor decor--bottom-right decor--party-small', 1.4],
  ],
};

function addDecorations() {
  Object.entries(decorations).forEach(([sceneName, items]) => {
    const scene = document.querySelector(`[data-scene="${sceneName}"]`);
    if (!scene) return;
    const fragment = document.createDocumentFragment();
    items.forEach(([src, className, speed], index) => {
      const image = document.createElement('img');
      image.src = `/${src}`;
      image.alt = '';
      image.loading = sceneName === 'dawn' ? 'eager' : 'lazy';
      image.decoding = 'async';
      image.className = `${className} parallax`;
      image.dataset.speed = String(speed);
      image.dataset.decorIndex = String(index);
      image.setAttribute('aria-hidden', 'true');
      fragment.append(image);
    });
    scene.append(fragment);
  });
}

function markIllustratedGallery() {
  document.querySelectorAll('#galleryTrack figure').forEach((figure) => {
    figure.classList.add('gallery-card--illustrated');
  });
  const intro = document.querySelector('[data-scene="gallery"] .story-copy p');
  if (intro) {
    intro.textContent = 'Mientras incorporamos sus fotografías reales, recorremos su historia a través de las caricaturas creadas especialmente para Aiden.';
  }
}

function injectStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .gate__mist{background-image:url('/noche.png')!important}
    .decor{position:absolute;z-index:1;pointer-events:none;user-select:none;object-fit:contain;filter:drop-shadow(0 18px 18px rgba(6,31,21,.2));will-change:transform}
    .decor--top-left{top:-3%;left:-3%;width:min(35vw,520px)}
    .decor--top-right{top:-4%;right:-4%;width:min(35vw,520px)}
    .decor--bottom-left{bottom:-5%;left:-4%;width:min(34vw,500px)}
    .decor--bottom-right{bottom:-5%;right:-4%;width:min(34vw,500px)}
    .decor--bottom-center{bottom:-5%;left:50%;transform:translateX(-50%);width:min(42vw,620px)}
    .decor--float-left{left:8%;top:32%;width:min(12vw,150px)}
    .decor--float-right{right:8%;top:22%;width:min(12vw,150px)}
    .decor--small{width:min(20vw,280px)}
    .decor--tiny{width:min(10vw,120px);filter:drop-shadow(0 0 16px rgba(255,230,123,.65))}
    .decor--party{width:min(26vw,390px)}
    .decor--party-small{width:min(19vw,280px)}
    .decor--sign{left:50%;top:8%;width:min(24vw,350px);opacity:.35;transform:translateX(-50%)}
    .decor--sign-small{width:min(18vw,250px);opacity:.55}
    .decor--night{filter:brightness(.72) saturate(.85) drop-shadow(0 18px 25px rgba(0,0,0,.35))}
    .gallery-card--illustrated img{object-fit:contain;background:linear-gradient(180deg,#edf4dd,#fff5dc);padding:1.2rem}
    .scene--awakening .animal[hidden],.scene--arrival .animal[hidden],.scene--fire .animal[hidden]{display:none!important}
    @media(max-width:900px){
      .decor--top-left,.decor--top-right{width:min(54vw,360px)}
      .decor--bottom-left,.decor--bottom-right{width:min(48vw,340px)}
      .decor--party{width:min(42vw,300px)}
      .decor--sign{width:min(48vw,320px);opacity:.2}
      .decor--tiny{width:80px}
    }
    @media(prefers-reduced-motion:reduce){.decor{transform:none!important}}
  `;
  document.head.append(style);
}

resolveImageAssets();
addDecorations();
markIllustratedGallery();
injectStyles();
