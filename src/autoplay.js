import gsap from 'gsap';
import { DIALOGUE_DURATION, getDialogueUrl, releaseDialogueUrl } from './audio/dialogue.js';

const MUSIC_URL = new URL('../Golden Lion Wishes.mp3', import.meta.url).href;
const $ = (selector, root = document) => root.querySelector(selector);

let dialogue = null;
let music = null;
let cinematicTimeline = null;
let animationFrame = 0;
let started = false;
let muted = false;

function injectCinematicMarkup() {
  const scene = $('[data-scene="candle"]');
  if (!scene) return;

  scene.innerHTML = `
    <div class="ultimate-cinema" aria-live="polite">
      <div class="ultimate-layer ultimate-layer--night"></div>
      <div class="ultimate-layer ultimate-layer--dawn"></div>
      <div class="ultimate-layer ultimate-layer--jungle"></div>
      <div class="ultimate-layer ultimate-layer--party"></div>
      <div class="ultimate-vignette"></div>
      <div class="ultimate-rays"></div>
      <div class="ultimate-embers" aria-hidden="true"></div>

      <div class="ultimate-candle" aria-hidden="true">
        <div class="ultimate-candle__aura"></div>
        <div class="ultimate-candle__flame"><i></i></div>
        <div class="ultimate-candle__wick"></div>
        <div class="ultimate-candle__wax"><i></i><b></b></div>
        <div class="ultimate-candle__shadow"></div>
      </div>

      <div class="ultimate-copy">
        <p class="ultimate-line" data-copy="ancient">Hace mucho tiempo…</p>
        <p class="ultimate-line ultimate-line--number" data-copy="days">Casi <strong>365</strong> días…</p>
        <p class="ultimate-line ultimate-line--number" data-copy="months">Casi <strong>12</strong> meses…</p>
        <p class="ultimate-line ultimate-line--warm" data-copy="arrival">desde que llegó a nuestra vida.</p>
      </div>

      <div class="ultimate-hero" aria-hidden="true">
        <div class="ultimate-hero__halo"></div>
        <img src="/aiden-sentado.png" alt="" />
      </div>

      <div class="ultimate-name">
        <span>Una pequeña luz llamada</span>
        <h1>Aiden Leonardo</h1>
        <p>Mora Molero</p>
      </div>

      <div class="ultimate-finale">
        <span class="eyebrow">La selva está lista</span>
        <h2>Mi primer rugido</h2>
        <p>Acompáñanos a celebrar su primera vuelta al sol.</p>
        <div class="ultimate-date"><strong>04</strong><span>octubre<br>2026</span></div>
      </div>

      <div class="ultimate-audio-status" aria-hidden="true">
        <span></span><span></span><span></span><span></span>
      </div>
    </div>
  `;

  const embers = $('.ultimate-embers', scene);
  const fragment = document.createDocumentFragment();
  for (let index = 0; index < 44; index += 1) {
    const ember = document.createElement('i');
    ember.style.setProperty('--x', `${Math.random() * 100}%`);
    ember.style.setProperty('--delay', `${Math.random() * -12}s`);
    ember.style.setProperty('--duration', `${7 + Math.random() * 11}s`);
    ember.style.setProperty('--drift', `${-70 + Math.random() * 140}px`);
    ember.style.setProperty('--size', `${1 + Math.random() * 4}px`);
    fragment.append(ember);
  }
  embers.append(fragment);
}

