import { api, type Entrepreneur } from '../api.js';
import { layout, formatDate, escapeHtml, pageAlert, type UserInfo } from './layout.js';
import { initQuill, getHtml, setHtml } from '../lib/editor.js';

export function entrepreneursView(user?: UserInfo | null) {
  const html = layout('Бизнесмены', renderLoading(), user);

  async function init() {
    try {
      const items = await api.entrepreneurs.list();
      const rows = items.map((item) => renderRow(item)).join('');
      setContent(`
        <div class="mb-4 flex justify-end">
          <a href="/admin/entrepreneurs/new" class="inline-flex items-center px-4 py-2 bg-terracotta text-white text-sm font-medium rounded-sm hover:bg-terracotta-600" data-link>Добавить</a>
        </div>
        <div class="bg-white border border-gray-200 rounded-sm overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Имя</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Должность</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дата</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Действия</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">${rows || emptyRow()}</tbody>
          </table>
        </div>
      `);
      attachActions(items);
    } catch (err) {
      setContent(pageAlert(err instanceof Error ? err.message : 'Ошибка загрузки', 'error'));
    }
  }

  function renderRow(item: Entrepreneur): string {
    return `
      <tr data-id="${item.id}">
        <td class="px-4 py-3 text-sm font-medium text-gray-900">
          ${item.photo ? `<img src="${escapeHtml(item.photo)}" class="w-8 h-8 rounded-full object-cover inline-block mr-2 align-middle" alt="">` : ''}
          ${escapeHtml(item.name)}
        </td>
        <td class="px-4 py-3 text-sm text-gray-600">${escapeHtml(item.title)}</td>
        <td class="px-4 py-3 text-sm">${statusBadge(item.isPublished)}</td>
        <td class="px-4 py-3 text-sm text-gray-500">${formatDate(item.createdAt)}</td>
        <td class="px-4 py-3 text-sm text-right space-x-2">
          <a href="/admin/entrepreneurs/${item.id}/edit" class="text-terracotta hover:underline" data-link>Изменить</a>
          <button class="text-red-600 hover:underline delete-btn" data-id="${item.id}">Удалить</button>
        </td>
      </tr>
    `;
  }

  function attachActions(items: Entrepreneur[]) {
    document.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const id = (e.currentTarget as HTMLButtonElement).dataset.id;
        const item = items.find((i) => i.id === id);
        if (!id || !item) return;
        if (!confirm(`Удалить «${item.name}»?`)) return;
        try {
          await api.entrepreneurs.delete(id);
          init();
        } catch (err) {
          alert(err instanceof Error ? err.message : 'Ошибка удаления');
        }
      });
    });
  }

  return { html, init };
}

export function entrepreneurFormView(id: string | null, user?: UserInfo | null) {
  const isEdit = id !== null;
  const html = layout(isEdit ? 'Редактировать бизнесмена' : 'Новый бизнесмен', renderForm({}), user);

  async function init() {
    initQuill('bio');
    if (isEdit && id) {
      try {
        const item = await api.entrepreneurs.get(id);
        fillForm(item);
      } catch (err) {
        setContent(pageAlert(err instanceof Error ? err.message : 'Ошибка загрузки', 'error'));
      }
    }
    attachSubmit(id);
  }

  return { html, init };
}

