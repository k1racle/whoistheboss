import { api } from '../api.js';
import { escapeHtml, layout, pageAlert, type UserInfo } from './layout.js';

type RegistrationRow = { label: string; value: string };
type MktuClass = { number: string; title: string; summary: string; officialText: string };
type Rule = { id: string; eyebrow: string; title: string; intro: string; points: string[]; note: string; tone: 'neutral' | 'accent' | 'warning' };
type Step = { number: string; title: string; text: string };
type Faq = { question: string; answer: string };
type TrademarkPage = Record<string, unknown> & {
  seoTitle: string; seoDescription: string; lastUpdated: string;
  hero: Record<string, string>;
  registration: { title: string; rows: RegistrationRow[]; certificateUrl: string; appendixUrl: string; certificateAlt: string };
  protection: { title: string; intro: string; notice: string; classes: MktuClass[] };
  rules: Rule[];
  licensing: { title: string; intro: string; points: string[]; processTitle: string; steps: Step[]; disclaimer: string };
  quality: { title: string; text: string; points: string[] };
  violation: { title: string; text: string; requirements: string[]; button: string; disclaimer: string };
  faqTitle: string; faqItems: Faq[];
  contacts: Record<string, string>;
  application: Record<string, string>;
  footerLegalText: string;
};

function field(label: string, path: string, value: string, textarea = false, help = ''): string {
  const control = textarea
    ? `<textarea class="editor-control" data-path="${path}" rows="5">${escapeHtml(value)}</textarea>`
    : `<input class="editor-control" data-path="${path}" type="text" value="${escapeHtml(value)}">`;
  return `<label class="editor-field editor-field--wide"><span class="editor-field__label">${label}</span>${control}${help ? `<span class="editor-field__help">${help}</span>` : ''}</label>`;
}

function section(index: number, title: string, description: string, body: string, open = false): string {
  return `<details class="editor-section" ${open ? 'open' : ''}>
    <summary class="editor-section__summary"><span class="editor-section__number">${String(index).padStart(2, '0')}</span><span class="editor-section__heading"><strong>${title}</strong><small>${description}</small></span><span class="editor-section__chevron">⌄</span></summary>
    <div class="editor-section__content"><div class="editor-grid">${body}</div></div>
  </details>`;
}

function listField(label: string, path: string, values: string[]): string {
  return field(label, path, values.join('\n'), true, 'Каждая строка — отдельный пункт.');
}

