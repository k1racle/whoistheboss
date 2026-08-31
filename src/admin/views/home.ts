import { api, type Settings } from '../api.js';
import { attachFormAutosave, type FormAutosaveController } from '../lib/formAutosave.js';
import { attachSortableList, renderSortableHandle } from '../lib/sortableList.js';
import { layout, escapeHtml, pageAlert, type UserInfo } from './layout.js';

const homeSections = [
  ['hero', 'Херо'],
  ['about', 'О проекте'],
  ['audience', 'Для кого'],
  ['heroes', 'Наши герои'],
  ['places', 'Места'],
  ['stages', 'Этапы'],
  ['latestNews', 'Последние новости'],
  ['cta', 'Стать участником'],
  ['banner', 'Баннер'],
] as const;

type HomeSectionKey = typeof homeSections[number][0];

export function homeView(user?: UserInfo | null) {
  const html = layout('Главная', '<div class="admin-loading">Загрузка редактора…</div>', user);
  async function init() {
    try {
      const settings = await api.settings.get();
      setContent(renderHomeForm(settings));
      attachOrderEditor();
      attachMediaFields();
      const form = document.getElementById('home-form') as HTMLFormElement | null;
      if (!form) return;
      const autosave = attachFormAutosave({
        form,
        save: () => api.settings.update(collectHomeSettings(form)),
      });
      attachSubmit(autosave);
    } catch (error) {
      setContent(pageAlert(error instanceof Error ? error.message : 'Не удалось загрузить настройки главной', 'error'));
    }
  }
  return { html, init };
}

