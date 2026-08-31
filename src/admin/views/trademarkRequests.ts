import { api, type TrademarkRequest } from '../api.js';
import { escapeHtml, formatDate, layout, pageAlert, type UserInfo } from './layout.js';

const labels: Record<string, string> = {
  projectName: 'Проект', projectDescription: 'Описание проекта', useDescription: 'Способ использования', territory: 'Территория', term: 'Срок', channels: 'Каналы', objectUrl: 'Адрес объекта', discoveredAt: 'Обнаружено', description: 'Описание', inn: 'ИНН', ogrn: 'ОГРН', position: 'Должность', projectWebsite: 'Сайт проекта', useStarted: 'Использование начато', launchDate: 'Дата запуска',
};

function statusSelect(item: TrademarkRequest): string {
  const statuses: Array<[TrademarkRequest['status'], string]> = [['NEW', 'Новая'], ['IN_PROGRESS', 'В работе'], ['COMPLETED', 'Завершена'], ['ARCHIVED', 'Архив']];
  return `<select class="status-select text-sm border border-gray-300 rounded-sm px-2 py-1" data-id="${item.id}">${statuses.map(([value, label]) => `<option value="${value}" ${item.status === value ? 'selected' : ''}>${label}</option>`).join('')}</select>`;
}

function details(item: TrademarkRequest): string {
  const rows = Object.entries(item.details || {})
    .filter(([key]) => !key.endsWith('Confirmed') && key !== 'websiteUrl')
    .map(([key, value]) => `<div><strong>${escapeHtml(labels[key] || key)}:</strong> ${escapeHtml(String(value || '—'))}</div>`).join('');
  const files = (item.attachments || []).map((file) => `<a class="text-[#DB2A00] hover:underline" href="${escapeHtml(file.url)}" target="_blank" rel="noopener">${escapeHtml(file.name)}</a>`).join('<br>');
  return `<details class="max-w-xl"><summary class="cursor-pointer text-[#DB2A00]">Открыть сведения</summary><div class="mt-3 grid gap-2 whitespace-pre-wrap text-sm">${rows}${files ? `<div><strong>Файлы:</strong><br>${files}</div>` : ''}</div></details>`;
}

function row(item: TrademarkRequest): string {
  return `<tr><td class="px-4 py-3 text-sm"><strong>${escapeHtml(item.requestNumber)}</strong><br><span class="text-gray-500">${item.type === 'LICENSE' ? 'Лицензия' : 'Нарушение'}</span></td><td class="px-4 py-3 text-sm"><strong>${escapeHtml(item.applicantName)}</strong><br>${escapeHtml(item.organization || '')}</td><td class="px-4 py-3 text-sm">${escapeHtml(item.contactName || '—')}<br>${escapeHtml(item.email || '')}<br>${escapeHtml(item.phone || '')}</td><td class="px-4 py-3">${details(item)}</td><td class="px-4 py-3">${statusSelect(item)}</td><td class="px-4 py-3 text-sm text-gray-500">${formatDate(item.createdAt)}</td><td class="px-4 py-3 text-right"><button class="delete-btn text-[#DB2A00] hover:underline" data-id="${item.id}">Удалить</button></td></tr>`;
}

export function trademarkRequestsView(user?: UserInfo | null) {
  const html = layout('Товарный знак — обращения', '<div class="text-gray-500">Загрузка…</div>', user);
  async function init() {
    const root = document.getElementById('page-content');
    if (!root) return;
    try {
      const items = await api.trademarkRequests.list();
      root.innerHTML = `<div class="bg-white border border-gray-200 rounded-sm overflow-x-auto"><table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-50"><tr>${['Номер / тип', 'Заявитель', 'Контакты', 'Сведения', 'Статус', 'Дата', 'Действия'].map((label) => `<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">${label}</th>`).join('')}</tr></thead><tbody class="divide-y divide-gray-200">${items.map(row).join('') || '<tr><td colspan="7" class="px-4 py-8 text-center text-gray-500">Обращений пока нет</td></tr>'}</tbody></table></div>`;
      root.querySelectorAll<HTMLSelectElement>('.status-select').forEach((select) => select.addEventListener('change', async () => {
        await api.trademarkRequests.updateStatus(select.dataset.id || '', select.value as TrademarkRequest['status']);
      }));
      root.querySelectorAll<HTMLButtonElement>('.delete-btn').forEach((button) => button.addEventListener('click', async () => {
        const item = items.find((entry) => entry.id === button.dataset.id);
        if (!item || !confirm(`Удалить обращение ${item.requestNumber}?`)) return;
        await api.trademarkRequests.delete(item.id);
        await init();
      }));
    } catch (error) {
      root.innerHTML = pageAlert(error instanceof Error ? error.message : 'Не удалось загрузить обращения.', 'error');
    }
  }
  return { html, init };
}
