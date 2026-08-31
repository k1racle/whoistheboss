import { api, type Settings } from '../api.js';
import { attachSortableList, renderSortableHandle } from '../lib/sortableList.js';
import { layout, escapeHtml, pageAlert, type UserInfo } from './layout.js';

type SettingField = {
  key: string;
  label: string;
  type?: 'text' | 'textarea' | 'image' | 'video' | 'select';
};

type FooterMetaItem = { text: string; href: string };
type SocialLinkItem = { label: string; href: string };

const FOOTER_META_ITEMS_KEY = 'FOOTER_META_ITEMS';
const SOCIAL_LINKS_KEY = 'SOCIAL_LINKS';
const ADMIN_ONLY_SETTING_KEYS = new Set([
  'ADMIN_EMAIL',
  'SITE_URL',
  'TELEGRAM_BOT_TOKEN',
  'TELEGRAM_CHAT_ID',
]);
const DEFAULT_FOOTER_META_ITEMS: FooterMetaItem[] = [
  { text: 'ИП Батагов А.А.', href: '' },
  { text: 'Пошта Почта', href: '' },
  { text: 'Политика конф-ти', href: '/privacy-policy' },
];

const SETTING_GROUPS: { title: string; description: string; fields: SettingField[] }[] = [
  {
    title: 'Основные настройки',
    description: 'Название, описание и технические данные сайта.',
    fields: [
      { key: 'SITE_NAME', label: 'Название сайта' },
      { key: 'SITE_DESCRIPTION', label: 'Описание сайта' },
      { key: 'SITE_URL', label: 'URL сайта' },
      { key: 'ADMIN_EMAIL', label: 'Email администратора' },
      { key: 'FOOTER_TEXT', label: 'Текст в подвале' },
    ],
  },
  {
    title: 'Контакты',
    description: 'Данные для страницы контактов и обратной связи.',
    fields: [
      { key: 'CONTACT_ADDRESS', label: 'Адрес (контакты)', type: 'textarea' },
      { key: 'CONTACT_MAP_EMBED', label: 'Ссылка на карту (iframe src)' },
      { key: 'CONTACT_PHONE', label: 'Телефон' },
      { key: 'CONTACT_EMAIL', label: 'Email для связи' },
    ],
  },
  {
    title: 'SEO публичных страниц',
    description: 'Заголовки и описания для поисковой выдачи. Изображения используются в превью ссылок.',
    fields: [
      { key: 'SEO_DEFAULT_IMAGE', label: 'Общее изображение для соцсетей', type: 'image' },
      { key: 'SEO_HOME_TITLE', label: 'Главная — SEO title' },
      { key: 'SEO_HOME_DESCRIPTION', label: 'Главная — SEO description', type: 'textarea' },
      { key: 'SEO_HOME_IMAGE', label: 'Главная — изображение', type: 'image' },
      { key: 'SEO_ENTREPRENEURS_TITLE', label: 'Предприниматели — SEO title' },
      { key: 'SEO_ENTREPRENEURS_DESCRIPTION', label: 'Предприниматели — SEO description', type: 'textarea' },
      { key: 'SEO_ENTREPRENEURS_IMAGE', label: 'Предприниматели — изображение', type: 'image' },
      { key: 'SEO_COMPANIES_TITLE', label: 'Бизнес — SEO title' },
      { key: 'SEO_COMPANIES_DESCRIPTION', label: 'Бизнес — SEO description', type: 'textarea' },
      { key: 'SEO_COMPANIES_IMAGE', label: 'Бизнес — изображение', type: 'image' },
      { key: 'SEO_BLOG_TITLE', label: 'Журнал — SEO title' },
      { key: 'SEO_BLOG_DESCRIPTION', label: 'Журнал — SEO description', type: 'textarea' },
      { key: 'SEO_BLOG_IMAGE', label: 'Журнал — изображение', type: 'image' },
      { key: 'SEO_INTERVIEWS_TITLE', label: 'Интервью — SEO title' },
      { key: 'SEO_INTERVIEWS_DESCRIPTION', label: 'Интервью — SEO description', type: 'textarea' },
      { key: 'SEO_INTERVIEWS_IMAGE', label: 'Интервью — изображение', type: 'image' },
      { key: 'SEO_REELS_TITLE', label: 'Рилсы — SEO title' },
      { key: 'SEO_REELS_DESCRIPTION', label: 'Рилсы — SEO description', type: 'textarea' },
      { key: 'SEO_REELS_IMAGE', label: 'Рилсы — изображение', type: 'image' },
      { key: 'SEO_CONTACTS_TITLE', label: 'Контакты — SEO title' },
      { key: 'SEO_CONTACTS_DESCRIPTION', label: 'Контакты — SEO description', type: 'textarea' },
      { key: 'SEO_CONTACTS_IMAGE', label: 'Контакты — изображение', type: 'image' },
    ],
  },
  {
    title: 'Шапка и логотипы',
    description: 'Меню и изображения общих частей сайта.',
    fields: [
      { key: 'HEADER_MENU', label: 'Меню в шапке (одна строка = /путь|Название)' },
      { key: 'HEADER_LOGO', label: 'Логотип в шапке', type: 'image' },
      { key: 'FOOTER_LOGO', label: 'Логотип в подвале', type: 'image' },
    ],
  },
  {
    title: 'Интеграция Telegram',
    description: 'Служебные данные Telegram-бота; они не выводятся в футере.',
    fields: [
      { key: 'TELEGRAM_BOT_TOKEN', label: 'Telegram bot token' },
      { key: 'TELEGRAM_CHAT_ID', label: 'Telegram chat ID' },
    ],
  },
  {
    title: 'Заглушка сайта',
    description: 'Настройки временного экрана до открытия публичного сайта.',
    fields: [
      { key: 'SPLASH_ENABLED', label: 'Включить заглушку', type: 'select' },
      { key: 'SPLASH_LOGO', label: 'Логотип на заглушке', type: 'image' },
      { key: 'SPLASH_MARQUEE', label: 'Текст бегущей строки на заглушке', type: 'textarea' },
    ],
  },
];

