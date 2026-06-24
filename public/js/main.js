document.addEventListener('DOMContentLoaded', () => {
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
