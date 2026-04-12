/* ===== SafeTrace AI - Shared JavaScript ===== */

// --- Theme Management ---
function toggleTheme() {
  const html = document.documentElement;
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('safetrace_theme', next);
}
(function() {
  const saved = localStorage.getItem('safetrace_theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
})();

// --- Mobile Menu ---
function toggleMobile() {
  document.getElementById('mobileToggle').classList.toggle('active');
  document.getElementById('navLinks').classList.toggle('open');
}

// --- Navbar Scroll Effect ---
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 10);
  updateScrollProgress();
  handleParallax();
});

// =============================================
// === SCROLL PROGRESS BAR =====================
// =============================================
function updateScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docH > 0 ? (window.scrollY / docH) * 100 : 0;
  bar.style.width = pct + '%';
}

// =============================================
// === PAGE CURTAIN TRANSITION =================
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  // Inject progress bar & curtain
  if (!document.getElementById('scroll-progress')) {
    const bar = document.createElement('div');
    bar.id = 'scroll-progress';
    document.body.prepend(bar);
  }
  if (!document.getElementById('page-curtain')) {
    const curtain = document.createElement('div');
    curtain.id = 'page-curtain';
    document.body.prepend(curtain);
  }
  // Play entrance animation
  document.body.classList.add('page-enter');

  // Wire internal links to exit animation
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
    link.addEventListener('click', e => {
      e.preventDefault();
      document.body.classList.remove('page-enter');
      document.body.classList.add('page-exit');
      setTimeout(() => { window.location.href = href; }, 450);
    });
  });
});

