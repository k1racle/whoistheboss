import { api, type Article, type Settings } from '../api.js';
import { layout, escapeHtml, pageAlert, type UserInfo } from './layout.js';
import { createShootingPageView } from './shootingPageEditor.js';

type SectionDefinition = readonly [string, string, string];

interface PageEditorConfig {
  title: string;
  formId: string;
  keyPrefix: string;
  saveMessage: string;
  sections: readonly SectionDefinition[];
  fields: readonly {
    section: string;
    label: string;
    name: string;
    help: string;
    textarea?: boolean;
    image?: boolean;
    inputType?: 'text' | 'number';
    min?: number;
    max?: number;
    defaultValue?: string;
  }[];
  articleSelection?: boolean;
}

const entrepreneursConfig: PageEditorConfig = {
  title: 'Страница «Предприниматели»',
  formId: 'entrepreneurs-page-form',
  keyPrefix: 'ENTREPRENEURS_PAGE',
  saveMessage: 'Страница предпринимателей сохранена',
  sections: [
    ['hero', 'Херо', 'Полноэкранный заголовок страницы.'],
    ['audience', 'Наши герои', 'Вводный текст и общие карточки «Для кого».'],
    ['heroes', 'Предприниматели', 'Карточки опубликованных предпринимателей.'],
    ['cta', 'Стать участником', 'Общая форма заявки.'],
    ['banner', 'Баннер', 'Общий заключительный баннер.'],
  ],
  fields: [
    { section: 'hero', label: 'Заголовок', name: 'ENTREPRENEURS_PAGE_HERO_TITLE', help: 'Перенос строки разделяет строки большого заголовка.', textarea: true },
    { section: 'audience', label: 'Заголовок блока', name: 'ENTREPRENEURS_PAGE_AUDIENCE_TITLE', help: 'Заголовок над карточками.' },
    { section: 'audience', label: 'Описание блока', name: 'ENTREPRENEURS_PAGE_AUDIENCE_TEXT', help: 'Вводный текст справа от заголовка.', textarea: true },
    { section: 'heroes', label: 'Заголовок блока', name: 'ENTREPRENEURS_PAGE_HEROES_TITLE', help: 'Заголовок над карточками предпринимателей.' },
    { section: 'heroes', label: 'Описание блока', name: 'ENTREPRENEURS_PAGE_HEROES_TEXT', help: 'Короткое описание раздела.', textarea: true },
  ],
};

const companiesConfig: PageEditorConfig = {
  title: 'Страница «Компании»',
  formId: 'companies-page-form',
  keyPrefix: 'COMPANIES_PAGE',
  saveMessage: 'Страница компаний сохранена',
  sections: [
    ['hero', 'Херо', 'Полноэкранный заголовок страницы.'],
    ['about', 'О проекте', 'Заголовок и описание проекта.'],
    ['catalog', 'Компании', 'Карточки опубликованных компаний.'],
    ['cta', 'Стать участником', 'Общая форма заявки.'],
    ['banner', 'Баннер', 'Общий заключительный баннер.'],
  ],
  fields: [
    { section: 'hero', label: 'Заголовок', name: 'COMPANIES_PAGE_HERO_TITLE', help: 'Перенос строки разделяет строки большого заголовка.', textarea: true },
    { section: 'about', label: 'Заголовок блока', name: 'COMPANIES_PAGE_ABOUT_TITLE', help: 'Заголовок блока о проекте.' },
    { section: 'about', label: 'Описание блока', name: 'COMPANIES_PAGE_ABOUT_TEXT', help: 'Разделяйте абзацы пустой строкой.', textarea: true },
  ],
};

