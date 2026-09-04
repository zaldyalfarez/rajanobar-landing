/**
 * RAJA NOBAR INDONESIA - CORE SCRIPTS
 * Lightweight, accessible vanilla JavaScript for modern sports portal.
 */

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0);
  if (window.lucide) {
    lucide.createIcons();
  }
  initCountdown();
  initSimulator();
  initMobileNavigation();
  initCompetitionFilter();
  initKeyboardListeners();
  initGsapAnimations();
});

/* --------------------------------------------------------------------------
   1. COUNTDOWN TIMER (Big Match Kick-off)
   -------------------------------------------------------------------------- */
function initCountdown() {
  const cdDisplay = document.getElementById('cdDisplay');
  if (!cdDisplay) return;

  let remainingSeconds = 3 * 3600 + 42 * 60 + 15;

  const timer = setInterval(() => {
    if (remainingSeconds <= 0) {
      clearInterval(timer);
      cdDisplay.textContent = 'Pertandingan Dimulai';
      return;
    }

    remainingSeconds--;

    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;

    cdDisplay.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, 1000);
}

/* --------------------------------------------------------------------------
   2. INTERACTIVE MATCH SCORE PREDICTOR
   -------------------------------------------------------------------------- */
let scoreTeam1 = 2;
let scoreTeam2 = 1;

function adjustSimScore(team, delta) {
  const elId = team === 'team1' ? 'simScoreTeam1' : 'simScoreTeam2';
  if (team === 'team1') {
    scoreTeam1 = Math.max(0, Math.min(9, scoreTeam1 + delta));
    const el = document.getElementById(elId);
    if (el) {
      el.textContent = scoreTeam1;
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(el, { scale: 1.35, color: '#005a36' }, { scale: 1, color: '#0f172a', duration: 0.3, ease: 'back.out(2)' });
      }
    }
  } else {
    scoreTeam2 = Math.max(0, Math.min(9, scoreTeam2 + delta));
    const el = document.getElementById(elId);
    if (el) {
      el.textContent = scoreTeam2;
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(el, { scale: 1.35, color: '#005a36' }, { scale: 1, color: '#0f172a', duration: 0.3, ease: 'back.out(2)' });
      }
    }
  }

  calculateSimPoints();
}

function calculateSimPoints() {
  const pointsEl = document.getElementById('simResultPoints');
  const statEl = document.getElementById('simCommunityStat');
  const booster = document.getElementById('boosterCheckbox');
  const firstGoal = document.getElementById('firstGoalSelect');

  if (!pointsEl) return;

  let points = 200;
  const totalGoals = scoreTeam1 + scoreTeam2;
  points += totalGoals * 25;

  if (firstGoal && firstGoal.value !== 'none') {
    points += 100;
  } else if (firstGoal && firstGoal.value === 'none' && totalGoals === 0) {
    points += 250;
  }

  if (booster && booster.checked) {
    points *= 2;
  }

  pointsEl.textContent = `+${points}`;
  if (typeof gsap !== 'undefined') {
    gsap.fromTo(pointsEl, { scale: 1.15, color: '#16a34a' }, { scale: 1, color: '#005a36', duration: 0.35, ease: 'power2.out' });
  }

  if (statEl) {
    if (scoreTeam1 > scoreTeam2) {
      statEl.textContent = `74% analis memprediksi kemenangan Indonesia (${scoreTeam1} - ${scoreTeam2}).`;
    } else if (scoreTeam1 === scoreTeam2) {
      statEl.textContent = `38% analis memprediksi laga sengit berakhir imbang (${scoreTeam1} - ${scoreTeam2}).`;
    } else {
      statEl.textContent = `Prediksi berani! 18% memprediksi tim tamu unggul (${scoreTeam1} - ${scoreTeam2}). Poin kejutan lebih besar!`;
    }
  }
}

function triggerSimLock() {
  const pointsEl = document.getElementById('simResultPoints');
  const points = pointsEl ? pointsEl.textContent : '+450';
  const lockBtn = document.getElementById('lockPredictionBtn');

  if (typeof gsap !== 'undefined' && lockBtn) {
    gsap.fromTo(lockBtn, { scale: 0.94 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
  }
  
  showToast('Prediksi Tersimpan', `Skor ${scoreTeam1} - ${scoreTeam2} terkunci dengan estimasi ${points} poin.`);

  setTimeout(() => {
    openJoinModal(`Simpan Prediksi: Indonesia ${scoreTeam1} - ${scoreTeam2} Vietnam`);
  }, 600);
}

function initSimulator() {
  calculateSimPoints();
}

/* --------------------------------------------------------------------------
   3. COMPETITION PILL FILTER
   -------------------------------------------------------------------------- */
function initCompetitionFilter() {
  const pills = document.querySelectorAll('.comp-pill');
  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      showToast('Kompetisi Dipilih', `Menampilkan pertandingan: ${pill.textContent.trim()}`);
    });
  });
}