function injectCinematicStyles() {
  const style = document.createElement('style');
  style.dataset.ultimateInvitation = 'true';
  style.textContent = `
    html{scroll-behavior:auto!important}
    body.cinematic-playing{overflow:hidden!important}
    body.cinematic-playing .progress{opacity:0!important}
    .scene--candle{height:100svh!important;min-height:100svh!important;padding:0!important;overflow:hidden!important;background:#030302!important;isolation:isolate}
    .ultimate-cinema,.ultimate-layer,.ultimate-vignette,.ultimate-rays,.ultimate-embers{position:absolute;inset:0}
    .ultimate-cinema{overflow:hidden;background:#030302;color:#fff}
    .ultimate-layer{inset:-5%;background-position:center;background-size:cover;opacity:0;transform:scale(1.12);will-change:transform,opacity,filter}
    .ultimate-layer--night{background-image:linear-gradient(rgba(0,0,0,.28),rgba(0,0,0,.72)),url('/noche.png');opacity:.28}
    .ultimate-layer--dawn{background-image:linear-gradient(rgba(37,19,5,.25),rgba(10,7,3,.62)),url('/dia.png')}
    .ultimate-layer--jungle{background-image:linear-gradient(rgba(4,24,15,.2),rgba(2,11,7,.66)),url('/selva.png')}
    .ultimate-layer--party{background-image:linear-gradient(rgba(3,23,13,.08),rgba(4,12,8,.48)),url('/fiesta dia.png')}
    .ultimate-vignette{z-index:8;pointer-events:none;background:radial-gradient(circle at 50% 45%,transparent 18%,rgba(0,0,0,.2) 52%,rgba(0,0,0,.82) 100%)}
    .ultimate-rays{z-index:7;opacity:0;mix-blend-mode:screen;background:conic-gradient(from 180deg at 50% 75%,transparent 0 38%,rgba(255,223,147,.16) 43%,transparent 48% 55%,rgba(255,237,188,.12) 60%,transparent 66%)}
    .ultimate-embers{z-index:18;pointer-events:none;overflow:hidden}
    .ultimate-embers i{position:absolute;left:var(--x);bottom:-8%;width:var(--size);height:var(--size);border-radius:50%;opacity:0;background:#ffd88a;box-shadow:0 0 9px #ffad48,0 0 22px rgba(255,103,28,.6);animation:ultimateEmber var(--duration) linear infinite;animation-delay:var(--delay)}
    .ultimate-candle{position:absolute;z-index:20;left:50%;bottom:7vh;width:106px;height:330px;transform:translateX(-50%);filter:drop-shadow(0 34px 28px rgba(0,0,0,.55))}
    .ultimate-candle__wax{position:absolute;bottom:0;left:7px;width:92px;height:255px;border-radius:20px 20px 12px 12px;background:linear-gradient(90deg,#79441f,#d99b55 16%,#fff0c8 47%,#d8a363 73%,#74401e);box-shadow:inset 13px 0 22px rgba(74,34,11,.36),inset -12px 0 25px rgba(67,28,8,.38)}
    .ultimate-candle__wax:before{content:'';position:absolute;left:0;right:0;top:-9px;height:28px;border-radius:50%;background:radial-gradient(ellipse,#fff2ce 0 28%,#bd7c3e 62%,#4c2918 73%)}
    .ultimate-candle__wax i,.ultimate-candle__wax b{position:absolute;top:5px;width:13px;border-radius:0 0 10px 10px;background:linear-gradient(#f4d6a6,#b46d31)}
    .ultimate-candle__wax i{left:15px;height:62px}.ultimate-candle__wax b{right:20px;height:39px}
    .ultimate-candle__wick{position:absolute;z-index:3;left:50%;bottom:252px;width:5px;height:34px;border-radius:3px;background:#24160e;transform:translateX(-50%)}
    .ultimate-candle__flame{position:absolute;z-index:6;left:50%;bottom:278px;width:60px;height:98px;border-radius:50% 50% 62% 38%;opacity:0;transform:translateX(-50%) scale(.05);transform-origin:50% 100%;background:radial-gradient(circle at 50% 72%,#fff 0 8%,#fff1a5 16%,#ffae37 43%,#ef4a1d 66%,transparent 72%);filter:drop-shadow(0 0 13px #ffe195) drop-shadow(0 0 38px #ff742c)}
    .ultimate-candle__flame i{position:absolute;left:50%;bottom:17px;width:18px;height:38px;border-radius:50%;transform:translateX(-50%);background:linear-gradient(#fff,#fff6bd 55%,#ffcf5c)}
    .ultimate-candle__aura{position:absolute;left:50%;bottom:160px;width:480px;height:480px;border-radius:50%;opacity:0;transform:translateX(-50%) scale(.2);background:radial-gradient(circle,rgba(255,226,149,.36),rgba(255,126,38,.12) 36%,transparent 69%);filter:blur(20px);mix-blend-mode:screen}
    .ultimate-candle__shadow{position:absolute;left:50%;bottom:-18px;width:300px;height:48px;border-radius:50%;transform:translateX(-50%);background:radial-gradient(ellipse,rgba(0,0,0,.75),transparent 70%);filter:blur(9px)}
    .ultimate-copy,.ultimate-name,.ultimate-finale{position:absolute;z-index:30;left:50%;width:min(940px,90vw);transform:translateX(-50%);text-align:center;pointer-events:none}
    .ultimate-copy{top:9vh;height:22vh}
    .ultimate-line{position:absolute;inset:0;display:grid;place-items:center;margin:0;opacity:0;font-family:'Fraunces',serif;font-size:clamp(2.4rem,6vw,6.2rem);line-height:1.02;letter-spacing:-.035em;color:#fff8ea;text-shadow:0 4px 25px #000,0 0 40px rgba(255,169,64,.32);filter:blur(15px);transform:translateY(28px) scale(.96)}
    .ultimate-line strong{color:#ffd77a;font-size:1.16em;text-shadow:0 0 24px #ffb144,0 0 65px rgba(255,95,22,.5)}
    .ultimate-line--warm{color:#ffe9b7}
    .ultimate-hero{position:absolute;z-index:24;left:50%;bottom:-4vh;width:min(52vw,620px);opacity:0;transform:translateX(-50%) translateY(16%) scale(.82);filter:blur(15px);pointer-events:none}
    .ultimate-hero img{position:relative;z-index:2;display:block;width:100%;max-height:74vh;object-fit:contain;filter:drop-shadow(0 25px 38px rgba(0,0,0,.5))}
    .ultimate-hero__halo{position:absolute;z-index:1;left:50%;top:43%;width:84%;aspect-ratio:1;border-radius:50%;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(255,226,145,.52),rgba(245,152,52,.15) 44%,transparent 70%);filter:blur(22px)}
    .ultimate-name{top:8vh;opacity:0;filter:blur(12px);transform:translateX(-50%) translateY(25px)}
    .ultimate-name span{font-size:clamp(.75rem,1.5vw,1rem);letter-spacing:.3em;text-transform:uppercase;color:#f8d995}
    .ultimate-name h1{margin:.35rem 0 0;font-family:'Fraunces',serif;font-size:clamp(3.2rem,8vw,8rem);line-height:.9;color:#fff5dd;text-shadow:0 4px 28px #000,0 0 55px rgba(255,178,63,.35)}
    .ultimate-name p{margin:.6rem 0;font-size:clamp(1rem,2vw,1.45rem);letter-spacing:.32em;text-transform:uppercase;color:#ffd27b}
    .ultimate-finale{top:50%;opacity:0;transform:translate(-50%,-44%) scale(.88);filter:blur(18px);padding:clamp(1.4rem,4vw,3rem);border:1px solid rgba(255,229,167,.38);border-radius:30px;background:linear-gradient(145deg,rgba(7,42,27,.83),rgba(4,22,14,.73));box-shadow:0 30px 90px rgba(0,0,0,.48),inset 0 1px rgba(255,255,255,.12);backdrop-filter:blur(13px)}
    .ultimate-finale h2{margin:.4rem 0;font-family:'Fraunces',serif;font-size:clamp(3.3rem,8vw,8rem);line-height:.9;color:#fff3cf;text-shadow:0 4px 24px #000,0 0 45px rgba(255,190,72,.28)}
    .ultimate-finale p{margin:1rem auto;max-width:620px;font-size:clamp(1rem,2vw,1.35rem);color:#f9efd7}
    .ultimate-date{display:flex;justify-content:center;align-items:center;gap:.8rem;margin-top:1.2rem;color:#ffd579}
    .ultimate-date strong{font-family:'Fraunces',serif;font-size:clamp(3rem,7vw,6rem);line-height:.8}.ultimate-date span{text-align:left;font-weight:700;letter-spacing:.12em;text-transform:uppercase}
    .ultimate-audio-status{position:absolute;z-index:40;right:1.3rem;bottom:1.25rem;display:flex;align-items:flex-end;gap:3px;height:18px;opacity:.58}
    .ultimate-audio-status span{display:block;width:3px;border-radius:3px;background:#ffd477;animation:ultimateMeter .72s ease-in-out infinite alternate}.ultimate-audio-status span:nth-child(2){animation-delay:-.25s}.ultimate-audio-status span:nth-child(3){animation-delay:-.5s}.ultimate-audio-status span:nth-child(4){animation-delay:-.15s}
    .gate{opacity:1!important;visibility:visible!important;pointer-events:auto!important;background:#030805!important}
    .gate.is-open{opacity:0!important;visibility:hidden!important;pointer-events:none!important}
    .gate__card small{max-width:36rem}.gate__card:after{content:'La narración y la música comienzan juntas.';display:block;margin-top:.75rem;font-size:.75rem;opacity:.65}
    @keyframes ultimateEmber{0%{opacity:0;transform:translate3d(0,0,0) scale(.6)}15%{opacity:.8}100%{opacity:0;transform:translate3d(var(--drift),-112vh,0) scale(1.4)}}
    @keyframes ultimateMeter{from{height:4px}to{height:18px}}
    @media(max-width:700px){.ultimate-candle{transform:translateX(-50%) scale(.78);transform-origin:bottom center;bottom:2vh}.ultimate-copy{top:8vh}.ultimate-hero{width:88vw}.ultimate-name{top:9vh}.ultimate-finale{width:88vw}.ultimate-finale h2{font-size:clamp(3rem,16vw,5.2rem)}}
    @media(prefers-reduced-motion:reduce){.ultimate-embers i,.ultimate-audio-status span{animation:none!important}}
  `;
  document.head.append(style);
}

