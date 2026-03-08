/* ===============================================
   FLEUR & COMBI — JavaScript
   Animations, parallax, scroll story (DJI-style)
   =============================================== */

'use strict';

// ─────────────────────────────────────────────
// NAVBAR — scroll & mobile toggle
// ─────────────────────────────────────────────
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

function updateNavbar() {
  navbar.classList.toggle('scrolled', window.scrollY > 70);
}

window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

navToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

// Fermer le menu mobile au clic sur un lien
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ─────────────────────────────────────────────
// SCROLL REVEAL — Intersection Observer
// ─────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Ne plus observer une fois visible
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px',
});

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right')
  .forEach(el => revealObserver.observe(el));

// ─────────────────────────────────────────────
// PARALLAX — Section Côte d'Opale
// ─────────────────────────────────────────────
const coastParallax = document.getElementById('coastParallax');
const coastSection  = coastParallax?.closest('.coast-section');

function updateCoastParallax() {
  if (!coastParallax || !coastSection) return;
  const rect     = coastSection.getBoundingClientRect();
  const progress = rect.top / window.innerHeight; // -1 à +1
  coastParallax.style.transform = `translateY(${progress * 45}px)`;
}

if (coastSection) {
  window.addEventListener('scroll', updateCoastParallax, { passive: true });
  updateCoastParallax();
}

// ─────────────────────────────────────────────
// SCROLL STORY — Effet DJI (sticky + chapters)
// ─────────────────────────────────────────────
const scrollStory  = document.querySelector('.scroll-story');
const storySticky  = document.querySelector('.story-sticky');
const storyLayers  = document.querySelectorAll('.story-layer');
const storyImage   = document.querySelector('.story-image');

let currentChapter = -1;
const CHAPTERS     = storyLayers.length;

function setupScrollStory() {
  if (!scrollStory || !CHAPTERS) return;

  // Hauteur = N chapitres × 100vh (scroll space)
  scrollStory.style.height = `${CHAPTERS * 100}vh`;

  // Activer le premier chapitre immédiatement
  activateChapter(0);
}

function activateChapter(index) {
  if (index === currentChapter) return;
  storyLayers[currentChapter]?.classList.remove('active');
  storyLayers[index]?.classList.add('active');
  currentChapter = index;
}

function updateScrollStory() {
  if (!scrollStory || !CHAPTERS) return;

  const rect            = scrollStory.getBoundingClientRect();
  const totalScrollable = scrollStory.offsetHeight - window.innerHeight;
  const scrolled        = -rect.top;
  const progress        = Math.max(0, Math.min(1, scrolled / totalScrollable));

  // Chapitre actif
  const rawChapter = progress * CHAPTERS;
  const chapter    = Math.min(Math.floor(rawChapter), CHAPTERS - 1);
  activateChapter(chapter);

  // Zoom progressif sur l'image (1 → 1.18)
  if (storyImage) {
    const scale = 1 + progress * 0.18;
    storyImage.style.transform = `scale(${scale})`;
  }
}

if (scrollStory) {
  setupScrollStory();
  window.addEventListener('scroll', updateScrollStory, { passive: true });
  updateScrollStory();
}

// ─────────────────────────────────────────────
// SMOOTH ANCHOR SCROLL
// ─────────────────────────────────────────────
const NAV_HEIGHT = 80;

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href   = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ─────────────────────────────────────────────
// CONTACT FORM — feedback visuel
// ─────────────────────────────────────────────
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');

contactForm?.addEventListener('submit', e => {
  e.preventDefault();

  // Validation HTML5 native
  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }

  // Feedback visuel succès
  submitBtn.innerHTML = '<span>Message envoyé ✓</span>';
  submitBtn.style.background = '#4caf50';
  submitBtn.style.borderColor = '#4caf50';
  submitBtn.disabled = true;

  // Remise à zéro après 4s
  setTimeout(() => {
    submitBtn.innerHTML = `
      <span>Envoyer ma demande</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"/>
      </svg>`;
    submitBtn.style.background    = '';
    submitBtn.style.borderColor   = '';
    submitBtn.disabled = false;
    contactForm.reset();
  }, 4000);
});
