import { api, type Settings } from '../api.js';
import { attachFormAutosave, type FormAutosaveController } from '../lib/formAutosave.js';
import { escapeHtml, layout, pageAlert, type UserInfo } from './layout.js';

type FaqItem = { question: string; answer: string };

const sections = [
  ['hero', 'Херо', 'Полноэкранный заголовок страницы.'],
  ['about', 'О проекте', 'Текст и видео о проекте.'],
  ['stages', 'Этапы', 'Общий блок этапов с главной страницы.'],
  ['faq', 'FAQ', 'Вопросы и раскрывающиеся ответы.'],
  ['cta', 'CTA', 'Общая форма заявки сайта.'],
] as const;

type ShootingSectionKey = typeof sections[number][0];

const defaultFaq: FaqItem[] = [
  { question: 'Кто может стать героем проекта?', answer: 'Предприниматель или руководитель с реальным опытом, историей и готовностью честно рассказать о своём пути.' },
  { question: 'Как проходит отбор?', answer: 'Команда проекта знакомится с заявкой, связывается с кандидатом и уточняет формат будущего материала.' },
  { question: 'Что нужно отправить?', answer: 'Заполните форму и кратко расскажите о себе, компании и теме, которой готовы поделиться.' },
];

function parseJson<T>(value: string | undefined, fallback: T): T {
  try {
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
}

function section(id: string, title: string, description: string, content: string, index: number, open = false): string {
  return `
    <details id="${id}" class="editor-section" ${open ? 'open' : ''}>
      <summary class="editor-section__summary">
        <span class="editor-section__number">${String(index).padStart(2, '0')}</span>
        <span class="editor-section__heading"><strong>${title}</strong><small>${description}</small></span>
        <span class="editor-section__chevron">⌄</span>
      </summary>
      <div class="editor-section__content"><div class="editor-grid">${content}</div></div>
    </details>`;
}

function field(label: string, name: string, value: string, options: { textarea?: boolean; help?: string } = {}): string {
  const control = options.textarea
    ? `<textarea class="editor-control" name="${name}" rows="5">${escapeHtml(value)}</textarea>`
    : `<input class="editor-control" type="text" name="${name}" value="${escapeHtml(value)}">`;
  return `
    <label class="editor-field editor-field--wide">
      <span class="editor-field__label">${label}</span>
      ${control}
      ${options.help ? `<span class="editor-field__help">${options.help}</span>` : ''}
    </label>`;
}

function faqItem(item: FaqItem, index: number): string {
  return `
    <article class="shooting-page-editor__faq-item" data-faq-item>
      <div class="shooting-page-editor__faq-head">
        <strong>Вопрос ${String(index + 1).padStart(2, '0')}</strong>
        <button type="button" class="editor-button" data-faq-remove>Удалить</button>
      </div>
      ${field('Вопрос', '', item.question).replace('name=""', 'data-faq-question')}
      ${field('Ответ', '', item.answer, { textarea: true }).replace('name=""', 'data-faq-answer')}
    </article>`;
}

function render(settings: Settings): string {
  const defaultOrder = sections.map(([key]) => key) as ShootingSectionKey[];
  const savedOrder = parseJson<ShootingSectionKey[]>(settings.SHOOTING_PAGE_SECTION_ORDER, defaultOrder);
  const order = [
    ...savedOrder.filter((key): key is ShootingSectionKey => defaultOrder.includes(key)),
    ...defaultOrder.filter((key) => !savedOrder.includes(key)),
  ];
  const visibility = parseJson<Record<string, boolean>>(settings.SHOOTING_PAGE_SECTION_VISIBILITY, {});
  const faq = parseJson<FaqItem[]>(settings.SHOOTING_PAGE_FAQ_JSON, defaultFaq);
  const labels = new Map(sections.map(([key, title]) => [key, title]));

  return `
    <form id="shooting-page-editor" class="entrepreneur-editor home-editor shooting-page-editor">
      <div id="shooting-page-message" class="entrepreneur-editor__message"></div>
      <div class="entrepreneur-editor__layout">
        <aside class="entrepreneur-editor__nav">
          <p class="entrepreneur-editor__nav-title">Блоки страницы</p>
          <a href="#shooting-page-order">00. Порядок и видимость</a>
          ${sections.map(([, title], index) => `<a href="#shooting-page-section-${index + 1}">${String(index + 1).padStart(2, '0')}. ${title}</a>`).join('')}
        </aside>
        <div class="entrepreneur-editor__sections">
          ${section('shooting-page-order', 'Порядок и видимость', 'Перемещайте блоки стрелками и отключайте ненужные секции.', `
            <div class="editor-field editor-field--wide">
              <div class="editor-order-list" data-shooting-order-list>
                ${order.map((key) => `
                  <div class="editor-order-item" data-section-key="${key}">
                    <label class="editor-switch">
                      <input type="checkbox" data-visible ${visibility[key] !== false ? 'checked' : ''}>
                      <span class="editor-switch__track"></span>
                      <span>
                        <strong>${labels.get(key) || key}</strong>
                        <small>Отображать на публичной странице</small>
                      </span>
                    </label>
                    <div class="editor-order-controls">
                      <button type="button" class="editor-order-button" data-move="-1" aria-label="Поднять">↑</button>
                      <button type="button" class="editor-order-button" data-move="1" aria-label="Опустить">↓</button>
                    </div>
                  </div>`).join('')}
              </div>
            </div>`, 0, true)}

          ${section('shooting-page-section-1', 'Херо', 'Полноэкранный заголовок страницы.', `
            ${field('Заголовок', 'SHOOTING_PAGE_HERO_TITLE', settings.SHOOTING_PAGE_HERO_TITLE || 'КАК ПРИНЯТЬ\nУЧАСТИЕ', { textarea: true, help: 'Каждая строка выводится отдельно.' })}
            ${field('SEO-заголовок', 'SHOOTING_PAGE_TITLE', settings.SHOOTING_PAGE_TITLE || 'Стать героем')}
            ${field('SEO-описание', 'SHOOTING_PAGE_DESCRIPTION', settings.SHOOTING_PAGE_DESCRIPTION || '', { textarea: true })}
          `, 1)}

          ${section('shooting-page-section-2', 'О проекте', 'Контент и видео второго блока.', `
            ${field('Заголовок', 'SHOOTING_PAGE_ABOUT_TITLE', settings.SHOOTING_PAGE_ABOUT_TITLE || 'О ПРОЕКТЕ')}
            ${field('Основной текст', 'SHOOTING_PAGE_ABOUT_TEXT', settings.SHOOTING_PAGE_ABOUT_TEXT || '', { textarea: true })}
            ${field('Нижний текст', 'SHOOTING_PAGE_ABOUT_BOTTOM_TEXT', settings.SHOOTING_PAGE_ABOUT_BOTTOM_TEXT || '', { textarea: true })}
            <label class="editor-field editor-field--wide">
              <span class="editor-field__label">Тип видео</span>
              <select class="editor-control" name="SHOOTING_PAGE_ABOUT_VIDEO_TYPE">
                <option value="EMBED" ${settings.SHOOTING_PAGE_ABOUT_VIDEO_TYPE !== 'SELF_HOSTED' ? 'selected' : ''}>Ссылка / встраивание</option>
                <option value="SELF_HOSTED" ${settings.SHOOTING_PAGE_ABOUT_VIDEO_TYPE === 'SELF_HOSTED' ? 'selected' : ''}>Загруженный файл</option>
              </select>
            </label>
            ${field('Ссылка на видео', 'SHOOTING_PAGE_ABOUT_VIDEO_URL', settings.SHOOTING_PAGE_ABOUT_VIDEO_URL || '', { help: 'VK Video, Rutube или другая ссылка для встраивания.' })}
            <div class="editor-field editor-field--wide">
              <span class="editor-field__label">Файл видео</span>
              <input type="hidden" name="SHOOTING_PAGE_ABOUT_VIDEO_FILE" value="${escapeHtml(settings.SHOOTING_PAGE_ABOUT_VIDEO_FILE || '')}" data-video-value>
              <div class="shooting-page-editor__video-actions">
                <label class="editor-button editor-button--primary">
                  Загрузить видео
                  <input type="file" accept="video/*" data-video-file hidden>
                </label>
                <span class="shooting-page-editor__video-status" data-video-status>${settings.SHOOTING_PAGE_ABOUT_VIDEO_FILE ? 'Файл загружен' : 'Файл не выбран'}</span>
              </div>
            </div>
          `, 2)}

          ${section('shooting-page-section-3', 'Этапы', 'Общий блок сайта.', `
            <div class="editor-field editor-field--wide home-related-editor">
              <strong>Общие этапы проекта</strong>
              <p>Изменения применяются одновременно на главной странице и здесь.</p>
              <a class="editor-button" href="/admin/stages" data-link>Редактировать этапы</a>
            </div>
          `, 3)}

          ${section('shooting-page-section-4', 'FAQ', 'Добавляйте и удаляйте вопросы.', `
            ${field('Заголовок блока', 'SHOOTING_PAGE_FAQ_TITLE', settings.SHOOTING_PAGE_FAQ_TITLE || 'FAQ')}
            <div class="shooting-page-editor__faq editor-field editor-field--wide" data-faq-list>
              ${(faq.length ? faq : defaultFaq).map(faqItem).join('')}
            </div>
            <div class="editor-field editor-field--wide">
              <button type="button" class="editor-button editor-button--primary" data-faq-add>Добавить вопрос</button>
            </div>
          `, 4)}

          ${section('shooting-page-section-5', 'CTA', 'Общая форма заявки сайта.', `
            <div class="editor-field editor-field--wide home-related-editor">
              <strong>Общая форма заявки</strong>
              <p>Дизайн и содержимое CTA едины для всего сайта. Здесь настраиваются положение и видимость блока.</p>
            </div>
          `, 5)}
        </div>
      </div>
      <div class="entrepreneur-editor__actions">
        <span>Изменения применятся после сохранения.</span>
        <button type="submit" class="editor-button editor-button--primary">Сохранить страницу</button>
      </div>
    </form>`;
}

function setMessage(message: string, type: 'success' | 'error'): void {
  const target = document.getElementById('shooting-page-message');
  if (target) target.innerHTML = pageAlert(message, type);
}

function renumberFaq(): void {
  document.querySelectorAll<HTMLElement>('[data-faq-item]').forEach((item, index) => {
    const title = item.querySelector<HTMLElement>('.shooting-page-editor__faq-head strong');
    if (title) title.textContent = `Вопрос ${String(index + 1).padStart(2, '0')}`;
  });
}

function syncOrderControls(form: HTMLFormElement): void {
  const items = [...form.querySelectorAll<HTMLElement>('[data-section-key]')];
  items.forEach((item, index) => {
    const up = item.querySelector<HTMLButtonElement>('[data-move="-1"]');
    const down = item.querySelector<HTMLButtonElement>('[data-move="1"]');
    if (up) up.disabled = index === 0;
    if (down) down.disabled = index === items.length - 1;
  });
}

function attach(autosave: FormAutosaveController): void {
  const form = document.getElementById('shooting-page-editor') as HTMLFormElement | null;
  if (!form) return;

  syncOrderControls(form);

  form.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const move = target.closest<HTMLButtonElement>('[data-move]');
    if (move) {
      const item = move.closest<HTMLElement>('[data-section-key]');
      const direction = Number(move.dataset.move);
      if (item) {
        const sibling = direction < 0 ? item.previousElementSibling : item.nextElementSibling;
        if (sibling) item.parentElement?.insertBefore(item, direction < 0 ? sibling : sibling.nextElementSibling);
      }
      syncOrderControls(form);
      return;
    }
    if (target.closest('[data-faq-remove]')) {
      target.closest('[data-faq-item]')?.remove();
      renumberFaq();
      return;
    }
    if (target.closest('[data-faq-add]')) {
      const list = form.querySelector<HTMLElement>('[data-faq-list]');
      if (list) {
        list.insertAdjacentHTML('beforeend', faqItem({ question: '', answer: '' }, list.children.length));
        renumberFaq();
      }
    }
  });

  const videoInput = form.querySelector<HTMLInputElement>('[data-video-file]');
  videoInput?.addEventListener('change', async () => {
    const file = videoInput.files?.[0];
    if (!file) return;
    const status = form.querySelector<HTMLElement>('[data-video-status]');
    const value = form.querySelector<HTMLInputElement>('[data-video-value]');
    try {
      if (status) status.textContent = 'Загрузка...';
      const uploaded = await api.uploadVideo(file);
      if (value) value.value = uploaded.url;
      if (status) status.textContent = 'Файл загружен';
    } catch (error) {
      if (status) status.textContent = 'Ошибка загрузки';
      setMessage(error instanceof Error ? error.message : 'Не удалось загрузить видео', 'error');
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (submit) submit.disabled = true;
    try {
      await autosave.saveNow();
      setMessage('Страница сохранена', 'success');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Не удалось сохранить страницу', 'error');
    } finally {
      if (submit) submit.disabled = false;
    }
  });
}

