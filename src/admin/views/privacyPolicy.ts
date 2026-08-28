import { api, type Settings } from '../api.js';
import { attachFormAutosave } from '../lib/formAutosave.js';
import { escapeHtml, layout, pageAlert, type UserInfo } from './layout.js';

const PRIVACY_POLICY_TEXT_KEY = 'PRIVACY_POLICY_TEXT';

export function privacyPolicyView(user?: UserInfo | null) {
  const html = layout('Политика конфиденциальности', '<div class="admin-loading">Загрузка редактора…</div>', user);

  async function init() {
    try {
      const settings = await api.settings.get();
      setContent(renderEditor(settings));
      const form = document.getElementById('privacy-policy-form') as HTMLFormElement | null;
      if (!form) return;

      const autosave = attachFormAutosave({
        form,
        save: () => api.settings.update(collectSettings(form)),
      });
      const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const message = document.getElementById('form-message');
        if (message) message.innerHTML = '';
        if (submit) submit.disabled = true;
        try {
          await autosave.saveNow();
          if (message) message.innerHTML = pageAlert('Политика конфиденциальности сохранена');
        } catch (error) {
          if (message) message.innerHTML = pageAlert(error instanceof Error ? error.message : 'Ошибка сохранения', 'error');
        } finally {
          if (submit) submit.disabled = false;
        }
      });
    } catch (error) {
      setContent(pageAlert(error instanceof Error ? error.message : 'Не удалось загрузить редактор', 'error'));
    }
  }

  return { html, init };
}

function renderEditor(settings: Settings): string {
  return `
    <form id="privacy-policy-form" class="standalone-editor">
      <div id="form-message"></div>
      <section class="editor-section standalone-editor__section">
        <div class="standalone-editor__header">
          <div>
            <span class="standalone-editor__eyebrow">Публичный документ</span>
            <h2>Текст политики</h2>
            <p>Текст отображается на отдельной публичной странице. Переносы строк и пустые строки сохраняются.</p>
          </div>
        </div>
        <label class="editor-field editor-field--wide" for="privacy-policy-text">
          <span class="editor-field__label">Политика конфиденциальности</span>
          <textarea
            id="privacy-policy-text"
            class="editor-control min-h-[32rem] resize-y leading-6"
            name="${PRIVACY_POLICY_TEXT_KEY}"
            rows="24"
            spellcheck="true"
          >${escapeHtml(settings[PRIVACY_POLICY_TEXT_KEY] || '')}</textarea>
          <span class="editor-field__help">Используйте Enter для новой строки. HTML-теги не нужны и будут показаны как обычный текст.</span>
        </label>
      </section>
      <div class="standalone-editor__actions">
        <span>Изменения появятся на сайте после сохранения</span>
        <a href="/privacy-policy" target="_blank" rel="noopener" class="editor-button">Открыть страницу ↗</a>
        <button type="submit" class="editor-button editor-button--primary">Сохранить политику</button>
      </div>
    </form>`;
}

function collectSettings(form: HTMLFormElement): Settings {
  const value = form.elements.namedItem(PRIVACY_POLICY_TEXT_KEY) as HTMLTextAreaElement | null;
  return { [PRIVACY_POLICY_TEXT_KEY]: value?.value || '' };
}

function setContent(html: string): void {
  const content = document.getElementById('page-content');
  if (content) content.innerHTML = html;
}
