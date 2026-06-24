import { api, type ShootingRequest } from '../api.js';
import { layout, formatDate, escapeHtml, pageAlert, type UserInfo } from './layout.js';

export function shootingRequestsView(user?: UserInfo | null) {
  const html = layout('Заявки на съёмку', renderLoading(), user);

  async function init() {
    try {
      const items = await api.shootingRequests.list();
      const rows = items.map((item) => renderRow(item)).join('');
      setContent(`
        <div class="bg-white border border-gray-200 rounded-sm overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Имя</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Контакты</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Компания</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Сообщение</th>
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

function renderRow(item: ShootingRequest): string {
  return `
    <tr data-id="${item.id}">
      <td class="px-4 py-3 text-sm font-medium text-gray-900">${escapeHtml(item.name)}</td>
      <td class="px-4 py-3 text-sm text-gray-600">${escapeHtml(item.email)}<br>${escapeHtml(item.phone || '')}</td>
      <td class="px-4 py-3 text-sm text-gray-600">${escapeHtml(item.company || '—')}</td>
      <td class="px-4 py-3 text-sm text-gray-700 max-w-xs">${escapeHtml(item.message || '—')}</td>
      <td class="px-4 py-3 text-sm">${statusSelect(item)}</td>
      <td class="px-4 py-3 text-sm text-gray-500">${formatDate(item.createdAt)}</td>
      <td class="px-4 py-3 text-sm text-right">
        <button class="text-red-600 hover:underline delete-btn" data-id="${item.id}">Удалить</button>
      </td>
    </tr>
  `;
}

function statusSelect(item: ShootingRequest): string {
  const statuses: { value: ShootingRequest['status']; label: string }[] = [
    { value: 'NEW', label: 'Новая' },
    { value: 'IN_PROGRESS', label: 'В работе' },
    { value: 'COMPLETED', label: 'Завершена' },
    { value: 'ARCHIVED', label: 'Архив' },
  ];
  return `
    <select class="status-select text-sm border border-gray-300 rounded-sm px-2 py-1" data-id="${item.id}">
      ${statuses.map((s) => `<option value="${s.value}" ${item.status === s.value ? 'selected' : ''}>${s.label}</option>`).join('')}
    </select>
  `;
}

function attachActions(items: ShootingRequest[], refresh: () => Promise<void>) {
  document.querySelectorAll('.status-select').forEach((select) => {
    select.addEventListener('change', async (e) => {
      const target = e.currentTarget as HTMLSelectElement;
      const id = target.dataset.id;
      const status = target.value as ShootingRequest['status'];
      if (!id) return;
      try {
        await api.shootingRequests.updateStatus(id, status);
        refresh();
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Ошибка обновления');
      }
    });
  });

  document.querySelectorAll('.delete-btn').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const id = (e.currentTarget as HTMLButtonElement).dataset.id;
      const item = items.find((i) => i.id === id);
      if (!id || !item) return;
      if (!confirm(`Удалить заявку от ${item.name}?`)) return;
      try {
        await api.shootingRequests.delete(id);
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
  return `<tr><td colspan="7" class="px-4 py-8 text-center text-gray-500">Нет заявок</td></tr>`;
}