function filterTeamSchedule(teamName) {
  const cards = document.querySelectorAll('.team-circle-card');
  cards.forEach(card => {
    const nameEl = card.querySelector('.team-circle-name');
    if (nameEl && nameEl.textContent.trim().toLowerCase() === teamName.toLowerCase()) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });

  showToast('Tim Unggulan Dipilih', `Menampilkan jadwal & status prediksi untuk: ${teamName}`);
}

/* --------------------------------------------------------------------------
   3.5 VENUE FILTERING
   -------------------------------------------------------------------------- */
function filterVenues(city, btn) {
  const filterBtns = document.querySelectorAll('.venue-filter-btn');
  filterBtns.forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
  });
  if (btn) {
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
  }

  const cards = document.querySelectorAll('.venue-card');
  let matchCount = 0;

  cards.forEach(card => {
    const cardCity = card.getAttribute('data-city');
    if (city === 'all' || cardCity === city) {
      card.style.display = card.classList.contains('venue-card-featured') ? 'grid' : 'flex';
      matchCount++;
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(card, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
      }
    } else {
      card.style.display = 'none';
    }
  });

  const cityLabel = btn ? btn.textContent.trim() : city;
  showToast('Lokasi Nobar', `Menampilkan: ${cityLabel} (${matchCount} venue)`);
}

/* --------------------------------------------------------------------------
   4. PRIZEPOOL TABS & DRAWER
   -------------------------------------------------------------------------- */
function switchPrizePool(tab) {
  const tabNovice = document.getElementById('tabNovice');
  const tabGold = document.getElementById('tabGold');

  if (tab === 'novice') {
    if (tabNovice) tabNovice.classList.add('active');
    if (tabGold) tabGold.classList.remove('active');
    showToast('Tier Ditampilkan', 'Prizepool resmi untuk Tier Novice & Silver.');
  } else {
    if (tabGold) tabGold.classList.add('active');
    if (tabNovice) tabNovice.classList.remove('active');
    showToast('Tier Ditampilkan', 'Prizepool turnamen akbar untuk Tier Gold & Master.');
  }
}

function toggleExtraPrizes() {
  const drawer = document.getElementById('prizepoolDrawer');
  const btnText = document.getElementById('togglePrizepoolText');
  const icon = document.getElementById('toggleIcon');
  if (!drawer || !btnText) return;

  drawer.classList.toggle('open');
  const isOpen = drawer.classList.contains('open');

  if (isOpen) {
    btnText.textContent = 'Tutup Rincian Peringkat 4-15';
    if (icon) icon.style.transform = 'rotate(180deg)';
  } else {
    btnText.textContent = 'Buka Rincian Peringkat 4-15';
    if (icon) icon.style.transform = 'rotate(0deg)';
  }
}

/* --------------------------------------------------------------------------
   5. FAQ ACCORDION
   -------------------------------------------------------------------------- */
function toggleFaq(btn) {
  const item = btn.closest('.faq-accordion-item');
  if (!item) return;

  const isExpanded = btn.getAttribute('aria-expanded') === 'true';

  document.querySelectorAll('.faq-accordion-item').forEach((other) => {
    if (other !== item) {
      other.classList.remove('active');
      const otherBtn = other.querySelector('.faq-accordion-toggle');
      if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
    }
  });

  if (isExpanded) {
    item.classList.remove('active');
    btn.setAttribute('aria-expanded', 'false');
  } else {
    item.classList.add('active');
    btn.setAttribute('aria-expanded', 'true');
  }
}

/* --------------------------------------------------------------------------
   6. MODAL & FORM
   -------------------------------------------------------------------------- */
