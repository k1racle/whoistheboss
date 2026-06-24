import './styles/admin.css';
import { router, type RouteResult } from './router.js';
import { api } from './api.js';
import type { UserInfo } from './views/layout.js';

let currentUser: UserInfo | null = null;

async function init() {
  const path = location.pathname;
  const isLoginPage = path === '/admin/login' || path === '/admin/';

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

  const result = await router.resolve(path, currentUser);
  app.innerHTML = result.html;
  attachGlobalListeners();
  if (result.init) {
    await result.init();
  }
}

function attachGlobalListeners() {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        await api.logout();
      } finally {
        location.href = '/admin/login';
      }
    });
  }
}

function setupNavigation() {
  document.body.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a[data-link]') as HTMLAnchorElement | null;
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('/admin')) return;
    if (link.hasAttribute('download')) return;
    e.preventDefault();
    if (href !== location.pathname) {
      history.pushState(null, '', href);
      render(href);
    }
  });

  window.addEventListener('popstate', () => {
    render(location.pathname);
  });
}

init();
