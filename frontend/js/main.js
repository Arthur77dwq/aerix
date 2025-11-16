// Free Location Autocomplete using Nominatim (OpenStreetMap)
let locationTimeout;

function initLocationAutocomplete() {
  const locationInput = document.getElementById('location');
  if (!locationInput) return;

  const dropdown = document.createElement('div');
  dropdown.className = 'location-dropdown';
  dropdown.style.display = 'none';
  locationInput.parentElement.appendChild(dropdown);

  locationInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    if (query.length < 3) {
      dropdown.style.display = 'none';
      return;
    }
    clearTimeout(locationTimeout);
    locationTimeout = setTimeout(() => searchLocations(query, dropdown, locationInput), 300);
  });

  document.addEventListener('click', (e) => {
    if (!locationInput.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = 'none';
    }
  });
}

function searchLocations(query, dropdown, input) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`;
  
  fetch(url, {
    headers: { 'User-Agent': 'Aerix-Landing-Page' }
  })
  .then(res => res.json())
  .then(data => {
    if (data.length === 0) {
      dropdown.style.display = 'none';
      return;
    }
    
    dropdown.innerHTML = '';
    data.forEach(place => {
      const item = document.createElement('div');
      item.className = 'location-item';
      item.textContent = place.display_name;
      item.addEventListener('click', () => {
        input.value = place.display_name;
        dropdown.style.display = 'none';
      });
      dropdown.appendChild(item);
    });
    dropdown.style.display = 'block';
  })
  .catch(err => {
    console.error('Location search error:', err);
    dropdown.style.display = 'none';
  });
}

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to 'dark'
const currentTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', currentTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const authModal = document.getElementById('authModal');
  const leadForm = document.getElementById('leadForm');
  const leadFormBottom = document.getElementById('leadFormBottom');
  const headerLogin = document.getElementById('openAuthFromHeader');
  const headerCta = document.getElementById('openAuthFromHeaderCta');
  const navToggle = document.querySelector('.nav-toggle');
  const mobileNav = document.getElementById('mobileNav');
  const navLinks = document.querySelectorAll('.nav a');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
  const openAuthButtons = document.querySelectorAll('.open-auth');

  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  function openModal() {
    if (!authModal) return;
    authModal.classList.add('show');
    authModal.setAttribute('aria-hidden', 'false');
    // Focus first input for better UX
    const firstInput = authModal.querySelector('.panel.active input');
    if (firstInput) firstInput.focus();
  }

  function closeModal() {
    if (!authModal) return;
    authModal.classList.remove('show');
    authModal.setAttribute('aria-hidden', 'true');
  }

  // Form handlers: prevent submit and show modal
  function handleLeadFormSubmit(e) {
    e.preventDefault();
    openModal();
  }

  if (leadForm) leadForm.addEventListener('submit', handleLeadFormSubmit);
  if (leadFormBottom) leadFormBottom.addEventListener('submit', handleLeadFormSubmit);

  // Header buttons
  if (headerLogin) headerLogin.addEventListener('click', openModal);
  if (headerCta) headerCta.addEventListener('click', openModal);
  openAuthButtons.forEach(btn => btn.addEventListener('click', openModal));

  // Modal close controls (backdrop or X)
  if (authModal) {
    authModal.addEventListener('click', (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.hasAttribute('data-close') || target.classList.contains('modal-backdrop')) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    });

    // Tabs: signup/login
    const tabs = authModal.querySelectorAll('.tab');
    const panels = authModal.querySelectorAll('.panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const name = tab.getAttribute('data-tab');
        tabs.forEach(t => {
          t.classList.toggle('active', t === tab);
          t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
        });
        panels.forEach(p => p.classList.remove('active'));
        const targetPanel = authModal.querySelector(`#${name === 'login' ? 'loginPanel' : 'signupPanel'}`);
        if (targetPanel) targetPanel.classList.add('active');
      });
    });

    // Prevent default form submissions in modal (demo only)
    panels.forEach(p => {
      p.addEventListener('submit', (e) => {
        e.preventDefault();
        closeModal();
        alert('Demo: form submitted. Connect backend to proceed.');
      });
    });
  }

  // Initialize location autocomplete
  initLocationAutocomplete();

  // Scroll Animation Observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observe all sections and cards
  document.querySelectorAll('.features h2, .how h2, .testimonials h2, .pricing h2').forEach(el => {
    el.classList.add('scroll-fade-in');
    observer.observe(el);
  });

  document.querySelectorAll('.feature-card').forEach((el, i) => {
    el.classList.add('scroll-fade-in');
    el.style.transitionDelay = `${i * 0.1}s`;
    observer.observe(el);
  });

  document.querySelectorAll('.step').forEach((el, i) => {
    el.classList.add('scroll-scale');
    el.style.transitionDelay = `${i * 0.1}s`;
    observer.observe(el);
  });

  document.querySelectorAll('.testimonial').forEach((el, i) => {
    el.classList.add('scroll-fade-in');
    el.style.transitionDelay = `${i * 0.15}s`;
    observer.observe(el);
  });

  document.querySelectorAll('.price-card').forEach((el, i) => {
    el.classList.add('scroll-scale');
    el.style.transitionDelay = `${i * 0.1}s`;
    observer.observe(el);
  });

  const hero = document.querySelector('.hero');
  const heroGrid = hero ? hero.querySelector('.hero-grid') : null;
  const heroVisual = document.querySelector('.hero-visual');
  const dashboardCard = heroVisual ? heroVisual.querySelector('.dashboard-card') : null;
  const mockScene = document.querySelector('.mock-scene');
  const laptopBody = mockScene ? mockScene.querySelector('.laptop-body') : null;
  const laptopScreen = mockScene ? mockScene.querySelector('.laptop-screen') : null;

  let heroHeight = hero ? hero.offsetHeight : window.innerHeight;
  let lastHeroShift = null;
  let lastGridShift = null;
  let lastSceneTiltX = null;
  let lastSceneTiltY = null;
  let lastBodyTiltX = null;
  let lastBodyTiltY = null;
  let lastScreenOffset = null;

  function recomputeHeroMetrics() {
    heroHeight = hero ? hero.offsetHeight : window.innerHeight;
  }

  const largeScreenQuery = window.matchMedia('(min-width: 1024px)');

  function resetHeroTransforms() {
    if (hero) hero.style.removeProperty('transform');
    if (heroGrid) heroGrid.style.removeProperty('transform');
    lastHeroShift = null;
    lastGridShift = null;
  }

  function applyScrollEffects() {
    const isLargeScreen = largeScreenQuery.matches;
    const scrollY = window.pageYOffset;

    if (!isLargeScreen) {
      if (lastHeroShift !== null || lastGridShift !== null) {
        resetHeroTransforms();
      }
    } else if (hero) {
      const heroShift = -Math.min(scrollY * 0.65, heroHeight);
      if (heroShift !== lastHeroShift) {
        hero.style.transform = `translate3d(0, ${heroShift}px, 0)`;
        lastHeroShift = heroShift;
      }

      if (heroGrid) {
        const contentShift = Math.min(scrollY * 0.3, heroHeight * 0.45);
        if (contentShift !== lastGridShift) {
          heroGrid.style.transform = `translate3d(0, ${contentShift}px, 0)`;
          lastGridShift = contentShift;
        }
      }
    }

    if (mockScene) {
      const progress = Math.min(scrollY / heroHeight, 1);
      const tiltX = -2 + progress * -4;
      const tiltY = -8 + progress * 6;
      if (tiltX !== lastSceneTiltX || tiltY !== lastSceneTiltY) {
        mockScene.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        lastSceneTiltX = tiltX;
        lastSceneTiltY = tiltY;
      }

      if (laptopBody) {
        const bodyTiltX = -6 + progress * -6;
        const bodyTiltY = -12 + progress * 8;
        if (bodyTiltX !== lastBodyTiltX || bodyTiltY !== lastBodyTiltY) {
          laptopBody.style.transform = `rotateX(${bodyTiltX}deg) rotateY(${bodyTiltY}deg)`;
          lastBodyTiltX = bodyTiltX;
          lastBodyTiltY = bodyTiltY;
        }
      }

      if (laptopScreen) {
        const screenOffset = progress * 12;
        if (screenOffset !== lastScreenOffset) {
          laptopScreen.style.transform = `translateY(${screenOffset}px)`;
          lastScreenOffset = screenOffset;
        }
      }
    }
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        applyScrollEffects();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    recomputeHeroMetrics();
    applyScrollEffects();
  });

  largeScreenQuery.addEventListener('change', () => {
    if (!largeScreenQuery.matches) {
      resetHeroTransforms();
    } else {
      applyScrollEffects();
    }
  });

  recomputeHeroMetrics();
  applyScrollEffects();

  if (navToggle && mobileNav) {
    const toggleNav = () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      const nextState = !expanded;
      navToggle.setAttribute('aria-expanded', String(nextState));
      mobileNav.classList.toggle('show', nextState);
      mobileNav.setAttribute('aria-hidden', String(!nextState));
      document.body.classList.toggle('nav-open', nextState);
    };

    navToggle.addEventListener('click', toggleNav);
    mobileNav.addEventListener('click', (event) => {
      if (event.target === mobileNav) toggleNav();
    });
    mobileNavLinks.forEach(link => link.addEventListener('click', toggleNav));
  }

  const sections = Array.from(document.querySelectorAll('main section[id]'));

  const highlightNav = () => {
    const scrollPosition = window.scrollY + window.innerHeight * 0.3;
    let activeId = null;
    for (const section of sections) {
      if (scrollPosition >= section.offsetTop) {
        activeId = section.id;
      }
    }
    if (activeId) {
      navLinks.forEach(link => {
        const match = link.getAttribute('href') === `#${activeId}`;
        link.classList.toggle('active', match);
      });
      mobileNavLinks.forEach(link => {
        const match = link.getAttribute('href') === `#${activeId}`;
        link.classList.toggle('active', match);
      });
    }
  };

  const headerEl = document.querySelector('.site-header');
  const updateHeaderState = () => {
    if (!headerEl) return;
    headerEl.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', () => {
    highlightNav();
    updateHeaderState();
  }, { passive: true });

  highlightNav();
  updateHeaderState();

  if (heroVisual && dashboardCard) {
    let targetX = 0.5;
    let targetY = 0.5;
    let currentX = 0.5;
    let currentY = 0.5;
    let isHovering = false;

    const clamp = (value) => Math.min(Math.max(value, 0), 1);

    const updateTargetFromEvent = (event) => {
      if (!(event instanceof PointerEvent)) return;
      if (event.pointerType === 'touch') return;
      const rect = heroVisual.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      targetX = clamp((event.clientX - rect.left) / rect.width);
      targetY = clamp((event.clientY - rect.top) / rect.height);
    };

    const animateTilt = () => {
      const ease = isHovering ? 0.18 : 0.12;
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;

      const baseRotateX = (0.5 - currentY) * 18;
      const baseRotateY = (currentX - 0.5) * 24;
      const intensity = isHovering ? 1 : 0.45;
      const rotateX = baseRotateX * intensity;
      const rotateY = baseRotateY * intensity;
      const translateZ = 18 * intensity;

      dashboardCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`;

      requestAnimationFrame(animateTilt);
    };

    animateTilt();

    heroVisual.addEventListener('pointerenter', (event) => {
      if (!(event instanceof PointerEvent)) return;
      if (event.pointerType === 'touch') return;
      isHovering = true;
      dashboardCard.classList.add('is-tilting');
      updateTargetFromEvent(event);
    });

    heroVisual.addEventListener('pointermove', (event) => {
      updateTargetFromEvent(event);
    });

    const handlePointerLeave = () => {
      isHovering = false;
      dashboardCard.classList.remove('is-tilting');
    };

    heroVisual.addEventListener('pointerleave', handlePointerLeave);
    heroVisual.addEventListener('pointercancel', handlePointerLeave);

    document.addEventListener('pointermove', (event) => {
      if (isHovering) return;
      updateTargetFromEvent(event);
    });

    window.addEventListener('blur', () => {
      isHovering = false;
      dashboardCard.classList.remove('is-tilting');
      targetX = 0.5;
      targetY = 0.5;
    });
  }

  // Minimal log for diagnostics
  console.log('Aerix landing initialized');
});

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menuToggle');
  const mobileSidebar = document.getElementById('mobileSidebar');
  const closeSidebar = document.getElementById('closeSidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  // Safety check: ensure all elements exist
  if (!menuToggle || !mobileSidebar || !closeSidebar || !sidebarOverlay) {
    return;
  }

  function toggleSidebar() {
    mobileSidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('open');
    document.body.classList.toggle('sidebar-open');
  }

  function closeSidebarOnEscape(e) {
    if (e.key === 'Escape' && mobileSidebar.classList.contains('open')) {
      toggleSidebar();
    }
  }

  menuToggle.addEventListener('click', toggleSidebar);
  closeSidebar.addEventListener('click', toggleSidebar);
  sidebarOverlay.addEventListener('click', toggleSidebar);
  document.addEventListener('keydown', closeSidebarOnEscape);

  // Close sidebar when clicking on a link
  const sidebarLinks = mobileSidebar.querySelectorAll('a');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', toggleSidebar);
  });
});
