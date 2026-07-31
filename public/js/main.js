document.addEventListener('DOMContentLoaded', () => {
  initKonamiEasterEgg();

  // Mobile menu
  const menuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const header = document.querySelector('.site-header');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('hidden');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  function openMobileMenu() {
    if (!mobileMenu || !menuButton) return;
    mobileMenu.classList.remove('hidden');
    requestAnimationFrame(() => {
      mobileMenu.classList.remove('opacity-0');
      mobileMenu.classList.add('opacity-100');
    });
    menuButton.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (header) header.classList.add('menu-open');
  }

  function closeMobileMenu() {
    if (!mobileMenu || !menuButton) return;
    mobileMenu.classList.remove('opacity-100');
    mobileMenu.classList.add('opacity-0');
    setTimeout(() => {
      mobileMenu.classList.add('hidden');
    }, 300);
    menuButton.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (header) header.classList.remove('menu-open');
  }

  // Header scroll behavior
  if (header && header.dataset.transparent === 'true') {
    const updateHeader = () => {
      if (window.scrollY > 40) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  // Scroll-triggered animations
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.08,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll, .reveal-scale').forEach((el) => {
    observer.observe(el);
  });

  // Stagger grid items
  document.querySelectorAll('.stagger-grid').forEach((grid) => {
    grid.querySelectorAll('.stagger-item').forEach((item, index) => {
      item.style.transitionDelay = `${index * 80}ms`;
      observer.observe(item);
    });
  });

  // Likes
  document.querySelectorAll('.engagement-bar').forEach(initEngagement);
});

function initKonamiEasterEgg() {
  const sequence = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a',
  ];
  const memePhrases = [
    'А Я ДУМАЛА СОВА',
    'СТРАШНО, ОЧЕНЬ СТРАШНО',
    'НУ ВЫ ДЕРЖИТЕСЬ',
    'ЭТО ФИАСКО, БРАТАН',
    'ПОЛУЧАЕТСЯ, Я ГЕНИЙ',
    'ВСЕ ИДЕТ ПО ПЛАНУ',
    'А ЧТО С ЛИЦОМ',
    'МЫ НА ДНЕ',
    'НЕ БУДИ ЛИХО',
    'Я УСТАЛ, Я УХОЖУ',
    'РАБОТАЕМ, БРАТЬЯ',
    'ГДЕ ДЕНЬГИ, ЛЕБОВСКИ',
    'ЭТО УСПЕХ',
    'ПОТРАЧЕНО',
    'НУ ТАКОЕ',
    'МЕМ ПОЛУЧИЛСЯ',
    'ГОРШОЧЕК НЕ ВАРИ',
    'ВЫ ВООБЩЕ ВИДЕЛИ',
    'ПАНИКА ОТМЕНЯЕТСЯ',
    'ДЕЛО ПАХНЕТ КРИНЖОМ',
    'ЗДЕСЬ КТО-ТО ПЕРЕИГРАЛ',
    'СИТУАЦИЯ ПОД КОНТРОЛЕМ',
    'МЫСЛЬ МАТЕРИАЛЬНА',
    'УРОН ПО РЕПУТАЦИИ',
    'СЮДА МЫ БОЛЬШЕ НЕ ИДЕМ',
    'НОРМАЛЬНО ЖЕ ОБЩАЛИСЬ',
    'НАЧАЛОСЬ',
    'ВСЕ, ПРИЕХАЛИ',
    'ЭТО БАЗА',
    'МЫ ВЫШЛИ ИЗ ЧАТА',
    'ОНО САМО',
    'ПОКАЖИ МНЕ КОД',
    'НИЧЕГО НЕ ПОНЯТНО, НО ОЧЕНЬ ИНТЕРЕСНО',
    'ЭТО УЖЕ МЕТА',
    'СЕЙЧАС ВСЕ ПОЕДЕТ',
    'КАК ТЕБЕ ТАКОЕ',
    'ГЛАВНОЕ НЕ ПАНИКОВАТЬ',
    'ТУТ НУЖЕН РЕСТАРТ',
    'ПРОСТО НАЖМИ ALT F4',
    'СЛИШКОМ МНОГО ВОПРОСОВ',
  ];
  const headingSelector = 'h1, h2, h3, .hero-title, .for-who-title, .stages-title, .section-title';
  const buttonSelector = [
    'a.red-button',
    'button.red-button',
    '.home-topbar__link',
    '.home-topbar__shooting',
    '.header-cta',
    '.footer-hero-button',
    '.site-banner__button',
    '.shooting-form button',
    '.shooting-form [type="submit"]',
  ].join(', ');
  let buffer = [];
  let isActive = false;
  let buttons = [];
  let rafId = 0;
  const pointer = { x: -9999, y: -9999 };

  const setRandomHeadings = () => {
    const headings = Array.from(document.querySelectorAll(headingSelector));
    headings.forEach((heading, index) => {
      const phrase = memePhrases[Math.floor(Math.random() * memePhrases.length)];
      heading.textContent = headings.length > memePhrases.length
        ? memePhrases[index % memePhrases.length]
        : phrase;
    });
  };

  const bindButtons = () => {
    buttons = Array.from(document.querySelectorAll(buttonSelector)).map((button) => ({
      node: button,
      tx: 0,
      ty: 0,
    }));

    buttons.forEach(({ node }) => {
      node.style.willChange = 'transform';
      node.style.transition = 'transform 0.18s ease-out, background-color 0.25s ease, color 0.25s ease';
    });
  };

  const updateRunawayButtons = () => {
    if (!isActive) {
      rafId = 0;
      return;
    }

    buttons.forEach((item) => {
      const rect = item.node.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = cx - pointer.x;
      const dy = cy - pointer.y;
      const distance = Math.hypot(dx, dy);
      const triggerRadius = 180;
      const maxMove = 120;

      if (distance < triggerRadius) {
        const force = (triggerRadius - distance) / triggerRadius;
        const safeDx = distance < 1 ? (Math.random() - 0.5) * 2 : dx / distance;
        const safeDy = distance < 1 ? (Math.random() - 0.5) * 2 : dy / distance;
        item.tx = safeDx * maxMove * force;
        item.ty = safeDy * maxMove * force;
      } else {
        item.tx *= 0.84;
        item.ty *= 0.84;
        if (Math.abs(item.tx) < 0.5) item.tx = 0;
        if (Math.abs(item.ty) < 0.5) item.ty = 0;
      }

      item.node.style.transform = `translate(${item.tx}px, ${item.ty}px)`;
    });

    rafId = window.requestAnimationFrame(updateRunawayButtons);
  };

  const activate = () => {
    if (isActive) return;
    isActive = true;
    document.documentElement.classList.add('konami-mode');
    setRandomHeadings();
    bindButtons();

    document.addEventListener('mousemove', (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    }, { passive: true });

    if (!rafId) {
      rafId = window.requestAnimationFrame(updateRunawayButtons);
    }
  };

  document.addEventListener('keydown', (event) => {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    buffer.push(key);
    buffer = buffer.slice(-sequence.length);

    const isMatch = sequence.every((value, index) => buffer[index] === value);
    if (isMatch) {
      activate();
    }
  });
}