function render(page: TrademarkPage): string {
  const hero = page.hero;
  const contacts = page.contacts;
  const application = page.application;
  return `<form id="trademark-page-editor" class="entrepreneur-editor home-editor">
    <div id="form-message" class="entrepreneur-editor__message"></div>
    <div class="entrepreneur-editor__layout">
      <aside class="entrepreneur-editor__nav">
        <p class="entrepreneur-editor__nav-title">Товарный знак</p>
        ${['SEO и герой', 'Регистрация', 'Классы МКТУ', 'Правила', 'Лицензирование', 'Качество и нарушения', 'FAQ', 'Контакты'].map((label, index) => `<a href="#tm-${index + 1}">${String(index + 1).padStart(2, '0')}. ${label}</a>`).join('')}
      </aside>
      <div class="entrepreneur-editor__sections">
        <div class="entrepreneur-editor__actions standalone-editor__actions"><button class="editor-button editor-button--primary" type="submit">Сохранить страницу</button><a class="editor-button" href="/tovarnyy-znak-marshrut-postroen" target="_blank" rel="noopener">Открыть страницу ↗</a></div>
        <div id="tm-1">${section(1, 'SEO и герой', 'Заголовки, описание и кнопки первого экрана.', `
          ${field('SEO-заголовок', 'seoTitle', page.seoTitle)}${field('SEO-описание', 'seoDescription', page.seoDescription, true)}${field('Дата обновления', 'lastUpdated', page.lastUpdated)}
          ${field('Надзаголовок', 'hero.eyebrow', hero.eyebrow || '')}${field('Крупный заголовок', 'hero.title', hero.title || '', true, 'Каждый Enter создаёт новую строку.')}${field('Подзаголовок', 'hero.subtitle', hero.subtitle || '', true)}${field('Вводный текст', 'hero.intro', hero.intro || '', true)}
          ${field('Кнопка заявки', 'hero.primaryButton', hero.primaryButton || '')}${field('Кнопка свидетельства', 'hero.certificateButton', hero.certificateButton || '')}${field('Кнопка сообщения', 'hero.reportButton', hero.reportButton || '')}`, true)}</div>
        <div id="tm-2">${section(2, 'Регистрация и документы', 'Официальные сведения и публичные PDF.', `
          ${field('Заголовок', 'registration.title', page.registration.title)}${field('Alt свидетельства', 'registration.certificateAlt', page.registration.certificateAlt, true)}
          ${page.registration.rows.map((row, index) => `<div class="editor-field editor-field--wide"><strong>Строка ${index + 1}</strong>${field('Название', `registration.rows.${index}.label`, row.label)}${field('Значение', `registration.rows.${index}.value`, row.value)}</div>`).join('')}
          ${documentField('Свидетельство', 'registration.certificateUrl', page.registration.certificateUrl)}${documentField('Приложение с перечнем МКТУ', 'registration.appendixUrl', page.registration.appendixUrl)}`)}</div>
        <div id="tm-3">${section(3, 'Классы МКТУ', 'Краткие описания и полный официальный перечень.', `
          ${field('Заголовок', 'protection.title', page.protection.title)}${field('Вводный текст', 'protection.intro', page.protection.intro, true)}${field('Юридическое примечание', 'protection.notice', page.protection.notice, true)}
          ${page.protection.classes.map((item, index) => `<div class="editor-field editor-field--wide"><strong>Класс ${escapeHtml(item.number)}</strong>${field('Номер', `protection.classes.${index}.number`, item.number)}${field('Название', `protection.classes.${index}.title`, item.title)}${field('Кратко', `protection.classes.${index}.summary`, item.summary, true)}${field('Официальный перечень', `protection.classes.${index}.officialText`, item.officialText, true)}</div>`).join('')}`)}</div>
        <div id="tm-4">${section(4, 'Правила использования', 'Информационные упоминания, лицензия и запреты.', page.rules.map((rule, index) => `<div class="editor-field editor-field--wide"><strong>Блок ${index + 1}</strong>${field('Метка', `rules.${index}.eyebrow`, rule.eyebrow)}${field('Заголовок', `rules.${index}.title`, rule.title)}${field('Введение', `rules.${index}.intro`, rule.intro, true)}${listField('Пункты', `rules.${index}.points`, rule.points)}${field('Примечание', `rules.${index}.note`, rule.note, true)}<label class="editor-field"><span class="editor-field__label">Цвет</span><select class="editor-control" data-path="rules.${index}.tone"><option value="neutral" ${rule.tone === 'neutral' ? 'selected' : ''}>Нейтральный</option><option value="accent" ${rule.tone === 'accent' ? 'selected' : ''}>Красный</option><option value="warning" ${rule.tone === 'warning' ? 'selected' : ''}>Предупреждение</option></select></label></div>`).join(''))}</div>
        <div id="tm-5">${section(5, 'Лицензирование', 'Условия, процесс и пояснение.', `
          ${field('Заголовок', 'licensing.title', page.licensing.title)}${field('Введение', 'licensing.intro', page.licensing.intro, true)}${listField('Условия', 'licensing.points', page.licensing.points)}${field('Заголовок процесса', 'licensing.processTitle', page.licensing.processTitle)}
          ${page.licensing.steps.map((step, index) => `<div class="editor-field editor-field--wide"><strong>Шаг ${index + 1}</strong>${field('Номер', `licensing.steps.${index}.number`, step.number)}${field('Название', `licensing.steps.${index}.title`, step.title)}${field('Описание', `licensing.steps.${index}.text`, step.text, true)}</div>`).join('')}${field('Дисклеймер', 'licensing.disclaimer', page.licensing.disclaimer, true)}`)}</div>
        <div id="tm-6">${section(6, 'Качество и нарушения', 'Требования к лицензиатам и форма сообщения.', `
          ${field('Заголовок качества', 'quality.title', page.quality.title)}${field('Текст качества', 'quality.text', page.quality.text, true)}${listField('Требования качества', 'quality.points', page.quality.points)}
          ${field('Заголовок нарушения', 'violation.title', page.violation.title)}${field('Текст нарушения', 'violation.text', page.violation.text, true)}${listField('Что приложить', 'violation.requirements', page.violation.requirements)}${field('Текст кнопки', 'violation.button', page.violation.button)}${field('Дисклеймер', 'violation.disclaimer', page.violation.disclaimer, true)}`)}</div>
        <div id="tm-7">${section(7, 'FAQ', 'Вопросы и ответы на публичной странице.', `${field('Заголовок FAQ', 'faqTitle', page.faqTitle)}${page.faqItems.map((item, index) => `<div class="editor-field editor-field--wide"><strong>Вопрос ${index + 1}</strong>${field('Вопрос', `faqItems.${index}.question`, item.question)}${field('Ответ', `faqItems.${index}.answer`, item.answer, true)}</div>`).join('')}`)}</div>
        <div id="tm-8">${section(8, 'Контакты и заявка', 'Реквизиты правообладателя и служебные тексты.', `
          ${Object.entries(contacts).map(([key, value]) => field(contactLabels[key] || key, `contacts.${key}`, value, ['legalAddress', 'postalAddress', 'disclaimer'].includes(key))).join('')}
          ${field('Заголовок заявки', 'application.title', application.title || '')}${field('Вводный текст заявки', 'application.intro', application.intro || '', true)}${field('Текст после отправки', 'application.successText', application.successText || '', true)}${field('Юридическая строка футера', 'footerLegalText', page.footerLegalText, true)}`)}</div>
        <div class="entrepreneur-editor__actions standalone-editor__actions"><button class="editor-button editor-button--primary" type="submit">Сохранить страницу</button></div>
      </div>
    </div>
  </form>`;
}

