import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const sceneOrder = [
  ['dawn', 'En un lugar muy cálido de Colombia, en la ciudad de Cúcuta, un bebé venía en camino. Su llegada había sido planeada con muchísimo amor, ilusión y ternura, junto a esos nervios que aparecen cuando una vida está a punto de cambiarlo todo.', 15000],
  ['waiting', 'Había amor, esperanza y calma. Y muchos nervios también. Porque no estaba por llegar solo un bebé. Estaba por comenzar una nueva aventura.', 12000],
  ['arrival', 'Y entonces, a las tres de la tarde, llegó él. Aiden Leonardo Mora Molero. Pequeño, curioso y con una mirada capaz de descubrirlo todo.', 12000],
  ['night', 'Desde sus primeros días, Aiden dejó claro que tendría su propia forma de descubrir el mundo. Incluso para descansar, siempre ha tenido su propio ritmo.', 12000],
  ['pack', 'Muy pronto, Aiden encontró su lugar dentro de una manada muy especial. Cuatro perritos se convirtieron en compañeros, guardianes y cómplices de sus primeros descubrimientos.', 12500],
  ['personality', 'Aiden es curioso, alegre y lleno de vida. Le gusta morder, conversar de noche, el tomate, la cebolla, comer con papá y dormir muy cerca de mamá.', 13000],
  ['steps', 'Hoy ya sabe ponerse de pie. Cada día avanza un poco más. Falta muy poco para que comience a correr por toda la casa.', 12000],
  ['fire', 'Aiden es ternura, curiosidad y alegría. Un pequeño fuego ardiente, con la fuerza de un león.', 10500],
  ['awakening', 'Después de casi doce meses de aventuras, aprendizajes, risas y amor, nuestro pequeño león está preparado para celebrar.', 11500],
  ['invitation', 'Por eso, en este día tan especial, Aiden quiere invitarte a celebrar su primer cumpleaños y acompañarlo cuando dé su primer gran rugido.', 13000],
  ['gallery', 'Detrás de cada ilustración está la historia real de Aiden. Un primer año lleno de miradas curiosas, paseos, abrazos, aprendizajes y momentos para conservar siempre.', 16000],
  ['letter', 'Hoy celebramos todo lo que eres y todo lo que apenas estás comenzando a ser. Este será apenas el primero de muchos rugidos.', 13500],
  ['details', 'Ahora que conoces un poco más de su historia, queremos invitarte a formar parte de este capítulo tan especial.', 12000],
  ['ending', 'Hace casi doce meses, una pequeña luz estaba por llegar. Hoy esa luz ilumina toda nuestra manada. Su historia apenas comienza.', 11500],
  ['closing', 'Te esperamos para celebrar la primera vuelta al sol de nuestro pequeño león, Aiden Leonardo Mora Molero.', 12000],
];

let stopped = false;
let currentUtterance = null;
let ambienceContext = null;
let ambienceGain = null;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function injectIntroMarkup() {
  const scene = document.querySelector('[data-scene="candle"]');
  if (!scene) return;

  scene.innerHTML = `
    <div class="intro-depth" aria-hidden="true">
      <div class="intro-bg intro-bg--far"></div>
      <div class="intro-bg intro-bg--mid"></div>
      <div class="intro-smoke intro-smoke--back"></div>
      <div class="intro-smoke intro-smoke--front"></div>
      <div class="intro-vignette"></div>
      <div class="intro-particles intro-particles--back"></div>
      <div class="intro-particles intro-particles--front"></div>
    </div>
    <div class="candle-stage" aria-hidden="true">
      <div class="candle-shadow"></div>
      <div class="candle-premium">
        <span class="wax-rim"></span>
        <span class="wax-drip wax-drip--one"></span>
        <span class="wax-drip wax-drip--two"></span>
        <span class="wick-premium"></span>
        <span class="spark spark--one"></span>
        <span class="spark spark--two"></span>
        <span class="flame-premium"><i></i></span>
        <span class="flame-aura"></span>
      </div>
    </div>
    <div class="intro-copy" aria-live="polite">
      <p class="intro-line" data-line="0">Hace mucho tiempo…</p>
      <p class="intro-line intro-line--accent" data-line="1">Casi <strong>365</strong> días…</p>
      <p class="intro-line intro-line--accent" data-line="2">Casi <strong>12</strong> meses…</p>
      <p class="intro-line intro-line--final" data-line="3">desde que llegó a nuestra vida.</p>
    </div>
  `;

  const createParticles = (container, count, front = false) => {
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < count; index += 1) {
      const particle = document.createElement('span');
      particle.className = front && index % 5 === 0 ? 'ember ember--bright' : 'ember';
      particle.style.setProperty('--x', `${Math.random() * 100}%`);
      particle.style.setProperty('--delay', `${Math.random() * -12}s`);
      particle.style.setProperty('--duration', `${7 + Math.random() * 11}s`);
      particle.style.setProperty('--size', `${1 + Math.random() * (front ? 4 : 2)}px`);
      particle.style.setProperty('--drift', `${-45 + Math.random() * 90}px`);
      fragment.append(particle);
    }
    container.append(fragment);
  };

  createParticles(scene.querySelector('.intro-particles--back'), 38, false);
  createParticles(scene.querySelector('.intro-particles--front'), 24, true);

  scene.querySelectorAll('.intro-line').forEach((line) => {
    const words = line.textContent.trim().split(/\s+/);
    line.textContent = '';
    words.forEach((word, index) => {
      const span = document.createElement('span');
      span.className = 'intro-word';
      span.textContent = word;
      if (/^(365|12)$/.test(word)) span.classList.add('intro-word--number');
      line.append(span);
      if (index < words.length - 1) line.append(document.createTextNode(' '));
    });
  });
}

