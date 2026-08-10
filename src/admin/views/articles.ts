import { api, type Article, type Business, type Entrepreneur } from '../api.js';
import { initQuill, getHtml, setHtml } from '../lib/editor.js';
import { attachFormAutosave } from '../lib/formAutosave.js';
import { bindAutoSlug } from '../lib/slug.js';
import { attachSortableList, renderSortableHandle } from '../lib/sortableList.js';
import { escapeHtml, formatDate, layout, pageAlert, type UserInfo } from './layout.js';

type RelatedSelection = {
  type: 'entrepreneur' | 'business';
  id: string;
};

const articleSectionOptions = [
  ['cover', 'Обложка и заголовок'],
  ['content', 'Основной текст'],
  ['secondary', 'Дополнительный блок'],
  ['related', 'Материалы по теме'],
  ['latest', 'Читать дальше'],
  ['banner', 'Баннер'],
] as const;

export function articlesView(user?: UserInfo | null) {
  const html = layout('Записи блога', renderLoading(), user);

  async function init() {
    try {
      const items = await api.articles.list();
      setContent(`
        <div class="mb-5 flex items-center justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-[#DB2A00]">Контент</p>
            <h1 class="mt-1 text-2xl font-semibold text-gray-950">Записи блога</h1>
          </div>
          <a href="/admin/articles/new" class="admin-primary-button" data-link>Добавить запись</a>
        </div>
        <div class="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Название</th>
                <th class="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Герой</th>
                <th class="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Статус</th>
                <th class="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Дата</th>
                <th class="px-5 py-3 text-right text-xs font-semibold uppercase text-gray-500">Действия</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              ${items.length ? items.map(renderRow).join('') : emptyRow()}
            </tbody>
          </table>
        </div>
        <div class="mt-4">
          <a href="/admin/pages/blog" class="admin-secondary-button" data-link>Настроить страницу блога: порядок, видимость и популярные записи</a>
        </div>
      `);
      attachListActions(items, init);
    } catch (error) {
      setContent(pageAlert(error instanceof Error ? error.message : 'Не удалось загрузить записи', 'error'));
    }
  }

  return { html, init };
}

export function articleFormView(id: string | null, user?: UserInfo | null) {
  const isEdit = Boolean(id);
  const html = layout(isEdit ? 'Редактировать запись' : 'Новая запись', renderLoading(), user);

  async function init() {
    try {
      const [entrepreneurs, businesses, item] = await Promise.all([
        api.entrepreneurs.list(),
        api.businesses.list(),
        id ? api.articles.get(id) : Promise.resolve(null),
      ]);

      setContent(renderForm(item || {}, entrepreneurs, businesses));
      initQuill('content');
      initQuill('secondaryText');
      if (item) fillEditors(item);
      bindAutoSlug('article-form', 'title');
      attachArticleSectionNavigation();
      attachSectionOrderEditor('article-form');
      attachArticleMediaEditor();
      attachSubmit(id);
    } catch (error) {
      setContent(pageAlert(error instanceof Error ? error.message : 'Не удалось открыть форму', 'error'));
    }
  }

  return { html, init };
}

function renderRow(item: Article): string {
  return `
    <tr data-id="${item.id}">
      <td class="px-5 py-4 text-sm font-semibold text-gray-950">${escapeHtml(item.title)}</td>
      <td class="px-5 py-4 text-sm text-gray-600">${escapeHtml(item.entrepreneur?.name || 'Без привязки')}</td>
      <td class="px-5 py-4 text-sm">${statusBadge(item.isPublished)}</td>
      <td class="px-5 py-4 text-sm text-gray-500">${formatDate(item.publishedAt || item.createdAt)}</td>
      <td class="space-x-3 px-5 py-4 text-right text-sm">
        <a href="/admin/articles/${item.id}/edit" class="font-medium text-[#DB2A00] hover:underline" data-link>Изменить</a>
        <button class="delete-btn font-medium text-[#DB2A00] hover:underline" data-id="${item.id}">Удалить</button>
      </td>
    </tr>
  `;
}