// =============================================
// === HERO PARTICLE CANVAS ====================
// =============================================
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function makeParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.5 - 0.2,
      alpha: Math.random() * 0.4 + 0.1,
      pulse: Math.random() * Math.PI * 2,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: 80 }, makeParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const color = isDark ? '100,181,246' : '21,96,130';

    particles.forEach(p => {
      p.pulse += 0.02;
      const alpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color}, ${alpha})`;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -10) { Object.assign(p, makeParticle(), { y: H + 5 }); }
      if (p.x < -10 || p.x > W + 10) { Object.assign(p, makeParticle()); }
    });

    // Draw connecting lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${color}, ${0.07 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); });
  init();
  draw();
}

// =============================================
// === FLOATING DOTS IN HERO ===================
// =============================================
function initFloatingDots() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  let dotsContainer = hero.querySelector('.hero-dots');
  if (!dotsContainer) {
    dotsContainer = document.createElement('div');
    dotsContainer.className = 'hero-dots';
    hero.prepend(dotsContainer);
  }

  const count = 20;
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('div');
    dot.className = 'hero-dot';
    dot.style.left = Math.random() * 100 + '%';
    dot.style.top = Math.random() * 100 + '%';
    dot.style.animationDuration = (4 + Math.random() * 8) + 's';
    dot.style.animationDelay = -(Math.random() * 8) + 's';
    dot.style.width = dot.style.height = (2 + Math.random() * 5) + 'px';
    dotsContainer.appendChild(dot);
  }
}

// =============================================
// === FLOATING ORB PARALLAX ===================
// =============================================
function handleParallax() {
  const orbs = document.querySelectorAll('.float-orb');
  const scrollY = window.scrollY;
  orbs.forEach((orb, i) => {
    const speed = 0.08 + i * 0.04;
    orb.style.transform = `translateY(${scrollY * speed}px)`;
  });
  const shapes = document.querySelectorAll('.float-shape');
  shapes.forEach((shape, i) => {
    const speed = 0.05 + i * 0.03;
    shape.style.transform = `translateY(${scrollY * speed}px) rotate(${scrollY * 0.02}deg)`;
  });
}

// =============================================
// === FLOATING SHAPES IN HERO =================
// =============================================
function initFloatingShapes() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const shapes = [
    { icon: '<svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48"><circle cx="12" cy="12" r="10"/></svg>', top:'15%', left:'85%', dur:'7s', delay:'-1s', size:'60px' },
    { icon: '<svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48"><rect x="2" y="2" width="20" height="20" rx="4"/></svg>', top:'65%', left:'90%', dur:'9s', delay:'-3s', size:'40px' },
    { icon: '<svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48"><polygon points="12,2 22,20 2,20"/></svg>', top:'30%', left:'78%', dur:'11s', delay:'-6s', size:'36px' },
    { icon: '<svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48"><circle cx="12" cy="12" r="4"/></svg>', top:'75%', left:'82%', dur:'6s', delay:'-2s', size:'20px' },
  ];
  shapes.forEach(s => {
    const el = document.createElement('div');
    el.className = 'float-shape';
    el.innerHTML = s.icon;
    el.style.cssText = `top:${s.top};left:${s.left};animation-duration:${s.dur};animation-delay:${s.delay};width:${s.size};height:${s.size};color:var(--primary)`;
    hero.appendChild(el);
  });
}

// =============================================
// === TYPEWRITER EFFECT =======================
// =============================================
function initTypewriter() {
  const el = document.querySelector('.hero h1 span');
  if (!el) return;
  const words = ['Missing Person', 'Public Safety', 'Facial Recognition', 'Real-Time Tracking'];
  let wordIdx = 0, charIdx = 0, deleting = false;

  // Inject cursor
  const cursor = document.createElement('span');
  cursor.className = 'typewriter-cursor';
  el.after(cursor);

  function type() {
    const word = words[wordIdx];
    if (!deleting) {
      el.textContent = word.slice(0, ++charIdx);
      if (charIdx === word.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      el.textContent = word.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        setTimeout(type, 400);
        return;
      }
    }
    setTimeout(type, deleting ? 55 : 90);
  }
  setTimeout(type, 1200);
}

// =============================================
// === TILT EFFECT ON CARDS ====================
// =============================================
function initTiltEffect() {
  document.querySelectorAll('.card').forEach(card => {
    card.classList.add('tilt-card');
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -6;
      const rotY = ((x - cx) / cx) * 6;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px) scale(1.01)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// =============================================
// === RIPPLE EFFECT ON BUTTONS ================
// =============================================
function initRipple() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('.btn');
    if (!btn) return;
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
}

// =============================================
// === MAGNETIC NAV LINKS ======================
// =============================================
function initMagneticLinks() {
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('mousemove', e => {
      const rect = link.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.25;
      const dy = (e.clientY - cy) * 0.25;
      link.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    link.addEventListener('mouseleave', () => {
      link.style.transform = '';
    });
  });
}

// =============================================
// === SCROLL-REVEAL (INTERSECTION OBSERVER) ===
// =============================================
(function() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
  });
})();

// =============================================
// === COUNTER ANIMATION =======================
// =============================================
function animateCounter(elementId, start, end, duration, suffix) {
  const el = document.getElementById(elementId);
  if (!el) return;

  // Pop animation
  el.classList.add('stat-pop');

  let startTime = null;
  function step(ts) {
    if (!startTime) startTime = ts;
    const progress = Math.min((ts - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(start + (end - start) * eased);
    el.textContent = value.toLocaleString() + (suffix || '');
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// =============================================
// === SECTION NUMBER COUNTER TRIGGER ==========
// =============================================
function initStatCounters() {
  const statsEl = document.querySelector('.hero-stats');
  if (!statsEl) return;
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animateCounter('statCases',    0, 12500, 2200, '');
      animateCounter('statRecovery', 0, 73,    2000, '%');
      animateCounter('statAccuracy', 0, 98,    2000, '%');
      animateCounter('statAgencies', 0, 150,   2000, '+');
      obs.disconnect();
    }
  }, { threshold: 0.3 });
  obs.observe(statsEl);
}

// =============================================
// === TOAST, MODAL, LOADING ===================
// =============================================
function showToast(message, type) {
  type = type || 'info';
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const icons = {
    success: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    error:   '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c62828" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    info:    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2196F3" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  };
  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.innerHTML = (icons[type] || icons.info) + '<span>' + message + '</span>';
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.cssText += 'opacity:0;transform:translateX(110%);transition:all 0.35s ease;';
    setTimeout(() => toast.remove(), 350);
  }, 4000);
}

function showModal(title, body) {
  const overlay = document.getElementById('modalOverlay');
  if (!overlay) return;
  if (title) document.getElementById('modalTitle').textContent = title;
  if (body) document.getElementById('modalBody').textContent = body;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  if (overlay) { overlay.classList.remove('active'); document.body.style.overflow = ''; }
}

function showLoading() {
  const el = document.getElementById('loadingOverlay');
  if (el) el.classList.add('active');
}

function hideLoading() {
  const el = document.getElementById('loadingOverlay');
  if (el) el.classList.remove('active');
}

// Close modal
document.addEventListener('click', e => { if (e.target.classList.contains('modal-overlay')) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Input error clear
document.addEventListener('focusin', e => {
  if (e.target.classList.contains('form-input')) {
    const group = e.target.closest('.form-group');
    if (group) group.classList.remove('error');
  }
});

// Smooth scroll anchors
document.addEventListener('click', e => {
  const anchor = e.target.closest('a[href^="#"]');
  if (anchor) {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  }
});

// =============================================
// === INIT ALL ON DOM READY ===================
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  initHeroCanvas();
  initFloatingDots();
  initFloatingShapes();
  initTypewriter();
  initTiltEffect();
  initRipple();
  initMagneticLinks();
  initStatCounters();
});