function renderHomeForm(settings: Settings): string {
  const hasLegacyHoverVideo = Boolean(settings.HOME_ABOUT_HOVER_VIDEO_URL || settings.HOME_ABOUT_HOVER_VIDEO_FILE);
  const values: Settings = {
    ...settings,
    HOME_ABOUT_VIDEO_URL: hasLegacyHoverVideo ? settings.HOME_ABOUT_HOVER_VIDEO_URL || '' : settings.HOME_ABOUT_VIDEO_URL || '',
    HOME_ABOUT_VIDEO_FILE: hasLegacyHoverVideo ? settings.HOME_ABOUT_HOVER_VIDEO_FILE || '' : settings.HOME_ABOUT_VIDEO_FILE || '',
  };
  const visibility = parseObject(settings.HOME_SECTION_VISIBILITY);
  const order = parseOrder(settings.HOME_SECTION_ORDER);
  const orderedSections = order.map((key) => homeSections.find(([candidate]) => candidate === key)!);
  const field = (label: string, name: string, help: string, textarea = false, rows = 4) => `
    <label class="editor-field editor-field--wide">
      <span class="editor-field__label">${label}</span>
      ${textarea
        ? `<textarea class="editor-control" name="${name}" rows="${rows}">${escapeHtml(values[name] || '')}</textarea>`
        : `<input class="editor-control" name="${name}" value="${escapeHtml(values[name] || '')}">`}
      <span class="editor-field__help">${help}${textarea ? ' Enter создаёт новую строку и на сайте.' : ''}</span>
    </label>`;

  const media = (label: string, name: string, kind: 'image' | 'video', help: string) => {
    const value = values[name] || '';
    return `
      <div class="editor-field editor-field--wide home-media-field" data-home-media data-media-kind="${kind}">
        <div>
          <span class="editor-field__label">${label}</span>
          <span class="editor-field__help">${help}</span>
        </div>
        <div class="home-media-field__preview" data-home-media-preview>
          ${value
            ? kind === 'image'
              ? `<img src="${escapeHtml(value)}" alt="">`
              : `<video src="${escapeHtml(value)}" muted controls></video>`
            : '<span>Файл не выбран</span>'}
        </div>
        <input type="hidden" name="${name}" value="${escapeHtml(value)}" data-home-media-value>
        <input type="file" accept="${kind === 'image' ? 'image/*' : 'video/*'}" data-home-media-file>
        <input class="editor-control" value="${escapeHtml(value)}" placeholder="/uploads/file или https://…" data-home-media-url>
      </div>`;
  };

  const section = (id: string, number: string, title: string, hint: string, content: string, open = false) => `
    <details id="${id}" class="editor-section" ${open ? 'open' : ''}>
      <summary class="editor-section__summary">
        <span class="editor-section__number">${number}</span>
        <span class="editor-section__heading"><strong>${title}</strong><small>${hint}</small></span>
        <span class="editor-section__chevron">⌄</span>
      </summary>
      <div class="editor-section__content"><div class="editor-grid">${content}</div></div>
    </details>`;

  return `
    <form id="home-form" class="entrepreneur-editor home-editor">
      <div id="form-message" class="entrepreneur-editor__message"></div>
      <div class="entrepreneur-editor__layout">
        <aside class="entrepreneur-editor__nav">
          <p class="entrepreneur-editor__nav-title">Блоки главной</p>
          <a href="#home-order">00. Порядок и видимость</a>
          <a href="#home-hero">01. Херо</a>
          <a href="#home-about">02. О проекте</a>
          <a href="#home-audience">03. Для кого</a>
          <a href="#home-heroes">04. Наши герои</a>
          <a href="#home-places">05. Места</a>
          <a href="#home-stages">06. Этапы</a>
          <a href="#home-latest-news">07. Последние новости</a>
          <a href="#home-cta">08. Заявка</a>
          <a href="#home-banner">09. Баннер</a>
        </aside>
        <div class="entrepreneur-editor__sections">
          ${section('home-order', '00', 'Порядок и видимость', 'Перемещайте блоки стрелками и отключайте ненужные секции.', `
            <div class="editor-field editor-field--wide">
              <input type="hidden" name="HOME_SECTION_ORDER" value="${escapeHtml(JSON.stringify(order))}" data-section-order-value>
              <div class="editor-order-list" data-section-order-list>
                ${orderedSections.map(([key, label]) => `
                  <div class="editor-order-item" data-section-order-item data-section-key="${key}">
                    <label class="editor-switch">
                      <input type="checkbox" name="home_section_${key}" ${visibility[key] !== false ? 'checked' : ''}>
                      <span class="editor-switch__track"></span>
                      <span><strong>${label}</strong><small>Отображать на главной странице</small></span>
                    </label>
                    <div class="editor-order-controls">${renderSortableHandle('Перетащить блок')}</div>
                  </div>`).join('')}
              </div>
            </div>`, true)}

          ${section('home-hero', '01', 'Херо', 'Первый полноэкранный блок главной.', `
            ${field('Заголовок', 'HOME_HERO_TITLE', 'Перенос строки задает деление большого заголовка.', true, 3)}
            ${field('Подпись товарного знака', 'HOME_HERO_TRADEMARK_TEXT', 'Текст под логотипом. Рекомендуется две строки.', true, 2)}
          `)}

          ${section('home-about', '02', 'О проекте', 'Текст, обложка-картинка и видео.', `
            ${field('Заголовок', 'HOME_ABOUT_TITLE', 'Заголовок слева от видео.', true, 3)}
            ${field('Основной текст', 'HOME_ABOUT_TEXT', 'Описание проекта слева.', true, 7)}
            ${field('Нижний текст', 'HOME_ABOUT_BOTTOM_TEXT', 'Строка под основной частью блока.', true, 4)}
            ${media('Обложка', 'HOME_ABOUT_COVER_IMAGE', 'image', 'Картинка показывается до наведения или запуска видео.')}
            ${field('Ссылка на видео', 'HOME_ABOUT_VIDEO_URL', 'Используйте для VK Video или другого embed-источника.')}
            ${media('Видео-файл', 'HOME_ABOUT_VIDEO_FILE', 'video', 'Загруженный файл имеет приоритет над ссылкой.')}
          `)}

          ${section('home-audience', '03', 'Для кого', 'Заголовок секции и управление карточками аудитории.', `
            ${field('Заголовок', 'HOME_AUDIENCE_TITLE', 'Большой заголовок блока.', true, 3)}
            <div class="editor-field editor-field--wide home-related-editor">
              <strong>Карточки аудитории</strong>
              <p>Названия, тексты при наведении, публикация и порядок карточек редактируются отдельно.</p>
              <a href="/admin/audience-cards" class="editor-button editor-button--primary" data-link>Открыть карточки</a>
            </div>
          `)}

          ${section('home-heroes', '04', 'Наши герои', 'Заголовок и вводный текст над карточками предпринимателей.', `
            ${field('Заголовок', 'HOME_HEROES_TITLE', 'Большой заголовок блока.', true, 3)}
            ${field('Описание', 'HOME_HEROES_TEXT', 'Текст справа от заголовка.', true, 6)}
          `)}

          ${section('home-places', '05', 'Места', 'Карточки последнего опубликованного бизнеса в дизайне раздела «Наши герои».', `
            ${field('Заголовок', 'HOME_PLACES_TITLE', 'Большой заголовок блока бизнеса.', true, 3)}
            ${field('Описание', 'HOME_PLACES_TEXT', 'Текст справа от заголовка.', true, 6)}
            <div class="editor-field editor-field--wide home-related-editor">
              <strong>Карточки бизнеса</strong>
              <p>В блок автоматически попадает последний опубликованный бизнес. Содержимое карточек редактируется в разделе «Бизнес».</p>
              <a href="/admin/businesses" class="editor-button editor-button--primary" data-link>Открыть бизнес</a>
            </div>
          `)}

          ${section('home-stages', '06', 'Этапы', 'Карточки процесса и заголовок блока.', `
            <div class="editor-field editor-field--wide home-related-editor">
              <strong>Редактор этапов</strong>
              <p>Заголовок, содержимое, количество и порядок карточек настраиваются в отдельной вкладке.</p>
              <a href="/admin/stages" class="editor-button editor-button--primary" data-link>Открыть этапы</a>
            </div>
          `)}

          ${section('home-latest-news', '07', 'Последние новости', 'Блок использует дизайн последних новостей со страницы журнала.', `
            ${field('Заголовок', 'HOME_LATEST_NEWS_TITLE', 'Заголовок слева над списком новостей.', true, 3)}
            ${field('Описание', 'HOME_LATEST_NEWS_DESCRIPTION', 'Вводный текст справа от заголовка.', true, 4)}
            <label class="editor-field editor-field--wide">
              <span class="editor-field__label">Количество новостей</span>
              <input class="editor-control" type="number" min="1" max="20" step="1" name="HOME_LATEST_NEWS_COUNT" value="${escapeHtml(settings.HOME_LATEST_NEWS_COUNT || '6')}">
              <span class="editor-field__help">На главной выводятся последние опубликованные записи. Допустимо от 1 до 20 карточек.</span>
            </label>
          `)}

          ${section('home-cta', '08', 'Стать участником', 'Заголовки и пояснение формы заявки.', `
            ${field('Заголовок блока', 'HOME_CTA_TITLE', 'Белый заголовок на красном фоне.', true, 3)}
            ${field('Заголовок формы', 'HOME_CTA_FORM_TITLE', 'Красный заголовок внутри формы.', true, 3)}
            ${field('Описание формы', 'HOME_CTA_FORM_DESCRIPTION', 'Короткое пояснение под заголовком формы.', true, 3)}
          `)}

          ${section('home-banner', '09', 'Баннер', 'Изображение заключительного промоблока.', `
            <div class="editor-field editor-field--wide home-related-editor">
              <strong>Редактор баннера</strong>
              <p>Изображение баннера используется на нескольких страницах и настраивается отдельно.</p>
              <a href="/admin/banner" class="editor-button editor-button--primary" data-link>Открыть баннер</a>
            </div>
          `)}
        </div>
      </div>
      <div class="entrepreneur-editor__actions">
        <span>Изменения применятся после сохранения</span>
        <button type="submit" class="editor-button editor-button--primary">Сохранить главную</button>
      </div>
    </form>`;
}