function injectAutoplayStyles() {
  const style = document.createElement('style');
  style.textContent = `
    html,body{scroll-behavior:auto!important}
    body.autoplay-active{overflow:hidden!important;cursor:default}
    .preloader p{display:none!important}
    .preloader{background:#050403!important}
    .loader-flame{font-size:0!important;width:42px;height:68px;border-radius:52% 48% 60% 40%;background:radial-gradient(circle at 50% 69%,#fff 0 8%,#ffe37a 17%,#ff9d35 43%,#db421e 65%,transparent 72%);filter:drop-shadow(0 0 16px #ff9c3f) drop-shadow(0 0 42px #ff6d2244);animation:introLoaderFlame .72s ease-in-out infinite alternate}
    .gate{opacity:0!important;visibility:hidden!important;pointer-events:none!important}
    .scene--candle{min-height:100vh!important;height:100vh!important;padding:0!important;background:#050403!important;color:#fff;overflow:hidden}
    .intro-depth,.intro-bg,.intro-smoke,.intro-vignette,.intro-particles{position:absolute;inset:-8%;pointer-events:none}
    .intro-bg--far{background:radial-gradient(circle at 50% 70%,rgba(116,55,22,.38),rgba(19,10,7,.86) 34%,#040302 74%);transform:scale(1.08)}
    .intro-bg--mid{background:radial-gradient(ellipse at 50% 75%,rgba(236,146,55,.09),transparent 42%),linear-gradient(115deg,transparent 25%,rgba(133,76,36,.08) 50%,transparent 70%);mix-blend-mode:screen}
    .intro-vignette{inset:0;background:radial-gradient(circle at 50% 52%,transparent 22%,rgba(0,0,0,.22) 55%,rgba(0,0,0,.82) 100%);z-index:9}
    .intro-smoke{opacity:.24;filter:blur(42px);background:radial-gradient(ellipse at 25% 55%,rgba(240,210,170,.18),transparent 38%),radial-gradient(ellipse at 75% 35%,rgba(200,155,110,.13),transparent 35%);mix-blend-mode:screen}
    .intro-smoke--back{animation:smokeDriftBack 16s ease-in-out infinite alternate}
    .intro-smoke--front{opacity:.12;filter:blur(65px);animation:smokeDriftFront 11s ease-in-out infinite alternate-reverse}
    .intro-particles{z-index:8;overflow:hidden}
    .ember{position:absolute;left:var(--x);bottom:-8%;width:var(--size);height:var(--size);border-radius:50%;background:#ffd88c;box-shadow:0 0 8px #ffb74d;opacity:0;animation:emberRise var(--duration) linear infinite;animation-delay:var(--delay)}
    .ember--bright{background:#fff5bd;box-shadow:0 0 10px #fff1a0,0 0 24px #ff8a35}
    .candle-stage{position:absolute;inset:0;z-index:12;display:grid;place-items:end center;padding-bottom:8vh;transform-style:preserve-3d;perspective:1000px}
    .candle-premium{position:relative;width:94px;height:270px;border-radius:18px 18px 12px 12px;background:linear-gradient(90deg,#8f5b2e 0%,#dba868 16%,#fff0c6 46%,#e2b478 68%,#8c582c 100%);box-shadow:inset 12px 0 28px #75431c66,inset -12px 0 30px #60351266,0 30px 70px #000b;transform-origin:50% 100%}
    .wax-rim{position:absolute;left:0;right:0;top:-8px;height:26px;border-radius:50%;background:radial-gradient(ellipse,#f8e4bd 0 28%,#b97c3e 62%,#5b351f 72%);box-shadow:0 5px 10px #4a291a66}
    .wax-drip{position:absolute;top:5px;width:13px;border-radius:0 0 9px 9px;background:linear-gradient(#efd2a0,#b87638)}
    .wax-drip--one{left:16px;height:58px}.wax-drip--two{right:21px;height:36px}
    .wick-premium{position:absolute;left:50%;top:-31px;width:5px;height:30px;border-radius:3px;background:linear-gradient(#17110d,#4a3624);transform:translateX(-50%);box-shadow:0 0 5px #000}
    .flame-premium{position:absolute;left:50%;top:-113px;width:54px;height:88px;border-radius:48% 52% 62% 38%;background:radial-gradient(circle at 50% 70%,#fff 0 8%,#ffe985 16%,#ffa62f 45%,#e9461f 67%,transparent 72%);filter:drop-shadow(0 0 12px #ffd26b) drop-shadow(0 0 34px #ff7b2c);transform:translateX(-50%) scale(0);opacity:0;z-index:5}
    .flame-premium i{position:absolute;left:50%;bottom:15px;width:17px;height:35px;border-radius:50% 50% 55% 45%;background:linear-gradient(#fff,#fff5b0 50%,#ffd56a);transform:translateX(-50%);filter:blur(.4px)}
    .flame-aura{position:absolute;left:50%;top:-245px;width:430px;height:430px;border-radius:50%;background:radial-gradient(circle,rgba(255,218,128,.34),rgba(255,145,50,.12) 34%,transparent 69%);filter:blur(20px);transform:translateX(-50%) scale(.2);opacity:0;mix-blend-mode:screen}
    .spark{position:absolute;left:50%;top:-45px;width:5px;height:5px;border-radius:50%;background:#fff4a7;box-shadow:0 0 12px #ff9f32;opacity:0;z-index:7}
    .candle-shadow{position:absolute;left:50%;bottom:5vh;width:320px;height:55px;border-radius:50%;background:radial-gradient(ellipse,#000b,transparent 70%);filter:blur(10px);transform:translateX(-50%);opacity:.65}
    .intro-copy{position:absolute;z-index:20;left:50%;top:8vh;width:min(900px,90vw);transform:translateX(-50%);text-align:center;display:grid;place-items:center;pointer-events:none}
    .intro-line{position:absolute;top:0;margin:0;color:#fff8e9;font-family:'Fraunces',serif;font-size:clamp(2rem,5vw,5.4rem);line-height:1.05;letter-spacing:-.025em;text-shadow:0 3px 18px #000,0 0 34px rgba(255,179,78,.26);white-space:normal;opacity:0}
    .intro-line--final{font-size:clamp(2.1rem,5.5vw,5.8rem);color:#fff0c7}
    .intro-word{display:inline-block;opacity:0;filter:blur(12px);transform:translateY(24px) scale(.98);will-change:transform,opacity,filter}
    .intro-word--number{color:#ffd985;text-shadow:0 0 18px #ffaf46,0 0 44px #ff6e253d}
    body.intro-complete .scene--candle{pointer-events:none}
    @keyframes introLoaderFlame{from{transform:rotate(-2deg) scale(.94);opacity:.84}to{transform:rotate(2deg) scale(1.06);opacity:1}}
    @keyframes smokeDriftBack{from{transform:translate3d(-4%,2%,0) scale(1.04)}to{transform:translate3d(5%,-3%,0) scale(1.12)}}
    @keyframes smokeDriftFront{from{transform:translate3d(5%,-2%,0) scale(1.1)}to{transform:translate3d(-6%,3%,0) scale(1.18)}}
    @keyframes emberRise{0%{transform:translate3d(0,0,0) scale(.3);opacity:0}12%{opacity:.72}75%{opacity:.35}100%{transform:translate3d(var(--drift),-118vh,0) scale(1.35);opacity:0}}
    @media(max-width:700px){.candle-stage{padding-bottom:9vh}.candle-premium{width:72px;height:220px}.flame-premium{width:44px;height:72px;top:-94px}.flame-aura{width:320px;height:320px;top:-190px}.intro-copy{top:10vh}.intro-line{font-size:clamp(1.8rem,10vw,3.3rem);width:92vw}}
    @media(prefers-reduced-motion:reduce){.intro-smoke,.ember{animation:none!important}.intro-bg,.candle-stage{transform:none!important}}
  `;
  document.head.append(style);
}