const blogConfig: PageEditorConfig = {
  title: 'Страница «Блог»',
  formId: 'blog-page-form',
  keyPrefix: 'BLOG_PAGE',
  saveMessage: 'Страница блога сохранена',
  articleSelection: true,
  sections: [
    ['hero', 'Херо', 'Полноэкранный заголовок страницы.'],
    ['popular', 'Популярное', 'Шесть выбранных записей блога в заданном порядке.'],
    ['mainNews', 'Главные новости', 'Две крупные новости с фотографиями и зеркальной компоновкой.'],
    ['latestNews', 'Последние новости', 'Автоматический список последних опубликованных записей.'],
    ['related', 'Читайте также', 'Три последних предпринимателя и три последние компании.'],
    ['cta', 'Стать участником', 'Общая форма заявки, используемая на остальных страницах сайта.'],
  ],
  fields: [
    {
      section: 'hero',
      label: 'Заголовок',
      name: 'BLOG_PAGE_HERO_TITLE',
      help: 'Первая строка — «ГЛАВНЫЕ», вторая строка — «НОВОСТИ».',
      textarea: true,
      defaultValue: 'ГЛАВНЫЕ\nНОВОСТИ',
    },
    {
      section: 'popular',
      label: 'Заголовок блока',
      name: 'BLOG_PAGE_POPULAR_TITLE',
      help: 'Заголовок над сеткой из шести записей.',
      defaultValue: 'ПОПУЛЯРНОЕ',
    },
    {
      section: 'mainNews',
      label: 'Заголовок первой карточки',
      name: 'BLOG_PAGE_MAIN_ONE_TITLE',
      help: 'Крупный заголовок слева от первой фотографии.',
      textarea: true,
      defaultValue: 'ЭЛЕНИКА КОРЕЛОВА В НОВОМ ВЫПУСКЕ ПРОЕКТА!',
    },
    {
      section: 'mainNews',
      label: 'Описание первой карточки',
      name: 'BLOG_PAGE_MAIN_ONE_TEXT',
      help: 'Мелкий текст в нижней части первой карточки.',
      textarea: true,
      defaultValue: 'Последние новости, биографии, истории успеха и годовой оборот',
    },
    {
      section: 'mainNews',
      label: 'Фотография первой карточки',
      name: 'BLOG_PAGE_MAIN_ONE_IMAGE',
      help: 'Изображение формата 4:3. Нажатие на фотографию ведёт по указанной ссылке.',
      image: true,
    },
    {
      section: 'mainNews',
      label: 'Ссылка первой карточки',
      name: 'BLOG_PAGE_MAIN_ONE_URL',
      help: 'Полный URL или внутренний путь, например /blog/nazvanie.',
    },
    {
      section: 'mainNews',
      label: 'Заголовок второй карточки',
      name: 'BLOG_PAGE_MAIN_TWO_TITLE',
      help: 'Крупный заголовок справа от второй фотографии.',
      textarea: true,
      defaultValue: 'ЭЛЕНИКА КОРЕЛОВА В НОВОМ ВЫПУСКЕ ПРОЕКТА!',
    },
    {
      section: 'mainNews',
      label: 'Описание второй карточки',
      name: 'BLOG_PAGE_MAIN_TWO_TEXT',
      help: 'Мелкий текст в нижней части второй карточки.',
      textarea: true,
      defaultValue: 'Последние новости, биографии, истории успеха и годовой оборот',
    },
    {
      section: 'mainNews',
      label: 'Фотография второй карточки',
      name: 'BLOG_PAGE_MAIN_TWO_IMAGE',
      help: 'Изображение формата 4:3. Нажатие на фотографию ведёт по указанной ссылке.',
      image: true,
    },
    {
      section: 'mainNews',
      label: 'Ссылка второй карточки',
      name: 'BLOG_PAGE_MAIN_TWO_URL',
      help: 'Полный URL или внутренний путь, например /blog/nazvanie.',
    },
    {
      section: 'latestNews',
      label: 'Заголовок блока',
      name: 'BLOG_PAGE_LATEST_TITLE',
      help: 'Крупный заголовок слева над списком.',
      defaultValue: 'ПОСЛЕДНИЕ НОВОСТИ',
    },
    {
      section: 'latestNews',
      label: 'Описание блока',
      name: 'BLOG_PAGE_LATEST_DESCRIPTION',
      help: 'Текст справа от заголовка. Регистр сохраняется как введён.',
      textarea: true,
      defaultValue: 'Новости проекта, истории предпринимателей и материалы о компаниях.',
    },
    {
      section: 'latestNews',
      label: 'Количество новостей',
      name: 'BLOG_PAGE_LATEST_COUNT',
      help: 'Сколько последних опубликованных записей показать. Допустимое значение: от 1 до 20.',
      inputType: 'number',
      min: 1,
      max: 20,
      defaultValue: '8',
    },
    {
      section: 'related',
      label: 'Заголовок блока',
      name: 'BLOG_PAGE_RELATED_TITLE',
      help: 'Заголовок над карточками предпринимателей и компаний.',
      defaultValue: 'ЧИТАЙТЕ ТАКЖЕ',
    },
  ],
};

export function entrepreneursPageView(user?: UserInfo | null) {
  return pageEditorView(entrepreneursConfig, user);
}