function attachOrderEditor() {
  const list = document.querySelector<HTMLElement>('[data-section-order-list]');
  const value = document.querySelector<HTMLInputElement>('[data-section-order-value]');
  if (!list || !value) return;
  attachSortableList({
    list,
    itemSelector: '[data-section-order-item]',
    onChange: () => {
      const items = Array.from(list.querySelectorAll<HTMLElement>('[data-section-order-item]'));
      value.value = JSON.stringify(items.map((item) => item.dataset.sectionKey || ''));
    },
  });
}

function attachMediaFields() {
  document.querySelectorAll<HTMLElement>('[data-home-media]').forEach((field) => {
    const kind = field.dataset.mediaKind;
    const fileInput = field.querySelector<HTMLInputElement>('[data-home-media-file]');
    const hidden = field.querySelector<HTMLInputElement>('[data-home-media-value]');
    const url = field.querySelector<HTMLInputElement>('[data-home-media-url]');
    const preview = field.querySelector<HTMLElement>('[data-home-media-preview]');
    const render = (src: string) => {
      if (!preview) return;
      preview.innerHTML = src ? kind === 'image' ? `<img src="${escapeHtml(src)}" alt="">` : `<video src="${escapeHtml(src)}" muted controls></video>` : '<span>Файл не выбран</span>';
    };
    url?.addEventListener('input', () => {
      if (hidden) hidden.value = url.value.trim();
      render(url.value.trim());
    });
    fileInput?.addEventListener('change', async () => {
      const file = fileInput.files?.[0];
      if (!file || !hidden) return;
      try {
        const uploaded = kind === 'image' ? await api.uploadImage(file) : await api.uploadVideo(file);
        hidden.value = uploaded.url;
        if (url) url.value = uploaded.url;
        render(uploaded.url);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Ошибка загрузки файла');
      }
    });
  });
}

