import { api } from '../api.js';
import { layout, formatDate, escapeHtml, type UserInfo } from './layout.js';

export async function dashboardView(user?: UserInfo | null) {
  const loadingHtml = layout('Дашборд', renderLoading(), user);

  async function init() {
    const counts = await Promise.all([
      api.entrepreneurs.list().then((r) => r.length).catch(() => 0),
      api.interviews.list().then((r) => r.length).catch(() => 0),
      api.reels.list().then((r) => r.length).catch(() => 0),
      api.articles.list().then((r) => r.length).catch(() => 0),
      api.comments.list().then((r) => r.filter((c) => !c.isApproved).length).catch(() => 0),
      api.shootingRequests.list().then((r) => r.filter((x) => x.status === 'NEW').length).catch(() => 0),
      api.subscribers.list().then((r) => r.length).catch(() => 0),
    ]);

    const content = `
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        ${statCard('Бизнесмены', counts[0], '/admin/entrepreneurs')}
        ${statCard('Интервью', counts[1], '/admin/interviews')}
        ${statCard('Рилсы', counts[2], '/admin/reels')}
        ${statCard('Статьи', counts[3], '/admin/articles')}
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        ${statCard('Комментариев на модерации', counts[4], '/admin/comments')}
        ${statCard('Новых заявок', counts[5], '/admin/shooting-requests')}
        ${statCard('Подписчиков', counts[6], '/admin/subscribers')}
      </div>
      <div class="bg-white border border-gray-200 rounded-sm p-6">
        <h2 class="text-lg font-semibold mb-4">Быстрые действия</h2>
        <div class="flex flex-wrap gap-3">
          <a href="/admin/interviews/new" class="inline-flex items-center px-4 py-2 bg-terracotta text-white text-sm font-medium rounded-sm hover:bg-terracotta-600" data-link>Добавить интервью</a>
          <a href="/admin/reels/new" class="inline-flex items-center px-4 py-2 bg-terracotta text-white text-sm font-medium rounded-sm hover:bg-terracotta-600" data-link>Добавить рилс</a>
          <a href="/admin/articles/new" class="inline-flex items-center px-4 py-2 bg-terracotta text-white text-sm font-medium rounded-sm hover:bg-terracotta-600" data-link>Добавить статью</a>
          <a href="/admin/entrepreneurs/new" class="inline-flex items-center px-4 py-2 bg-terracotta text-white text-sm font-medium rounded-sm hover:bg-terracotta-600" data-link>Добавить бизнесмена</a>
        </div>
      </div>
    `;

    const pageContent = document.getElementById('page-content');
    if (pageContent) {
      pageContent.innerHTML = content;
    }
  }

  return { html: loadingHtml, init };
}

function statCard(label: string, value: number, href: string): string {
  return `
    <a href="${href}" class="block bg-white border border-gray-200 rounded-sm p-6 hover:shadow-sm transition-shadow" data-link>
      <p class="text-sm text-gray-500 mb-1">${escapeHtml(label)}</p>
      <p class="text-3xl font-bold">${value}</p>
    </a>
  `;
}

function renderLoading(): string {
  return `<div class="text-gray-500">Загрузка статистики…</div>`;
}
