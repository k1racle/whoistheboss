import { api, type Subscriber } from '../api.js';
import { layout, formatDate, escapeHtml, pageAlert, type UserInfo } from './layout.js';

export function subscribersView(user?: UserInfo | null) {
  const html = layout('Подписчики', renderLoading(), user);

  async function init() {
    try {
      const items = await api.subscribers.list();
      const rows = items.map((item) => renderRow(item)).join('');
      setContent(`
        <div class="mb-4 flex justify-between items-center">
          <p class="text-sm text-gray-600">Всего: ${items.length}</p>
          <button id="export-csv" class="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-sm font-medium rounded-sm hover:bg-gray-50">Экспорт CSV</button>
        </div>
        <div class="bg-white border border-gray-200 rounded-sm overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Активен</th>
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

function renderRow(item: Subscriber): string {
  return `
    <tr data-id="${item.id}">
      <td class="px-4 py-3 text-sm font-medium text-gray-900">${escapeHtml(item.email)}</td>
      <td class="px-4 py-3 text-sm">${item.isActive ? 'Да' : 'Нет'}</td>
      <td class="px-4 py-3 text-sm text-gray-500">${formatDate(item.createdAt)}</td>
      <td class="px-4 py-3 text-sm text-right">
        <button class="text-red-600 hover:underline delete-btn" data-id="${item.id}">Удалить</button>
      </td>
    </tr>
  `;
}

function attachActions(items: Subscriber[], refresh: () => Promise<void>) {
  const exportBtn = document.getElementById('export-csv');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      api.subscribers.exportCsv();
    });
  }

  document.querySelectorAll('.delete-btn').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const id = (e.currentTarget as HTMLButtonElement).dataset.id;
      const item = items.find((i) => i.id === id);
      if (!id || !item) return;
      if (!confirm(`Удалить подписчика ${item.email}?`)) return;
      try {
        await api.subscribers.delete(id);
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
  return `<tr><td colspan="4" class="px-4 py-8 text-center text-gray-500">Нет подписчиков</td></tr>`;
}
