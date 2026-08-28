import { api, type Settings } from '../api.js';
import { attachFormAutosave, type FormAutosaveController } from '../lib/formAutosave.js';
import { layout, escapeHtml, pageAlert, type UserInfo } from './layout.js';

type BannerFieldName = 'HOME_BANNER_IMAGE' | 'HOME_BANNER_MOBILE_IMAGE';

const bannerPageOptions = [
  ['/', 'Главная'],
  ['/companies', 'Бизнес'],
  ['/companies/SLUG', 'Страница бизнеса'],
  ['/entrepreneurs', 'Предприниматели'],
  ['/entrepreneurs/SLUG', 'Страница предпринимателя'],
  ['/blog', 'Журнал'],
  ['/blog/SLUG', 'Статья журнала'],
  ['/shooting-request', 'Заявка на съёмку'],
  ['/contacts', 'Контакты'],
  ['/reels', 'Рилсы'],
  ['/interviews', 'Интервью'],
  ['/interviews/SLUG', 'Страница интервью'],
] as const;

type BannerPageKey = typeof bannerPageOptions[number][0];

const defaultBannerPages: BannerPageKey[] = [
  '/',
  '/companies',
  '/companies/SLUG',
  '/entrepreneurs',
  '/entrepreneurs/SLUG',
  '/blog/SLUG',
];

const bannerFields: Array<{
  name: BannerFieldName;
  title: string;
  help: string;
  placeholder: string;
}> = [
  {
    name: 'HOME_BANNER_IMAGE',
    title: 'Десктопное изображение баннера',
    help: 'Широкое изображение для десктопа и планшета.',
    placeholder: '/uploads/banner-desktop.jpg или https://…',
  },
  {
    name: 'HOME_BANNER_MOBILE_IMAGE',
    title: 'Мобильное изображение баннера',
    help: 'Отдельное изображение для экранов до 768px.',
    placeholder: '/uploads/banner-mobile.jpg или https://…',
  },
];

export function bannerView(user?: UserInfo | null) {
  const html = layout('Баннер', '<div class="admin-loading">Загрузка редактора…</div>', user);

  async function init() {
    try {
      const settings = await api.settings.get();
      setContent(renderBannerEditor(settings));
      const form = document.getElementById('banner-form') as HTMLFormElement | null;
      if (!form) return;
      const autosave = attachFormAutosave({
        form,
        save: () => api.settings.update(collectBannerSettings(form)),
      });
      attachBannerEditor(autosave);
    } catch (error) {
      setContent(pageAlert(error instanceof Error ? error.message : 'Не удалось загрузить баннер', 'error'));
    }
  }

  return { html, init };
}

function renderBannerEditor(settings: Settings): string {
  const link = settings.HOME_BANNER_LINK || '/entrepreneurs';
  const selectedPages = parseBannerPages(settings.HOME_BANNER_PAGES);

  return `
    <form id="banner-form" class="standalone-editor">
      <div id="form-message"></div>
      <section class="editor-section standalone-editor__section">
        <div class="standalone-editor__header">
          <div>
            <span class="standalone-editor__eyebrow">Общий элемент сайта</span>
            <h2>Заключительный баннер</h2>
            <p>Баннер используется на главной, странице предпринимателей, страницах бизнеса и в журнале. Для мобильной версии можно загрузить отдельное изображение.</p>
          </div>
          <div class="standalone-editor__header-actions">
            <a href="/" target="_blank" rel="noopener" class="editor-button">Посмотреть на сайте ↗</a>
            <button type="submit" class="editor-button editor-button--primary">Сохранить баннер</button>
          </div>
        </div>

        ${bannerFields.map((field) => renderMediaField(field, settings[field.name] || '')).join('')}

        <label class="editor-field">
          <span class="editor-field__label">Ссылка баннера</span>
          <input class="editor-control" name="HOME_BANNER_LINK" value="${escapeHtml(link)}" placeholder="/entrepreneurs или https://…">
          <span class="editor-field__help">Вся площадь баннера будет ссылкой. Значение применяется на всех страницах.</span>
        </label>

        <div class="editor-field editor-field--wide">
          <span class="editor-field__label">Страницы показа</span>
          <span class="editor-field__help">Включите баннер только на тех страницах, где он должен отображаться.</span>
          <div class="editor-visibility-grid">
            ${bannerPageOptions.map(([key, label]) => `
              <label class="editor-switch">
                <input type="checkbox" name="HOME_BANNER_PAGE" value="${key}" ${selectedPages.includes(key) ? 'checked' : ''}>
                <span class="editor-switch__track"></span>
                <span><strong>${label}</strong><small>${key}</small></span>
              </label>`).join('')}
          </div>
        </div>
      </section>
      <div class="standalone-editor__actions">
        <span>Изменения применятся ко всем страницам с этим баннером.</span>
        <button type="submit" class="editor-button editor-button--primary">Сохранить баннер</button>
      </div>
    </form>
    <div class="media-library" id="banner-media-library" aria-hidden="true">
      <button type="button" class="media-library__backdrop" data-library-close aria-label="Закрыть"></button>
      <div class="media-library__dialog" role="dialog" aria-modal="true">
        <div class="media-library__header">
          <div><h2>Библиотека изображений</h2><p>Выберите ранее загруженный файл</p></div>
          <button type="button" class="media-library__close" data-library-close aria-label="Закрыть">×</button>
        </div>
        <div class="media-library__grid" data-library-grid></div>
      </div>
    </div>`;
}

