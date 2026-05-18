/* ============================================================
   ANAND G — PREMIUM PORTFOLIO JAVASCRIPT
   Animations | Interactions | Dynamic effects
   ============================================================ */

'use strict';

/* ── Utility ── */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ============================================================
   PAGE LOADER
   ============================================================ */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = qs('#loader');
    loader.classList.add('hidden');
    // Trigger hero reveal after load
    revealHero();
    startCounters();
  }, 1800);
});

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
const cursorDot  = qs('#cursorDot');
const cursorRing = qs('#cursorRing');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

// Smooth ring follow
function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Hover interactions
const hoverEls = 'a, button, .skill-card, .service-card, .project-card, .filter-btn';
document.addEventListener('mouseover', (e) => {
  if (e.target.closest(hoverEls)) cursorRing.classList.add('hover');
});
document.addEventListener('mouseout', (e) => {
  if (e.target.closest(hoverEls)) cursorRing.classList.remove('hover');
});

/* ============================================================
   NAVBAR
   ============================================================ */
const navbar     = qs('#navbar');
const hamburger  = qs('#hamburger');
const navLinks   = qs('#navLinks');
const navLinkEls = qsa('.nav-link');

// Scroll — add class when scrolled
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  highlightNavLink();
  toggleBackToTop();
}, { passive: true });

// Hamburger
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu on link click
navLinkEls.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Active nav link based on scroll position
function highlightNavLink() {
  const sections = qsa('section[id]');
  const scrollY  = window.scrollY + 120;

  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');

    if (scrollY >= top && scrollY < top + height) {
      navLinkEls.forEach(l => l.classList.remove('active'));
      const active = qs(`.nav-link[data-section="${id}"]`);
      if (active) active.classList.add('active');
    }
  });
}

/* ============================================================
   TYPING ANIMATION
   ============================================================ */
const roles = [
  'Shopify Developer',
  'WordPress Expert',
  'WooCommerce Specialist',
  'Ecommerce Builder',
  'UI-Focused Coder',
];
let roleIdx   = 0;
let charIdx   = 0;
let isDeleting = false;

const typingEl = qs('#typingText');

function type() {
  const currentRole = roles[roleIdx % roles.length];

  if (!isDeleting) {
    typingEl.textContent = currentRole.slice(0, ++charIdx);
    if (charIdx === currentRole.length) {
      isDeleting = true;
      setTimeout(type, 2200);
      return;
    }
  } else {
    typingEl.textContent = currentRole.slice(0, --charIdx);
    if (charIdx === 0) {
      isDeleting = false;
      roleIdx++;
    }
  }
  setTimeout(type, isDeleting ? 55 : 95);
}

// Start typing after loader
setTimeout(type, 2000);

/* ============================================================
   HERO REVEAL
   ============================================================ */
function revealHero() {
  const heroEls = qsa('.hero .reveal-up, .hero .reveal-right');
  heroEls.forEach((el) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, parseFloat(el.style.getPropertyValue('--delay') || '0') * 1000);
  });
}

/* ============================================================
   SCROLL REVEAL — IntersectionObserver
   ============================================================ */
const revealOpts = { threshold: 0.12, rootMargin: '0px 0px -60px 0px' };

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, revealOpts);

// Observe all reveal elements except hero (handled separately)
document.addEventListener('DOMContentLoaded', () => {
  qsa('.reveal-up:not(.hero *), .reveal-left:not(.hero *), .reveal-right:not(.hero *)').forEach(el => {
    revealObserver.observe(el);
  });
});

