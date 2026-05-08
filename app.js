const CONFIG = {
  weddingDate: '2026-10-10T17:00:00-05:00',
  googleSheetsWebAppUrl: '',
  spotifyUrl: '',
  appleMusicUrl: '',
};

const body = document.body;
const loader = document.getElementById('loader');
const openButton = document.getElementById('openInvitation');
const site = document.getElementById('site');
const petalField = document.getElementById('petalField');
const guestLine = document.getElementById('guestLine');
const heroGuest = document.getElementById('heroGuest');
const guestHidden = document.getElementById('guestHidden');
const nameInput = document.getElementById('nombre');
const qrImage = document.getElementById('qrImage');
const qrName = document.getElementById('qrName');
const form = document.getElementById('rsvpForm');
const formStatus = document.getElementById('formStatus');
const submitButton = document.getElementById('rsvpSubmit');
const musicToggle = document.getElementById('musicToggle');
const spotifyLink = document.getElementById('spotifyLink');
const appleLink = document.getElementById('appleLink');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const closeLightbox = document.getElementById('closeLightbox');
let ambientAudio;
let petalTimer;

window.addEventListener('load', () => {
  window.setTimeout(() => {
    body.classList.remove('is-loading');
    loader.setAttribute('aria-hidden', 'true');
  }, 900);
});

function getGuestName() {
  const params = new URLSearchParams(window.location.search);
  return params.get('invitado') || params.get('nombre') || params.get('guest') || '';
}