function renderMediaField(
  field: (typeof bannerFields)[number],
  image: string,
): string {
  return `
    <div class="media-field" data-banner-media data-banner-name="${field.name}">
      <div class="media-field__heading">
        <div>
          <span class="editor-field__label">${field.title}</span>
          <p class="editor-field__help">${field.help}</p>
        </div>
        <span class="media-field__status" data-banner-status>${image ? 'Изображение выбрано' : 'Не выбрано'}</span>
      </div>
      <div class="media-field__body">
        <div class="media-field__preview banner-editor__preview" data-banner-preview>
          ${image
            ? `<img src="${escapeHtml(image)}" alt=""><span>Текущее изображение</span>`
            : '<div class="media-field__empty"><strong>Нет изображения</strong><span>Загрузите новое или выберите из библиотеки</span></div>'}
        </div>
        <div class="media-field__controls">
          <input type="hidden" name="${field.name}" value="${escapeHtml(image)}" data-banner-value>
          <input type="file" accept="image/*" class="sr-only" data-banner-file>
          <button type="button" class="editor-button editor-button--primary" data-banner-upload>Загрузить изображение</button>
          <button type="button" class="editor-button" data-banner-library>Выбрать загруженное</button>
          <button type="button" class="editor-button editor-button--danger" data-banner-clear>Убрать</button>
          <details class="media-field__url">
            <summary>Указать URL вручную</summary>
            <input class="editor-control" value="${escapeHtml(image)}" placeholder="${escapeHtml(field.placeholder)}" data-banner-url>
          </details>
        </div>
      </div>
    </div>`;
}

