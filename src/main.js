import './styles.css';
import './asset-integration.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { Howl } from 'howler';

gsap.registerPlugin(ScrollTrigger);

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const params = new URLSearchParams(location.search);
const guestName = (params.get('invitado') || 'Invitado especial').trim();
const companionAllowed = (params.get('acompanante') || '').toLowerCase() === 'si';
const phone = '573000000000'; // Reemplazar por el número real antes de publicar.

$('#gateGuest').textContent = `${guestName}, Aiden quiere compartir contigo una historia.`;
$('#guestLine').textContent = `${guestName}, esta aventura también es para ti.`;
$('#personalMessage').textContent = companionAllowed
  ? `${guestName}, Aiden ha reservado un lugar para ti y un acompañante dentro de su manada.`
  : `${guestName}, Aiden ha reservado un lugar muy especial para ti dentro de su manada.`;
$('#rsvpName').value = guestName === 'Invitado especial' ? '' : guestName;
$('#companionField').hidden = !companionAllowed;

const soundState = { enabled: false };
new Howl({
  src: ['data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA='],
  volume: 0,
});

function playTone(freq = 440, duration = 0.25, type = 'sine', gain = 0.05) {
  if (!soundState.enabled) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const context = playTone.context || (playTone.context = new AudioContext());
  const oscillator = context.createOscillator();
  const volume = context.createGain();
  oscillator.type = type;
  oscillator.frequency.value = freq;
  volume.gain.setValueAtTime(gain, context.currentTime);
  volume.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
  oscillator.connect(volume).connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + duration);
}

function setSound(enabled) {
  soundState.enabled = enabled;
  $('#soundToggle').textContent = enabled ? '🔊' : '🔇';
  if (enabled) {
    playTone(523, 0.35, 'sine', 0.04);
    setTimeout(() => playTone(659, 0.45, 'sine', 0.03), 120);
  }
}

$('#soundToggle').addEventListener('click', () => setSound(!soundState.enabled));
window.addEventListener('load', () => setTimeout(() => $('#preloader').classList.add('is-hidden'), 350));

