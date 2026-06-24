import { api, type Reel, type Entrepreneur } from '../api.js';
import { layout, formatDate, escapeHtml, pageAlert, type UserInfo } from './layout.js';
import { initQuill, getHtml, setHtml } from '../lib/editor.js';

export function reelsView(user?: UserInfo | null) {
  const html = layout('Рилсы', renderLoading(), user);

  async function init() {
    try {
      const items = await api.reels.list();
      const rows = items.map((item) => renderRow(item)).join('');
      setContent(`
        <div class="mb-4 flex justify-end">
          <a href="/admin/reels/new" class="inline-flex items-center px-4 py-2 bg-terracotta text-white text-sm font-medium rounded-sm hover:bg-terracotta-600" data-link>Добавить</a>
        </div>
        <div class="bg-white border border-gray-200 rounded-sm overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Название</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Бизнесмен</th>
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

  function renderRow(item: Reel): string {
    return `
      <tr data-id="${item.id}">
        <td class="px-4 py-3 text-sm font-medium text-gray-900">${escapeHtml(item.title)}</td>
        <td class="px-4 py-3 text-sm text-gray-600">${escapeHtml(item.entrepreneur?.name || '—')}</td>
        <td class="px-4 py-3 text-sm">${statusBadge(item.isPublished)}</td>
        <td class="px-4 py-3 text-sm text-gray-500">${formatDate(item.createdAt)}</td>
        <td class="px-4 py-3 text-sm text-right space-x-2">
          <a href="/admin/reels/${item.id}/edit" class="text-terracotta hover:underline" data-link>Изменить</a>
          <button class="text-red-600 hover:underline delete-btn" data-id="${item.id}">Удалить</button>
        </td>
      </tr>
    `;
  }

  function attachActions(items: Reel[]) {
    document.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const id = (e.currentTarget as HTMLButtonElement).dataset.id;
        const item = items.find((i) => i.id === id);
        if (!id || !item) return;
        if (!confirm(`Удалить «${item.title}»?`)) return;
        try {
          await api.reels.delete(id);
          init();
        } catch (err) {
          alert(err instanceof Error ? err.message : 'Ошибка удаления');
        }
      });
    });
  }

  return { html, init };
}

export function reelFormView(id: string | null, user?: UserInfo | null) {
  const isEdit = id !== null;
  const html = layout(isEdit ? 'Редактировать рилс' : 'Новый рилс', renderForm({ videoType: 'EMBED' } as Partial<Reel>, []), user);

  async function init() {
    try {
      const entrepreneurs = await api.entrepreneurs.list();
      setContent(renderForm({}, entrepreneurs));
      initQuill('description');
      attachVideoTypeToggle();
      if (isEdit && id) {
        const item = await api.reels.get(id);
        fillForm(item);
        syncVideoFields(item.videoType);
      }
      attachSubmit(id);
    } catch (err) {
      setContent(pageAlert(err instanceof Error ? err.message : 'Ошибка загрузки', 'error'));
    }
  }

  return { html, init };
}

function renderForm(item: Partial<Reel>, entrepreneurs: Entrepreneur[]): string {
  return `
    <form id="reel-form" class="bg-white border border-gray-200 rounded-sm p-6 max-w-3xl">
      <div id="form-message"></div>
      <div class="grid grid-cols-1 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Название <span class="text-red-500">*</span></label>
          <input type="text" name="title" value="${escapeHtml(item.title || '')}" required class="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-terracotta">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Slug <span class="text-red-500">*</span></label>
          <input type="text" name="slug" value="${escapeHtml(item.slug || '')}" required class="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-terracotta">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Бизнесмен</label>
          <select name="entrepreneurId" class="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-terracotta">
            <option value="">Без бизнесмена</option>
            ${entrepreneurs.map((e) => `<option value="${e.id}">${escapeHtml(e.name)}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Обложка (URL или загрузить)</label>
          <input type="text" name="coverImage" value="${escapeHtml(item.coverImage || '')}" class="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-terracotta mb-2">
          <input type="file" name="coverImageFile" accept="image/*" class="block w-full text-sm text-gray-600">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Тип видео</label>
          <div class="flex gap-4">
            <label class="inline-flex items-center gap-2">
              <input type="radio" name="videoType" value="EMBED" ${item.videoType === 'EMBED' ? 'checked' : ''} class="h-4 w-4 text-terracotta border-gray-300">
              <span class="text-sm text-gray-700">Встраиваемое (URL)</span>
            </label>
            <label class="inline-flex items-center gap-2">
              <input type="radio" name="videoType" value="SELF_HOSTED" ${item.videoType === 'SELF_HOSTED' ? 'checked' : ''} class="h-4 w-4 text-terracotta border-gray-300">
              <span class="text-sm text-gray-700">Загруженное</span>
            </label>
          </div>
        </div>
        <div id="videoUrl-field">
          <label class="block text-sm font-medium text-gray-700 mb-1">URL видео</label>
          <input type="text" name="videoUrl" value="${escapeHtml(item.videoUrl || '')}" class="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-terracotta">
        </div>
        <div id="videoFile-field" class="hidden">
          <label class="block text-sm font-medium text-gray-700 mb-1">Файл видео</label>
          <input type="text" name="videoFile" value="${escapeHtml(item.videoFile || '')}" readonly class="w-full px-4 py-2 border border-gray-300 rounded-sm bg-gray-50 mb-2">
          <input type="file" name="videoFileUpload" accept="video/*" class="block w-full text-sm text-gray-600">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Описание</label>
          <input type="hidden" name="description">
          <div id="editor-description" class="bg-white">${item.description || ''}</div>
        </div>
        <div class="flex items-center gap-2">
          <input type="checkbox" name="isPublished" id="isPublished" ${item.isPublished ? 'checked' : ''} class="h-4 w-4 text-terracotta border-gray-300 rounded">
          <label for="isPublished" class="text-sm text-gray-700">Опубликовано</label>
        </div>
        <div class="pt-4 flex gap-3">
          <button type="submit" class="px-4 py-2 bg-terracotta text-white text-sm font-medium rounded-sm hover:bg-terracotta-600">Сохранить</button>
          <a href="/admin/reels" class="px-4 py-2 border border-gray-300 text-sm font-medium rounded-sm hover:bg-gray-50" data-link>Отмена</a>
        </div>
      </div>
    </form>
  `;
}

function attachVideoTypeToggle() {
  const form = document.getElementById('reel-form') as HTMLFormElement | null;
  if (!form) return;
  form.querySelectorAll<HTMLInputElement>('input[name="videoType"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      const type = form.querySelector<HTMLInputElement>('input[name="videoType"]:checked')?.value as 'EMBED' | 'SELF_HOSTED';
      syncVideoFields(type);
    });
  });
}

function syncVideoFields(type: 'EMBED' | 'SELF_HOSTED') {
  const urlField = document.getElementById('videoUrl-field');
  const fileField = document.getElementById('videoFile-field');
  if (!urlField || !fileField) return;
  if (type === 'EMBED') {
    urlField.classList.remove('hidden');
    fileField.classList.add('hidden');
  } else {
    urlField.classList.add('hidden');
    fileField.classList.remove('hidden');
  }
}

function fillForm(item: Reel) {
  const form = document.getElementById('reel-form') as HTMLFormElement | null;
  if (!form) return;
  form.querySelector<HTMLInputElement>('input[name="title"]')!.value = item.title;
  form.querySelector<HTMLInputElement>('input[name="slug"]')!.value = item.slug;
  form.querySelector<HTMLSelectElement>('select[name="entrepreneurId"]')!.value = item.entrepreneurId || '';
  form.querySelector<HTMLInputElement>('input[name="coverImage"]')!.value = item.coverImage || '';
  form.querySelector<HTMLInputElement>(`input[name="videoType"][value="${item.videoType}"]`)!.checked = true;
  form.querySelector<HTMLInputElement>('input[name="videoUrl"]')!.value = item.videoUrl || '';
  form.querySelector<HTMLInputElement>('input[name="videoFile"]')!.value = item.videoFile || '';
  setHtml('description', item.description || '');
  form.querySelector<HTMLInputElement>('input[name="isPublished"]')!.checked = item.isPublished;
}

function attachSubmit(id: string | null) {
  const form = document.getElementById('reel-form') as HTMLFormElement | null;
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById('form-message');
    if (msg) msg.innerHTML = '';

    try {
      const descriptionHtml = getHtml('description');
      const data = await collectFormData(form, descriptionHtml);
      if (id) {
        await api.reels.update(id, data);
      } else {
        await api.reels.create(data);
      }
      location.href = '/admin/reels';
    } catch (err) {
      if (msg) {
        msg.innerHTML = pageAlert(err instanceof Error ? err.message : 'Ошибка сохранения', 'error');
      }
    }
  });
}