function renderForm(item: Partial<Entrepreneur>): string {
  return `
    <form id="entrepreneur-form" class="bg-white border border-gray-200 rounded-sm p-6 max-w-2xl">
      <div id="form-message"></div>
      <div class="grid grid-cols-1 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Имя <span class="text-red-500">*</span></label>
          <input type="text" name="name" value="${escapeHtml(item.name || '')}" required class="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-terracotta">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Slug <span class="text-red-500">*</span></label>
          <input type="text" name="slug" value="${escapeHtml(item.slug || '')}" required class="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-terracotta">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Должность / заголовок <span class="text-red-500">*</span></label>
          <input type="text" name="title" value="${escapeHtml(item.title || '')}" required class="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-terracotta">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Фото (URL или загрузить)</label>
          <input type="text" name="photo" value="${escapeHtml(item.photo || '')}" class="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-terracotta mb-2">
          <input type="file" name="photoFile" accept="image/*" class="block w-full text-sm text-gray-600">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Биография</label>
          <input type="hidden" name="bio">
          <div id="editor-bio" class="bg-white">${item.bio || ''}</div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Цитата</label>
          <input type="text" name="quote" value="${escapeHtml(item.quote || '')}" class="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-terracotta">
        </div>
        <div class="flex items-center gap-2">
          <input type="checkbox" name="isPublished" id="isPublished" ${item.isPublished ? 'checked' : ''} class="h-4 w-4 text-terracotta border-gray-300 rounded">
          <label for="isPublished" class="text-sm text-gray-700">Опубликовано</label>
        </div>
        <div class="pt-4 flex gap-3">
          <button type="submit" class="px-4 py-2 bg-terracotta text-white text-sm font-medium rounded-sm hover:bg-terracotta-600">Сохранить</button>
          <a href="/admin/entrepreneurs" class="px-4 py-2 border border-gray-300 text-sm font-medium rounded-sm hover:bg-gray-50" data-link>Отмена</a>
        </div>
      </div>
    </form>
  `;
}

function fillForm(item: Entrepreneur) {
  const form = document.getElementById('entrepreneur-form') as HTMLFormElement | null;
  if (!form) return;
  form.querySelector<HTMLInputElement>('input[name="name"]')!.value = item.name;
  form.querySelector<HTMLInputElement>('input[name="slug"]')!.value = item.slug;
  form.querySelector<HTMLInputElement>('input[name="title"]')!.value = item.title;
  form.querySelector<HTMLInputElement>('input[name="photo"]')!.value = item.photo || '';
  setHtml('bio', item.bio || '');
  form.querySelector<HTMLInputElement>('input[name="quote"]')!.value = item.quote || '';
  form.querySelector<HTMLInputElement>('input[name="isPublished"]')!.checked = item.isPublished;
}

function attachSubmit(id: string | null) {
  const form = document.getElementById('entrepreneur-form') as HTMLFormElement | null;
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById('form-message');
    if (msg) msg.innerHTML = '';

    try {
      const bioHtml = getHtml('bio');
      const data = await collectFormData(form, bioHtml);
      if (id) {
        await api.entrepreneurs.update(id, data);
      } else {
        await api.entrepreneurs.create(data);
      }
      location.href = '/admin/entrepreneurs';
    } catch (err) {
      if (msg) {
        msg.innerHTML = pageAlert(err instanceof Error ? err.message : 'Ошибка сохранения', 'error');
      }
    }
  });
}

async function collectFormData(form: HTMLFormElement, bioHtml: string): Promise<Partial<Entrepreneur>> {
  const fd = new FormData(form);
  const photoFile = fd.get('photoFile') as File | null;
  let photo = (fd.get('photo') as string) || null;
  if (photoFile && photoFile.size > 0) {
    const uploaded = await api.uploadImage(photoFile);
    photo = uploaded.url;
  }
  return {
    name: fd.get('name') as string,
    slug: fd.get('slug') as string,
    title: fd.get('title') as string,
    photo,
    bio: bioHtml || null,
    quote: (fd.get('quote') as string) || null,
    isPublished: fd.has('isPublished'),
  };
}

function setContent(html: string) {
  const pageContent = document.getElementById('page-content');
  if (pageContent) pageContent.innerHTML = html;
}

function renderLoading(): string {
  return `<div class="text-gray-500">Загрузка…</div>`;
}

function emptyRow(): string {
  return `<tr><td colspan="5" class="px-4 py-8 text-center text-gray-500">Нет записей</td></tr>`;
}

function statusBadge(isPublished: boolean): string {
  return isPublished
    ? `<span class="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Опубликовано</span>`
    : `<span class="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Черновик</span>`;
}