const KNOWN_KEYS = SETTING_GROUPS.flatMap(group => group.fields);

export function settingsView(user?: UserInfo | null) {
  const html = layout('Настройки', renderLoading(), user);

  async function init() {
    try {
      const settings = await api.settings.get();
      setContent(renderForm(settings, user?.role === 'ADMIN'));
      attachSubmit();
      attachVideoUploads();
      attachLogoUploads();
      attachSocialLinksEditor();
      attachFooterMetaEditor();
    } catch (err) {
      setContent(pageAlert(err instanceof Error ? err.message : 'Ошибка загрузки', 'error'));
    }
  }

  return { html, init };
}

function renderForm(settings: Settings, isAdmin: boolean): string {
  const visibleGroups = SETTING_GROUPS
    .map(group => ({
      ...group,
      fields: group.fields.filter(field => isAdmin || !ADMIN_ONLY_SETTING_KEYS.has(field.key)),
    }))
    .filter(group => group.fields.length);
  const groups = visibleGroups.map(group => `
    <section class="grid gap-4 border-b border-gray-200 pb-7 last:border-0">
      <div>
        <h2 class="text-lg font-semibold text-gray-900">${escapeHtml(group.title)}</h2>
        <p class="mt-1 text-sm text-gray-500">${escapeHtml(group.description)}</p>
      </div>
      ${group.fields.map(field => renderSettingField(field, settings[field.key] || '')).join('')}
    </section>
  `).join('');

  return `
    <form id="settings-form" class="bg-white border border-gray-200 rounded-sm p-6 max-w-3xl">
      <div id="form-message"></div>
      <div class="grid grid-cols-1 gap-7">
        ${groups}
        ${renderSocialLinksSection(settings)}
        ${renderFooterMetaSection(settings[FOOTER_META_ITEMS_KEY])}
        <div class="pt-4 flex gap-3">
          <button type="submit" class="px-4 py-2 bg-terracotta text-white text-sm font-medium rounded-sm hover:bg-terracotta-600">Сохранить</button>
        </div>
      </div>
    </form>
  `;
}