function chooseSpanishVoice() {
  return speechSynthesis.getVoices().find((voice) => /^es(-|_)/i.test(voice.lang)) || null;
}

function narrate(text, options = {}) {
  if (!('speechSynthesis' in window) || stopped) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-ES';
  utterance.rate = options.rate ?? 0.82;
  utterance.pitch = options.pitch ?? 0.96;
  utterance.volume = options.volume ?? 0.9;
  const voice = chooseSpanishVoice();
  if (voice) utterance.voice = voice;
  currentUtterance = utterance;
  try { speechSynthesis.speak(utterance); } catch { /* Autoplay de voz puede ser bloqueado. */ }
}

function startAmbience() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    ambienceContext = ambienceContext || new AudioContext();
    ambienceGain = ambienceContext.createGain();
    ambienceGain.gain.value = 0.0001;
    ambienceGain.connect(ambienceContext.destination);

    const fire = ambienceContext.createOscillator();
    const fireGain = ambienceContext.createGain();
    const filter = ambienceContext.createBiquadFilter();
    fire.type = 'triangle';
    fire.frequency.value = 72;
    filter.type = 'lowpass';
    filter.frequency.value = 240;
    fireGain.gain.value = 0.016;
    fire.connect(filter).connect(fireGain).connect(ambienceGain);
    fire.start();

    const now = ambienceContext.currentTime;
    ambienceGain.gain.exponentialRampToValueAtTime(0.5, now + 4.2);
  } catch { /* El navegador puede exigir interacción para AudioContext. */ }
}