let lenis;
function initScroll() {
  if (reduceMotion) return;
  lenis = new Lenis({ duration: 1.15, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

$('#startButton').addEventListener('click', () => {
  setSound(true);
  $('#gate').classList.add('is-open');
  document.body.classList.add('started');
  initScroll();
  initAnimations();
  playTone(660, 0.6, 'triangle', 0.05);
});

function initAnimations() {
  if (reduceMotion) return;

  gsap.to('#progressBar', {
    width: '100%',
    ease: 'none',
    scrollTrigger: { trigger: '#story', start: 'top top', end: 'bottom bottom', scrub: true },
  });

  gsap.timeline({
    scrollTrigger: {
      trigger: '[data-scene="candle"]',
      start: 'top top',
      end: '+=180%',
      pin: true,
      scrub: 1,
    },
  })
    .from('.flame', { scale: 0, opacity: 0, duration: 0.6 })
    .to('.reveal-line', { opacity: 1, y: 0, stagger: 0.7, duration: 1 })
    .to('.candle-wrap', { scale: 1.55, opacity: 0.2, duration: 1 }, '>-.2');

  $$('.parallax').forEach((element) => {
    gsap.to(element, {
      yPercent: () => -8 * Number(element.dataset.speed || 1),
      ease: 'none',
      scrollTrigger: {
        trigger: element.closest('.scene'),
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });

  gsap.from('[data-scene="dawn"] .glass', {
    x: -100,
    opacity: 0,
    scrollTrigger: { trigger: '[data-scene="dawn"]', start: 'top 65%', end: 'top 25%', scrub: true },
  });
  gsap.to('.sun-glow', {
    scale: 1.4,
    y: -80,
    scrollTrigger: { trigger: '[data-scene="dawn"]', scrub: true },
  });

  gsap.from('.floating-words span', {
    scale: 0,
    opacity: 0,
    stagger: 0.2,
    scrollTrigger: { trigger: '[data-scene="waiting"]', start: 'top 60%' },
  });
  gsap.to('.ambient-orb', {
    scale: 1.6,
    opacity: 0.2,
    scrollTrigger: { trigger: '[data-scene="waiting"]', start: 'top top', end: 'bottom top', scrub: true },
  });

  gsap.from('.character--arrival', {
    y: 180,
    scale: 0.75,
    opacity: 0,
    scrollTrigger: { trigger: '[data-scene="arrival"]', start: 'top 60%', end: 'top 15%', scrub: true },
  });
  gsap.from('.animal--lion', {
    x: 160,
    rotation: 8,
    scrollTrigger: { trigger: '[data-scene="arrival"]', start: 'top 70%', end: 'bottom 50%', scrub: true },
  });

  gsap.to('.character--night', { y: -24, repeat: -1, yoyo: true, duration: 3, ease: 'sine.inOut' });
  gsap.to('.paw-trail', {
    x: 80,
    opacity: 0.8,
    scrollTrigger: { trigger: '[data-scene="pack"]', scrub: true },
  });

  $$('.memory-card').forEach((card, index) => {
    gsap.from(card, {
      y: 80,
      rotation: index % 2 ? 8 : -8,
      opacity: 0,
      scrollTrigger: { trigger: '[data-scene="personality"]', start: `top ${75 - index * 5}%` },
    });
  });

  const steps = $$('.step-sequence img');
  gsap.timeline({
    scrollTrigger: {
      trigger: '[data-scene="steps"]',
      start: 'top top',
      end: '+=220%',
      pin: true,
      scrub: 1,
    },
  })
    .to(steps[0], { opacity: 1, duration: 0.5 })
    .to(steps[0], { opacity: 0, duration: 0.5 })
    .to(steps[1], { opacity: 1, duration: 0.5 }, '<')
    .to(steps[1], { opacity: 0, duration: 0.5 })
    .to(steps[2], { opacity: 1, duration: 0.5 }, '<');

  gsap.timeline({
    scrollTrigger: {
      trigger: '[data-scene="fire"]',
      start: 'top top',
      end: '+=150%',
      pin: true,
      scrub: 1,
    },
  })
    .from('.character--hero', { scale: 0.65, y: 180, opacity: 0 })
    .from('.animal--guardian', { scale: 0.5, opacity: 0 }, '<')
    .to('.lion-aura', { scale: 1.7, opacity: 0.35 });

  $$('.scene--awakening .animal:not([hidden])').forEach((animal, index) => {
    gsap.from(animal, {
      y: 120,
      x: index % 2 ? 100 : -100,
      opacity: 0,
      rotation: index % 2 ? 8 : -8,
      delay: index * 0.08,
      scrollTrigger: { trigger: '[data-scene="awakening"]', start: 'top 65%' },
    });
  });
  const monkey = $('.animal--monkey:not([hidden])');
  const toucan = $('.animal--toucan:not([hidden])');
  if (monkey) gsap.to(monkey, { rotation: 4, transformOrigin: 'top center', repeat: -1, yoyo: true, duration: 1.6, ease: 'sine.inOut' });
  if (toucan) gsap.to(toucan, { x: -30, y: 12, repeat: -1, yoyo: true, duration: 2.4, ease: 'sine.inOut' });

  gsap.from('.invitation-card', {
    scale: 0.75,
    opacity: 0,
    scrollTrigger: { trigger: '[data-scene="invitation"]', start: 'top 65%', end: 'top 20%', scrub: true },
  });
  gsap.from('.character--invite', {
    x: -160,
    opacity: 0,
    scrollTrigger: { trigger: '[data-scene="invitation"]', start: 'top 70%', end: 'top 25%', scrub: true },
  });

  const gallery = $('#galleryTrack');
  const amount = () => Math.max(0, gallery.scrollWidth - innerWidth);
  gsap.to(gallery, {
    x: () => -amount(),
    ease: 'none',
    scrollTrigger: {
      trigger: '[data-scene="gallery"]',
      start: 'top top',
      end: () => `+=${amount() + innerHeight}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });

  gsap.from('.letter-card', { x: -120, opacity: 0, scrollTrigger: { trigger: '[data-scene="letter"]', start: 'top 65%' } });
  gsap.from('.letter-photo', { x: 120, rotation: 10, opacity: 0, scrollTrigger: { trigger: '[data-scene="letter"]', start: 'top 65%' } });
  gsap.from('.details-grid article', { y: 70, opacity: 0, stagger: 0.12, scrollTrigger: { trigger: '[data-scene="details"]', start: 'top 60%' } });
}

function openRsvp() {
  $('#rsvpDialog').showModal();
}

$('#rsvpOpen').addEventListener('click', openRsvp);
$('#rsvpOpenClosing').addEventListener('click', openRsvp);

$('#rsvpForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const attendance = data.get('attendance');
  if (!attendance) {
    alert('Selecciona si podrás asistir.');
    return;
  }

  const lines = [
    'Hola, confirmo la invitación de “Mi primer rugido” 🦁',
    `Nombre: ${data.get('name')}`,
    `Asistencia: ${attendance}`,
    companionAllowed && data.get('companion') ? `Acompañante: ${data.get('companion')}` : '',
    data.get('message') ? `Mensaje para Aiden: ${data.get('message')}` : '',
  ].filter(Boolean);

  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
});

$('#blowCandle').addEventListener('click', () => {
  playTone(160, 0.8, 'sawtooth', 0.025);
  gsap.to('.ending-candle .flame', { scale: 0, opacity: 0, duration: 0.3 });
  gsap.to('[data-scene="ending"]', { filter: 'brightness(.25)', duration: 0.5, yoyo: true, repeat: 1 });
  setTimeout(() => document.querySelector('[data-scene="closing"]').scrollIntoView({ behavior: 'smooth' }), 900);
});

$('#restartStory').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