function applyGuestName() {
  const guest = getGuestName().trim();
  const safeGuest = guest || 'Invitado especial';

  if (guest) {
    guestLine.textContent = `Para ${guest}`;
    heroGuest.textContent = `${guest}, tenemos el placer de invitarte a nuestro matrimonio.`;
    nameInput.value = guest;
  }

  guestHidden.value = safeGuest;
  qrName.textContent = safeGuest;

  const url = new URL(window.location.href);
  if (guest) url.searchParams.set('invitado', guest);
  const qrData = encodeURIComponent(url.toString());
  qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=12&data=${qrData}`;
}

function playPaperSound() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const context = new AudioContext();
  const duration = 0.9;
  const bufferSize = context.sampleRate * duration;
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const data = buffer.getChannelData(0);

  for (let index = 0; index < bufferSize; index += 1) {
    const fade = 1 - index / bufferSize;
    data[index] = (Math.random() * 2 - 1) * fade * 0.28;
  }

  const noise = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  noise.buffer = buffer;
  filter.type = 'highpass';
  filter.frequency.value = 1100;
  gain.gain.setValueAtTime(0.001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.22, context.currentTime + 0.06);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
  noise.connect(filter).connect(gain).connect(context.destination);
  noise.start();

  const shimmer = context.createOscillator();
  const shimmerGain = context.createGain();
  shimmer.type = 'triangle';
  shimmer.frequency.setValueAtTime(420, context.currentTime);
  shimmer.frequency.exponentialRampToValueAtTime(820, context.currentTime + 0.55);
  shimmerGain.gain.setValueAtTime(0.001, context.currentTime);
  shimmerGain.gain.exponentialRampToValueAtTime(0.05, context.currentTime + 0.04);
  shimmerGain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.7);
  shimmer.connect(shimmerGain).connect(context.destination);
  shimmer.start();
  shimmer.stop(context.currentTime + 0.72);
}

function releasePetals(count = 58) {
  for (let i = 0; i < count; i += 1) {
    const petal = document.createElement('span');
    petal.className = 'petal';
    petal.style.left = `${Math.random() * 100}vw`;
    petal.style.setProperty('--size', `${Math.random() * 12 + 8}px`);
    petal.style.setProperty('--drift', `${(Math.random() - 0.5) * 340}px`);
    petal.style.setProperty('--spin', `${Math.random() * 760 + 220}deg`);
    petal.style.setProperty('--duration', `${Math.random() * 4 + 5}s`);
    petal.style.animationDelay = `${Math.random() * 1.2}s`;
    petalField.appendChild(petal);
    window.setTimeout(() => petal.remove(), 9800);
  }
}

function openInvitation() {
  if (body.classList.contains('opened')) return;
  playPaperSound();
  releasePetals(70);
  body.classList.add('opened');
  openButton.setAttribute('aria-expanded', 'true');
  site.setAttribute('aria-hidden', 'false');
  window.setTimeout(() => {
    body.classList.remove('locked');
    document.getElementById('inicio').scrollIntoView({ behavior: 'smooth' });
  }, 2100);

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    petalTimer = window.setInterval(() => releasePetals(4), 3200);
  }
}

openButton.addEventListener('click', openInvitation);

function pad(value) {
  return String(value).padStart(2, '0');
}

function updateCountdown() {
  const weddingDate = new Date(CONFIG.weddingDate);
  const diff = weddingDate.getTime() - Date.now();
  const values = { days: 0, hours: '00', minutes: '00', seconds: '00' };

  if (diff > 0) {
    values.days = Math.floor(diff / 86400000);
    values.hours = pad(Math.floor(diff / 3600000) % 24);
    values.minutes = pad(Math.floor(diff / 60000) % 60);
    values.seconds = pad(Math.floor(diff / 1000) % 60);
  }

  Object.entries(values).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  });
}

updateCountdown();
window.setInterval(updateCountdown, 1000);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('[data-animate]').forEach((element) => observer.observe(element));

function updateParallax() {
  const viewport = window.innerHeight;
  document.querySelectorAll('[data-parallax]').forEach((element) => {
    const rect = element.getBoundingClientRect();
    const speed = Number(element.dataset.parallax || 0);
    const centerDelta = rect.top + rect.height / 2 - viewport / 2;
    element.style.transform = `translate3d(0, ${centerDelta * speed * -1}px, 0)`;
  });
}

window.addEventListener('scroll', updateParallax, { passive: true });
window.addEventListener('resize', updateParallax);
updateParallax();

function configureMusicLinks() {
  if (CONFIG.spotifyUrl) {
    spotifyLink.href = CONFIG.spotifyUrl;
    spotifyLink.target = '_blank';
    spotifyLink.rel = 'noreferrer';
  } else {
    spotifyLink.setAttribute('aria-disabled', 'true');
    spotifyLink.title = 'Agrega el enlace de Spotify en app.js';
  }

  if (CONFIG.appleMusicUrl) {
    appleLink.href = CONFIG.appleMusicUrl;
    appleLink.target = '_blank';
    appleLink.rel = 'noreferrer';
  } else {
    appleLink.setAttribute('aria-disabled', 'true');
    appleLink.title = 'Agrega el enlace de Apple Music en app.js';
  }
}

function toggleAmbientSound() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  if (ambientAudio) {
    ambientAudio.gain.gain.exponentialRampToValueAtTime(0.001, ambientAudio.context.currentTime + 0.35);
    window.setTimeout(() => ambientAudio.context.close(), 420);
    ambientAudio = null;
    musicToggle.textContent = 'Sonido ambiente';
    return;
  }

  const context = new AudioContext();
  const gain = context.createGain();
  const toneA = context.createOscillator();
  const toneB = context.createOscillator();
  toneA.type = 'sine';
  toneB.type = 'triangle';
  toneA.frequency.value = 196;
  toneB.frequency.value = 293.66;
  gain.gain.value = 0.001;
  toneA.connect(gain);
  toneB.connect(gain);
  gain.connect(context.destination);
  toneA.start();
  toneB.start();
  gain.gain.exponentialRampToValueAtTime(0.035, context.currentTime + 0.8);
  ambientAudio = { context, gain };
  musicToggle.textContent = 'Pausar ambiente';
}

musicToggle.addEventListener('click', toggleAmbientSound);
configureMusicLinks();

form.addEventListener('submit', async (event) => {
  if (!CONFIG.googleSheetsWebAppUrl) return;

  event.preventDefault();
  submitButton.disabled = true;
  submitButton.textContent = 'Enviando...';
  formStatus.textContent = 'Guardando tu RSVP en Google Sheets.';

  const payload = new FormData(form);
  payload.append('page_url', window.location.href);
  payload.append('submitted_at', new Date().toISOString());

  try {
    await fetch(CONFIG.googleSheetsWebAppUrl, {
      method: 'POST',
      body: payload,
      mode: 'no-cors',
    });
    window.location.href = '/success.html?sheet=1';
  } catch {
    formStatus.textContent = 'No pudimos conectar con Google Sheets. Intenta nuevamente.';
    submitButton.disabled = false;
    submitButton.textContent = 'RSVP now';
  }
});

document.querySelectorAll('.gallery-grid button').forEach((button) => {
  button.addEventListener('click', () => {
    const image = button.querySelector('img');
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightbox.showModal();
  });
});

closeLightbox.addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});

applyGuestName();