async function collectFormData(form: HTMLFormElement, descriptionHtml: string): Promise<Partial<Reel>> {
  const fd = new FormData(form);
  const coverFile = fd.get('coverImageFile') as File | null;
  let coverImage = (fd.get('coverImage') as string) || null;
  if (coverFile && coverFile.size > 0) {
    const uploaded = await api.uploadImage(coverFile);
    coverImage = uploaded.url;
  }

  const videoFileUpload = fd.get('videoFileUpload') as File | null;
  let videoFile = (fd.get('videoFile') as string) || null;
  const videoType = (fd.get('videoType') as 'EMBED' | 'SELF_HOSTED') || 'EMBED';
  if (videoType === 'SELF_HOSTED' && videoFileUpload && videoFileUpload.size > 0) {
    const uploaded = await api.uploadVideo(videoFileUpload);
    videoFile = uploaded.url;
  }

  return {
    title: fd.get('title') as string,
    slug: fd.get('slug') as string,
    entrepreneurId: (fd.get('entrepreneurId') as string) || null,
    coverImage,
    videoType,
    videoUrl: videoType === 'EMBED' ? (fd.get('videoUrl') as string) || null : null,
    videoFile: videoType === 'SELF_HOSTED' ? videoFile : null,
    description: descriptionHtml || null,
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