/* ============================================================
   SKILL BAR ANIMATION — triggered on scroll
   ============================================================ */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fills = qsa('.skill-fill', entry.target.closest('#skills') || entry.target.parentElement);
      fills.forEach(fill => {
        const w = fill.dataset.width;
        fill.style.width = w + '%';
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.addEventListener('DOMContentLoaded', () => {
  const skillSection = qs('#skills');
  if (skillSection) skillObserver.observe(skillSection);
});

/* ============================================================
   ANIMATED COUNTERS
   ============================================================ */
function startCounters() {
  const counters = qsa('[data-count]');
  counters.forEach(counter => {
    const target  = parseInt(counter.dataset.count, 10);
    const dur     = 1800;
    const step    = 16;
    const inc     = target / (dur / step);
    let current   = 0;

    const timer = setInterval(() => {
      current += inc;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      counter.textContent = Math.floor(current);
    }, step);
  });
}

/* ============================================================
   PORTFOLIO FILTERS
   ============================================================ */
const filterBtns  = qsa('.filter-btn');
const projectCards = qsa('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;

    // Update active state
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Filter cards
    projectCards.forEach((card, i) => {
      const cats = card.dataset.category || '';
      const show = filter === 'all' || cats.includes(filter);

      if (show) {
        card.classList.remove('hidden');
        card.style.animationDelay = `${i * 0.08}s`;
        card.style.animation = 'fadeUp .5s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ── Inject fadeUp animation ── */
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
  }
`;
document.head.appendChild(style);

/* ============================================================
   TESTIMONIALS SLIDER
   ============================================================ */
const track      = qs('#testimonialsTrack');
const dotsWrap   = qs('#testiDots');
const prevBtn    = qs('#testiPrev');
const nextBtn    = qs('#testiNext');
const cards      = qsa('.testimonial-card', track);

let currentSlide = 0;
let slidesVisible = getSlidesVisible();
let autoTimer;

function getSlidesVisible() {
  if (window.innerWidth < 768)  return 1;
  if (window.innerWidth < 1024) return 2;
  return 3;
}

function totalSlides() {
  return Math.ceil(cards.length / slidesVisible);
}

function buildDots() {
  dotsWrap.innerHTML = '';
  for (let i = 0; i < totalSlides(); i++) {
    const dot = document.createElement('button');
    dot.className = 'testi-dot' + (i === currentSlide ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  }
}

function goTo(idx) {
  const total = totalSlides();
  currentSlide = (idx + total) % total;
  const offset = currentSlide * (100 / slidesVisible) * slidesVisible;
  track.style.transform = `translateX(-${currentSlide * 100 / totalSlides() * slidesVisible / slidesVisible}%)`;

  // Calculate actual pixel offset
  const cardW   = cards[0].offsetWidth + 24; // gap
  track.style.transform = `translateX(-${currentSlide * cardW * slidesVisible}px)`;

  qsa('.testi-dot', dotsWrap).forEach((d, i) => {
    d.classList.toggle('active', i === currentSlide);
  });
}

function next() { goTo(currentSlide + 1); resetAuto(); }
function prev() { goTo(currentSlide - 1); resetAuto(); }

function resetAuto() {
  clearInterval(autoTimer);
  autoTimer = setInterval(next, 4000);
}

prevBtn.addEventListener('click', prev);
nextBtn.addEventListener('click', next);

window.addEventListener('resize', () => {
  slidesVisible = getSlidesVisible();
  currentSlide  = 0;
  buildDots();
  goTo(0);
});

buildDots();
autoTimer = setInterval(next, 4000);

/* ── Swipe support ── */
let touchStartX = 0;
track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend',   e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
});

/* ============================================================
   CONTACT FORM
   ============================================================ */
const form      = qs('#contactForm');
const submitBtn = qs('#submitBtn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  submitBtn.classList.add('loading');
  submitBtn.disabled = true;

  // Simulate async send (replace with real API)
  await new Promise(r => setTimeout(r, 2200));

  submitBtn.classList.remove('loading');
  submitBtn.disabled = false;
  showToast('✅ Message sent! I\'ll get back to you within 24 hours.');
  form.reset();

  // Reset floating labels
  qsa('.form-field input, .form-field textarea, .form-field select', form).forEach(el => {
    el.dispatchEvent(new Event('change'));
  });
});

function validateForm() {
  let valid = true;
  const required = qsa('[required]', form);
  required.forEach(field => {
    if (!field.value.trim()) {
      field.style.borderColor = '#ff4d6d';
      valid = false;
      setTimeout(() => field.style.borderColor = '', 2000);
    }
  });
  if (!valid) {
    showToast('⚠️ Please fill in all required fields.');
  }
  return valid;
}

/* ── Toast notification ── */
function showToast(msg) {
  const existing = qs('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  toast.style.cssText = `
    position:fixed; bottom:28px; left:50%; transform:translateX(-50%) translateY(80px);
    background:rgba(20,26,44,.97); color:#f0f4ff;
    border:1px solid rgba(123,47,255,.35); border-radius:50px;
    padding:14px 28px; font-size:.9rem; font-weight:600;
    backdrop-filter:blur(16px); z-index:9999;
    transition:transform .4s cubic-bezier(.4,0,.2,1), opacity .4s;
    max-width:90%; text-align:center; white-space:nowrap;
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });
  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(80px)';
    toast.style.opacity   = '0';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

/* ============================================================
   BACK TO TOP
   ============================================================ */
const backToTop = qs('#backToTop');

function toggleBackToTop() {
  backToTop.classList.toggle('visible', window.scrollY > 400);
}

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================================
   MOUSE PARALLAX — Hero blobs & profile card
   ============================================================ */
const hero = qs('.hero');
const blobs = qsa('.blob');

hero.addEventListener('mousemove', (e) => {
  const { left, top, width, height } = hero.getBoundingClientRect();
  const x = (e.clientX - left) / width  - 0.5;
  const y = (e.clientY - top)  / height - 0.5;

  blobs.forEach((blob, i) => {
    const factor = (i + 1) * 18;
    blob.style.transform = `translate(${x * factor}px, ${y * factor}px) scale(${1 + Math.abs(x) * 0.04})`;
  });
});

/* ============================================================
   FOOTER — Current year
   ============================================================ */
const yearEl = qs('#currentYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ============================================================
   SMOOTH SCROLL — Internal links
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ============================================================
   GRADIENT BORDER ANIMATION — service cards on hover
   ============================================================ */
qsa('.service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
    const glow = card.querySelector('.service-card-glow');
    if (glow) {
      glow.style.left = (e.clientX - rect.left - 90) + 'px';
      glow.style.top  = (e.clientY - rect.top  - 90) + 'px';
    }
  });
});

/* ============================================================
   STAGGERED SECTION ENTRY — add CSS delay to children
   ============================================================ */
function initStagger() {
  const staggerGroups = [
    '.services-grid .service-card',
    '.skills-grid .skill-card',
    '.projects-grid .project-card',
    '.about-expertise .expertise-card',
  ];
  staggerGroups.forEach(selector => {
    qsa(selector).forEach((el, i) => {
      if (!el.style.getPropertyValue('--delay')) {
        el.style.setProperty('--delay', `${i * 0.1}s`);
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', initStagger);

/* ============================================================
   EXPERIENCE TIMELINE — alternate left/right
   ============================================================ */
// Already handled via CSS classes .reveal-left/.reveal-right

/* ============================================================
   KEYBOARD NAVIGATION — Accessibility
   ============================================================ */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  }
});

/* ============================================================
   PERFORMANCE — Defer non-critical work
   ============================================================ */
// Prefetch next section images (empty here since placeholders)
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    // Future: preload images
  });
}

/* ============================================================
   INIT LOG
   ============================================================ */
console.log(
  '%c✦ Anand G Portfolio — Shopify & WordPress Developer%c\nanandg.shopy@gmail.com',
  'color:#7b2fff;font-size:16px;font-weight:bold;',
  'color:#8b9cbf;font-size:12px;'
);