function renderSettingField({ key, label, type }: SettingField, value: string): string {
  if (type === 'video') {
    return `
      <div data-video-field="${key}">
        <label class="block text-sm font-medium text-gray-700 mb-1">${escapeHtml(label)}</label>
        <input type="hidden" name="${key}" value="${escapeHtml(value)}">
        <input type="file" accept="video/*" data-video-upload="${key}" class="block w-full text-sm text-gray-500">
        ${value ? `<a class="mt-2 inline-block text-sm text-terracotta hover:underline" href="${escapeHtml(value)}" target="_blank" rel="noopener">Открыть загруженное видео</a>` : ''}
      </div>
    `;
  }
  if (type === 'image') {
    return `
      <div data-image-field="${key}">
        <label class="block text-sm font-medium text-gray-700 mb-1">${escapeHtml(label)}</label>
        <input type="hidden" name="${key}" value="${escapeHtml(value)}">
        <input type="file" accept="image/*" data-logo-upload="${key}" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-medium file:bg-terracotta file:text-white hover:file:bg-terracotta-600">
        <div class="mt-2 logo-preview">
          ${value ? `<img src="${escapeHtml(value)}" alt="" class="h-12 w-auto object-contain border border-gray-200 rounded-sm">` : ''}
        </div>
      </div>
    `;
  }
  if (type === 'select') {
    return `
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">${escapeHtml(label)}</label>
        <select name="${key}" class="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-terracotta">
          <option value="false" ${value === 'true' ? '' : 'selected'}>Выключено</option>
          <option value="true" ${value === 'true' ? 'selected' : ''}>Включено</option>
        </select>
      </div>
    `;
  }
  if (type === 'textarea' || key === 'FOOTER_TEXT') {
    return `
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">${escapeHtml(label)}</label>
        <textarea name="${key}" rows="4" class="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-terracotta font-mono text-sm">${escapeHtml(value)}</textarea>
      </div>
    `;
  }
  return `
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">${escapeHtml(label)}</label>
      <input type="text" name="${key}" value="${escapeHtml(value)}" class="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-terracotta">
    </div>
  `;
}

function parseSocialLinks(settings: Settings): SocialLinkItem[] {
  if (settings[SOCIAL_LINKS_KEY]) {
    try {
      const parsed = JSON.parse(settings[SOCIAL_LINKS_KEY]);
      if (Array.isArray(parsed)) return parsed.filter(item => item && typeof item.label === 'string' && typeof item.href === 'string');
    } catch { /* use legacy values */ }
  }
  const legacy = [
    ['SOCIAL_TELEGRAM', 'TELEGRAM'], ['SOCIAL_INSTAGRAM', 'INSTAGRAM'], ['SOCIAL_VK', 'VK'],
    ['SOCIAL_YOUTUBE', 'YOUTUBE'], ['SOCIAL_PINTEREST', 'PINTEREST'], ['SOCIAL_DZEN', 'DZEN'],
    ['SOCIAL_X', 'X'], ['SOCIAL_WHATSAPP', 'WHATSAPP'],
  ] as const;
  return legacy.flatMap(([key, label]) => settings[key]?.trim() ? [{ label, href: settings[key].trim() }] : []);
}

function renderSocialLinkRow(item: SocialLinkItem): string {
  return `<article class="grid gap-3 rounded-sm border border-gray-200 p-4 sm:grid-cols-[auto_0.75fr_1.5fr_auto] sm:items-end" data-social-link-row>
    ${renderSortableHandle('Перетащить социальную сеть')}
    <label><span class="mb-1 block text-sm font-medium text-gray-700">Название *</span><input type="text" value="${escapeHtml(item.label)}" required class="w-full px-4 py-2 border border-gray-300 rounded-sm" data-social-link-label placeholder="Telegram"></label>
    <label><span class="mb-1 block text-sm font-medium text-gray-700">Ссылка *</span><input type="url" value="${escapeHtml(item.href)}" required class="w-full px-4 py-2 border border-gray-300 rounded-sm" data-social-link-href placeholder="https://..."></label>
    <button type="button" class="editor-button editor-button--danger" data-social-link-remove>Удалить</button>
  </article>`;
}

