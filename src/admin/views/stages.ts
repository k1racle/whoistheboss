import { api, type Settings } from '../api.js';
import { layout, escapeHtml, pageAlert, type UserInfo } from './layout.js';

interface StageItem {
  index: string;
  title: string;
  subtitle: string;
  eyebrow: string;
  description: string;
}

const defaultStages: StageItem[] = [
  { index: '01', title: 'Подготовка', subtitle: 'и сбор материалов', eyebrow: '[ как начинается проект ]', description: 'Знакомимся с героем и собираем материалы.' },
  { index: '02', title: 'Съемочный', subtitle: 'процесс', eyebrow: '[ фундамент проекта ]', description: 'Проводим интервью и съемку бизнеса.' },
  { index: '03', title: 'Создание', subtitle: 'материалов', eyebrow: '[ визуализация ]', description: 'Готовим видео, фотографии и тексты.' },
  { index: '04', title: 'Публикация', subtitle: 'и продвижение', eyebrow: '[ реализация проекта ]', description: 'Публикуем и распространяем готовые материалы.' },
];

export function stagesView(user?: UserInfo | null) {
  const html = layout('Этапы', '<div class="admin-loading">Загрузка редактора…</div>', user);

  async function init() {
    try {
      const settings = await api.settings.get();
      setContent(renderStagesEditor(settings));
      attachStagesEditor();
    } catch (error) {
      setContent(pageAlert(error instanceof Error ? error.message : 'Не удалось загрузить этапы', 'error'));
    }
  }

  return { html, init };
}

function renderStagesEditor(settings: Settings): string {
  const stages = parseStages(settings.HOME_STAGES_JSON);
  return `
    <form id="stages-form" class="standalone-editor">
      <div id="form-message"></div>
      <section class="editor-section standalone-editor__section">
        <div class="standalone-editor__header">
          <div>
            <span class="standalone-editor__eyebrow">Общий блок сайта</span>
            <h2>Редактор этапов</h2>
            <p>Изменения применяются во всех местах сайта, где используется блок этапов. Меняйте порядок карточек стрелками.</p>
          </div>
          <div class="standalone-editor__header-actions">
            <button type="button" class="editor-button" data-stage-add>Добавить этап</button>
            <button type="submit" class="editor-button editor-button--primary">Сохранить этапы</button>
          </div>
        </div>
        <label class="editor-field editor-field--wide">
          <span class="editor-field__label">Заголовок блока</span>
          <input class="editor-control" name="HOME_STAGES_TITLE" value="${escapeHtml(settings.HOME_STAGES_TITLE || 'ЭТАПЫ')}">
          <span class="editor-field__help">Большой заголовок над карточками.</span>
        </label>
        <div class="stages-admin-list" data-stages-list>
          ${stages.map(renderStage).join('')}
        </div>
      </section>
      <div class="standalone-editor__actions">
        <span>На странице будут показаны все созданные этапы.</span>
        <button type="submit" class="editor-button editor-button--primary">Сохранить этапы</button>
      </div>
    </form>`;
}

function renderStage(stage: StageItem, index: number): string {
  return `
    <article class="stages-admin-item" data-stage-item>
      <div class="stages-admin-item__head">
        <span class="stages-admin-item__position" data-stage-position>${String(index + 1).padStart(2, '0')}</span>
        <strong>Этап</strong>
        <div class="editor-order-controls">
          <button type="button" class="editor-order-button" data-stage-move="up" title="Выше">↑</button>
          <button type="button" class="editor-order-button" data-stage-move="down" title="Ниже">↓</button>
          <button type="button" class="editor-order-button editor-order-button--remove" data-stage-remove title="Удалить">×</button>
        </div>
      </div>
      <div class="editor-grid">
        <label class="editor-field">
          <span class="editor-field__label">Номер</span>
          <input class="editor-control" data-stage-index value="${escapeHtml(stage.index)}" placeholder="01">
        </label>
        <label class="editor-field">
          <span class="editor-field__label">Заголовок</span>
          <input class="editor-control" data-stage-title value="${escapeHtml(stage.title)}">
        </label>
        <label class="editor-field">
          <span class="editor-field__label">Подзаголовок</span>
          <input class="editor-control" data-stage-subtitle value="${escapeHtml(stage.subtitle)}">
        </label>
        <label class="editor-field">
          <span class="editor-field__label">Метка в скобках</span>
          <input class="editor-control" data-stage-eyebrow value="${escapeHtml(stage.eyebrow)}">
        </label>
        <label class="editor-field editor-field--wide">
          <span class="editor-field__label">Подробное описание</span>
          <textarea class="editor-control" data-stage-description rows="5">${escapeHtml(stage.description)}</textarea>
        </label>
      </div>
    </article>`;
}