function configureGate() {
  const button = $('#startButton');
  const note = $('.gate__card small');
  if (button) button.textContent = 'Toca para comenzar';
  if (note) note.textContent = 'Este toque activa el diálogo original y la música de fondo.';
}

function prepareAudio() {
  if (dialogue && music) return;

  dialogue = new Audio(getDialogueUrl());
  dialogue.preload = 'auto';
  dialogue.volume = 1;
  dialogue.load();

  music = new Audio(MUSIC_URL);
  music.preload = 'auto';
  music.loop = true;
  music.volume = 0;
  music.load();
}

function fadeAudio(audio, target, duration = 1.5) {
  if (!audio) return;
  const state = { volume: audio.volume };
  gsap.killTweensOf(state);
  gsap.to(state, {
    volume: target,
    duration,
    ease: 'sine.inOut',
    onUpdate: () => {
      audio.volume = Math.max(0, Math.min(1, state.volume));
    },
  });
}

function buildTimeline() {
  if (cinematicTimeline) return cinematicTimeline;

  const scene = $('[data-scene="candle"]');
  if (!scene) return null;

  const night = $('.ultimate-layer--night', scene);
  const dawn = $('.ultimate-layer--dawn', scene);
  const jungle = $('.ultimate-layer--jungle', scene);
  const party = $('.ultimate-layer--party', scene);
  const candle = $('.ultimate-candle', scene);
  const flame = $('.ultimate-candle__flame', scene);
  const aura = $('.ultimate-candle__aura', scene);
  const rays = $('.ultimate-rays', scene);
  const ancient = $('[data-copy="ancient"]', scene);
  const days = $('[data-copy="days"]', scene);
  const months = $('[data-copy="months"]', scene);
  const arrival = $('[data-copy="arrival"]', scene);
  const hero = $('.ultimate-hero', scene);
  const name = $('.ultimate-name', scene);
  const finale = $('.ultimate-finale', scene);

  const reveal = (target, at, hold = 3.2) => {
    cinematicTimeline
      .to(target, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.35, ease: 'power3.out' }, at)
      .to(target, { opacity: 0, y: -20, filter: 'blur(10px)', duration: 1.05, ease: 'power2.in' }, at + hold);
  };

  cinematicTimeline = gsap.timeline({ paused: true, defaults: { overwrite: 'auto' } });
  cinematicTimeline
    .set(scene, { autoAlpha: 1 }, 0)
    .fromTo(candle, { opacity: .05, y: 70, scale: .84 }, { opacity: 1, y: 0, scale: 1, duration: 3.8, ease: 'power3.out' }, 0)
    .to(night, { opacity: .55, scale: 1.04, duration: 8, ease: 'none' }, 0)
    .to(flame, { opacity: 1, scale: 1, duration: 2.2, ease: 'elastic.out(1,.45)' }, 2.1)
    .to(aura, { opacity: 1, scale: 1, duration: 3, ease: 'power2.out' }, 2.3)
    .to(rays, { opacity: .5, duration: 4 }, 3);

  gsap.to(flame, {
    rotation: 2.5,
    scaleY: 1.07,
    duration: .45,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    transformOrigin: '50% 100%',
  });

  reveal(ancient, 4.8, 4.1);
  reveal(days, 11.2, 4.3);
  reveal(months, 18.2, 4.1);
  reveal(arrival, 25.2, 4.7);

  cinematicTimeline
    .to(dawn, { opacity: .72, scale: 1.03, duration: 5.5, ease: 'power2.inOut' }, 29)
    .to(night, { opacity: 0, duration: 5.5 }, 29)
    .to(candle, { y: 110, opacity: 0, scale: 1.2, duration: 4.5, ease: 'power2.in' }, 30.5)
    .to(hero, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 3.8, ease: 'power3.out' }, 31.5)
    .to(name, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 2.4, ease: 'power3.out' }, 34)
    .to(jungle, { opacity: .72, scale: 1.02, duration: 5.5, ease: 'power2.inOut' }, 39)
    .to(dawn, { opacity: 0, duration: 5 }, 39)
    .to(hero, { scale: 1.06, y: -18, duration: 8, ease: 'none' }, 39)
    .to(name, { opacity: 0, y: -25, filter: 'blur(9px)', duration: 1.5 }, 43.5)
    .to(hero, { opacity: 0, y: 80, filter: 'blur(12px)', duration: 2.8, ease: 'power2.in' }, 45)
    .to(party, { opacity: .88, scale: 1, duration: 5, ease: 'power2.inOut' }, 45)
    .to(jungle, { opacity: .2, duration: 4 }, 45)
    .to(finale, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 3.2, ease: 'back.out(1.25)' }, 48.2)
    .to(finale, { scale: 1.025, duration: 6, ease: 'sine.inOut' }, 52)
    .to(rays, { opacity: .85, rotation: 4, duration: 8, ease: 'none' }, 49);

  const clock = {};
  cinematicTimeline.to(clock, { duration: .001 }, DIALOGUE_DURATION - .001);
  return cinematicTimeline;
}

