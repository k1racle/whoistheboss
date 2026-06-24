export interface UserInfo {
  role: string;
  name?: string;
  email?: string;
}

export function layout(title: string, content: string, user?: UserInfo | null): string {
  const isAdmin = user?.role === 'ADMIN';
  return `
    <div class="min-h-screen flex">
      <aside class="w-64 bg-white border-r border-gray-200 p-6 flex-shrink-0">
        <h2 class="text-lg font-bold mb-1">Кто здесь главный?</h2>
        <p class="text-xs text-gray-500 mb-8">Админ-панель</p>
        <nav class="space-y-1" id="admin-nav">
          <a href="/admin" class="nav-link block px-4 py-2 rounded-sm hover:bg-gray-50 text-sm font-medium" data-link>Главная</a>
          <a href="/admin/interviews" class="nav-link block px-4 py-2 rounded-sm hover:bg-gray-50 text-sm font-medium" data-link>Интервью</a>
          <a href="/admin/reels" class="nav-link block px-4 py-2 rounded-sm hover:bg-gray-50 text-sm font-medium" data-link>Рилсы</a>
          <a href="/admin/articles" class="nav-link block px-4 py-2 rounded-sm hover:bg-gray-50 text-sm font-medium" data-link>Статьи</a>
          <a href="/admin/entrepreneurs" class="nav-link block px-4 py-2 rounded-sm hover:bg-gray-50 text-sm font-medium" data-link>Бизнесмены</a>
          <a href="/admin/businesses" class="nav-link block px-4 py-2 rounded-sm hover:bg-gray-50 text-sm font-medium" data-link>Бизнесы</a>
          <a href="/admin/comments" class="nav-link block px-4 py-2 rounded-sm hover:bg-gray-50 text-sm font-medium" data-link>Комментарии</a>
          <a href="/admin/shooting-requests" class="nav-link block px-4 py-2 rounded-sm hover:bg-gray-50 text-sm font-medium" data-link>Заявки</a>
          <a href="/admin/subscribers" class="nav-link block px-4 py-2 rounded-sm hover:bg-gray-50 text-sm font-medium" data-link>Подписчики</a>
          ${isAdmin ? `<a href="/admin/users" class="nav-link block px-4 py-2 rounded-sm hover:bg-gray-50 text-sm font-medium" data-link>Пользователи</a>` : ''}
          <a href="/admin/settings" class="nav-link block px-4 py-2 rounded-sm hover:bg-gray-50 text-sm font-medium" data-link>Настройки</a>
        </nav>
      </aside>
      <main class="flex-1 p-8 overflow-auto">
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-2xl font-bold">${title}</h1>
          <div class="flex items-center gap-4">
            ${user ? `<span class="text-sm text-gray-600">${user.name || user.email}</span>` : ''}
            <button id="logout-btn" class="text-sm text-gray-600 hover:text-terracotta">Выйти</button>
          </div>
        </div>
        <div id="page-content">
          ${content}
        </div>
      </main>
    </div>
  `;
}

export function formatDate(iso?: string | null | Date): string {
  if (!iso) return '—';
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  return d.toLocaleDateString('ru-RU', {
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
  const color = type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200';
  return `<div class="${color} border px-4 py-3 rounded-sm mb-4" id="page-alert">${escapeHtml(message)}</div>`;
}