export function companiesPageView(user?: UserInfo | null) {
  return pageEditorView(companiesConfig, user);
}

export function blogPageView(user?: UserInfo | null) {
  return pageEditorView(blogConfig, user);
}

export function shootingPageView(user?: UserInfo | null) {
  return createShootingPageView(user);
}

function legacyShootingPageView(user?: UserInfo | null) {
  const html = layout('Страница «Стать участником»', '<div class="admin-loading">Загрузка редактора…</div>', user);
  async function init() {
    try {
      const settings = await api.settings.get();
      setContent(renderShootingPage(settings));
      attachSimpleSubmit();
    } catch (error) {
      setContent(pageAlert(error instanceof Error ? error.message : 'Не удалось загрузить страницу', 'error'));
    }
  }
  return { html, init };
}

function pageEditorView(config: PageEditorConfig, user?: UserInfo | null) {
  const html = layout(config.title, '<div class="admin-loading">Загрузка редактора…</div>', user);
  async function init() {
    try {
      const [settings, articles] = await Promise.all([
        api.settings.get(),
        config.articleSelection ? api.articles.list() : Promise.resolve([]),
      ]);
      setContent(renderPageEditor(config, settings, articles));
      attachOrderEditor();
      if (config.articleSelection) attachArticleSelection();
      attachPageMediaFields();
      attachPageSubmit(config);
    } catch (error) {
      setContent(pageAlert(error instanceof Error ? error.message : 'Не удалось загрузить редактор', 'error'));
    }
  }
  return { html, init };
}

function renderPageEditor(config: PageEditorConfig, settings: Settings, articles: Article[] = []): string {
  const visibility = parseObject(settings[`${config.keyPrefix}_SECTION_VISIBILITY`]);
  const order = parseOrder(settings[`${config.keyPrefix}_SECTION_ORDER`], config.sections);
  const orderedSections = order.map((key) => config.sections.find(([candidate]) => candidate === key)!);
  const sectionContent = (key: string) => {
    const fields = config.fields.filter((field) => field.section === key);
    if (key === 'cta') {
      return relatedEditor('Общая форма заявки', 'Дизайн и содержимое CTA едины для сайта. Здесь настраиваются позиция и видимость блока.', '/admin/pages/shooting-request', 'Открыть страницу заявки');
    }
    if (key === 'banner') {
      return relatedEditor('Заключительный баннер', 'Изображение и ссылка баннера меняются сразу на всех страницах.', '/admin/banner', 'Открыть баннер');
    }
    if (key === 'audience') {
      return `${fields.map((field) => renderField(field, settings)).join('')}${relatedEditor('Карточки «Для кого»', 'Карточки общие для главной и страницы предпринимателей.', '/admin/audience-cards', 'Открыть карточки')}`;
    }
    if (key === 'popular' && config.articleSelection) {
      return `${fields.map((field) => renderField(field, settings)).join('')}${renderPopularArticleSelection(settings, articles)}`;
    }
    if (key === 'mainNews') {
      return renderMainNewsManualFields(fields, settings);
    }
    if (!fields.length) {
      return '<div class="editor-field editor-field--wide home-related-editor"><strong>Автоматический блок</strong><p>Контент собирается из опубликованных материалов. Здесь настраиваются его позиция и видимость.</p></div>';
    }
    return fields.map((field) => renderField(field, settings)).join('');
  };

  return `
    <form id="${config.formId}" class="entrepreneur-editor home-editor" data-page-editor>
      <div id="form-message" class="entrepreneur-editor__message"></div>
      <div class="entrepreneur-editor__layout">
        <aside class="entrepreneur-editor__nav">
          <p class="entrepreneur-editor__nav-title">Блоки страницы</p>
          <a href="#page-order">00. Порядок и видимость</a>
          ${config.sections.map(([, label], index) => `<a href="#page-section-${index + 1}">${String(index + 1).padStart(2, '0')}. ${label}</a>`).join('')}
        </aside>
        <div class="entrepreneur-editor__sections">
          ${renderSection('page-order', '00', 'Порядок и видимость', 'Перемещайте блоки стрелками и отключайте ненужные секции.', `
            <div class="editor-field editor-field--wide">
              <input type="hidden" name="${config.keyPrefix}_SECTION_ORDER" value="${escapeHtml(JSON.stringify(order))}" data-section-order-value>
              <div class="editor-order-list" data-section-order-list>
                ${orderedSections.map(([key, label]) => `
                  <div class="editor-order-item" data-section-order-item data-section-key="${key}">
                    <label class="editor-switch">
                      <input type="checkbox" name="page_section_${key}" ${visibility[key] !== false ? 'checked' : ''}>
                      <span class="editor-switch__track"></span>
                      <span><strong>${label}</strong><small>Отображать на публичной странице</small></span>
                    </label>
                    <div class="editor-order-controls">
                      <button type="button" class="editor-order-button" data-order-direction="up">↑</button>
                      <button type="button" class="editor-order-button" data-order-direction="down">↓</button>
                    </div>
                  </div>`).join('')}
              </div>
            </div>`, true)}
          ${config.sections.map(([key, label, hint], index) => renderSection(
            `page-section-${index + 1}`,
            String(index + 1).padStart(2, '0'),
            label,
            hint,
            sectionContent(key),
          )).join('')}
        </div>
      </div>
      <div class="entrepreneur-editor__actions">
        <span>Изменения применятся после сохранения</span>
        <button type="submit" class="editor-button editor-button--primary">Сохранить страницу</button>
      </div>
    </form>`;
}