function collectSettings(form: HTMLFormElement): Settings {
  const payload: Settings = {};
  new FormData(form).forEach((value, key) => {
    if (typeof value === 'string') payload[key] = value;
  });
  const orderItems = [...form.querySelectorAll<HTMLElement>('[data-section-key]')];
  payload.SHOOTING_PAGE_SECTION_ORDER = JSON.stringify(orderItems.map((item) => item.dataset.sectionKey));
  payload.SHOOTING_PAGE_SECTION_VISIBILITY = JSON.stringify(Object.fromEntries(orderItems.map((item) => [
    item.dataset.sectionKey,
    item.querySelector<HTMLInputElement>('[data-visible]')?.checked !== false,
  ])));
  payload.SHOOTING_PAGE_FAQ_JSON = JSON.stringify(
    [...form.querySelectorAll<HTMLElement>('[data-faq-item]')]
      .map((item) => ({
        question: item.querySelector<HTMLInputElement>('[data-faq-question]')?.value.trim() || '',
        answer: item.querySelector<HTMLTextAreaElement>('[data-faq-answer]')?.value.trim() || '',
      }))
      .filter((item) => item.question || item.answer),
  );
  return payload;
}

export function createShootingPageView(user?: UserInfo | null) {
  const html = layout('Страница «Стать героем»', '<div class="admin-loading">Загрузка редактора...</div>', user);
  async function init() {
    try {
      const settings = await api.settings.get();
      const content = document.getElementById('page-content');
      if (content) content.innerHTML = render(settings);
      const form = document.getElementById('shooting-page-editor') as HTMLFormElement | null;
      if (!form) return;
      const autosave = attachFormAutosave({
        form,
        save: () => api.settings.update(collectSettings(form)),
      });
      attach(autosave);
    } catch (error) {
      const content = document.getElementById('page-content');
      if (content) content.innerHTML = pageAlert(error instanceof Error ? error.message : 'Не удалось загрузить редактор', 'error');
    }
  }
  return { html, init };
}
