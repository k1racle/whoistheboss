import { api, type Settings } from '../api.js';
import { layout, escapeHtml, pageAlert, type UserInfo } from './layout.js';

const KNOWN_KEYS: { key: string; label: string; type?: 'text' | 'textarea' | 'image' | 'select' }[] = [
  { key: 'SITE_NAME', label: 'Название сайта' },
  { key: 'SITE_DESCRIPTION', label: 'Описание сайта' },
  { key: 'SITE_URL', label: 'URL сайта' },
  { key: 'ADMIN_EMAIL', label: 'Email администратора' },
  { key: 'FOOTER_TEXT', label: 'Текст в подвале' },
  { key: 'CONTACT_ADDRESS', label: 'Адрес (контакты)', type: 'textarea' },
  { key: 'CONTACT_MAP_EMBED', label: 'Ссылка на карту (iframe src)' },
  { key: 'CONTACT_PHONE', label: 'Телефон' },
  { key: 'CONTACT_EMAIL', label: 'Email для связи' },
  { key: 'YANDEX_METRIKA', label: 'Код Яндекс.Метрики' },
  { key: 'SOCIAL_TELEGRAM', label: 'Telegram' },
  { key: 'SOCIAL_VK', label: 'VK' },
  { key: 'SOCIAL_YOUTUBE', label: 'YouTube' },
  { key: 'SOCIAL_INSTAGRAM', label: 'Instagram' },
  { key: 'SOCIAL_X', label: 'X (Twitter)' },
  { key: 'SOCIAL_WHATSAPP', label: 'WhatsApp' },
  { key: 'TELEGRAM_BOT_TOKEN', label: 'Telegram bot token' },
  { key: 'TELEGRAM_CHAT_ID', label: 'Telegram chat ID' },
  { key: 'HEADER_MENU', label: 'Меню в шапке (одна строка = /путь|Название)' },
  { key: 'HEADER_LOGO', label: 'Логотип в шапке', type: 'image' },
  { key: 'FOOTER_LOGO', label: 'Логотип в подвале', type: 'image' },
  { key: 'SPLASH_ENABLED', label: 'Включить заглушку', type: 'select' },
  { key: 'SPLASH_LOGO', label: 'Логотип на заглушке', type: 'image' },
  { key: 'SPLASH_MARQUEE', label: 'Текст бегущей строки на заглушке', type: 'textarea' },
];

export function settingsView(user?: UserInfo | null) {
  const html = layout('Настройки', renderLoading(), user);

  async function init() {
    try {
      const settings = await api.settings.get();
      setContent(renderForm(settings));
      attachSubmit();
      attachLogoUploads();
    } catch (err) {
      setContent(pageAlert(err instanceof Error ? err.message : 'Ошибка загрузки', 'error'));
    }
  }

  return { html, init };
}

function renderForm(settings: Settings): string {
  const inputs = KNOWN_KEYS.map(({ key, label, type }) => {
    const value = settings[key] || '';
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
    if (type === 'textarea' || key === 'FOOTER_TEXT' || key === 'YANDEX_METRIKA') {
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
  }).join('');

  return `
    <form id="settings-form" class="bg-white border border-gray-200 rounded-sm p-6 max-w-2xl">
      <div id="form-message"></div>
      <div class="grid grid-cols-1 gap-4">
        ${inputs}
        <div class="pt-4 flex gap-3">
          <button type="submit" class="px-4 py-2 bg-terracotta text-white text-sm font-medium rounded-sm hover:bg-terracotta-600">Сохранить</button>
        </div>
      </div>
    </form>
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
        data[key] = (fd.get(key) as string) || '';
      }
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
