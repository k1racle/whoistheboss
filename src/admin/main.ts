import './styles/admin.css';
import { router } from './router.js';
import { api } from './api.js';
import { confirmFormNavigation, deactivateFormAutosave } from './lib/formAutosave.js';
import type { UserInfo } from './views/layout.js';

let currentUser: UserInfo | null = null;
let renderedPath = location.pathname;

async function init() {
  const path = location.pathname;
  const isLoginPage = path === '/admin/login';

  if (!isLoginPage) {
    try {
      const user = await api.getMe();
      currentUser = { role: user.role, name: user.name, email: user.email };
    } catch {
      location.href = '/admin/login';
      return;
    }
  }

  render(path);
  setupNavigation();
}

async function render(path: string) {
  const app = document.getElementById('app');
  if (!app) return;

  deactivateFormAutosave();
  const result = await router.resolve(path, currentUser);
  app.innerHTML = result.html;
  renderedPath = path;
  attachGlobalListeners();
  if (result.init) {
    await result.init();
  }
}

function attachGlobalListeners() {
  const currentPath = location.pathname.replace(/\/$/, '') || '/admin';
  document.querySelectorAll<HTMLAnchorElement>('.admin-nav__link').forEach((link) => {
    const linkPath = new URL(link.href).pathname.replace(/\/$/, '') || '/admin';
    const isHome = linkPath === '/admin' && currentPath === '/admin';
    link.classList.toggle('is-active', isHome || (linkPath !== '/admin' && currentPath.startsWith(linkPath)));
  });
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      if (!await confirmFormNavigation()) return;
      try {
        await api.logout();
      } finally {
        location.href = '/admin/login';
      }
    });
  }
}

function setupNavigation() {
  document.body.addEventListener('click', async (e) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a[data-link]') as HTMLAnchorElement | null;
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('/admin')) return;
    if (link.hasAttribute('download')) return;
    e.preventDefault();
    if (href !== location.pathname) {
      if (!await confirmFormNavigation()) return;
      history.pushState(null, '', href);
      await render(href);
    }
  });

  window.addEventListener('popstate', async () => {
    const targetPath = location.pathname;
    if (!await confirmFormNavigation()) {
      history.pushState(null, '', renderedPath);
      return;
    }
    await render(targetPath);
  });
}

init();