const contactLabels: Record<string, string> = {
  title: 'Заголовок', rightsHolder: 'Правообладатель', ogrn: 'ОГРН', inn: 'ИНН', legalAddress: 'Юридический адрес', postalAddress: 'Почтовый адрес', licenseEmail: 'Почта для лицензий', violationEmail: 'Почта для нарушений', phone: 'Телефон', disclaimer: 'Дисклеймер',
};

function documentField(label: string, path: string, value: string): string {
  return `<div class="editor-field editor-field--wide"><span class="editor-field__label">${label}</span><input class="editor-control" data-path="${path}" type="text" value="${escapeHtml(value)}"><label class="editor-button editor-button--primary">Загрузить PDF<input type="file" accept="application/pdf,.pdf" data-document-target="${path}" hidden></label></div>`;
}

function setAtPath(target: Record<string, unknown>, path: string, value: string): void {
  const parts = path.split('.');
  let current: unknown = target;
  parts.forEach((part, index) => {
    if (index === parts.length - 1) {
      (current as Record<string, unknown>)[part] = (part === 'points' || part === 'requirements') ? value.split('\n').map((item) => item.trim()).filter(Boolean) : value;
      return;
    }
    current = Array.isArray(current) ? current[Number(part)] : (current as Record<string, unknown>)[part];
  });
}

function collect(form: HTMLFormElement, source: TrademarkPage): TrademarkPage {
  const result = structuredClone(source);
  form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('[data-path]').forEach((control) => setAtPath(result, control.dataset.path || '', control.value));
  return result;
}

export function trademarkPageView(user?: UserInfo | null) {
  const html = layout('Страница «Товарный знак»', '<div class="text-gray-500">Загрузка…</div>', user);
  async function init() {
    const root = document.getElementById('page-content');
    if (!root) return;
    try {
      let page = await api.trademarkPage.get<TrademarkPage>();
      root.innerHTML = render(page);
      const form = root.querySelector<HTMLFormElement>('#trademark-page-editor')!;
      const message = root.querySelector<HTMLElement>('#form-message')!;
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        try {
          page = collect(form, page);
          await api.settings.update({ TRADEMARK_PAGE_JSON: JSON.stringify(page) });
          message.innerHTML = pageAlert('Страница сохранена.');
        } catch (error) {
          message.innerHTML = pageAlert(error instanceof Error ? error.message : 'Не удалось сохранить страницу.', 'error');
        }
      });
      form.querySelectorAll<HTMLInputElement>('[data-document-target]').forEach((input) => input.addEventListener('change', async () => {
        const file = input.files?.[0];
        const path = input.dataset.documentTarget;
        if (!file || !path) return;
        try {
          const uploaded = await api.uploadDocument(file);
          const target = form.querySelector<HTMLInputElement>(`[data-path="${path}"]`);
          if (target) { target.value = uploaded.url; target.dispatchEvent(new Event('input', { bubbles: true })); }
          message.innerHTML = pageAlert('PDF загружен. Сохраните страницу.');
        } catch (error) {
          message.innerHTML = pageAlert(error instanceof Error ? error.message : 'Не удалось загрузить PDF.', 'error');
        }
      }));
    } catch (error) {
      root.innerHTML = pageAlert(error instanceof Error ? error.message : 'Не удалось загрузить страницу.', 'error');
    }
  }
  return { html, init };
}
