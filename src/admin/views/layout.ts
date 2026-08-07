export interface UserInfo {
  role: string;
  name?: string;
  email?: string;
}

export function layout(title: string, content: string, user?: UserInfo | null): string {
  const isAdmin = user?.role === 'ADMIN';
  const navigation = [
    ['/admin', 'Главная'],
    ['/admin/pages/entrepreneurs', 'Страница «Предприниматели»'],
    ['/admin/pages/companies', 'Страница «Компании»'],
    ['/admin/pages/blog', 'Страница «Блог»'],
    ['/admin/pages/shooting-request', 'Страница «Стать героем»'],
    ['/admin/entrepreneurs', 'Предприниматели'],
    ['/admin/businesses', 'Компании'],
    ['/admin/interviews', 'Интервью'],
    ['/admin/articles', 'Записи блога'],
    ['/admin/reels', 'Рилсы'],
    ['/admin/shooting-requests', 'Заявки'],
    ...(isAdmin ? [['/admin/users', 'Пользователи']] : []),
    ['/admin/banner', 'Баннер'],
    ['/admin/audience-cards', 'Карточки «Для кого»'],
    ['/admin/stages', 'Этапы'],
    ['/admin/settings', 'Настройки'],
  ];

  return `
    <div class="admin-shell">
      <aside class="admin-sidebar">
        <a href="/admin" class="admin-brand" data-link>
          <img src="/images/image-29.svg" alt="Кто здесь главный?">
          <span>Админ-панель</span>
        </a>
        <nav class="admin-nav" id="admin-nav">
          ${navigation.map(([href, label]) => `<a href="${href}" class="admin-nav__link" data-link>${label}</a>`).join('')}
        </nav>
        <div class="admin-sidebar__footer">
          <span>${escapeHtml(user?.name || user?.email || '')}</span>
          <button id="logout-btn" type="button">Выйти</button>
        </div>
      </aside>
      <main class="admin-main">
        <header class="admin-topbar">
          <div>
            <span class="admin-topbar__eyebrow">Управление сайтом</span>
            <h1>${title}</h1>
          </div>
          <a href="/" target="_blank" rel="noopener" class="admin-site-link">Открыть сайт ↗</a>
        </header>
        <div id="page-content" class="admin-page-content">${content}</div>
      </main>
    </div>`;
}

export function formatDate(iso?: string | null | Date): string {
  if (!iso) return '—';
  const date = typeof iso === 'string' ? new Date(iso) : iso;
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function pageAlert(message: string, type: 'success' | 'error' = 'success'): string {
  return `<div class="admin-alert admin-alert--${type}" id="page-alert">${escapeHtml(message)}</div>`;
}
