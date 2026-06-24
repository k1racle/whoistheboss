import { api, type Business, type Entrepreneur } from '../api.js';
import { layout, formatDate, escapeHtml, pageAlert, type UserInfo } from './layout.js';
import { initQuill, getHtml, setHtml } from '../lib/editor.js';

export function businessesView(user?: UserInfo | null) {
  const html = layout('Бизнесы', renderLoading(), user);

  async function init() {
    try {
      const items = await api.businesses.list();
      const rows = items.map((item) => renderRow(item)).join('');
      setContent(`
        <div class="mb-4 flex justify-end">
          <a href="/admin/businesses/new" class="inline-flex items-center px-4 py-2 bg-terracotta text-white text-sm font-medium rounded-sm hover:bg-terracotta-600" data-link>Добавить</a>
        </div>
        <div class="bg-white border border-gray-200 rounded-sm overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Название</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Тип</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Бизнесмен</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Город</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
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

  function renderRow(item: Business): string {
    return `
      <tr data-id="${item.id}">
        <td class="px-4 py-3 text-sm font-medium text-gray-900">${escapeHtml(item.name)}</td>
        <td class="px-4 py-3 text-sm text-gray-600">${escapeHtml(item.type)}</td>
        <td class="px-4 py-3 text-sm text-gray-600">${escapeHtml(item.entrepreneur?.name || '—')}</td>
        <td class="px-4 py-3 text-sm text-gray-600">${escapeHtml(item.city || '—')}</td>
        <td class="px-4 py-3 text-sm">${statusBadge(item.isPublished)}</td>
        <td class="px-4 py-3 text-sm text-right space-x-2">
          <a href="/admin/businesses/${item.id}/edit" class="text-terracotta hover:underline" data-link>Изменить</a>
          <button class="text-red-600 hover:underline delete-btn" data-id="${item.id}">Удалить</button>
        </td>
      </tr>
    `;
  }

  function attachActions(items: Business[]) {
    document.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const id = (e.currentTarget as HTMLButtonElement).dataset.id;
        const item = items.find((i) => i.id === id);
        if (!id || !item) return;
        if (!confirm(`Удалить «${item.name}»?`)) return;
        try {
          await api.businesses.delete(id);
          init();
        } catch (err) {
          alert(err instanceof Error ? err.message : 'Ошибка удаления');
        }
      });
    });
  }

  return { html, init };
}

export function businessFormView(id: string | null, user?: UserInfo | null) {
  const isEdit = id !== null;
  const html = layout(isEdit ? 'Редактировать бизнес' : 'Новый бизнес', renderForm({}, []), user);

  async function init() {
    try {
      const entrepreneurs = await api.entrepreneurs.list();
      setContent(renderForm({}, entrepreneurs));
      initQuill('description');
      if (isEdit && id) {
        const item = await api.businesses.get(id);
        fillForm(item);
      }
      attachSubmit(id);
    } catch (err) {
      setContent(pageAlert(err instanceof Error ? err.message : 'Ошибка загрузки', 'error'));
    }
  }

  return { html, init };
}

function renderForm(item: Partial<Business>, entrepreneurs: Entrepreneur[]): string {
  return `
    <form id="business-form" class="bg-white border border-gray-200 rounded-sm p-6 max-w-3xl">
      <div id="form-message"></div>
      <div class="grid grid-cols-1 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Название <span class="text-red-500">*</span></label>
          <input type="text" name="name" value="${escapeHtml(item.name || '')}" required class="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-terracotta">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Slug <span class="text-red-500">*</span></label>
          <input type="text" name="slug" value="${escapeHtml(item.slug || '')}" required class="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-terracotta">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Тип <span class="text-red-500">*</span></label>
          <input type="text" name="type" value="${escapeHtml(item.type || '')}" placeholder="ресторан, винодельня, кафе..." required class="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-terracotta">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Бизнесмен <span class="text-red-500">*</span></label>
          <select name="entrepreneurId" required class="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-terracotta">
            <option value="">Выберите</option>
            ${entrepreneurs.map((e) => `<option value="${e.id}">${escapeHtml(e.name)}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Описание</label>
          <input type="hidden" name="description">
          <div id="editor-description" class="bg-white">${item.description || ''}</div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Город</label>
            <input type="text" name="city" value="${escapeHtml(item.city || '')}" class="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-terracotta">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Адрес</label>
            <input type="text" name="address" value="${escapeHtml(item.address || '')}" class="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-terracotta">
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
            <input type="text" name="phone" value="${escapeHtml(item.phone || '')}" class="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-terracotta">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" value="${escapeHtml(item.email || '')}" class="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-terracotta">
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Сайт</label>
          <input type="url" name="website" value="${escapeHtml(item.website || '')}" class="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-terracotta">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Обложка (URL или загрузить)</label>
          <input type="text" name="coverImage" value="${escapeHtml(item.coverImage || '')}" class="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-terracotta mb-2">
          <input type="file" name="coverImageFile" accept="image/*" class="block w-full text-sm text-gray-600">
        </div>
        <div class="flex items-center gap-2">
          <input type="checkbox" name="isPublished" id="isPublished" ${item.isPublished ? 'checked' : ''} class="h-4 w-4 text-terracotta border-gray-300 rounded">
          <label for="isPublished" class="text-sm text-gray-700">Опубликовано</label>
        </div>
        <div class="pt-4 flex gap-3">
          <button type="submit" class="px-4 py-2 bg-terracotta text-white text-sm font-medium rounded-sm hover:bg-terracotta-600">Сохранить</button>
          <a href="/admin/businesses" class="px-4 py-2 border border-gray-300 text-sm font-medium rounded-sm hover:bg-gray-50" data-link>Отмена</a>
        </div>
      </div>
    </form>
  `;
}

function fillForm(item: Business) {
  const form = document.getElementById('business-form') as HTMLFormElement | null;
  if (!form) return;
  form.querySelector<HTMLInputElement>('input[name="name"]')!.value = item.name;
  form.querySelector<HTMLInputElement>('input[name="slug"]')!.value = item.slug;
  form.querySelector<HTMLInputElement>('input[name="type"]')!.value = item.type;
  form.querySelector<HTMLSelectElement>('select[name="entrepreneurId"]')!.value = item.entrepreneurId;
  setHtml('description', item.description || '');
  form.querySelector<HTMLInputElement>('input[name="city"]')!.value = item.city || '';
  form.querySelector<HTMLInputElement>('input[name="address"]')!.value = item.address || '';
  form.querySelector<HTMLInputElement>('input[name="phone"]')!.value = item.phone || '';
  form.querySelector<HTMLInputElement>('input[name="email"]')!.value = item.email || '';
  form.querySelector<HTMLInputElement>('input[name="website"]')!.value = item.website || '';
  form.querySelector<HTMLInputElement>('input[name="coverImage"]')!.value = item.coverImage || '';
  form.querySelector<HTMLInputElement>('input[name="isPublished"]')!.checked = item.isPublished;
}

function attachSubmit(id: string | null) {
  const form = document.getElementById('business-form') as HTMLFormElement | null;
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById('form-message');
    if (msg) msg.innerHTML = '';

    try {
      const descriptionHtml = getHtml('description');
      const data = await collectFormData(form, descriptionHtml);
      if (id) {
        await api.businesses.update(id, data);
      } else {
        await api.businesses.create(data);
      }
      location.href = '/admin/businesses';
    } catch (err) {
      if (msg) {
        msg.innerHTML = pageAlert(err instanceof Error ? err.message : 'Ошибка сохранения', 'error');
      }
    }
  });
}

async function collectFormData(form: HTMLFormElement, descriptionHtml: string): Promise<Partial<Business>> {
  const fd = new FormData(form);
  const coverFile = fd.get('coverImageFile') as File | null;
  let coverImage = (fd.get('coverImage') as string) || null;
  if (coverFile && coverFile.size > 0) {
    const uploaded = await api.uploadImage(coverFile);
    coverImage = uploaded.url;
  }

  return {
    name: fd.get('name') as string,
    slug: fd.get('slug') as string,
    type: fd.get('type') as string,
    entrepreneurId: fd.get('entrepreneurId') as string,
    description: descriptionHtml || null,
    city: (fd.get('city') as string) || null,
    address: (fd.get('address') as string) || null,
    phone: (fd.get('phone') as string) || null,
    email: (fd.get('email') as string) || null,
    website: (fd.get('website') as string) || null,
    coverImage,
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
  return `<tr><td colspan="6" class="px-4 py-8 text-center text-gray-500">Нет записей</td></tr>`;
}

function statusBadge(isPublished: boolean): string {
  return isPublished
    ? `<span class="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Опубликовано</span>`
    : `<span class="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Черновик</span>`;
}