function openJoinModal(context = 'Daftar Akun') {
  const modal = document.getElementById('joinModal');
  const subtitle = document.getElementById('modalSubtitle');
  if (!modal) return;

  if (subtitle && context.startsWith('Simpan Prediksi')) {
    subtitle.textContent = `Lengkapi kontakmu untuk mengunci tiket ${context.replace('Simpan Prediksi: ', '')}.`;
  } else if (subtitle && context.startsWith('Prediksi:')) {
    subtitle.textContent = `Lengkapi formulir singkat untuk memasang prediksi pada ${context}.`;
  } else if (subtitle && context.startsWith('Reservasi:')) {
    subtitle.textContent = `Konfirmasi kontak untuk mengamankan kursi nonton bareng di ${context.replace('Reservasi: ', '')}.`;
  } else if (subtitle && context.startsWith('Pendaftaran Nobar')) {
    subtitle.textContent = 'Daftarkan nama & nomor WhatsApp untuk reservasi kuota nonton bareng resmi.';
  } else if (subtitle) {
    subtitle.textContent = 'Buat akun dalam 30 detik untuk mengamankan kuota prediksi dan booster harianmu.';
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  const modalCard = modal.querySelector('.modal-card');
  if (typeof gsap !== 'undefined' && modalCard) {
    gsap.fromTo(modalCard,
      { y: 35, scale: 0.95, autoAlpha: 0 },
      { y: 0, scale: 1, autoAlpha: 1, duration: 0.35, ease: 'back.out(1.4)' }
    );
  }

  setTimeout(() => {
    const input = document.getElementById('inputName');
    if (input) input.focus();
  }, 100);
}

function closeJoinModal() {
  const modal = document.getElementById('joinModal');
  if (!modal) return;

  const modalCard = modal.querySelector('.modal-card');
  if (typeof gsap !== 'undefined' && modalCard) {
    gsap.to(modalCard, {
      y: 20,
      scale: 0.96,
      autoAlpha: 0,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  } else {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function handleFormSubmit(e) {
  e.preventDefault();
  const inputName = document.getElementById('inputName');
  const name = inputName ? inputName.value.trim() : 'Peserta';

  closeJoinModal();
  showToast(`Selamat Bergabung, ${name}`, 'Akun berhasil dibuat. Kuota prediksi gratis dan booster 2x sudah aktif.');

  if (inputName) inputName.value = '';
}

/* --------------------------------------------------------------------------
   7. MOBILE NAVIGATION
   -------------------------------------------------------------------------- */
function initMobileNavigation() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mobileNav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      nav.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
    }
  });
}

function closeMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mobileNav');
  if (nav) nav.classList.remove('open');
  if (toggle) toggle.setAttribute('aria-expanded', 'false');
}

/* --------------------------------------------------------------------------
   8. TOAST NOTIFICATION
   -------------------------------------------------------------------------- */
let toastTimeout;
function showToast(title, message) {
  const toast = document.getElementById('toast');
  const toastTitle = document.getElementById('toastTitle');
  const toastMsg = document.getElementById('toastMessage');

  if (!toast || !toastTitle || !toastMsg) return;

  toastTitle.textContent = title;
  toastMsg.textContent = message;

  toast.classList.add('active');
  if (typeof gsap !== 'undefined') {
    gsap.fromTo(toast, 
      { y: 30, autoAlpha: 0, scale: 0.95 }, 
      { y: 0, autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(1.5)' }
    );
  }

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    if (typeof gsap !== 'undefined') {
      gsap.to(toast, {
        y: 20,
        autoAlpha: 0,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => toast.classList.remove('active')
      });
    } else {
      toast.classList.remove('active');
    }
  }, 3500);
}

function initKeyboardListeners() {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeJoinModal();
      closeMobileMenu();
    }
  });

  const modal = document.getElementById('joinModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeJoinModal();
    });
  }
}

function selectSportCategory(sport) {
  const tabs = document.querySelectorAll('.sport-tab-item');
  tabs.forEach(t => t.classList.remove('active'));
  if (window.event && window.event.currentTarget) {
    window.event.currentTarget.classList.add('active');
  }
  showToast('Kategori Terpilih', 'Menampilkan jadwal & pertandingan resmi Sepak Bola.');
}

function showSoonNotice(sportName) {
  showToast('Segera Hadir', `Fitur nobar dan jadwal untuk cabang ${sportName} sedang disiapkan.`);
}

function toggleMoreSportsMenu(e) {
  if (e) e.stopPropagation();
  const dropdown = document.getElementById('moreSportsDropdown');
  if (dropdown) {
    dropdown.classList.toggle('show');
  }
}

// Close sports dropdown on outside click
document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('moreSportsDropdown');
  const btn = document.getElementById('moreSportsBtn');
  if (dropdown && dropdown.classList.contains('show')) {
    if (btn && !btn.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('show');
    }
  }
});

/* --------------------------------------------------------------------------
   10. GSAP ANIMATIONS & INTERSECTION-TRIGGERED ENTRANCES
   -------------------------------------------------------------------------- */