function attachStagesEditor() {
  const form = document.getElementById('stages-form') as HTMLFormElement | null;
  const list = document.querySelector<HTMLElement>('[data-stages-list]');
  if (!form || !list) return;

  const sync = () => {
    const items = Array.from(list.querySelectorAll<HTMLElement>('[data-stage-item]'));
    items.forEach((item, index) => {
      const position = item.querySelector<HTMLElement>('[data-stage-position]');
      const up = item.querySelector<HTMLButtonElement>('[data-stage-move="up"]');
      const down = item.querySelector<HTMLButtonElement>('[data-stage-move="down"]');
      if (position) position.textContent = String(index + 1).padStart(2, '0');
      if (up) up.disabled = index === 0;
      if (down) down.disabled = index === items.length - 1;
    });
  };

  document.querySelector<HTMLElement>('[data-stage-add]')?.addEventListener('click', () => {
    const wrapper = document.createElement('div');
    const next = list.querySelectorAll('[data-stage-item]').length + 1;
    wrapper.innerHTML = renderStage({ index: String(next).padStart(2, '0'), title: '', subtitle: '', eyebrow: '', description: '' }, next - 1);
    const item = wrapper.firstElementChild;
    if (item) list.appendChild(item);
    sync();
  });
  list.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const item = target.closest<HTMLElement>('[data-stage-item]');
    if (!item) return;
    if (target.closest('[data-stage-remove]')) {
      item.remove();
    } else {
      const move = target.closest<HTMLElement>('[data-stage-move]')?.dataset.stageMove;
      if (move === 'up' && item.previousElementSibling) list.insertBefore(item, item.previousElementSibling);
      if (move === 'down' && item.nextElementSibling) list.insertBefore(item.nextElementSibling, item);
    }
    sync();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const stages = Array.from(list.querySelectorAll<HTMLElement>('[data-stage-item]')).map((item) => ({
      index: item.querySelector<HTMLInputElement>('[data-stage-index]')?.value.trim() || '',
      title: item.querySelector<HTMLInputElement>('[data-stage-title]')?.value.trim() || '',
      subtitle: item.querySelector<HTMLInputElement>('[data-stage-subtitle]')?.value.trim() || '',
      eyebrow: item.querySelector<HTMLInputElement>('[data-stage-eyebrow]')?.value.trim() || '',
      description: item.querySelector<HTMLTextAreaElement>('[data-stage-description]')?.value.trim() || '',
    }));
    const title = (form.elements.namedItem('HOME_STAGES_TITLE') as HTMLInputElement).value.trim();
    const message = document.getElementById('form-message');
    try {
      await api.settings.update({ HOME_STAGES_TITLE: title, HOME_STAGES_JSON: JSON.stringify(stages) });
      if (message) message.innerHTML = pageAlert('Этапы сохранены');
    } catch (error) {
      if (message) message.innerHTML = pageAlert(error instanceof Error ? error.message : 'Ошибка сохранения', 'error');
    }
  });
  sync();
}

function parseStages(value?: string): StageItem[] {
  try {
    const parsed = JSON.parse(value || '[]');
    return Array.isArray(parsed) && parsed.length ? parsed : defaultStages;
  } catch {
    return defaultStages;
  }
}

function setContent(html: string) {
  const content = document.getElementById('page-content');
  if (content) content.innerHTML = html;
}