function renderShootingPage(settings: Settings): string {
  return `
    <form id="shooting-page-form" class="entrepreneur-editor home-editor">
      <div id="form-message" class="entrepreneur-editor__message"></div>
      <div class="entrepreneur-editor__sections">
        ${renderSection('shooting-page-main', '01', 'Страница заявки', 'На эту страницу ведёт кнопка «Стать героем» во всех шапках сайта.', `
          ${renderField({ section: 'main', label: 'Заголовок', name: 'SHOOTING_PAGE_TITLE', help: 'Основной заголовок страницы.' }, settings)}
          ${renderField({ section: 'main', label: 'Описание', name: 'SHOOTING_PAGE_DESCRIPTION', help: 'Короткое пояснение над формой.', textarea: true }, settings)}
          <div class="editor-field editor-field--wide home-related-editor">
            <strong>Контент страницы</strong>
            <p>Страница и маршрут уже созданы. Следующие блоки добавим сюда на следующем этапе.</p>
            <a href="/shooting-request" target="_blank" rel="noopener" class="editor-button">Открыть страницу ↗</a>
          </div>
        `, true)}
      </div>
      <div class="entrepreneur-editor__actions">
        <span>Изменения применятся после сохранения</span>
        <button type="submit" class="editor-button editor-button--primary">Сохранить страницу</button>
      </div>
    </form>`;
}

function renderSection(id: string, number: string, title: string, hint: string, content: string, open = false): string {
  return `
    <details id="${id}" class="editor-section" ${open ? 'open' : ''}>
      <summary class="editor-section__summary">
        <span class="editor-section__number">${number}</span>
        <span class="editor-section__heading"><strong>${title}</strong><small>${hint}</small></span>
        <span class="editor-section__chevron">⌄</span>
      </summary>
      <div class="editor-section__content"><div class="editor-grid">${content}</div></div>
    </details>`;
}

function renderField(field: PageEditorConfig['fields'][number], settings: Settings): string {
  const value = settings[field.name] || field.defaultValue || '';
  if (field.image) {
    return `
      <div class="editor-field editor-field--wide home-media-field" data-page-media>
        <div>
          <span class="editor-field__label">${field.label}</span>
          <span class="editor-field__help">${field.help}</span>
        </div>
        <div class="home-media-field__preview" data-page-media-preview>
          ${value ? `<img src="${escapeHtml(value)}" alt="">` : '<span>Файл не выбран</span>'}
        </div>
        <input type="hidden" name="${field.name}" value="${escapeHtml(value)}" data-page-media-value>
        <input type="file" accept="image/*" data-page-media-file>
        <input class="editor-control" value="${escapeHtml(value)}" placeholder="/uploads/file или https://…" data-page-media-url>
      </div>`;
  }
  return `
    <label class="editor-field editor-field--wide">
      <span class="editor-field__label">${field.label}</span>
      ${field.textarea
        ? `<textarea class="editor-control" name="${field.name}" rows="6">${escapeHtml(value)}</textarea>`
        : `<input class="editor-control" type="${field.inputType || 'text'}" name="${field.name}" value="${escapeHtml(value)}"${field.min !== undefined ? ` min="${field.min}"` : ''}${field.max !== undefined ? ` max="${field.max}"` : ''}>`}
      <span class="editor-field__help">${field.help}</span>
    </label>`;
}