function initGsapAnimations() {
  if (typeof gsap === 'undefined') return;

  gsap.defaults({ duration: 0.6, ease: "power2.out" });

  // 1. Refined & Cinematic Hero Entrance Choreography (Cepat, Dinamis & Berkarakter)
  const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

  // Top header slides down smoothly
  heroTl.fromTo('.site-header',
    { y: -30, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, duration: 0.5, clearProps: 'all' }
  );

  // Left Column (Typography & Call to Actions)
  heroTl.fromTo('.status-pill',
    { y: -16, scale: 0.9, autoAlpha: 0 },
    { y: 0, scale: 1, autoAlpha: 1, duration: 0.45, ease: 'back.out(1.6)', clearProps: 'all' },
    "-=0.35"
  );

  heroTl.fromTo('.hero-title',
    { y: 22, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, duration: 0.5, clearProps: 'all' },
    "-=0.32"
  );

  heroTl.fromTo('.hero-description',
    { y: 18, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, duration: 0.45, clearProps: 'all' },
    "-=0.35"
  );

  heroTl.fromTo('.hero-btn-row .btn',
    { y: 16, scale: 0.94, autoAlpha: 0 },
    { y: 0, scale: 1, autoAlpha: 1, duration: 0.45, stagger: 0.08, ease: 'back.out(1.4)', clearProps: 'all' },
    "-=0.3"
  );

  heroTl.fromTo('.hero-stats-bar .stat-cell',
    { y: 15, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, duration: 0.4, stagger: 0.06, clearProps: 'all' },
    "-=0.25"
  );

  // Right Column: The Interactive Match Arena Card (Centerpiece)
  // Starts simultaneously with the typography!
  heroTl.fromTo('.match-arena-card',
    { y: 38, scale: 0.93, autoAlpha: 0 },
    { y: 0, scale: 1, autoAlpha: 1, duration: 0.65, ease: 'back.out(1.25)', clearProps: 'all' },
    "-=0.72"
  );

  // Inside the Arena Card: Indonesia crest slides from left, Vietnam from right, meeting at VS!
  heroTl.fromTo('.arena-teams-layout .team-unit:first-child',
    { x: -28, autoAlpha: 0 },
    { x: 0, autoAlpha: 1, duration: 0.45, ease: 'power2.out', clearProps: 'all' },
    "-=0.42"
  );

  heroTl.fromTo('.arena-vs-column',
    { scale: 0.5, autoAlpha: 0 },
    { scale: 1, autoAlpha: 1, duration: 0.4, ease: 'back.out(1.8)', clearProps: 'all' },
    "-=0.38"
  );

  heroTl.fromTo('.arena-teams-layout .team-unit:last-child',
    { x: 28, autoAlpha: 0 },
    { x: 0, autoAlpha: 1, duration: 0.45, ease: 'power2.out', clearProps: 'all' },
    "-=0.42"
  );

  // Controls, Footer & Points pop
  heroTl.fromTo('.arena-controls',
    { y: 14, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, duration: 0.38, clearProps: 'all' },
    "-=0.25"
  );

  heroTl.fromTo('.arena-footer',
    { y: 14, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, duration: 0.38, clearProps: 'all' },
    "-=0.25"
  );

  heroTl.fromTo('.calc-amount',
    { scale: 1.32, color: '#16a34a' },
    { scale: 1, color: '#005a36', duration: 0.4, ease: 'back.out(1.5)', clearProps: 'all' },
    "-=0.15"
  );

  // 2. High-Impact Scroll Entrance Animations (Pemicu Presisi Pada Tiap Kontainer Konten)
  if (typeof IntersectionObserver !== 'undefined') {
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    // Helper untuk animasi scroll yang nyata terlihat dan tidak pernah 'muncul duluan'
    function registerScrollReveal(triggerSelector, targetSelector, animVars) {
      const trigger = document.querySelector(triggerSelector);
      if (!trigger) return;

      const targets = document.querySelectorAll(targetSelector);
      if (targets.length === 0) return;

      // Kunci: Set elemen dalam kondisi tersembunyi di bawah agar 100% tidak 'muncul duluan'
      gsap.set(targets, {
        autoAlpha: 0,
        y: animVars.fromY !== undefined ? animVars.fromY : 45,
        scale: animVars.fromScale !== undefined ? animVars.fromScale : 1,
        x: animVars.fromX !== undefined ? animVars.fromX : 0
      });

      let triggered = false;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !triggered) {
            triggered = true;
            gsap.to(targets, {
              autoAlpha: 1,
              y: 0,
              x: 0,
              scale: 1,
              duration: animVars.duration || 0.65,
              stagger: animVars.stagger || 0,
              ease: animVars.ease || 'power2.out',
              delay: animVars.delay || 0,
              clearProps: 'all'
            });
            observer.unobserve(trigger);
          }
        });
      }, {
        root: null,
        rootMargin: '0px 0px -40px 0px', // Aktif saat kontainer konten 40px memasuki layar
        threshold: 0.08
      });

      observer.observe(trigger);
    }

    // 1. Section: Pilih Tim Nasional Favorit Anda (#top-teams)
    registerScrollReveal('#top-teams .top-teams-grid', '#top-teams .team-circle-card', {
      fromY: 45,
      fromScale: 0.88,
      duration: 0.6,
      stagger: 0.04,
      ease: 'back.out(1.4)'
    });

    // 2. Section: Jadwal Pertandingan (#jadwal)
    registerScrollReveal('#jadwal .sports-category-bar', '#jadwal .sports-category-bar', {
      fromX: -40,
      fromY: 0,
      duration: 0.55,
      ease: 'power2.out'
    });
    registerScrollReveal('#jadwal .matches-grid', '#jadwal .match-quick-card', {
      fromY: 50,
      duration: 0.65,
      stagger: 0.1,
      ease: 'power3.out'
    });

    // 3. Section: Mudah & Cepat: Pasang Tebak Skor Sekarang (#app-preview)
    registerScrollReveal('#app-preview .app-guide-content', '#app-preview .guide-step-card', {
      fromX: -45,
      fromY: 0,
      duration: 0.65,
      stagger: 0.1,
      ease: 'power2.out'
    });
    registerScrollReveal('#app-preview .phones-trio-wrap', '#app-preview .phone-frame-item', {
      fromY: 70,
      fromScale: 0.88,
      duration: 0.75,
      stagger: 0.14,
      ease: 'back.out(1.3)'
    });

    // 4. Pita Transisi Banner (.mid-transition-banner)
    registerScrollReveal('.mid-transition-banner', '.mid-transition-banner .mid-transition-inner', {
      fromY: 35,
      fromScale: 0.96,
      duration: 0.6,
      ease: 'power2.out'
    });

    // 5. Section: Tebak dengan Tepat, Mainkan Strategi Terdepan (#strategi)
    registerScrollReveal('#strategi .bento-sports-grid', '#strategi .bento-item', {
      fromY: 50,
      duration: 0.65,
      stagger: 0.12,
      ease: 'power2.out'
    });

    // 6. Section: Prizepool Musim 2026 (#prizepool)
    registerScrollReveal('#prizepool .podium-cards-grid', '#prizepool .product-prize-card', {
      fromY: 60,
      fromScale: 0.92,
      duration: 0.7,
      stagger: 0.12,
      ease: 'back.out(1.25)'
    });

    // 7. Section: Maksimalkan Pengalaman Nobar Anda (#membership)
    registerScrollReveal('#membership .membership-cards-grid', '#membership .membership-card', {
      fromY: 55,
      duration: 0.65,
      stagger: 0.09,
      ease: 'power2.out'
    });

    // 8. Section: Standar Transparansi & Fair Play (#keunggulan)
    registerScrollReveal('#keunggulan .trust-pillars-grid', '#keunggulan .pillar-card', {
      fromY: 40,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power2.out'
    });

    // 9. Section: Pertanyaan Umum (#faq)
    registerScrollReveal('#faq .faq-accordion-group', '#faq .faq-accordion-item', {
      fromY: 30,
      duration: 0.5,
      stagger: 0.07,
      ease: 'power2.out'
    });

    // 10. Section: Bottom CTA Banner (.bottom-cta-banner)
    registerScrollReveal('.bottom-cta-banner', '.bottom-cta-banner .bottom-cta-inner', {
      fromY: 40,
      fromScale: 0.95,
      duration: 0.65,
      ease: 'back.out(1.2)'
    });
  }
}

// Global exports
window.adjustSimScore = adjustSimScore;
window.calculateSimPoints = calculateSimPoints;
window.triggerSimLock = triggerSimLock;
window.switchPrizePool = switchPrizePool;
window.toggleExtraPrizes = toggleExtraPrizes;
window.toggleFaq = toggleFaq;
window.openJoinModal = openJoinModal;
window.closeJoinModal = closeJoinModal;
window.handleFormSubmit = handleFormSubmit;
window.closeMobileMenu = closeMobileMenu;
window.filterTeamSchedule = filterTeamSchedule;
window.selectSportCategory = selectSportCategory;
window.showSoonNotice = showSoonNotice;
window.toggleMoreSportsMenu = toggleMoreSportsMenu;
window.initGsapAnimations = initGsapAnimations;