function initEngagement(bar) {
  const entityType = bar.dataset.entityType;
  const entityId = bar.dataset.entityId;
  if (!entityType || !entityId) return;

  const likeBtn = bar.querySelector('.like-btn');
  const shareToggle = bar.querySelector('.share-toggle');
  const sharePanel = bar.querySelector('.share-panel');

  if (likeBtn) {
    likeBtn.addEventListener('click', async () => {
      try {
        const res = await fetch('/api/likes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ entityType, entityId }),
        });
        if (res.status === 401) {
          window.location.href = '/login';
          return;
        }
        if (!res.ok) throw new Error('Like failed');
        const data = await res.json();
        likeBtn.classList.toggle('is-liked', data.liked);
        const countEl = likeBtn.querySelector('.like-count');
        if (countEl) countEl.textContent = data.count;
      } catch (err) {
        console.error(err);
      }
    });
  }

  if (shareToggle && sharePanel) {
    shareToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = sharePanel.classList.contains('hidden');
      closeAllSharePanels();
      if (isHidden) {
        sharePanel.classList.remove('hidden');
        shareToggle.setAttribute('aria-expanded', 'true');
      } else {
        sharePanel.classList.add('hidden');
        shareToggle.setAttribute('aria-expanded', 'false');
      }
    });

    sharePanel.querySelectorAll('.share-option').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const platform = btn.dataset.platform;
        const url = btn.dataset.url || '';
        const title = btn.dataset.title || document.title;

        if (platform === 'native' && navigator.share) {
          try {
            await navigator.share({ title: decodeURIComponent(title), url: decodeURIComponent(url) });
            await logShare(entityType, entityId, 'native');
          } catch {
            // user cancelled
          }
          return;
        }

        if (platform === 'copy') {
          try {
            await navigator.clipboard.writeText(url);
            btn.textContent = 'Скопировано!';
            setTimeout(() => {
              btn.innerHTML = `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Копировать ссылку`;
            }, 1500);
          } catch {
            // ignore
          }
          await logShare(entityType, entityId, 'copy');
          return;
        }

        if (url) {
          window.open(url, '_blank', 'noopener,noreferrer');
          await logShare(entityType, entityId, platform);
        }
      });
    });
  }
}

function closeAllSharePanels() {
  document.querySelectorAll('.share-panel').forEach((panel) => {
    panel.classList.add('hidden');
  });
  document.querySelectorAll('.share-toggle').forEach((btn) => {
    btn.setAttribute('aria-expanded', 'false');
  });
}

document.addEventListener('click', closeAllSharePanels);

async function logShare(entityType, entityId, platform) {
  try {
    const res = await fetch('/api/shares', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ entityType, entityId, platform }),
    });
    if (!res.ok) return;
    const data = await res.json();
    const bar = document.querySelector(`.engagement-bar[data-entity-type="${entityType}"][data-entity-id="${entityId}"]`);
    if (bar) {
      const countEl = bar.querySelector('.share-count');
      if (countEl) countEl.textContent = data.count;
    }
  } catch (err) {
    console.error(err);
  }
}