function renderPopularArticleSelection(settings: Settings, articles: Article[]): string {
  let selectedIds: string[] = [];
  try {
    const parsed = JSON.parse(settings.BLOG_PAGE_POPULAR_ARTICLE_IDS || '[]');
    if (Array.isArray(parsed)) selectedIds = parsed.map(String).slice(0, 6);
  } catch {}

  const options = (selectedId = '') => articles
    .filter((article) => article.isPublished || article.id === selectedId)
    .map((article) => `
      <option value="${escapeHtml(article.id)}" data-cover="${escapeHtml(article.coverImage || '')}" ${article.id === selectedId ? 'selected' : ''}>
        ${escapeHtml(article.title)}${article.isPublished ? '' : ' — черновик'}
      </option>`)
    .join('');

  return `
    <div class="editor-field editor-field--wide">
      <span class="editor-field__label">Записи и порядок карточек</span>
      <p class="editor-field__help">Выберите до шести опубликованных записей. Пустые позиции автоматически заполнятся самыми свежими публикациями. Третья и четвёртая карточки выводятся красными.</p>
      <div class="blog-popular-editor">
        ${Array.from({ length: 6 }, (_, index) => {
          const selectedId = selectedIds[index] || '';
          const selected = articles.find((article) => article.id === selectedId);
          return `
            <label class="blog-popular-editor__slot">
              <span class="blog-popular-editor__number">${String(index + 1).padStart(2, '0')}</span>
              <span class="blog-popular-editor__preview">
                ${selected?.coverImage
                  ? `<img src="${escapeHtml(selected.coverImage)}" alt="">`
                  : '<span>Без обложки</span>'}
              </span>
              <select class="editor-control" name="blog_popular_article_${index}" data-blog-article-slot data-blog-article-group="popular">
                <option value="">Заполнить свежей автоматически</option>
                ${options(selectedId)}
              </select>
            </label>`;
        }).join('')}
      </div>
      <a href="/admin/articles" class="editor-button editor-button--primary" data-link>Открыть записи блога</a>
    </div>`;
}

function renderMainNewsManualFields(fields: PageEditorConfig['fields'], settings: Settings): string {
  const first = fields.filter((field) => field.name.includes('_ONE_'));
  const second = fields.filter((field) => field.name.includes('_TWO_'));
  return `
    <div class="editor-field editor-field--wide">
      <span class="editor-field__label">Две независимые карточки</span>
      <p class="editor-field__help">Карточки не связаны с записями блога. Для каждой вручную задаются текст, фотография и адрес перехода.</p>
      <div class="blog-main-settings">
        <section class="blog-main-settings__card">
          <h3>01. Первая карточка</h3>
          ${first.map((field) => renderField(field, settings)).join('')}
        </section>
        <section class="blog-main-settings__card">
          <h3>02. Вторая карточка</h3>
          ${second.map((field) => renderField(field, settings)).join('')}
        </section>
      </div>
    </div>`;
}

function relatedEditor(title: string, text: string, href: string, linkLabel: string): string {
  return `
    <div class="editor-field editor-field--wide home-related-editor">
      <strong>${title}</strong>
      <p>${text}</p>
      <a href="${href}" class="editor-button editor-button--primary" data-link>${linkLabel}</a>
    </div>`;
}

function attachArticleSelection() {
  const selects = Array.from(document.querySelectorAll<HTMLSelectElement>('[data-blog-article-slot]'));
  const sync = () => {
    selects.forEach((select) => {
      const group = select.dataset.blogArticleGroup || '';
      const chosen = selects
        .filter((candidate) => (candidate.dataset.blogArticleGroup || '') === group)
        .map((candidate) => candidate.value)
        .filter(Boolean);
      select.querySelectorAll<HTMLOptionElement>('option[value]').forEach((option) => {
        option.disabled = Boolean(option.value && option.value !== select.value && chosen.includes(option.value));
      });
      const preview = select.closest('.blog-popular-editor__slot')?.querySelector<HTMLElement>('.blog-popular-editor__preview');
      const cover = select.selectedOptions[0]?.dataset.cover || '';
      if (preview) preview.innerHTML = cover ? `<img src="${escapeHtml(cover)}" alt="">` : '<span>Без обложки</span>';
    });
  };
  selects.forEach((select) => select.addEventListener('change', sync));
  sync();
}