function renderSocialLinksSection(settings: Settings): string {
  const items = parseSocialLinks(settings);
  return `<section class="grid gap-4 border-b border-gray-200 pb-7"><div><h2 class="text-lg font-semibold text-gray-900">Социальные сети</h2><p class="mt-1 text-sm text-gray-500">Один список для футера и мобильного меню. Можно добавить любую новую сеть.</p></div><input type="hidden" name="${SOCIAL_LINKS_KEY}" value="${escapeHtml(JSON.stringify(items))}" data-social-links-value><div class="grid gap-3" data-social-links-list>${items.map(renderSocialLinkRow).join('')}</div><button type="button" class="editor-button justify-self-start" data-social-link-add>Добавить социальную сеть</button></section>`;
}

function attachSocialLinksEditor() {
  const list = document.querySelector<HTMLElement>('[data-social-links-list]');
  const value = document.querySelector<HTMLInputElement>('[data-social-links-value]');
  const addButton = document.querySelector<HTMLButtonElement>('[data-social-link-add]');
  if (!list || !value || !addButton) return;
  const sync = () => { value.value = JSON.stringify(Array.from(list.querySelectorAll<HTMLElement>('[data-social-link-row]')).map(row => ({ label: row.querySelector<HTMLInputElement>('[data-social-link-label]')?.value.trim() || '', href: row.querySelector<HTMLInputElement>('[data-social-link-href]')?.value.trim() || '' }))); };
  attachSortableList({ list, itemSelector: '[data-social-link-row]', onChange: sync });
  addButton.addEventListener('click', () => { list.insertAdjacentHTML('beforeend', renderSocialLinkRow({ label: '', href: '' })); list.querySelector<HTMLInputElement>('[data-social-link-row]:last-child [data-social-link-label]')?.focus(); sync(); });
  list.addEventListener('input', sync);
  list.addEventListener('click', (event) => { const remove = (event.target as HTMLElement).closest('[data-social-link-remove]'); if (!remove) return; remove.closest('[data-social-link-row]')?.remove(); sync(); });
}

function parseFooterMetaItems(value: string | undefined): FooterMetaItem[] {
  if (!value) return DEFAULT_FOOTER_META_ITEMS;
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return DEFAULT_FOOTER_META_ITEMS;
    return parsed
      .filter(item => item && typeof item === 'object')
      .map(item => ({
        text: typeof item.text === 'string' ? item.text : '',
        href: typeof item.href === 'string' ? item.href : '',
      }));
  } catch {
    return DEFAULT_FOOTER_META_ITEMS;
  }
}

function renderFooterMetaRow(item: FooterMetaItem): string {
  return `
    <article class="grid gap-3 rounded-sm border border-gray-200 p-4 sm:grid-cols-[auto_1fr_1fr_auto] sm:items-end" data-footer-meta-row>
      ${renderSortableHandle('Перетащить элемент футера')}
      <label>
        <span class="mb-1 block text-sm font-medium text-gray-700">Текст *</span>
        <input type="text" value="${escapeHtml(item.text)}" required class="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-terracotta" data-footer-meta-text>
      </label>
      <label>
        <span class="mb-1 block text-sm font-medium text-gray-700">Ссылка</span>
        <input type="text" value="${escapeHtml(item.href)}" placeholder="/contacts или https://…" class="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-terracotta" data-footer-meta-href>
      </label>
      <button type="button" class="editor-button editor-button--danger" data-footer-meta-remove>Удалить</button>
    </article>
  `;
}

function renderFooterMetaSection(value: string | undefined): string {
  const items = parseFooterMetaItems(value);
  return `
    <section class="grid gap-4 border-b border-gray-200 pb-7">
      <div>
        <h2 class="text-lg font-semibold text-gray-900">Нижняя строка футера</h2>
        <p class="mt-1 text-sm text-gray-500">Текст обязателен. Если ссылка заполнена, элемент становится ссылкой; без ссылки остается обычным текстом.</p>
      </div>
      <input type="hidden" name="${FOOTER_META_ITEMS_KEY}" value="${escapeHtml(JSON.stringify(items))}" data-footer-meta-value>
      <div class="grid gap-3" data-footer-meta-list>
        ${items.map(renderFooterMetaRow).join('')}
      </div>
      <button type="button" class="editor-button justify-self-start" data-footer-meta-add>Добавить элемент</button>
    </section>
  `;
}