function sparkleTone(frequency = 620, duration = 0.45, volume = 0.025) {
  if (!ambienceContext || ambienceContext.state !== 'running') return;
  const oscillator = ambienceContext.createOscillator();
  const gain = ambienceContext.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(volume, ambienceContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ambienceContext.currentTime + duration);
  oscillator.connect(gain).connect(ambienceContext.destination);
  oscillator.start();
  oscillator.stop(ambienceContext.currentTime + duration);
}

function revealLine(line, startAt, hold = 2.2) {
  const words = [...line.querySelectorAll('.intro-word')];
  const timeline = gsap.timeline({ delay: startAt });
  timeline.to(line, { opacity: 1, duration: 0.1 });
  timeline.to(words, {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    duration: 0.78,
    stagger: 0.34,
    ease: 'power3.out',
    onStart: () => sparkleTone(560 + Number(line.dataset.line) * 70, 0.42),
  });
  timeline.to(words.filter((word) => word.classList.contains('intro-word--number')), {
    scale: 1.08,
    textShadow: '0 0 25px #ffd67a, 0 0 58px #ff7a2d',
    yoyo: true,
    repeat: 1,
    duration: 0.4,
    ease: 'sine.inOut',
  }, '<40%');
  timeline.to(line, { opacity: 0, y: -12, filter: 'blur(8px)', duration: 1.05, ease: 'power2.in' }, `+=${hold}`);
  return timeline;
}

