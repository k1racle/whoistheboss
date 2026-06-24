import { api, type Article, type Entrepreneur } from '../api.js';
import { layout, formatDate, escapeHtml, pageAlert, type UserInfo } from './layout.js';
import { initQuill, getHtml, setHtml } from '../lib/editor.js';

export function articlesView(user?: UserInfo | null) {
  const html = layout('Статьи', renderLoading(), user);

  async function init() {
    try {
      const items = await api.articles.list();
      const rows = items.map((item) => renderRow(item)).join('');
      setContent(`
        <div class="mb-4 flex justify-end">
          <a href="/admin/articles/new" class="inline-flex items-center px-4 py-2 bg-terracotta text-white text-sm font-medium rounded-sm hover:bg-terracotta-600" data-link>Добавить</a>
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

  function renderRow(item: Article): string {
    return `
      <tr data-id="${item.id}">
        <td class="px-4 py-3 text-sm font-medium text-gray-900">${escapeHtml(item.title)}</td>
        <td class="px-4 py-3 text-sm text-gray-600">${escapeHtml(item.entrepreneur?.name || '—')}</td>
        <td class="px-4 py-3 text-sm">${statusBadge(item.isPublished)}</td>
        <td class="px-4 py-3 text-sm text-gray-500">${formatDate(item.createdAt)}</td>
        <td class="px-4 py-3 text-sm text-right space-x-2">
          <a href="/admin/articles/${item.id}/edit" class="text-terracotta hover:underline" data-link>Изменить</a>
          <button class="text-red-600 hover:underline delete-btn" data-id="${item.id}">Удалить</button>
        </td>
      </tr>
    `;
  }

  function attachActions(items: Article[]) {
    document.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const id = (e.currentTarget as HTMLButtonElement).dataset.id;
        const item = items.find((i) => i.id === id);
        if (!id || !item) return;
        if (!confirm(`Удалить «${item.title}»?`)) return;
        try {
          await api.articles.delete(id);
          init();
        } catch (err) {
          alert(err instanceof Error ? err.message : 'Ошибка удаления');
        }
      });
    });
  }

  return { html, init };
}

export function articleFormView(id: string | null, user?: UserInfo | null) {
  const isEdit = id !== null;
  const html = layout(isEdit ? 'Редактировать статью' : 'Новая статья', renderForm({}, []), user);

  async function init() {
    try {
      const entrepreneurs = await api.entrepreneurs.list();
      setContent(renderForm({}, entrepreneurs));
      initQuill('content');
      if (isEdit && id) {
        const item = await api.articles.get(id);
        fillForm(item);
      }
      attachSubmit(id);
    } catch (err) {
      setContent(pageAlert(err instanceof Error ? err.message : 'Ошибка загрузки', 'error'));
    }
  }

  return { html, init };
}

function renderForm(item: Partial<Article>, entrepreneurs: Entrepreneur[]): string {
  return `
    <form id="article-form" class="bg-white border border-gray-200 rounded-sm p-6 max-w-3xl">
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
          <label class="block text-sm font-medium text-gray-700 mb-1">Подзаголовок</label>
          <input type="text" name="subtitle" value="${escapeHtml(item.subtitle || '')}" class="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-terracotta">
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
          <label class="block text-sm font-medium text-gray-700 mb-1">Содержание <span class="text-red-500">*</span></label>
          <input type="hidden" name="content" value="${escapeHtml(item.content || '')}">
          <div id="editor-content" class="bg-white">${item.content || ''}</div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Дата публикации</label>
          <input type="datetime-local" name="publishedAt" value="${formatDateTimeLocal(item.publishedAt)}" class="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-terracotta">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">SEO title</label>
          <input type="text" name="metaTitle" value="${escapeHtml(item.metaTitle || '')}" class="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-terracotta">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">SEO description</label>
          <input type="text" name="metaDesc" value="${escapeHtml(item.metaDesc || '')}" class="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-terracotta">
        </div>
        <div class="flex items-center gap-2">
          <input type="checkbox" name="isPublished" id="isPublished" ${item.isPublished ? 'checked' : ''} class="h-4 w-4 text-terracotta border-gray-300 rounded">
          <label for="isPublished" class="text-sm text-gray-700">Опубликовано</label>
        </div>
        <div class="pt-4 flex gap-3">
          <button type="submit" class="px-4 py-2 bg-terracotta text-white text-sm font-medium rounded-sm hover:bg-terracotta-600">Сохранить</button>
          <a href="/admin/articles" class="px-4 py-2 border border-gray-300 text-sm font-medium rounded-sm hover:bg-gray-50" data-link>Отмена</a>
        </div>
      </div>
    </form>
  `;
}

function fillForm(item: Article) {
  const form = document.getElementById('article-form') as HTMLFormElement | null;
  if (!form) return;
  form.querySelector<HTMLInputElement>('input[name="title"]')!.value = item.title;
  form.querySelector<HTMLInputElement>('input[name="slug"]')!.value = item.slug;
  form.querySelector<HTMLInputElement>('input[name="subtitle"]')!.value = item.subtitle || '';
  form.querySelector<HTMLSelectElement>('select[name="entrepreneurId"]')!.value = item.entrepreneurId || '';
  form.querySelector<HTMLInputElement>('input[name="coverImage"]')!.value = item.coverImage || '';
  setHtml('content', item.content);
  form.querySelector<HTMLInputElement>('input[name="publishedAt"]')!.value = formatDateTimeLocal(item.publishedAt);
  form.querySelector<HTMLInputElement>('input[name="metaTitle"]')!.value = item.metaTitle || '';
  form.querySelector<HTMLInputElement>('input[name="metaDesc"]')!.value = item.metaDesc || '';
  form.querySelector<HTMLInputElement>('input[name="isPublished"]')!.checked = item.isPublished;
}

function attachSubmit(id: string | null) {
  const form = document.getElementById('article-form') as HTMLFormElement | null;
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById('form-message');
    if (msg) msg.innerHTML = '';

    try {
      const contentHtml = getHtml('content');
      if (!contentHtml || contentHtml === '<p><br></p>') {
        if (msg) msg.innerHTML = pageAlert('Введите содержание статьи', 'error');
        return;
      }
      const data = await collectFormData(form, contentHtml);
      if (id) {
        await api.articles.update(id, data);
      } else {
        await api.articles.create(data);
      }
      location.href = '/admin/articles';
    } catch (err) {
      if (msg) {
        msg.innerHTML = pageAlert(err instanceof Error ? err.message : 'Ошибка сохранения', 'error');
      }
    }
  });
}

async function collectFormData(form: HTMLFormElement, contentHtml: string): Promise<Partial<Article>> {
  const fd = new FormData(form);
  const coverFile = fd.get('coverImageFile') as File | null;
  let coverImage = (fd.get('coverImage') as string) || null;
  if (coverFile && coverFile.size > 0) {
    const uploaded = await api.uploadImage(coverFile);
    coverImage = uploaded.url;
  }

  return {
    title: fd.get('title') as string,
    slug: fd.get('slug') as string,
    subtitle: (fd.get('subtitle') as string) || null,
    entrepreneurId: (fd.get('entrepreneurId') as string) || null,
    coverImage,
    content: contentHtml,
    isPublished: fd.has('isPublished'),
    publishedAt: (fd.get('publishedAt') as string) || null,
    metaTitle: (fd.get('metaTitle') as string) || null,
    metaDesc: (fd.get('metaDesc') as string) || null,
  };
}

function formatDateTimeLocal(value?: string | null | Date): string {
  if (!value) return '';
  const d = typeof value === 'string' ? new Date(value) : value;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
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
