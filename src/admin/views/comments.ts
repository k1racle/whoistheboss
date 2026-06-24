import { api, type Comment } from '../api.js';
import { layout, formatDate, escapeHtml, pageAlert, type UserInfo } from './layout.js';

export function commentsView(user?: UserInfo | null) {
  const html = layout('Комментарии', renderLoading(), user);

  async function init() {
    try {
      const items = await api.comments.list();
      const rows = items.map((item) => renderRow(item)).join('');
      setContent(`
        <div class="bg-white border border-gray-200 rounded-sm overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Автор</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Комментарий</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Материал</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дата</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Действия</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">${rows || emptyRow()}</tbody>
          </table>
        </div>
      `);
      attachActions(items, init);
    } catch (err) {
      setContent(pageAlert(err instanceof Error ? err.message : 'Ошибка загрузки', 'error'));
    }
  }

  return { html, init };
}

function renderRow(item: Comment): string {
  const entity = item.interview || item.article || item.reel || item.entrepreneur;
  let entityLabel = '—';
  if (entity) {
    const title = 'title' in entity ? entity.title : entity.name;
    const typeLabel = item.interview ? 'Интервью' : item.article ? 'Статья' : item.reel ? 'Рилс' : 'Бизнесмен';
    entityLabel = `${escapeHtml(typeLabel)}: ${escapeHtml(title)}`;
  }
  return `
    <tr data-id="${item.id}">
      <td class="px-4 py-3 text-sm text-gray-900">${escapeHtml(item.user.name)}<br><span class="text-xs text-gray-500">${escapeHtml(item.user.email)}</span></td>
      <td class="px-4 py-3 text-sm text-gray-700 max-w-md">${escapeHtml(item.content)}</td>
      <td class="px-4 py-3 text-sm text-gray-600">${entityLabel}</td>
      <td class="px-4 py-3 text-sm">${statusBadge(item.isApproved)}</td>
      <td class="px-4 py-3 text-sm text-gray-500">${formatDate(item.createdAt)}</td>
      <td class="px-4 py-3 text-sm text-right space-x-2">
        ${!item.isApproved ? `<button class="text-green-600 hover:underline approve-btn" data-id="${item.id}">Одобрить</button>` : `<button class="text-gray-600 hover:underline reject-btn" data-id="${item.id}">Скрыть</button>`}
        <button class="text-red-600 hover:underline delete-btn" data-id="${item.id}">Удалить</button>
      </td>
    </tr>
  `;
}

function attachActions(items: Comment[], refresh: () => Promise<void>) {
  document.querySelectorAll('.approve-btn').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const id = (e.currentTarget as HTMLButtonElement).dataset.id;
      if (!id) return;
      try {
        await api.comments.approve(id, true);
        refresh();
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Ошибка');
      }
    });
  });

  document.querySelectorAll('.reject-btn').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const id = (e.currentTarget as HTMLButtonElement).dataset.id;
      if (!id) return;
      try {
        await api.comments.approve(id, false);
        refresh();
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Ошибка');
      }
    });
  });

  document.querySelectorAll('.delete-btn').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const id = (e.currentTarget as HTMLButtonElement).dataset.id;
      const item = items.find((i) => i.id === id);
      if (!id || !item) return;
      if (!confirm('Удалить комментарий?')) return;
      try {
        await api.comments.delete(id);
        refresh();
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Ошибка удаления');
      }
    });
  });
}

function setContent(html: string) {
  const pageContent = document.getElementById('page-content');
  if (pageContent) pageContent.innerHTML = html;
}

function renderLoading(): string {
  return `<div class="text-gray-500">Загрузка…</div>`;
}

function emptyRow(): string {
  return `<tr><td colspan="6" class="px-4 py-8 text-center text-gray-500">Нет комментариев</td></tr>`;
}

function statusBadge(isApproved: boolean): string {
  return isApproved
    ? `<span class="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Одобрен</span>`
    : `<span class="inline-flex px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">На модерации</span>`;
}