async function playCandleScene() {
  const scene = document.querySelector('[data-scene="candle"]');
  if (!scene) return;

  window.scrollTo(0, 0);
  scene.scrollIntoView({ block: 'start' });

  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger.trigger?.dataset?.scene === 'candle') trigger.kill(true);
  });

  startAmbience();

  const candle = scene.querySelector('.candle-premium');
  const flame = scene.querySelector('.flame-premium');
  const aura = scene.querySelector('.flame-aura');
  const stage = scene.querySelector('.candle-stage');
  const bgFar = scene.querySelector('.intro-bg--far');
  const bgMid = scene.querySelector('.intro-bg--mid');
  const sparks = scene.querySelectorAll('.spark');
  const lines = [...scene.querySelectorAll('.intro-line')];

  gsap.set(candle, { opacity: 0.05, y: 48, scale: 0.88 });
  gsap.set(stage, { scale: 1.22, y: -24 });

  const master = gsap.timeline();
  master
    .to(candle, { opacity: 0.32, y: 22, duration: 1.8, ease: 'power2.out' }, 0)
    .to(stage, { scale: 1.08, y: -8, duration: 3.6, ease: 'power1.inOut' }, 0)
    .to(bgFar, { scale: 1.14, xPercent: -1.8, duration: 18, ease: 'none' }, 0)
    .to(bgMid, { scale: 1.1, xPercent: 2.5, yPercent: -1.4, duration: 15, ease: 'none' }, 0)
    .to(candle, { opacity: 1, y: 0, scale: 1, duration: 1.7, ease: 'power3.out' }, 1.5)
    .to(sparks[0], { opacity: 1, x: -18, y: -32, duration: 0.25, yoyo: true, repeat: 1 }, 2.55)
    .to(sparks[1], { opacity: 1, x: 20, y: -48, duration: 0.3, yoyo: true, repeat: 1 }, 3.05)
    .to(flame, { opacity: 1, scale: 0.18, duration: 0.25, ease: 'back.out(2)' }, 3.45)
    .to(flame, { scale: 1, duration: 2.15, ease: 'elastic.out(1,.45)' }, 3.65)
    .to(aura, { opacity: 1, scale: 1, duration: 2.7, ease: 'power2.out' }, 3.8)
    .to(stage, { scale: 1, y: 0, duration: 2.8, ease: 'sine.inOut' }, 3.9);

  gsap.to(flame, { rotation: 2.4, skewX: 2, scaleY: 1.06, duration: 0.48, repeat: -1, yoyo: true, ease: 'sine.inOut', transformOrigin: '50% 100%' });
  gsap.to(aura, { scale: 1.08, opacity: 0.78, duration: 1.6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  gsap.to(stage, { x: 10, y: -4, duration: 5.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });

  await sleep(5200);
  narrate('Hace mucho tiempo… casi trescientos sesenta y cinco días… casi doce meses… desde que llegó a nuestra vida.', { rate: 0.74, pitch: 0.94 });

  revealLine(lines[0], 0, 1.15);
  revealLine(lines[1], 4.1, 1.15);
  revealLine(lines[2], 8.2, 1.05);
  revealLine(lines[3], 12.1, 2.2);

  await sleep(18200);

  await gsap.timeline()
    .to('.intro-copy', { opacity: 0, duration: 0.8 })
    .to(aura, { scale: 4.2, opacity: 1, duration: 2.4, ease: 'power2.in' }, '<')
    .to(flame, { scale: 2.1, filter: 'drop-shadow(0 0 28px #fff6bb) drop-shadow(0 0 90px #ff8b34)', duration: 2.1, ease: 'power2.in' }, '<')
    .to(scene, { filter: 'brightness(2.2)', duration: 1.5, ease: 'power2.in' }, '<.7');

  document.body.classList.add('intro-complete');
}

async function moveToScene(sceneName, duration) {
  if (stopped) return;
  const scene = document.querySelector(`[data-scene="${sceneName}"]`);
  if (!scene) return;
  document.body.style.overflow = 'hidden';
  gsap.to(window, {
    scrollTo: { y: scene, autoKill: false },
    duration: Math.min(2.4, Math.max(1.25, duration * 0.00016)),
    ease: 'power2.inOut',
  });
  scene.scrollIntoView({ behavior: 'smooth', block: 'start' });
  await sleep(Math.min(2400, Math.max(1200, duration * 0.17)));
}

async function playRemainingStory() {
  for (const [sceneName, narration, duration] of sceneOrder) {
    if (stopped) break;
    await moveToScene(sceneName, duration);
    narrate(narration);
    await sleep(duration);
  }
  document.body.style.overflow = '';
}

async function playStory() {
  document.body.classList.add('autoplay-active', 'started');
  window.scrollTo(0, 0);

  const startButton = document.querySelector('#startButton');
  if (startButton) startButton.click();

  await sleep(180);
  await playCandleScene();
  await playRemainingStory();
}

function startAfterLoading() {
  const preloader = document.querySelector('#preloader');
  const gate = document.querySelector('#gate');
  if (gate) gate.classList.add('is-open');

  setTimeout(() => {
    if (preloader) preloader.classList.add('is-hidden');
    setTimeout(playStory, 420);
  }, 1700);
}

injectIntroMarkup();
injectAutoplayStyles();

window.addEventListener('load', (event) => {
  event.stopImmediatePropagation();
  startAfterLoading();
}, { capture: true, once: true });

window.addEventListener('beforeunload', () => {
  stopped = true;
  if (currentUtterance && 'speechSynthesis' in window) speechSynthesis.cancel();
  if (ambienceContext) ambienceContext.close().catch(() => {});
});