function attachOrderEditor() {
  const list = document.querySelector<HTMLElement>('[data-section-order-list]');
  const value = document.querySelector<HTMLInputElement>('[data-section-order-value]');
  if (!list || !value) return;
  const sync = () => {
    const items = Array.from(list.querySelectorAll<HTMLElement>('[data-section-order-item]'));
    value.value = JSON.stringify(items.map((item) => item.dataset.sectionKey || ''));
    items.forEach((item, index) => {
      const up = item.querySelector<HTMLButtonElement>('[data-order-direction="up"]');
      const down = item.querySelector<HTMLButtonElement>('[data-order-direction="down"]');
      if (up) up.disabled = index === 0;
      if (down) down.disabled = index === items.length - 1;
    });
  };
  list.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-order-direction]');
    const item = button?.closest<HTMLElement>('[data-section-order-item]');
    if (!button || !item) return;
    if (button.dataset.orderDirection === 'up' && item.previousElementSibling) list.insertBefore(item, item.previousElementSibling);
    if (button.dataset.orderDirection === 'down' && item.nextElementSibling) list.insertBefore(item.nextElementSibling, item);
    sync();
  });
  sync();
}

function attachPageMediaFields() {
  document.querySelectorAll<HTMLElement>('[data-page-media]').forEach((field) => {
    const fileInput = field.querySelector<HTMLInputElement>('[data-page-media-file]');
    const hidden = field.querySelector<HTMLInputElement>('[data-page-media-value]');
    const url = field.querySelector<HTMLInputElement>('[data-page-media-url]');
    const preview = field.querySelector<HTMLElement>('[data-page-media-preview]');
    const render = (src: string) => {
      if (!preview) return;
      preview.innerHTML = src
        ? `<img src="${escapeHtml(src)}" alt="">`
        : '<span>Файл не выбран</span>';
    };

    url?.addEventListener('input', () => {
      if (hidden) hidden.value = url.value.trim();
      render(url.value.trim());
    });

    fileInput?.addEventListener('change', async () => {
      const file = fileInput.files?.[0];
      if (!file || !hidden) return;
      try {
        const uploaded = await api.uploadImage(file);
        hidden.value = uploaded.url;
        if (url) url.value = uploaded.url;
        render(uploaded.url);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Ошибка загрузки изображения');
      }
    });
  });
}

function attachPageSubmit(config: PageEditorConfig) {
  const form = document.getElementById(config.formId) as HTMLFormElement | null;
  if (!form) return;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const fd = new FormData(form);
    const data: Settings = {};
    fd.forEach((value, key) => {
      if (!key.startsWith('page_section_') && !key.startsWith('blog_popular_article_')) {
        data[key] = String(value);
      }
    });
    if (config.articleSelection) {
      const selectedIds = Array.from({ length: 6 }, (_, index) => String(fd.get(`blog_popular_article_${index}`) || ''))
        .filter((id, index, ids) => id && ids.indexOf(id) === index);
      data.BLOG_PAGE_POPULAR_ARTICLE_IDS = JSON.stringify(selectedIds);
    }
    data[`${config.keyPrefix}_SECTION_VISIBILITY`] = JSON.stringify(
      Object.fromEntries(config.sections.map(([key]) => [key, fd.has(`page_section_${key}`)])),
    );
    await saveSettings(data, config.saveMessage);
  });
}

function attachSimpleSubmit() {
  const form = document.getElementById('shooting-page-form') as HTMLFormElement | null;
  if (!form) return;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data: Settings = {};
    new FormData(form).forEach((value, key) => {
      data[key] = String(value);
    });
    await saveSettings(data, 'Страница заявки сохранена');
  });
}

async function saveSettings(data: Settings, successMessage: string) {
  const message = document.getElementById('form-message');
  try {
    await api.settings.update(data);
    if (message) message.innerHTML = pageAlert(successMessage);
  } catch (error) {
    if (message) message.innerHTML = pageAlert(error instanceof Error ? error.message : 'Ошибка сохранения', 'error');
  }
}

function parseObject(value?: string): Record<string, boolean> {
  try {
    const parsed = JSON.parse(value || '{}');
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function parseOrder(value: string | undefined, sections: readonly SectionDefinition[]): string[] {
  const defaults = sections.map(([key]) => key);
  try {
    const parsed = JSON.parse(value || '[]');
    if (!Array.isArray(parsed)) return defaults;
    const valid = parsed.map(String).filter((key, index, values) => defaults.includes(key) && values.indexOf(key) === index);
    return [...valid, ...defaults.filter((key) => !valid.includes(key))];
  } catch {
    return defaults;
  }
}

function setContent(html: string) {
  const content = document.getElementById('page-content');
  if (content) content.innerHTML = html;
}