function attachSubmit(autosave: FormAutosaveController) {
  const form = document.getElementById('home-form') as HTMLFormElement | null;
  if (!form) return;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = document.getElementById('form-message');
    try {
      await autosave.saveNow();
      if (message) message.innerHTML = pageAlert('Главная страница сохранена');
    } catch (error) {
      if (message) message.innerHTML = pageAlert(error instanceof Error ? error.message : 'Ошибка сохранения', 'error');
    }
  });
}

function collectHomeSettings(form: HTMLFormElement): Settings {
  const fd = new FormData(form);
  const data: Settings = {};
  fd.forEach((value, key) => {
    if (!key.startsWith('home_section_')) data[key] = String(value);
  });
  data.HOME_SECTION_VISIBILITY = JSON.stringify(Object.fromEntries(homeSections.map(([key]) => [key, fd.has(`home_section_${key}`)])));
  data.HOME_ABOUT_VIDEO_TYPE = data.HOME_ABOUT_VIDEO_FILE ? 'SELF_HOSTED' : 'EMBED';
  data.HOME_ABOUT_HOVER_VIDEO_TYPE = 'EMBED';
  data.HOME_ABOUT_HOVER_VIDEO_URL = '';
  data.HOME_ABOUT_HOVER_VIDEO_FILE = '';
  return data;
}

function parseObject(value?: string): Record<string, boolean> {
  try {
    const parsed = JSON.parse(value || '{}');
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function parseOrder(value?: string): HomeSectionKey[] {
  const defaults = homeSections.map(([key]) => key) as HomeSectionKey[];
  try {
    const parsed = JSON.parse(value || '[]');
    if (!Array.isArray(parsed)) return defaults;
    const valid = parsed
      .map(String)
      .filter((key, index, values): key is HomeSectionKey => defaults.includes(key as HomeSectionKey) && values.indexOf(key) === index);
    return [...valid, ...defaults.filter((key) => !valid.includes(key))];
  } catch {
    return defaults;
  }
}

function setContent(html: string) {
  const content = document.getElementById('page-content');
  if (content) content.innerHTML = html;
}
