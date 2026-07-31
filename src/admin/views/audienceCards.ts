import { api, type AudienceCard } from '../api.js';
import { layout, formatDate, escapeHtml, pageAlert, type UserInfo } from './layout.js';

export function audienceCardsView(user?: UserInfo | null) {
  const html = layout('Карточки «Для кого»', '<div class="text-gray-500">Загрузка...</div>', user);

  async function init() {
    try {
      const items = await api.audienceCards.list();
      const rows = items.map(renderRow).join('');
      setContent(`
        <div class="mb-4 flex items-start justify-between gap-6">
          <div>
            <p class="font-medium text-gray-900">Общий блок сайта</p>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Это единый набор карточек «Для кого». Изменения применятся на всех страницах, где используется этот блок.</p>
          </div>
          <a href="/admin/audience-cards/new" class="inline-flex items-center px-4 py-2 bg-terracotta text-white text-sm font-medium rounded-sm" data-link>Добавить карточку</a>
        </div>
        <div class="bg-white border border-gray-200 rounded-sm overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Основной текст</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hover-текст</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Порядок</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дата</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Действия</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              ${rows || '<tr><td colspan="6" class="px-4 py-8 text-center text-gray-500">Нет карточек</td></tr>'}
            </tbody>
          </table>
        </div>
      `);

      document.querySelectorAll<HTMLButtonElement>('.audience-delete').forEach((button) => {
        button.addEventListener('click', async () => {
          const item = items.find((candidate) => candidate.id === button.dataset.id);
          if (!item || !confirm(`Удалить «${item.title}»?`)) return;
          await api.audienceCards.delete(item.id);
          init();
        });
      });
    } catch (err) {
      setContent(pageAlert(err instanceof Error ? err.message : 'Ошибка загрузки', 'error'));
    }
  }

  return { html, init };
}

export function audienceCardFormView(id: string | null, user?: UserInfo | null) {
  const isEdit = id !== null;
  const html = layout(isEdit ? 'Редактировать карточку' : 'Новая карточка', renderForm({}), user);

  async function init() {
    if (isEdit && id) {
      try {
        fillForm(await api.audienceCards.get(id));
      } catch (err) {
        setContent(pageAlert(err instanceof Error ? err.message : 'Ошибка загрузки', 'error'));
      }
    }
    attachSubmit(id);
  }

  return { html, init };
}

function renderRow(item: AudienceCard): string {
  return `
    <tr>
      <td class="px-4 py-3 text-sm font-medium text-gray-900">${escapeHtml(item.title)}</td>
      <td class="px-4 py-3 text-sm text-gray-600">${escapeHtml(item.hoverTitle || '—')}</td>
      <td class="px-4 py-3 text-sm text-gray-600">${item.sortOrder}</td>
      <td class="px-4 py-3 text-sm">${item.isPublished ? 'Опубликовано' : 'Черновик'}</td>
      <td class="px-4 py-3 text-sm text-gray-500">${formatDate(item.createdAt)}</td>
      <td class="px-4 py-3 text-sm text-right space-x-2">
        <a href="/admin/audience-cards/${item.id}/edit" class="text-terracotta hover:underline" data-link>Изменить</a>
        <button class="text-[#DB2A00] hover:underline audience-delete" data-id="${item.id}">Удалить</button>
      </td>
    </tr>
  `;
}

function renderForm(item: Partial<AudienceCard>): string {
  return `
    <form id="audience-card-form" class="bg-white border border-gray-200 rounded-sm p-6 max-w-2xl">
      <div id="form-message"></div>
      <div class="grid grid-cols-1 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Текст карточки *</label>
          <input name="title" required value="${escapeHtml(item.title || '')}" class="w-full px-4 py-2 border border-gray-300 rounded-sm">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Дополнительный текст</label>
          <textarea name="description" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-sm">${escapeHtml(item.description || '')}</textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Текст при наведении</label>
          <input name="hoverTitle" value="${escapeHtml(item.hoverTitle || '')}" class="w-full px-4 py-2 border border-gray-300 rounded-sm">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Дополнительный текст при наведении</label>
          <textarea name="hoverDescription" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-sm">${escapeHtml(item.hoverDescription || '')}</textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Порядок показа</label>
          <input type="number" name="sortOrder" value="${item.sortOrder ?? 0}" class="w-full px-4 py-2 border border-gray-300 rounded-sm">
        </div>
        <label class="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" name="isPublished" ${item.isPublished ? 'checked' : ''}>
          Показывать на главной
        </label>
        <div class="pt-4 flex gap-3">
          <button type="submit" class="px-4 py-2 bg-terracotta text-white text-sm font-medium rounded-sm">Сохранить</button>
          <a href="/admin/audience-cards" class="px-4 py-2 border border-gray-300 text-sm" data-link>Отмена</a>
        </div>
      </div>
    </form>
  `;
}

function fillForm(item: AudienceCard) {
  const form = document.getElementById('audience-card-form') as HTMLFormElement | null;
  if (!form) return;
  (form.elements.namedItem('title') as HTMLInputElement).value = item.title;
  (form.elements.namedItem('description') as HTMLTextAreaElement).value = item.description || '';
  (form.elements.namedItem('hoverTitle') as HTMLInputElement).value = item.hoverTitle || '';
  (form.elements.namedItem('hoverDescription') as HTMLTextAreaElement).value = item.hoverDescription || '';
  (form.elements.namedItem('sortOrder') as HTMLInputElement).value = String(item.sortOrder);
  (form.elements.namedItem('isPublished') as HTMLInputElement).checked = item.isPublished;
}

function attachSubmit(id: string | null) {
  const form = document.getElementById('audience-card-form') as HTMLFormElement | null;
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = {
      title: (form.elements.namedItem('title') as HTMLInputElement).value,
      description: (form.elements.namedItem('description') as HTMLTextAreaElement).value || null,
      hoverTitle: (form.elements.namedItem('hoverTitle') as HTMLInputElement).value || null,
      hoverDescription: (form.elements.namedItem('hoverDescription') as HTMLTextAreaElement).value || null,
      sortOrder: Number((form.elements.namedItem('sortOrder') as HTMLInputElement).value || 0),
      isPublished: (form.elements.namedItem('isPublished') as HTMLInputElement).checked,
    };

    try {
      if (id) {
        await api.audienceCards.update(id, data);
      } else {
        await api.audienceCards.create(data);
      }
      location.href = '/admin/audience-cards';
    } catch (err) {
      const message = document.getElementById('form-message');
      if (message) {
        message.innerHTML = pageAlert(err instanceof Error ? err.message : 'Ошибка сохранения', 'error');
      }
    }
  });
}

function setContent(html: string) {
  const pageContent = document.getElementById('page-content');
  if (pageContent) pageContent.innerHTML = html;
}