function attachBannerEditor(autosave: FormAutosaveController) {
  const form = document.getElementById('banner-form') as HTMLFormElement | null;
  const modal = document.getElementById('banner-media-library');
  const grid = modal?.querySelector<HTMLElement>('[data-library-grid]');
  if (!form || !modal || !grid) return;

  let activeField: HTMLElement | null = null;

  const renderField = (field: HTMLElement, source: string, caption = 'Текущее изображение') => {
    const value = field.querySelector<HTMLInputElement>('[data-banner-value]');
    const url = field.querySelector<HTMLInputElement>('[data-banner-url]');
    const preview = field.querySelector<HTMLElement>('[data-banner-preview]');
    const status = field.querySelector<HTMLElement>('[data-banner-status]');
    if (!value || !url || !preview) return;

    value.value = source;
    url.value = source;
    preview.innerHTML = source
      ? `<img src="${escapeHtml(source)}" alt=""><span>${caption}</span>`
      : '<div class="media-field__empty"><strong>Нет изображения</strong><span>Загрузите новое или выберите из библиотеки</span></div>';
    if (status) status.textContent = source ? 'Изображение выбрано' : 'Не выбрано';
  };

  const closeLibrary = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('media-library-open');
    activeField = null;
  };

  const openLibrary = async (field: HTMLElement) => {
    activeField = field;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('media-library-open');
    grid.innerHTML = '<p class="media-library__loading">Загружаем изображения…</p>';
    try {
      const files = (await api.media.list()).filter((item) => item.type === 'image');
      grid.innerHTML = files.length
        ? files.map((item) => `
            <button type="button" class="media-library__item" data-library-url="${escapeHtml(item.url)}">
              <img src="${escapeHtml(item.url)}" alt=""><span>${escapeHtml(item.name)}</span>
            </button>`).join('')
        : '<p class="media-library__loading">Загруженных изображений пока нет.</p>';
    } catch (error) {
      grid.innerHTML = `<p class="media-library__loading media-library__loading--error">${escapeHtml(error instanceof Error ? error.message : 'Не удалось открыть библиотеку')}</p>`;
    }
  };

  modal.querySelectorAll<HTMLElement>('[data-library-close]').forEach((button) => {
    button.addEventListener('click', closeLibrary);
  });

  grid.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLElement>('[data-library-url]');
    if (!button || !activeField) return;
    renderField(activeField, button.dataset.libraryUrl || '');
    closeLibrary();
  });

  document.querySelectorAll<HTMLElement>('[data-banner-media]').forEach((field) => {
    const fileInput = field.querySelector<HTMLInputElement>('[data-banner-file]');
    const url = field.querySelector<HTMLInputElement>('[data-banner-url]');
    const uploadButton = field.querySelector<HTMLElement>('[data-banner-upload]');
    const clearButton = field.querySelector<HTMLElement>('[data-banner-clear]');
    const libraryButton = field.querySelector<HTMLElement>('[data-banner-library]');
    if (!fileInput || !url) return;

    uploadButton?.addEventListener('click', () => fileInput.click());
    clearButton?.addEventListener('click', () => {
      fileInput.value = '';
      renderField(field, '');
    });
    url.addEventListener('input', () => renderField(field, url.value.trim()));
    fileInput.addEventListener('change', async () => {
      const selected = fileInput.files?.[0];
      if (!selected) return;
      try {
        const uploaded = await api.uploadImage(selected);
        renderField(field, uploaded.url, 'Новое изображение');
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Не удалось загрузить изображение');
      }
    });
    libraryButton?.addEventListener('click', async () => {
      await openLibrary(field);
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = document.getElementById('form-message');
    try {
      await autosave.saveNow();
      if (message) message.innerHTML = pageAlert('Баннер сохранен');
    } catch (error) {
      if (message) message.innerHTML = pageAlert(error instanceof Error ? error.message : 'Ошибка сохранения', 'error');
    }
  });
}

function collectBannerSettings(form: HTMLFormElement): Settings {
  const link = form.elements.namedItem('HOME_BANNER_LINK') as HTMLInputElement | null;
  const desktop = form.elements.namedItem('HOME_BANNER_IMAGE') as HTMLInputElement | null;
  const mobile = form.elements.namedItem('HOME_BANNER_MOBILE_IMAGE') as HTMLInputElement | null;
  const pages = Array.from(form.querySelectorAll<HTMLInputElement>('input[name="HOME_BANNER_PAGE"]:checked'))
    .map((input) => input.value);
  return {
    HOME_BANNER_IMAGE: desktop?.value.trim() || '',
    HOME_BANNER_MOBILE_IMAGE: mobile?.value.trim() || '',
    HOME_BANNER_LINK: link?.value.trim() || '/entrepreneurs',
    HOME_BANNER_PAGES: JSON.stringify(pages),
  };
}

function parseBannerPages(value: string | null | undefined): BannerPageKey[] {
  if (!value) return defaultBannerPages;

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return defaultBannerPages;
    return bannerPageOptions.map(([key]) => key).filter((key) => parsed.includes(key));
  } catch {
    return defaultBannerPages;
  }
}

function setContent(html: string) {
  const content = document.getElementById('page-content');
  if (content) content.innerHTML = html;
}
