const sceneOrder = [
  ['candle', 'Hace no mucho tiempo. Hace casi doce meses. Una pequeña luz estaba por llegar al mundo.', 10500],
  ['dawn', 'En un lugar muy cálido de Colombia, en la ciudad de Cúcuta, un bebé venía en camino. Su llegada había sido planeada con muchísimo amor, ilusión y ternura, junto a esos nervios que aparecen cuando una vida está a punto de cambiarlo todo.', 13500],
  ['waiting', 'Había amor, esperanza y calma. Y muchos nervios también. Porque no estaba por llegar solo un bebé. Estaba por comenzar una nueva aventura.', 10500],
  ['arrival', 'Y entonces, a las tres de la tarde, llegó él. Aiden Leonardo Mora Molero. Pequeño, curioso y con una mirada capaz de descubrirlo todo.', 10500],
  ['night', 'Desde sus primeros días, Aiden dejó claro que tendría su propia forma de descubrir el mundo. Incluso para descansar, siempre ha tenido su propio ritmo.', 11000],
  ['pack', 'Muy pronto, Aiden encontró su lugar dentro de una manada muy especial. Cuatro perritos se convirtieron en compañeros, guardianes y cómplices de sus primeros descubrimientos.', 11500],
  ['personality', 'Aiden es curioso, alegre y lleno de vida. Le gusta morder, conversar de noche, el tomate, la cebolla, comer con papá y dormir muy cerca de mamá.', 12000],
  ['steps', 'Hoy ya sabe ponerse de pie. Cada día avanza un poco más. Falta muy poco para que comience a correr por toda la casa.', 11000],
  ['fire', 'Aiden es ternura, curiosidad y alegría. Un pequeño fuego ardiente, con la fuerza de un león.', 9500],
  ['awakening', 'Después de casi doce meses de aventuras, aprendizajes, risas y amor, nuestro pequeño león está preparado para celebrar.', 10500],
  ['invitation', 'Por eso, en este día tan especial, Aiden quiere invitarte a celebrar su primer cumpleaños y acompañarlo cuando dé su primer gran rugido.', 12000],
  ['gallery', 'Detrás de cada ilustración está la historia real de Aiden. Un primer año lleno de miradas curiosas, paseos, abrazos, aprendizajes y momentos para conservar siempre.', 15000],
  ['letter', 'Hoy celebramos todo lo que eres y todo lo que apenas estás comenzando a ser. Este será apenas el primero de muchos rugidos.', 12500],
  ['details', 'Ahora que conoces un poco más de su historia, queremos invitarte a formar parte de este capítulo tan especial.', 12000],
  ['ending', 'Hace casi doce meses, una pequeña luz estaba por llegar. Hoy esa luz ilumina toda nuestra manada. Su historia apenas comienza.', 11000],
  ['closing', 'Te esperamos para celebrar la primera vuelta al sol de nuestro pequeño león, Aiden Leonardo Mora Molero.', 12000],
];

let stopped = false;
let currentUtterance = null;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function injectAutoplayStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .preloader p{display:none!important}
    .preloader{background:#050504!important}
    .loader-flame{font-size:0!important;width:54px;height:82px;border-radius:55% 45% 55% 45%;background:radial-gradient(circle at 50% 68%,#fff 0 9%,#ffd34d 23%,#ff7b22 56%,transparent 70%);filter:drop-shadow(0 0 22px #ff9c3f);animation:flicker 1s infinite alternate}
    .gate{opacity:0!important;visibility:hidden!important;pointer-events:none!important}
    .scene--candle .story-copy{margin:0!important;align-self:start!important;padding-top:clamp(3rem,10vh,7rem);z-index:20}
    .scene--candle .story-copy p{margin:.35rem 0;text-shadow:0 4px 24px #000,0 0 18px #ffb74d88}
    .scene--candle .candle-wrap{z-index:5}
    body.autoplay-active{cursor:default}
    body.autoplay-active .progress{opacity:.85}
    @media(max-width:700px){.scene--candle .story-copy{padding-top:12vh}.scene--candle .story-copy p{font-size:1.15rem}.scene--candle .story-copy .lead{font-size:1.6rem}}
  `;
  document.head.append(style);
}

function chooseSpanishVoice() {
  return speechSynthesis.getVoices().find((voice) => /^es(-|_)/i.test(voice.lang)) || null;
}

function narrate(text) {
  if (!('speechSynthesis' in window) || stopped) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-ES';
  utterance.rate = 0.9;
  utterance.pitch = 1.02;
  utterance.volume = 0.9;
  const voice = chooseSpanishVoice();
  if (voice) utterance.voice = voice;
  currentUtterance = utterance;
  try { speechSynthesis.speak(utterance); } catch { /* El navegador puede bloquear audio automático. */ }
}

function animateIntroText() {
  const lines = [...document.querySelectorAll('.scene--candle .reveal-line')];
  lines.forEach((line) => {
    line.style.opacity = '0';
    line.style.transform = 'translateY(22px)';
  });
  lines.forEach((line, index) => {
    setTimeout(() => {
      line.animate(
        [
          { opacity: 0, transform: 'translateY(22px)', filter: 'blur(7px)' },
          { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' },
        ],
        { duration: 1500, fill: 'forwards', easing: 'cubic-bezier(.22,1,.36,1)' },
      );
    }, 900 + index * 2300);
  });
}

async function moveToScene(sceneName, duration) {
  if (stopped) return;
  const scene = document.querySelector(`[data-scene="${sceneName}"]`);
  if (!scene) return;
  scene.scrollIntoView({ behavior: 'smooth', block: 'start' });
  await sleep(Math.min(2200, Math.max(900, duration * 0.16)));
}

async function playStory() {
  document.body.classList.add('autoplay-active', 'started');
  window.scrollTo(0, 0);

  const startButton = document.querySelector('#startButton');
  if (startButton) startButton.click();

  await sleep(500);
  animateIntroText();

  for (const [sceneName, narration, duration] of sceneOrder) {
    if (stopped) break;
    await moveToScene(sceneName, duration);
    narrate(narration);
    await sleep(duration);
  }
}

function startAfterLoading() {
  const preloader = document.querySelector('#preloader');
  const gate = document.querySelector('#gate');
  if (gate) gate.classList.add('is-open');

  setTimeout(() => {
    if (preloader) preloader.classList.add('is-hidden');
    setTimeout(playStory, 650);
  }, 1800);
}

injectAutoplayStyles();

window.addEventListener('load', (event) => {
  event.stopImmediatePropagation();
  startAfterLoading();
}, { capture: true, once: true });

window.addEventListener('beforeunload', () => {
  stopped = true;
  if (currentUtterance && 'speechSynthesis' in window) speechSynthesis.cancel();
});