function renderForm(
  item: Partial<Article>,
  entrepreneurs: Entrepreneur[],
  businesses: Business[],
): string {
  const selections = parseSelections(item.relatedMaterials);
  const sectionVisibility = parseVisibility(item.sectionVisibility);
  const sectionOrder = parseSectionOrder(item.sectionOrder, articleSectionOptions.map(([key]) => key));
  const orderedSectionOptions = sectionOrder.map((key) => articleSectionOptions.find(([optionKey]) => optionKey === key)!);

  return `
    <form id="article-form" class="entrepreneur-editor article-editor">
      <div id="form-message" class="entrepreneur-editor__message"></div>
      <div class="entrepreneur-editor__layout">
        <aside class="entrepreneur-editor__nav">
          <p class="entrepreneur-editor__nav-title">Разделы записи</p>
          <a href="#article-editor-visibility">00. Видимость и порядок</a>
          <a href="#article-editor-main">01. Основная информация</a>
          <a href="#article-editor-content">02. Обложка и текст</a>
          <a href="#article-editor-secondary">03. Дополнительный блок</a>
          <a href="#article-editor-related">04. Материалы по теме</a>
          <a href="#article-editor-publishing">05. Публикация и SEO</a>
        </aside>

        <div class="entrepreneur-editor__sections">
          ${formSection(
            'article-editor-visibility',
            '00',
            'Видимость и порядок блоков',
            'Настройка публичной страницы записи так же, как у остальных редакторов.',
            `
              <div class="editor-field editor-field--wide home-related-editor">
                <strong>Страница блога</strong>
                <p>Общие секции самой страницы блога, популярные записи и порядок блоков главного списка настраиваются отдельно.</p>
                <a href="/admin/pages/blog" class="editor-button editor-button--primary" data-link>Открыть страницу блога</a>
              </div>
              <div class="editor-field editor-field--wide">
                <input type="hidden" name="sectionOrder" value="${escapeHtml(JSON.stringify(sectionOrder))}" data-section-order-value>
                <div class="editor-visibility-grid editor-order-list" data-section-order-list>
                  ${orderedSectionOptions.map(([key, label]) => `
                    <div class="editor-order-item" data-section-order-item data-section-key="${key}">
                      <label class="editor-switch">
                        <input type="checkbox" name="section_${key}" ${sectionVisibility[key] !== false ? 'checked' : ''}>
                        <span class="editor-switch__track"></span>
                        <span><strong>${label}</strong><small>Показывать блок на публичной странице</small></span>
                      </label>
                      <div class="editor-order-controls">${renderSortableHandle('Перетащить блок')}</div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `,
            true,
          )}

          ${formSection(
            'article-editor-main',
            '01',
            'Основная информация',
            'Название, адрес страницы, рубрика и связь с героем.',
            `
              ${textField('Название статьи', 'title', item.title, true)}
              ${textField('Адрес страницы', 'slug', item.slug, true, 'Создаётся автоматически из названия.')}
              ${textField('Рубрика', 'category', item.category, false, 'Показывается на красной плашке рядом с датой.')}
              <div class="editor-field">
                <label class="editor-field__label" for="entrepreneurId">Автор или герой материала</label>
                <select id="entrepreneurId" name="entrepreneurId" class="editor-control">
                  <option value="">Без привязки</option>
                  ${entrepreneurs.map((entry) => `
                    <option value="${entry.id}" ${item.entrepreneurId === entry.id ? 'selected' : ''}>
                      ${escapeHtml(entry.name)}
                    </option>
                  `).join('')}
                </select>
                <p class="editor-field__help">Имя выводится в метаданных статьи и в карточках последних новостей.</p>
              </div>
              ${textField(
                'Краткое описание',
                'subtitle',
                item.subtitle,
                false,
                'Используется в карточках блога и в SEO, если отдельное описание не задано.',
                'text',
                true,
              )}
            `,
            true,
          )}

          ${formSection(
            'article-editor-content',
            '02',
            'Обложка и основной текст',
            'Обложка показывается в формате 16:9, основной текст идёт сразу под ней.',
            `
              ${imageField('Главное изображение', 'coverImage', item.coverImage, 'Рекомендуемый формат: горизонтальное изображение 16:9.')}
              ${textField(
                'Источник главного изображения',
                'coverImageSource',
                item.coverImageSource,
                false,
                'Введите только текст после «Источник:». Если поле пустое, подпись не выводится.',
                'text',
                true,
              )}
              <div class="editor-field editor-field--wide">
                <label class="editor-field__label">Текст статьи <span class="text-[#DB2A00]">*</span></label>
                <div id="editor-content" class="admin-rich-editor article-editor__rich article-editor__rich--main bg-white">${item.content || ''}</div>
                <p class="editor-field__help">В редактор можно добавлять подзаголовки, ссылки и изображения.</p>
              </div>
            `,
          )}

          ${formSection(
            'article-editor-secondary',
            '03',
            'Дополнительный блок',
            'На странице изображение располагается слева, текст справа.',
            `
              ${imageField('Изображение дополнительного блока', 'secondaryImage', item.secondaryImage, 'Вертикальное или квадратное изображение.')}
              ${textField(
                'Источник дополнительного изображения',
                'secondaryImageSource',
                item.secondaryImageSource,
                false,
                'Введите только текст после «Источник:». Если поле пустое, подпись не выводится.',
                'text',
                true,
              )}
              <div class="editor-field editor-field--wide">
                <label class="editor-field__label">Текст справа</label>
                <div id="editor-secondaryText" class="admin-rich-editor article-editor__rich article-editor__rich--secondary bg-white">${item.secondaryText || ''}</div>
              </div>
            `,
          )}

          ${formSection(
            'article-editor-related',
            '04',
            'Материалы по теме',
            'Выберите до трёх карточек. Можно смешивать героев и компании; порядок сохраняется.',
            `
              ${textField('Заголовок блока', 'relatedTitle', item.relatedTitle || 'МАТЕРИАЛЫ ПО ТЕМЕ', false, '', 'text', true)}
              <div class="article-related-grid">
                ${[0, 1, 2].map((index) => relatedSelect(index, selections[index], entrepreneurs, businesses)).join('')}
              </div>
            `,
          )}

          ${formSection(
            'article-editor-publishing',
            '05',
            'Публикация и SEO',
            'Настройки видимости и данные для поисковых систем.',
            `
              ${textField('Дата публикации', 'publishedAt', formatDateTimeLocal(item.publishedAt), false, '', 'datetime-local')}
              ${textField('SEO title', 'metaTitle', item.metaTitle)}
              ${textField('SEO description', 'metaDesc', item.metaDesc, false, '', 'text', true)}
              <label class="editor-field editor-field--wide flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                <input type="checkbox" name="isPublished" ${item.isPublished ? 'checked' : ''} class="h-4 w-4 accent-[#DB2A00]">
                <span class="text-sm font-medium text-gray-800">Опубликовать запись</span>
              </label>
            `,
          )}
        </div>
      </div>

      <div class="entrepreneur-editor__actions">
        <span class="entrepreneur-editor__save-note">Изменения применяются после сохранения.</span>
        <a href="/admin/articles" class="admin-secondary-button" data-link>Отмена</a>
        <button type="submit" class="admin-primary-button">Сохранить запись</button>
      </div>
    </form>
    <div class="media-library" id="media-library" aria-hidden="true">
      <button type="button" class="media-library__backdrop" data-media-close aria-label="Закрыть"></button>
      <div class="media-library__dialog" role="dialog" aria-modal="true" aria-labelledby="media-library-title">
        <div class="media-library__header">
          <div>
            <h2 id="media-library-title">Библиотека изображений</h2>
            <p>Выберите ранее загруженное изображение</p>
          </div>
          <button type="button" class="media-library__close" data-media-close aria-label="Закрыть">×</button>
        </div>
        <div class="media-library__grid" data-media-library-grid></div>
      </div>
    </div>
  `;
}

function formSection(
  id: string,
  number: string,
  title: string,
  description: string,
  content: string,
  open = false,
): string {
  return `
    <details id="${id}" class="editor-section" ${open ? 'open' : ''}>
      <summary class="editor-section__summary">
        <span class="editor-section__number">${number}</span>
        <span class="editor-section__heading">
          <strong>${title}</strong>
          <small>${description}</small>
        </span>
        <span class="editor-section__chevron" aria-hidden="true">⌄</span>
      </summary>
      <div class="editor-section__content">
        <div class="editor-grid">${content}</div>
      </div>
    </details>
  `;
}

function textField(
  label: string,
  name: string,
  value?: string | null,
  required = false,
  help = '',
  type = 'text',
  wide = false,
): string {
  return `
    <div class="editor-field${wide ? ' editor-field--wide' : ''}">
      <label class="editor-field__label" for="${name}">${label}${required ? ' <span class="text-[#DB2A00]">*</span>' : ''}</label>
      <input id="${name}" type="${type}" name="${name}" value="${escapeHtml(value || '')}" ${required ? 'required' : ''} class="editor-control">
      ${help ? `<p class="editor-field__help">${help}</p>` : ''}
    </div>
  `;
}

function imageField(
  label: string,
  name: 'coverImage' | 'secondaryImage',
  value?: string | null,
  help = '',
): string {
  const modifier = name === 'coverImage'
    ? 'article-media-field--cover'
    : 'article-media-field--secondary';
  return `
    <div class="editor-field editor-field--wide media-field article-media-field ${modifier}" data-media-field>
      <div class="media-field__heading">
        <div>
          <span class="editor-field__label">${label}</span>
          ${help ? `<p class="editor-field__help">${help}</p>` : ''}
        </div>
        <span class="media-field__status" data-media-status>${value ? 'Изображение выбрано' : 'Не выбрано'}</span>
      </div>
      <div class="media-field__body">
        <div class="media-field__preview" data-media-preview>
          ${value
            ? `<img src="${escapeHtml(value)}" alt=""><span>Текущее изображение</span>`
            : '<div class="media-field__empty"><strong>Нет изображения</strong><span>Загрузите новое или выберите из библиотеки</span></div>'}
        </div>
        <div class="media-field__controls">
          <input type="hidden" name="${name}" value="${escapeHtml(value || '')}" data-media-url>
          <input type="file" name="${name}File" accept="image/*" class="sr-only" data-media-file>
          <button type="button" class="editor-button editor-button--primary" data-media-upload>Загрузить фото</button>
          <button type="button" class="editor-button" data-media-library>Выбрать загруженное</button>
          <button type="button" class="editor-button editor-button--danger" data-media-clear>Убрать</button>
          <details class="media-field__url">
            <summary>Указать URL вручную</summary>
            <input type="text" value="${escapeHtml(value || '')}" placeholder="/uploads/photo.jpg или https://…" class="editor-control" data-media-url-proxy>
          </details>
        </div>
      </div>
    </div>
  `;
}

function relatedSelect(
  index: number,
  selected: RelatedSelection | undefined,
  entrepreneurs: Entrepreneur[],
  businesses: Business[],
): string {
  const value = selected ? `${selected.type}:${selected.id}` : '';
  return `
    <div class="editor-field">
      <label class="editor-field__label" for="related-${index}">Карточка ${index + 1}</label>
      <select id="related-${index}" name="relatedMaterial" class="editor-control">
        <option value="">Не выбрана</option>
        <optgroup label="Предприниматели">
          ${entrepreneurs.map((entry) => `
            <option value="entrepreneur:${entry.id}" ${value === `entrepreneur:${entry.id}` ? 'selected' : ''}>
              ${escapeHtml(entry.name)}
            </option>
          `).join('')}
        </optgroup>
        <optgroup label="Компании">
          ${businesses.map((entry) => `
            <option value="business:${entry.id}" ${value === `business:${entry.id}` ? 'selected' : ''}>
              ${escapeHtml(entry.name)}
            </option>
          `).join('')}
        </optgroup>
      </select>
    </div>
  `;
}

function fillEditors(item: Article) {
  setHtml('content', item.content || '');
  setHtml('secondaryText', item.secondaryText || '');
}

function attachArticleSectionNavigation() {
  document.querySelectorAll<HTMLAnchorElement>('.article-editor .entrepreneur-editor__nav a').forEach((link) => {
    link.addEventListener('click', () => {
      const section = document.querySelector<HTMLDetailsElement>(link.hash);
      if (section) section.open = true;
    });
  });
}

function attachSectionOrderEditor(formId: string) {
  const form = document.getElementById(formId) as HTMLFormElement | null;
  const list = form?.querySelector<HTMLElement>('[data-section-order-list]');
  const value = form?.querySelector<HTMLInputElement>('[data-section-order-value]');
  if (!list || !value) return;

  attachSortableList({
    list,
    itemSelector: '[data-section-order-item]',
    onChange: () => {
    value.value = JSON.stringify(Array.from(list.querySelectorAll<HTMLElement>('[data-section-order-item]')).map((item) => item.dataset.sectionKey || ''));
    },
  });
}

function attachArticleMediaEditor() {
  const modal = document.getElementById('media-library');
  const libraryGrid = modal?.querySelector<HTMLElement>('[data-media-library-grid]');
  let selectMedia: ((url: string) => void) | null = null;
  let mediaPromise: ReturnType<typeof api.media.list> | null = null;

  const renderPreview = (field: HTMLElement, url: string, localUrl?: string) => {
    const preview = field.querySelector<HTMLElement>('[data-media-preview]');
    const status = field.querySelector<HTMLElement>('[data-media-status]');
    const proxy = field.querySelector<HTMLInputElement>('[data-media-url-proxy]');
    if (!preview) return;
    const displayUrl = localUrl || url;
    preview.innerHTML = displayUrl
      ? `<img src="${escapeHtml(displayUrl)}" alt=""><span>${localUrl ? 'Новое изображение' : 'Текущее изображение'}</span>`
      : '<div class="media-field__empty"><strong>Нет изображения</strong><span>Загрузите новое или выберите из библиотеки</span></div>';
    if (status) status.textContent = displayUrl ? 'Изображение выбрано' : 'Не выбрано';
    if (proxy && proxy.value !== url) proxy.value = url;
  };

  const closeLibrary = () => {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('media-library-open');
    selectMedia = null;
  };

  const openLibrary = async (onSelect: (url: string) => void) => {
    if (!modal || !libraryGrid) return;
    selectMedia = onSelect;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('media-library-open');
    libraryGrid.innerHTML = '<p class="media-library__loading">Загружаем изображения…</p>';
    try {
      mediaPromise ||= api.media.list();
      const files = (await mediaPromise).filter((file) => file.type === 'image');
      libraryGrid.innerHTML = files.length
        ? files.map((file) => `
            <button type="button" class="media-library__item" data-library-url="${escapeHtml(file.url)}">
              <img src="${escapeHtml(file.url)}" alt="">
              <span title="${escapeHtml(file.name)}">${escapeHtml(file.name)}</span>
            </button>
          `).join('')
        : '<p class="media-library__loading">Загруженных изображений пока нет.</p>';
    } catch (error) {
      libraryGrid.innerHTML = `<p class="media-library__loading media-library__loading--error">${escapeHtml(error instanceof Error ? error.message : 'Не удалось открыть библиотеку')}</p>`;
    }
  };

  modal?.querySelectorAll<HTMLElement>('[data-media-close]').forEach((button) => {
    button.addEventListener('click', closeLibrary);
  });
  libraryGrid?.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-library-url]');
    if (!button || !selectMedia) return;
    selectMedia(button.dataset.libraryUrl || '');
    closeLibrary();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal?.classList.contains('is-open')) closeLibrary();
  });

  document.querySelectorAll<HTMLElement>('.article-editor [data-media-field]').forEach((field) => {
    const urlInput = field.querySelector<HTMLInputElement>('[data-media-url]');
    const fileInput = field.querySelector<HTMLInputElement>('[data-media-file]');
    const proxy = field.querySelector<HTMLInputElement>('[data-media-url-proxy]');
    if (!urlInput || !fileInput) return;

    renderPreview(field, urlInput.value);
    field.querySelector<HTMLElement>('[data-media-upload]')?.addEventListener('click', () => fileInput.click());
    field.querySelector<HTMLElement>('[data-media-library]')?.addEventListener('click', () => {
      openLibrary((url) => {
        urlInput.value = url;
        fileInput.value = '';
        renderPreview(field, url);
      });
    });
    field.querySelector<HTMLElement>('[data-media-clear]')?.addEventListener('click', () => {
      urlInput.value = '';
      fileInput.value = '';
      renderPreview(field, '');
    });
    fileInput.addEventListener('change', () => {
      const file = fileInput.files?.[0];
      renderPreview(field, urlInput.value, file ? URL.createObjectURL(file) : undefined);
    });
    proxy?.addEventListener('input', () => {
      urlInput.value = proxy.value.trim();
      fileInput.value = '';
      renderPreview(field, urlInput.value);
    });
  });
}

function attachSubmit(id: string | null) {
  const form = document.getElementById('article-form') as HTMLFormElement | null;
  if (!form) return;

  const hasContent = () => {
    const content = getHtml('content');
    return Boolean(content && content !== '<p><br></p>');
  };
  const autosave = attachFormAutosave({
    form,
    available: Boolean(id),
    canAutosave: () => hasContent() && !hasSelectedFiles(form),
    blockedMessage: 'Заполните текст и сохраните выбранные файлы вручную',
    save: async () => {
      const content = getHtml('content');
      if (!content || content === '<p><br></p>') throw new Error('Добавьте основной текст статьи');
      const data = await collectFormData(form, content);
      if (id) await api.articles.update(id, data);
      else await api.articles.create(data);
    },
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = document.getElementById('form-message');
    const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (message) message.innerHTML = '';

    try {
      if (submit) submit.disabled = true;
      await autosave.saveNow();
      location.href = '/admin/articles';
    } catch (error) {
      if (message) {
        message.innerHTML = pageAlert(error instanceof Error ? error.message : 'Не удалось сохранить запись', 'error');
        message.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } finally {
      if (submit) submit.disabled = false;
    }
  });
}

function hasSelectedFiles(form: HTMLFormElement): boolean {
  return Array.from(form.querySelectorAll<HTMLInputElement>('input[type="file"]'))
    .some((input) => Boolean(input.files?.length));
}

async function collectFormData(form: HTMLFormElement, content: string): Promise<Partial<Article>> {
  const formData = new FormData(form);
  const coverImage = await resolveImage(formData, 'coverImage');
  const secondaryImage = await resolveImage(formData, 'secondaryImage');
  const relatedMaterials = formData
    .getAll('relatedMaterial')
    .map(String)
    .filter(Boolean)
    .map((value) => {
      const [type, id] = value.split(':');
      return { type, id };
    })
    .filter((item): item is RelatedSelection =>
      (item.type === 'entrepreneur' || item.type === 'business') && Boolean(item.id),
    );

  return {
    title: String(formData.get('title') || ''),
    slug: String(formData.get('slug') || ''),
    subtitle: nullableString(formData.get('subtitle')),
    category: nullableString(formData.get('category')),
    entrepreneurId: nullableString(formData.get('entrepreneurId')),
    coverImage,
    coverImageSource: nullableString(formData.get('coverImageSource')),
    content,
    secondaryImage,
    secondaryImageSource: nullableString(formData.get('secondaryImageSource')),
    secondaryText: cleanEditorHtml(getHtml('secondaryText')),
    relatedTitle: nullableString(formData.get('relatedTitle')),
    relatedMaterials: JSON.stringify(relatedMaterials),
    sectionVisibility: JSON.stringify(Object.fromEntries(
      articleSectionOptions.map(([key]) => [key, formData.has(`section_${key}`)]),
    )),
    sectionOrder: String(formData.get('sectionOrder') || JSON.stringify(articleSectionOptions.map(([key]) => key))),
    isPublished: formData.has('isPublished'),
    publishedAt: nullableString(formData.get('publishedAt')),
    metaTitle: nullableString(formData.get('metaTitle')),
    metaDesc: nullableString(formData.get('metaDesc')),
  };
}

async function resolveImage(
  formData: FormData,
  name: 'coverImage' | 'secondaryImage',
): Promise<string | null> {
  const file = formData.get(`${name}File`);
  if (file instanceof File && file.size > 0) {
    return (await api.uploadImage(file)).url;
  }
  return nullableString(formData.get(name));
}

function cleanEditorHtml(value: string): string | null {
  return !value || value === '<p><br></p>' ? null : value;
}

function nullableString(value: FormDataEntryValue | null): string | null {
  const normalized = String(value || '').trim();
  return normalized || null;
}

function parseSelections(value?: string | null): RelatedSelection[] {
  try {
    const parsed: unknown = JSON.parse(value || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is RelatedSelection =>
      typeof item === 'object'
      && item !== null
      && ('type' in item)
      && ('id' in item)
      && ((item as RelatedSelection).type === 'entrepreneur' || (item as RelatedSelection).type === 'business')
      && typeof (item as RelatedSelection).id === 'string',
    );
  } catch {
    return [];
  }
}

function parseVisibility(value: string | null | undefined): Record<string, boolean> {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function parseSectionOrder(value: string | null | undefined, defaults: readonly string[]): string[] {
  let saved: string[] = [];
  try {
    const parsed = JSON.parse(value || '[]');
    if (Array.isArray(parsed)) saved = parsed.map(String);
  } catch {
    saved = [];
  }
  return [...saved.filter((key, index) => defaults.includes(key) && saved.indexOf(key) === index), ...defaults.filter((key) => !saved.includes(key))];
}

function attachListActions(items: Article[], reload: () => Promise<void>) {
  document.querySelectorAll<HTMLButtonElement>('.delete-btn').forEach((button) => {
    button.addEventListener('click', async () => {
      const item = items.find((entry) => entry.id === button.dataset.id);
      if (!item || !confirm(`Удалить «${item.title}»?`)) return;
      try {
        await api.articles.delete(item.id);
        await reload();
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Не удалось удалить запись');
      }
    });
  });
}

function formatDateTimeLocal(value?: string | null | Date): string {
  if (!value) return '';
  const date = typeof value === 'string' ? new Date(value) : value;
  const pad = (part: number) => String(part).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function setContent(html: string) {
  const content = document.getElementById('page-content');
  if (content) content.innerHTML = html;
}

function renderLoading(): string {
  return '<div class="text-sm text-gray-500">Загрузка…</div>';
}

function emptyRow(): string {
  return '<tr><td colspan="5" class="px-5 py-10 text-center text-sm text-gray-500">Записей пока нет</td></tr>';
}

function statusBadge(isPublished: boolean): string {
  return isPublished
    ? '<span class="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800">Опубликовано</span>'
    : '<span class="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">Черновик</span>';
}