function attachLogoUploads() {
  const inputs = document.querySelectorAll<HTMLInputElement>('[data-logo-upload]');
  inputs.forEach((input) => {
    input.addEventListener('change', async () => {
      const file = input.files?.[0];
      if (!file) return;
      const key = input.dataset.logoUpload;
      const wrapper = input.closest('[data-image-field]') as HTMLElement | null;
      const hidden = wrapper?.querySelector(`input[name="${key}"]`) as HTMLInputElement | null;
      const preview = wrapper?.querySelector('.logo-preview');
      try {
        const { url } = await api.uploadImage(file);
        if (hidden) hidden.value = url;
        if (preview) {
          preview.innerHTML = `<img src="${url}" alt="" class="h-12 w-auto object-contain border border-gray-200 rounded-sm">`;
        }
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Ошибка загрузки изображения');
      }
    });
  });
}

function attachVideoUploads() {
  const inputs = document.querySelectorAll<HTMLInputElement>('[data-video-upload]');
  inputs.forEach((input) => {
    input.addEventListener('change', async () => {
      const file = input.files?.[0];
      if (!file) return;
      const key = input.dataset.videoUpload;
      const wrapper = input.closest('[data-video-field]') as HTMLElement | null;
      const hidden = wrapper?.querySelector(`input[name="${key}"]`) as HTMLInputElement | null;
      try {
        const { url } = await api.uploadVideo(file);
        if (hidden) hidden.value = url;
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Ошибка загрузки видео');
      }
    });
  });
}

function attachFooterMetaEditor() {
  const list = document.querySelector<HTMLElement>('[data-footer-meta-list]');
  const value = document.querySelector<HTMLInputElement>('[data-footer-meta-value]');
  const addButton = document.querySelector<HTMLButtonElement>('[data-footer-meta-add]');
  if (!list || !value || !addButton) return;

  const sync = () => {
    const items = Array.from(list.querySelectorAll<HTMLElement>('[data-footer-meta-row]')).map(row => ({
      text: row.querySelector<HTMLInputElement>('[data-footer-meta-text]')?.value.trim() || '',
      href: row.querySelector<HTMLInputElement>('[data-footer-meta-href]')?.value.trim() || '',
    }));
    value.value = JSON.stringify(items);
  };

  attachSortableList({
    list,
    itemSelector: '[data-footer-meta-row]',
    onChange: sync,
  });

  addButton.addEventListener('click', () => {
    list.insertAdjacentHTML('beforeend', renderFooterMetaRow({ text: '', href: '' }));
    list.querySelector<HTMLInputElement>('[data-footer-meta-row]:last-child [data-footer-meta-text]')?.focus();
    sync();
  });

  list.addEventListener('input', sync);
  list.addEventListener('click', (event) => {
    const remove = (event.target as HTMLElement).closest<HTMLElement>('[data-footer-meta-remove]');
    if (!remove) return;
    remove.closest<HTMLElement>('[data-footer-meta-row]')?.remove();
    sync();
  });
}

function attachSubmit() {
  const form = document.getElementById('settings-form') as HTMLFormElement | null;
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById('form-message');
    if (msg) msg.innerHTML = '';

    try {
      const fd = new FormData(form);
      const data: Settings = {};
      for (const { key } of KNOWN_KEYS) {
        const value = fd.get(key);
        if (typeof value === 'string') data[key] = value;
      }
      data[FOOTER_META_ITEMS_KEY] = (fd.get(FOOTER_META_ITEMS_KEY) as string) || '[]';
      data[SOCIAL_LINKS_KEY] = (fd.get(SOCIAL_LINKS_KEY) as string) || '[]';
      await api.settings.update(data);
      if (msg) msg.innerHTML = pageAlert('Настройки сохранены');
    } catch (err) {
      if (msg) {
        msg.innerHTML = pageAlert(err instanceof Error ? err.message : 'Ошибка сохранения', 'error');
      }
    }
  });
}

function setContent(html: string) {
  const pageContent = document.getElementById('page-content');
  if (pageContent) pageContent.innerHTML = html;
}

function renderLoading(): string {
  return `<div class="text-gray-500">Загрузка…</div>`;
}