function syncTimeline() {
  if (!dialogue || !cinematicTimeline) return;
  cinematicTimeline.time(Math.min(dialogue.currentTime, DIALOGUE_DURATION), false);
  if (!dialogue.paused && !dialogue.ended) {
    animationFrame = requestAnimationFrame(syncTimeline);
  }
}

function finishCinematic() {
  cancelAnimationFrame(animationFrame);
  cinematicTimeline?.time(DIALOGUE_DURATION, false);
  fadeAudio(music, muted ? 0 : .26, 2.5);

  setTimeout(() => {
    document.body.classList.remove('cinematic-playing');
    const invitation = $('[data-scene="invitation"]');
    invitation?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 1800);
}

async function startExperience(event) {
  event?.preventDefault();
  event?.stopImmediatePropagation();
  if (started) return;

  started = true;
  prepareAudio();
  buildTimeline();

  const gate = $('#gate');
  gate?.classList.add('is-open');
  const soundToggle = $('#soundToggle');
  if (soundToggle) soundToggle.textContent = muted ? '🔇' : '🔊';
  document.body.classList.add('cinematic-playing', 'started');
  window.scrollTo(0, 0);
  $('[data-scene="candle"]')?.scrollIntoView({ block: 'start' });

  music.volume = 0;
  dialogue.volume = muted ? 0 : 1;
  const musicPromise = music.play();
  const dialoguePromise = dialogue.play();
  fadeAudio(music, muted ? 0 : .16, 2.8);

  dialogue.addEventListener('ended', finishCinematic, { once: true });
  dialogue.addEventListener('error', handleAudioFailure, { once: true });

  const [, dialogueResult] = await Promise.allSettled([musicPromise, dialoguePromise]);
  if (dialogueResult.status === 'rejected') {
    handleAudioFailure();
    return;
  }

  cinematicTimeline?.pause(0);
  syncTimeline();
}

function handleAudioFailure() {
  cancelAnimationFrame(animationFrame);
  dialogue?.pause();
  music?.pause();
  started = false;
  document.body.classList.remove('cinematic-playing');
  $('#gate')?.classList.remove('is-open');
  const button = $('#startButton');
  if (button) button.textContent = 'Reintentar audio';
}

function bindControls() {
  const startButton = $('#startButton');
  const soundToggle = $('#soundToggle');

  startButton?.addEventListener('click', startExperience, { capture: true });

  soundToggle?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    muted = !muted;
    if (dialogue) dialogue.muted = muted;
    if (music) music.muted = muted;
    setTimeout(() => {
      if (soundToggle) soundToggle.textContent = muted ? '🔇' : '🔊';
    }, 0);
  }, { capture: true });
}

injectCinematicMarkup();
injectCinematicStyles();
configureGate();
prepareAudio();
bindControls();

window.addEventListener('beforeunload', () => {
  cancelAnimationFrame(animationFrame);
  dialogue?.pause();
  music?.pause();
  releaseDialogueUrl();
});
