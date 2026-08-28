import { api, type City, type Entrepreneur, type EntrepreneurStorySection } from '../api.js';
import { layout, formatDate, escapeHtml, pageAlert, type UserInfo } from './layout.js';
import { initQuill, getHtml, setHtml } from '../lib/editor.js';
import { attachFormAutosave } from '../lib/formAutosave.js';
import { bindAutoSlug } from '../lib/slug.js';
import { attachSortableList, renderSortableHandle } from '../lib/sortableList.js';

const entrepreneurSectionOptions = [
  ['hero', 'Херо'],
  ['about', 'Меню и фотослайдер'],
  ['shorts', 'Короткие видео'],
  ['more', 'Больше о герое'],
  ['featuredInterview', 'Главное интервью'],
  ['cta', 'Стать участником'],
  ['banner', 'Баннер'],
  ['interviewList', 'Список интервью'],
  ['articles', 'Статьи'],
] as const;

const storySectionTypeLabels: Record<EntrepreneurStorySection['type'], string> = {
  BIOGRAPHY: 'Биография',
  ACCENT: 'Красный текстовый блок',
  PORTRAIT: 'Текст + вертикальное фото',
  WIDE: 'Текст + широкое фото',
};

export function entrepreneursView(user?: UserInfo | null) {
  const html = layout('Предприниматели', renderLoading(), user);

  async function init() {
    try {
      const items = await api.entrepreneurs.list();
      const rows = items.map((item) => renderRow(item)).join('');
      setContent(`
        <div class="mb-4 flex justify-end">
          <a href="/admin/entrepreneurs/new" class="inline-flex items-center px-4 py-2 bg-terracotta text-white text-sm font-medium rounded-sm hover:bg-terracotta-600" data-link>Добавить</a>
        </div>
        <div class="bg-white border border-gray-200 rounded-sm overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Имя</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Должность</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дата</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Действия</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">${rows || emptyRow()}</tbody>
          </table>
        </div>
      `);
      attachActions(items);
    } catch (err) {
      setContent(pageAlert(err instanceof Error ? err.message : 'Ошибка загрузки', 'error'));
    }
  }

  function renderRow(item: Entrepreneur): string {
    return `
      <tr data-id="${item.id}">
        <td class="px-4 py-3 text-sm font-medium text-gray-900">
          ${item.photo ? `<img src="${escapeHtml(item.photo)}" class="w-8 h-8 rounded-full object-cover inline-block mr-2 align-middle" alt="">` : ''}
          ${escapeHtml(item.name)}
        </td>
        <td class="px-4 py-3 text-sm text-gray-600">${escapeHtml(item.title)}</td>
        <td class="px-4 py-3 text-sm">${statusBadge(item.isPublished)}</td>
        <td class="px-4 py-3 text-sm text-gray-500">${formatDate(item.createdAt)}</td>
        <td class="px-4 py-3 text-sm text-right space-x-2">
          <a href="/admin/entrepreneurs/${item.id}/edit" class="text-terracotta hover:underline" data-link>Изменить</a>
          <button class="text-[#DB2A00] hover:underline delete-btn" data-id="${item.id}">Удалить</button>
        </td>
      </tr>
    `;
  }

  function attachActions(items: Entrepreneur[]) {
    document.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const id = (e.currentTarget as HTMLButtonElement).dataset.id;
        const item = items.find((i) => i.id === id);
        if (!id || !item) return;
        if (!confirm(`Удалить «${item.name}»?`)) return;
        try {
          await api.entrepreneurs.delete(id);
          init();
        } catch (err) {
          alert(err instanceof Error ? err.message : 'Ошибка удаления');
        }
      });
    });
  }

  return { html, init };
}

export function entrepreneurFormView(id: string | null, user?: UserInfo | null) {
  const isEdit = id !== null;
  const html = layout(isEdit ? 'Редактировать предпринимателя' : 'Новый предприниматель', renderForm({}, []), user);

  async function init() {
    let item: Entrepreneur | undefined;
    try {
      const [cities, loadedItem] = await Promise.all([
        api.cities.list(),
        isEdit && id ? api.entrepreneurs.get(id) : Promise.resolve(undefined),
      ]);
      item = loadedItem;
      setContent(renderForm(item || {}, cities));
    } catch (err) {
      setContent(pageAlert(err instanceof Error ? err.message : 'Ошибка загрузки', 'error'));
      return;
    }
    initQuill('bio');
    attachFeaturedInterviewVideoTypeToggle();
    if (item) fillForm(item);
    attachSectionNavigation();
    attachSectionOrderEditor('entrepreneur-form');
    attachMediaEditor();
    attachStorySections();
    bindAutoSlug('entrepreneur-form', 'name');
    attachSubmit(id, item?.updatedAt);
  }

  return { html, init };
}

function renderForm(item: Partial<Entrepreneur>, cities: City[]): string {
  const sectionVisibility = parseVisibility(item.sectionVisibility);
  const sectionOrder = parseSectionOrder(item.sectionOrder, entrepreneurSectionOptions.map(([key]) => key));
  const orderedSectionOptions = sectionOrder.map((key) => entrepreneurSectionOptions.find(([optionKey]) => optionKey === key)!);
  const field = (
    label: string,
    name: string,
    value: string | null | undefined,
    options: { textarea?: boolean; rows?: number; help?: string; required?: boolean; wide?: boolean; placeholder?: string } = {}
  ) => `
    <div class="editor-field${options.wide ? ' editor-field--wide' : ''}">
      <label for="${name}" class="editor-field__label">${label}${options.required ? ' <span class="text-[#DB2A00]">*</span>' : ''}</label>
      ${options.textarea
        ? `<textarea id="${name}" name="${name}" rows="${options.rows || 4}" placeholder="${escapeHtml(options.placeholder || '')}" class="editor-control">${escapeHtml(value || '')}</textarea>`
        : `<input id="${name}" type="text" name="${name}" value="${escapeHtml(value || '')}" placeholder="${escapeHtml(options.placeholder || '')}" ${options.required ? 'required' : ''} class="editor-control">`
      }
      ${options.help ? `<p class="editor-field__help">${options.help}</p>` : ''}
    </div>
  `;

  const mediaField = (
    label: string,
    name: string,
    fileName: string,
    value: string | null | undefined,
    help: string
  ) => `
    <div class="editor-field editor-field--wide media-field" data-media-field data-media-kind="image">
      <div class="media-field__heading">
        <div>
          <span class="editor-field__label">${label}</span>
          <p class="editor-field__help">${help}</p>
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
          <input type="file" name="${fileName}" accept="image/*" class="sr-only" data-media-file>
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

  const galleryField = (
    label: string,
    name: string,
    value: string | null | undefined,
    help: string
  ) => `
    <div class="editor-field editor-field--wide gallery-field" data-gallery-field>
      <span class="editor-field__label">${label}</span>
      <p class="editor-field__help">${help}</p>
      <textarea name="${name}" class="sr-only" data-gallery-value>${escapeHtml(value || '')}</textarea>
      <div class="gallery-field__items" data-gallery-items></div>
      <div class="gallery-field__actions">
        <input type="file" accept="image/*" multiple class="sr-only" data-gallery-file>
        <button type="button" class="editor-button editor-button--primary" data-gallery-upload>Добавить фото</button>
        <button type="button" class="editor-button" data-gallery-library>Выбрать загруженное</button>
      </div>
    </div>
  `;

  const section = (id: string, number: string, title: string, description: string, content: string, open = false) => `
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

  return `
    <form id="entrepreneur-form" class="entrepreneur-editor">
      <div id="form-message" class="entrepreneur-editor__message"></div>
      <div class="entrepreneur-editor__layout">
        <aside class="entrepreneur-editor__nav">
          <p class="entrepreneur-editor__nav-title">Разделы страницы</p>
          <a href="#editor-visibility">00. Видимость блоков</a>
          <a href="#editor-main">01. Основное</a>
          <a href="#editor-hero">02. Херо</a>
          <a href="#editor-about">03. Меню и галерея</a>
          <a href="#editor-stories">04. Секции с текстом</a>
          <a href="#editor-more">08. Больше</a>
          <a href="#editor-interview">09. Интервью</a>
          <a href="#editor-extra">10. Дополнительно</a>
        </aside>
        <div class="entrepreneur-editor__sections">
          ${section('editor-visibility', '00', 'Видимость блоков', 'Включайте только те блоки, которые должны отображаться на странице героя.', `
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
          `, true)}

          ${section('editor-main', '01', 'Основное', 'Имя героя, адрес страницы, должность и главная фотография.', `
            ${field('Имя и фамилия', 'name', item.name, { required: true, help: 'Выводится в заголовках и карточках героя.' })}
            ${field('Адрес страницы (формируется автоматически)', 'slug', item.slug, { required: true, help: 'Создаётся из имени латиницей. При совпадении адресов система добавит номер.' })}
            ${field('Должность / подпись', 'title', item.title, { help: 'Короткая роль героя: «Управляющий партнер». Поле можно оставить пустым.' })}
            <fieldset class="editor-field editor-field--wide">
              <legend class="editor-field__label">Города присутствия <span class="text-[#DB2A00]">*</span></legend>
              <p class="editor-field__help">Предприниматель может показываться сразу в нескольких городских разделах.</p>
              <div class="mt-3 grid gap-2 sm:grid-cols-2">
                ${cities.map(city => `<label class="flex min-h-11 items-center gap-3 border border-gray-200 px-3 py-2 text-sm"><input type="checkbox" name="cityIds" value="${city.id}"><span>${escapeHtml(city.name)} <small class="text-gray-500">/${escapeHtml(city.slug)}</small></span></label>`).join('') || '<p class="text-sm text-[#DB2A00]">Сначала добавьте город в разделе «Города присутствия».</p>'}
              </div>
            </fieldset>
            ${field('Цитата', 'quote', item.quote, { help: 'Используется как запасной тизер в блоках страницы.' })}
            ${mediaField('Главное фото героя', 'photo', 'photoFile', item.photo, 'Основной портрет для карточки героя и связанных блоков. Рекомендуется вертикальное изображение.')}
          `, true)}

          ${section('editor-hero', '02', 'Херо', 'Первый полноэкранный блок страницы. Имя берётся из раздела «Основное».', `
            ${field('Текст слева', 'heroLeftTeaser', item.heroLeftTeaser, { textarea: true, rows: 3, help: 'Небольшая подпись слева от фамилии.' })}
            ${field('Текст справа сверху', 'heroRightTeaser', item.heroRightTeaser, { textarea: true, rows: 3, help: 'Подпись справа от строки «МАРШРУТ ПОСТРОЕН».' })}
            ${field('Текст справа снизу', 'heroBottomRightTeaser', item.heroBottomRightTeaser, { textarea: true, rows: 3, help: 'Дополнительная подпись в правой нижней части херо.' })}
            ${field('Бегущая строка', 'heroMarquee', item.heroMarquee, { textarea: true, rows: 3, help: 'Текст на красной полосе внизу херо. Если оставить пустым, соберётся автоматически.', wide: true })}
          `)}

          ${section('editor-about', '03', 'Меню и фотослайдер', 'Полноэкранный блок после херо: карточки навигации слева, фотографии справа.', `
            ${field('Вступительное описание', 'aboutIntroDescription', item.aboutIntroDescription, { textarea: true, rows: 4, help: 'Поясняющий текст над блоком.', wide: true })}
            ${field('Дополнительные карточки меню', 'aboutMenuLabels', item.aboutMenuLabels, { textarea: true, rows: 4, help: 'Две строки: «Статьи» и «Контакты». Карточки текстовых секций редактируются внутри самих секций.' })}
            ${field('Описания дополнительных карточек', 'aboutMenuDescriptions', item.aboutMenuDescriptions, { textarea: true, rows: 4, help: 'Две строки в том же порядке: описание для «Статей» и для «Контактов».' })}
            ${galleryField('Фотографии слайдера', 'aboutGalleryPhotos', item.aboutGalleryPhotos, 'Фото меняются при наведении на пункты меню. Расположите их в том же порядке, что карточки.')}
          `)}

          ${section('editor-stories', '04', 'Секции с текстом', 'Добавляйте нужные секции, выбирая один из четырёх вариантов оформления.', `
            <div class="editor-field editor-field--wide story-sections-editor">
              <div class="story-sections-editor__list" data-story-list></div>
              <p class="story-sections-editor__empty" data-story-empty>Секций пока нет. Выберите тип и нажмите «Добавить секцию».</p>
              <div class="story-sections-editor__actions">
                <label>
                  <span class="editor-field__label">Тип новой секции</span>
                  <select class="editor-control" data-story-type-select>
                    <option value="" selected disabled>Выберите тип оформления</option>
                    ${Object.entries(storySectionTypeLabels).map(([value, label]) => `<option value="${value}">${label}</option>`).join('')}
                  </select>
                </label>
                <button type="button" class="editor-button editor-button--primary" data-story-add disabled>Добавить секцию</button>
              </div>
            </div>
          `)}

          ${section('editor-more', '08', 'Больше о герое', 'Красные карточки ссылок и широкая фотография перед интервью.', `
            ${field('Тексты четырёх карточек', 'moreCardTitles', item.moreCardTitles, { textarea: true, rows: 6, help: 'Ровно четыре строки: одна строка — одна карточка.' })}
            ${field('Ссылки четырёх карточек', 'moreCardLinks', item.moreCardLinks, { textarea: true, rows: 6, help: 'Ровно четыре строки в том же порядке. Допустимы относительные и полные ссылки.' })}
            ${mediaField('Широкая фотография', 'morePhoto', 'morePhotoFile', item.morePhoto, 'Фото во втором ряду, занимает ширину двух карточек.')}
          `)}

          ${section('editor-interview', '09', 'Главное интервью', 'Полноэкранный видеоблок «Смотреть интервью».', `
            <div class="editor-field editor-field--wide">
              <span class="editor-field__label">Источник видео</span>
              <p class="editor-field__help">Вставьте ссылку VK / iframe или загрузите собственный видеофайл.</p>
              <div class="editor-segmented">
                <label><input type="radio" name="featuredInterviewVideoType" value="EMBED" ${(item.featuredInterviewVideoType || 'EMBED') === 'EMBED' ? 'checked' : ''}><span>Ссылка / VK</span></label>
                <label><input type="radio" name="featuredInterviewVideoType" value="SELF_HOSTED" ${item.featuredInterviewVideoType === 'SELF_HOSTED' ? 'checked' : ''}><span>Загрузить файл</span></label>
              </div>
            </div>
            <div id="featuredInterviewVideoUrl-field" class="editor-field editor-field--wide">
              <label class="editor-field__label" for="featuredInterviewVideoUrl">Ссылка на видео</label>
              <input id="featuredInterviewVideoUrl" type="text" name="featuredInterviewVideoUrl" value="${escapeHtml(item.featuredInterviewVideoUrl || '')}" placeholder="Ссылка VK Video, embed-код или URL" class="editor-control">
              <p class="editor-field__help">Для VK можно вставить обычную ссылку на ролик или ссылку из кода для вставки.</p>
            </div>
            <div id="featuredInterviewVideoFile-field" class="editor-field editor-field--wide hidden">
              <label class="editor-field__label">Загруженный видеофайл</label>
              <input type="text" name="featuredInterviewVideoFile" value="${escapeHtml(item.featuredInterviewVideoFile || '')}" readonly class="editor-control">
              <input type="file" name="featuredInterviewVideoFileUpload" accept="video/*" class="editor-file-input">
              <p class="editor-field__help">Рекомендуется MP4 (H.264), горизонтальное видео 16:9.</p>
            </div>
          `)}

          ${section('editor-extra', '10', 'Дополнительно', 'Резервные материалы и расширенное описание.', `
            ${mediaField('Фото при наведении', 'hoverPhoto', 'hoverPhotoFile', item.hoverPhoto, 'Резервное изображение для состояний наведения на карточках героя.')}
            ${galleryField('Дополнительная галерея', 'galleryPhotos', item.galleryPhotos, 'Общая галерея героя. Используйте её для дополнительных материалов, не входящих в фотослайдер меню.')}
            <div class="editor-field editor-field--wide">
              <label class="editor-field__label">Расширенная биография</label>
              <p class="editor-field__help">Текст для дополнительных материалов и старых шаблонов. Форматирование сохраняется.</p>
              <input type="hidden" name="bio">
              <div id="editor-bio" class="bg-white">${item.bio || ''}</div>
            </div>
          `)}

          <div class="entrepreneur-editor__publish">
            <label class="editor-switch">
              <input type="checkbox" name="isPublished" id="isPublished" ${item.isPublished ? 'checked' : ''}>
              <span class="editor-switch__track"></span>
              <span><strong>Опубликовать страницу</strong><small>Если выключено, герой останется черновиком.</small></span>
            </label>
          </div>
        </div>
      </div>
      <div class="entrepreneur-editor__actions">
        <span class="entrepreneur-editor__save-note">Изменения появятся на странице после сохранения</span>
        <a href="/admin/entrepreneurs" class="editor-button" data-link>Отмена</a>
        <button type="submit" class="editor-button editor-button--primary editor-button--save">Сохранить</button>
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

function createStorySection(type: EntrepreneurStorySection['type']): EntrepreneurStorySection {
  const id = globalThis.crypto?.randomUUID?.() || `story-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const base = {
    id,
    isVisible: true,
    menuLabel: storySectionTypeLabels[type],
    menuDescription: '',
    menuImage: null,
  };

  if (type === 'BIOGRAPHY') {
    return { ...base, type, eyebrow: '', title: '', textOne: '', textTwo: '', textThree: '', image: null };
  }
  if (type === 'ACCENT') return { ...base, type, title: '', textOne: '', textTwo: '' };
  if (type === 'PORTRAIT') return { ...base, type, title: '', text: '', asideText: '', image: null };
  return { ...base, type, title: '', text: '', bottomText: '', image: null };
}

function normalizeAdminStorySections(item: Entrepreneur): EntrepreneurStorySection[] {
  if (Array.isArray(item.storySections)) return item.storySections;

  const labels = (item.aboutMenuLabels || '').split(/\r?\n/).map(value => value.trim());
  const descriptions = (item.aboutMenuDescriptions || '').split(/\r?\n/).map(value => value.trim());
  const gallery = (item.aboutGalleryPhotos || item.galleryPhotos || '').split(/\r?\n|,/).map(value => value.trim()).filter(Boolean);
  const fallbackImage = item.photo || gallery[0] || null;
  const biographyFallback = stripHtml(item.bio || item.quote || '');

  return [
    {
      id: 'legacy-biography',
      type: 'BIOGRAPHY',
      isVisible: parseVisibility(item.sectionVisibility).biography !== false,
      menuLabel: labels[0] || 'Биография',
      menuDescription: descriptions[0] || '',
      menuImage: null,
      eyebrow: '',
      title: '',
      textOne: item.biographyTextOne || '',
      textTwo: item.biographyTextTwo || '',
      textThree: item.biographyTextThree || '',
      image: item.biographyPhoto || null,
    },
    {
      id: 'legacy-childhood',
      type: 'ACCENT',
      isVisible: parseVisibility(item.sectionVisibility).childhood !== false,
      menuLabel: labels[1] || 'Краткая биография',
      menuDescription: descriptions[1] || 'Детство, интересы и обстоятельства, которые сформировали взгляд на дело.',
      menuImage: gallery[1] || fallbackImage,
      title: item.childhoodTitle || '',
      textOne: item.childhoodTextOne || biographyFallback,
      textTwo: item.childhoodTextTwo || '',
    },
    {
      id: 'legacy-education',
      type: 'PORTRAIT',
      isVisible: parseVisibility(item.sectionVisibility).education !== false,
      menuLabel: labels[2] || 'Начало карьеры',
      menuDescription: descriptions[2] || 'Образование, первые роли и профессиональный опыт.',
      menuImage: gallery[2] || fallbackImage,
      title: item.educationTitle || '',
      text: item.educationText || biographyFallback || item.title,
      asideText: item.educationAsideText || '',
      image: item.educationPhoto || fallbackImage,
    },
    {
      id: 'legacy-turnover',
      type: 'WIDE',
      isVisible: parseVisibility(item.sectionVisibility).turnover !== false,
      menuLabel: labels[3] || 'Первые успехи в бизнесе',
      menuDescription: descriptions[3] || 'Решения, которые привели к первым заметным результатам.',
      menuImage: gallery[3] || fallbackImage,
      title: item.turnoverTitle || '',
      text: item.turnoverText || biographyFallback || item.title,
      bottomText: item.turnoverBottomText || '',
      image: item.turnoverPhoto || fallbackImage,
    },
  ];
}

function stripHtml(value: string): string {
  const element = document.createElement('div');
  element.innerHTML = value;
  return element.textContent?.replace(/\s+/g, ' ').trim() || '';
}

function getAdditionalMenuLines(value: string | null | undefined): string {
  const lines = (value || '').split(/\r?\n/);
  return (lines.length >= 6 ? lines.slice(4, 6) : lines.slice(0, 2)).join('\n');
}

function renderStoryTextField(label: string, field: string, value: string, rows = 4): string {
  return `
    <label class="editor-field">
      <span class="editor-field__label">${label}</span>
      <textarea rows="${rows}" class="editor-control" data-story-field="${field}">${escapeHtml(value)}</textarea>
    </label>
  `;
}

function renderStoryMediaField(
  label: string,
  value: string | null,
  kind: 'section' | 'menu',
  help?: string,
): string {
  const valueAttribute = kind === 'section' ? 'data-story-image' : 'data-story-menu-image';
  const fileAttribute = kind === 'section' ? 'data-story-image-file' : 'data-story-menu-image-file';

  return `
    <div class="editor-field editor-field--wide media-field" data-media-field>
      <div class="media-field__heading">
        <div>
          <span class="editor-field__label">${label}</span>
          ${help ? `<p class="editor-field__help">${help}</p>` : ''}
        </div>
        <span class="media-field__status" data-media-status>${value ? 'Изображение выбрано' : 'Не выбрано'}</span>
      </div>
      <div class="media-field__body">
        <div class="media-field__preview" data-media-preview></div>
        <div class="media-field__controls">
          <input type="hidden" value="${escapeHtml(value || '')}" data-media-url ${valueAttribute}>
          <input type="file" accept="image/*" class="sr-only" data-media-file ${fileAttribute}>
          <button type="button" class="editor-button editor-button--primary" data-media-upload>Загрузить фото</button>
          <button type="button" class="editor-button" data-media-library>Выбрать загруженное</button>
          <button type="button" class="editor-button editor-button--danger" data-media-clear>Убрать</button>
          <details class="media-field__url">
            <summary>Указать URL вручную</summary>
            <input type="text" value="${escapeHtml(value || '')}" class="editor-control" data-media-url-proxy>
          </details>
        </div>
      </div>
    </div>
  `;
}

function renderStoryImageField(section: { image: string | null }): string {
  return renderStoryMediaField('Фото секции', section.image, 'section');
}

function renderStoryMenuImageField(section: { menuImage: string | null }): string {
  return renderStoryMediaField(
    'Фото карточки меню',
    section.menuImage,
    'menu',
    'Это изображение показывается справа при наведении на соответствующий пункт меню.',
  );
}

function renderStorySectionRow(section: EntrepreneurStorySection, index: number): string {
  let fields: string;
  if (section.type === 'BIOGRAPHY') {
    fields = [
      renderStoryTextField('Надзаголовок (необязательно)', 'eyebrow', section.eyebrow, 2),
      renderStoryTextField('Заголовок', 'title', section.title, 2),
      renderStoryTextField('Первый текст', 'textOne', section.textOne, 6),
      renderStoryTextField('Второй текст', 'textTwo', section.textTwo, 6),
      renderStoryTextField('Третий текст', 'textThree', section.textThree, 6),
      renderStoryImageField(section),
    ].join('');
  } else if (section.type === 'ACCENT') {
    fields = [
      renderStoryTextField('Заголовок', 'title', section.title, 3),
      renderStoryTextField('Первый текст', 'textOne', section.textOne, 7),
      renderStoryTextField('Второй текст', 'textTwo', section.textTwo, 7),
    ].join('');
  } else if (section.type === 'PORTRAIT') {
    fields = [
      renderStoryTextField('Заголовок', 'title', section.title, 4),
      renderStoryTextField('Основной текст', 'text', section.text, 8),
      renderStoryTextField('Текст рядом с кнопкой', 'asideText', section.asideText, 5),
      renderStoryImageField(section),
    ].join('');
  } else {
    fields = [
      renderStoryTextField('Заголовок', 'title', section.title, 4),
      renderStoryTextField('Верхний текст справа', 'text', section.text, 7),
      renderStoryTextField('Нижний текст справа', 'bottomText', section.bottomText, 7),
      renderStoryImageField(section),
    ].join('');
  }

  return `
    <article class="story-section-row" data-story-section data-story-id="${escapeHtml(section.id)}" data-story-type="${section.type}">
      <div class="story-section-row__header">
        <span class="story-section-row__number" data-story-number>${String(index + 1).padStart(2, '0')}</span>
        <strong>${storySectionTypeLabels[section.type]}</strong>
        <button type="button" class="editor-button editor-button--danger" data-story-remove>Удалить секцию</button>
      </div>
      <div class="story-section-row__menu">
        ${renderStoryTextField('Название карточки меню', 'menuLabel', section.menuLabel, 2)}
        ${renderStoryTextField('Описание карточки меню', 'menuDescription', section.menuDescription, 3)}
        ${renderStoryMenuImageField(section)}
      </div>
      <div class="editor-grid">${fields}</div>
    </article>
  `;
}

function renderStorySections(sections: EntrepreneurStorySection[]) {
  const list = document.querySelector<HTMLElement>('[data-story-list]');
  if (!list) return;
  list.innerHTML = sections.map(renderStorySectionRow).join('');
  updateStorySectionsState();
}

function updateStorySectionsState() {
  const list = document.querySelector<HTMLElement>('[data-story-list]');
  document.querySelector<HTMLElement>('[data-story-empty]')?.classList.toggle('hidden', Boolean(list?.children.length));
  list?.querySelectorAll<HTMLElement>('[data-story-section]').forEach((row, index) => {
    const number = row.querySelector<HTMLElement>('[data-story-number]');
    if (number) number.textContent = String(index + 1).padStart(2, '0');
  });
}

function storyOrderKey(id: string): string {
  return `story:${id}`;
}

function renderOrderItem(key: string, label: string, visible: boolean, storyId?: string): string {
  const inputName = storyId ? `story_visible_${storyId}` : `section_${key}`;
  return `
    <div class="editor-order-item" data-section-order-item data-section-key="${escapeHtml(key)}"${storyId ? ` data-story-order-id="${escapeHtml(storyId)}"` : ''}>
      <label class="editor-switch">
        <input type="checkbox" name="${escapeHtml(inputName)}" ${visible ? 'checked' : ''}>
        <span class="editor-switch__track"></span>
        <span><strong>${escapeHtml(label)}</strong><small>Показывать блок на публичной странице</small></span>
      </label>
      <div class="editor-order-controls">${renderSortableHandle('Перетащить блок')}</div>
    </div>
  `;
}

function normalizeEditorSectionOrder(raw: string | null | undefined, stories: EntrepreneurStorySection[]): string[] {
  const storyKeys = stories.map(section => storyOrderKey(section.id));
  const defaults = [
    'hero',
    'about',
    ...storyKeys.slice(0, 3),
    'shorts',
    ...storyKeys.slice(3),
    'more',
    'featuredInterview',
    'cta',
    'banner',
    'interviewList',
    'articles',
  ];
  const legacyMap: Record<string, string> = {
    biography: 'story:legacy-biography',
    childhood: 'story:legacy-childhood',
    education: 'story:legacy-education',
    turnover: 'story:legacy-turnover',
  };
  const allowed = new Set(defaults);
  let saved: string[] = [];
  try {
    const parsed = JSON.parse(raw || '[]');
    if (Array.isArray(parsed)) {
      saved = parsed
        .filter((key): key is string => typeof key === 'string')
        .map(key => legacyMap[key] || key)
        .filter((key, index, values) => allowed.has(key) && values.indexOf(key) === index);
    }
  } catch {
    saved = [];
  }
  return [...saved, ...defaults.filter(key => !saved.includes(key))];
}

function renderSectionOrderItems(
  form: HTMLFormElement,
  stories: EntrepreneurStorySection[],
  visibility: Record<string, boolean>,
  rawOrder: string | null | undefined,
) {
  const list = form.querySelector<HTMLElement>('[data-section-order-list]');
  const value = form.querySelector<HTMLInputElement>('[data-section-order-value]');
  if (!list || !value) return;
  const storyMap = new Map(stories.map(section => [storyOrderKey(section.id), section]));
  const fixedLabels = new Map<string, string>(entrepreneurSectionOptions);
  const order = normalizeEditorSectionOrder(rawOrder, stories);

  list.innerHTML = order.map((key) => {
    const story = storyMap.get(key);
    if (story) return renderOrderItem(key, `${storySectionTypeLabels[story.type]} — ${story.menuLabel}`, story.isVisible, story.id);
    return renderOrderItem(key, fixedLabels.get(key) || key, visibility[key] !== false);
  }).join('');
  value.value = JSON.stringify(order);
}

let bindDynamicMediaField: ((field: HTMLElement) => void) | null = null;
let syncSectionOrderEditor: (() => void) | null = null;

function attachStorySections() {
  const form = document.getElementById('entrepreneur-form') as HTMLFormElement | null;
  const list = form?.querySelector<HTMLElement>('[data-story-list]');
  const addButton = form?.querySelector<HTMLButtonElement>('[data-story-add]');
  const typeSelect = form?.querySelector<HTMLSelectElement>('[data-story-type-select]');
  const orderList = form?.querySelector<HTMLElement>('[data-section-order-list]');
  if (!form || !list || !addButton || !typeSelect || !orderList) return;

  typeSelect.addEventListener('change', () => {
    addButton.disabled = !typeSelect.value;
  });

  addButton.addEventListener('click', () => {
    if (!typeSelect.value) return;
    const type = typeSelect.value as EntrepreneurStorySection['type'];
    const section = createStorySection(type);
    list.insertAdjacentHTML('beforeend', renderStorySectionRow(section, list.children.length));
    const row = list.lastElementChild as HTMLElement | null;
    row?.querySelectorAll<HTMLElement>('[data-media-field]').forEach(field => bindDynamicMediaField?.(field));

    const orderItem = renderOrderItem(
      storyOrderKey(section.id),
      `${storySectionTypeLabels[section.type]} — ${section.menuLabel}`,
      true,
      section.id,
    );
    const moreItem = orderList.querySelector<HTMLElement>('[data-section-key="more"]');
    if (moreItem) moreItem.insertAdjacentHTML('beforebegin', orderItem);
    else orderList.insertAdjacentHTML('beforeend', orderItem);
    updateStorySectionsState();
    syncSectionOrderEditor?.();
    typeSelect.value = '';
    addButton.disabled = true;
  });

  list.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLElement>('[data-story-remove]');
    const row = button?.closest<HTMLElement>('[data-story-section]');
    if (!button || !row) return;
    const id = row.dataset.storyId || '';
    if (!confirm('Удалить эту текстовую секцию?')) return;
    row.remove();
    orderList.querySelector<HTMLElement>(`[data-story-order-id="${CSS.escape(id)}"]`)?.remove();
    updateStorySectionsState();
    syncSectionOrderEditor?.();
  });
}

function fillForm(item: Entrepreneur) {
  const form = document.getElementById('entrepreneur-form') as HTMLFormElement | null;
  if (!form) return;
  const selectedCityIds = new Set(item.cityLinks?.map(link => link.cityId) || []);
  form.querySelectorAll<HTMLInputElement>('input[name="cityIds"]').forEach((input) => {
    input.checked = selectedCityIds.has(input.value);
  });

  form.querySelector<HTMLInputElement>('input[name="name"]')!.value = item.name;
  form.querySelector<HTMLInputElement>('input[name="slug"]')!.value = item.slug;
  form.querySelector<HTMLInputElement>('input[name="title"]')!.value = item.title;
  form.querySelector<HTMLTextAreaElement>('textarea[name="heroLeftTeaser"]')!.value = item.heroLeftTeaser || '';
  form.querySelector<HTMLTextAreaElement>('textarea[name="heroRightTeaser"]')!.value = item.heroRightTeaser || '';
  form.querySelector<HTMLTextAreaElement>('textarea[name="heroBottomRightTeaser"]')!.value = item.heroBottomRightTeaser || '';
  form.querySelector<HTMLTextAreaElement>('textarea[name="heroMarquee"]')!.value = item.heroMarquee || '';
  form.querySelector<HTMLTextAreaElement>('textarea[name="aboutIntroDescription"]')!.value = item.aboutIntroDescription || '';
  form.querySelector<HTMLTextAreaElement>('textarea[name="aboutMenuLabels"]')!.value = getAdditionalMenuLines(item.aboutMenuLabels);
  form.querySelector<HTMLTextAreaElement>('textarea[name="aboutMenuDescriptions"]')!.value = getAdditionalMenuLines(item.aboutMenuDescriptions);
  form.querySelector<HTMLTextAreaElement>('textarea[name="moreCardTitles"]')!.value = item.moreCardTitles || '';
  form.querySelector<HTMLTextAreaElement>('textarea[name="moreCardLinks"]')!.value = item.moreCardLinks || '';
  form.querySelector<HTMLInputElement>('input[name="morePhoto"]')!.value = item.morePhoto || '';
  form.querySelector<HTMLInputElement>(`input[name="featuredInterviewVideoType"][value="${item.featuredInterviewVideoType || 'EMBED'}"]`)!.checked = true;
  form.querySelector<HTMLInputElement>('input[name="featuredInterviewVideoUrl"]')!.value = item.featuredInterviewVideoUrl || '';
  form.querySelector<HTMLInputElement>('input[name="featuredInterviewVideoFile"]')!.value = item.featuredInterviewVideoFile || '';
  form.querySelector<HTMLInputElement>('input[name="photo"]')!.value = item.photo || '';
  form.querySelector<HTMLTextAreaElement>('textarea[name="aboutGalleryPhotos"]')!.value = item.aboutGalleryPhotos || '';
  form.querySelector<HTMLTextAreaElement>('textarea[name="galleryPhotos"]')!.value = item.galleryPhotos || '';
  form.querySelector<HTMLInputElement>('input[name="hoverPhoto"]')!.value = item.hoverPhoto || '';
  setHtml('bio', item.bio || '');
  form.querySelector<HTMLInputElement>('input[name="quote"]')!.value = item.quote || '';
  const visibility = parseVisibility(item.sectionVisibility);
  const storySections = normalizeAdminStorySections(item);
  renderStorySections(storySections);
  renderSectionOrderItems(form, storySections, visibility, item.sectionOrder);
  form.querySelector<HTMLInputElement>('input[name="isPublished"]')!.checked = item.isPublished;
  syncFeaturedInterviewVideoFields(item.featuredInterviewVideoType || 'EMBED');
}

function attachFeaturedInterviewVideoTypeToggle() {
  const form = document.getElementById('entrepreneur-form') as HTMLFormElement | null;
  if (!form) return;
  form.querySelectorAll<HTMLInputElement>('input[name="featuredInterviewVideoType"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      const type = form.querySelector<HTMLInputElement>('input[name="featuredInterviewVideoType"]:checked')?.value as 'EMBED' | 'SELF_HOSTED';
      syncFeaturedInterviewVideoFields(type || 'EMBED');
    });
  });
  const initialType = form.querySelector<HTMLInputElement>('input[name="featuredInterviewVideoType"]:checked')?.value as 'EMBED' | 'SELF_HOSTED';
  syncFeaturedInterviewVideoFields(initialType || 'EMBED');
}

function syncFeaturedInterviewVideoFields(type: 'EMBED' | 'SELF_HOSTED') {
  const urlField = document.getElementById('featuredInterviewVideoUrl-field');
  const fileField = document.getElementById('featuredInterviewVideoFile-field');
  if (!urlField || !fileField) return;
  if (type === 'EMBED') {
    urlField.classList.remove('hidden');
    fileField.classList.add('hidden');
  } else {
    urlField.classList.add('hidden');
    fileField.classList.remove('hidden');
  }
}

function attachSectionNavigation() {
  document.querySelectorAll<HTMLAnchorElement>('.entrepreneur-editor__nav a').forEach((link) => {
    link.addEventListener('click', () => {
      const section = document.querySelector<HTMLDetailsElement>(link.hash);
      if (section) section.open = true;
    });
  });
}

function attachMediaEditor() {
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

  const closeLibrary = () => {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('media-library-open');
    selectMedia = null;
  };

  modal?.querySelectorAll<HTMLElement>('[data-media-close]').forEach((button) => button.addEventListener('click', closeLibrary));
  libraryGrid?.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-library-url]');
    if (!button || !selectMedia) return;
    selectMedia(button.dataset.libraryUrl || '');
    closeLibrary();
  });

  const bindMediaField = (field: HTMLElement) => {
    if (field.dataset.mediaBound === 'true') return;
    const urlInput = field.querySelector<HTMLInputElement>('[data-media-url]');
    const fileInput = field.querySelector<HTMLInputElement>('[data-media-file]');
    const proxy = field.querySelector<HTMLInputElement>('[data-media-url-proxy]');
    if (!urlInput || !fileInput) return;
    field.dataset.mediaBound = 'true';

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
  };

  bindDynamicMediaField = bindMediaField;
  document.querySelectorAll<HTMLElement>('[data-media-field]').forEach(bindMediaField);

  document.querySelectorAll<HTMLElement>('[data-gallery-field]').forEach((field) => {
    const valueInput = field.querySelector<HTMLTextAreaElement>('[data-gallery-value]');
    const items = field.querySelector<HTMLElement>('[data-gallery-items]');
    const fileInput = field.querySelector<HTMLInputElement>('[data-gallery-file]');
    if (!valueInput || !items || !fileInput) return;

    const readUrls = () => valueInput.value.split(/\r?\n/).map((url) => url.trim()).filter(Boolean);
    const writeUrls = (urls: string[]) => {
      valueInput.value = urls.join('\n');
      renderItems();
    };
    const renderItems = () => {
      const urls = readUrls();
      items.innerHTML = urls.length
        ? urls.map((url, index) => `
            <div class="gallery-field__item">
              <img src="${escapeHtml(url)}" alt="">
              <button type="button" data-gallery-remove="${index}" aria-label="Удалить">×</button>
              <span>${index + 1}</span>
            </div>
          `).join('')
        : '<div class="gallery-field__empty">Фотографии ещё не добавлены</div>';
    };

    renderItems();
    items.addEventListener('click', (event) => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-gallery-remove]');
      if (!button) return;
      const urls = readUrls();
      urls.splice(Number(button.dataset.galleryRemove), 1);
      writeUrls(urls);
    });
    field.querySelector<HTMLElement>('[data-gallery-upload]')?.addEventListener('click', () => fileInput.click());
    field.querySelector<HTMLElement>('[data-gallery-library]')?.addEventListener('click', () => {
      openLibrary((url) => writeUrls([...readUrls(), url]));
    });
    fileInput.addEventListener('change', async () => {
      const files = Array.from(fileInput.files || []);
      if (!files.length) return;
      const uploadButton = field.querySelector<HTMLButtonElement>('[data-gallery-upload]');
      if (uploadButton) {
        uploadButton.disabled = true;
        uploadButton.textContent = 'Загрузка…';
      }
      try {
        const uploaded = [];
        for (const file of files) uploaded.push((await api.uploadImage(file)).url);
        writeUrls([...readUrls(), ...uploaded]);
        mediaPromise = null;
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Не удалось загрузить изображения');
      } finally {
        fileInput.value = '';
        if (uploadButton) {
          uploadButton.disabled = false;
          uploadButton.textContent = 'Добавить фото';
        }
      }
    });
  });
}

function attachSubmit(id: string | null, initialUpdatedAt?: string) {
  const form = document.getElementById('entrepreneur-form') as HTMLFormElement | null;
  if (!form) return;
  let currentId = id;
  let expectedUpdatedAt = initialUpdatedAt;

  const autosave = attachFormAutosave({
    form,
    available: () => Boolean(currentId),
    canAutosave: () => !hasSelectedFiles(form),
    blockedMessage: 'Сначала сохраните выбранные файлы вручную',
    save: async () => {
      const bioHtml = getHtml('bio');
      const data = await collectFormData(form, bioHtml);
      if (currentId) {
        const updated = await api.entrepreneurs.update(currentId, { ...data, expectedUpdatedAt });
        expectedUpdatedAt = updated.updatedAt;
        return;
      }
      const created = await api.entrepreneurs.create(data);
      currentId = created.id;
      expectedUpdatedAt = created.updatedAt;
    },
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById('form-message');
    if (msg) msg.innerHTML = '';

    try {
      await autosave.saveNow();
      if (msg) msg.innerHTML = pageAlert('Предприниматель сохранён');
    } catch (err) {
      if (msg) {
        msg.innerHTML = pageAlert(err instanceof Error ? err.message : 'Ошибка сохранения', 'error');
      }
    }
  });
}

function hasSelectedFiles(form: HTMLFormElement): boolean {
  return Array.from(form.querySelectorAll<HTMLInputElement>('input[type="file"]'))
    .some((input) => Boolean(input.files?.length));
}

async function collectStorySections(form: HTMLFormElement): Promise<EntrepreneurStorySection[]> {
  const rows = Array.from(form.querySelectorAll<HTMLElement>('[data-story-section]'));
  const sections: EntrepreneurStorySection[] = [];

  for (const row of rows) {
    const id = row.dataset.storyId || '';
    const type = row.dataset.storyType as EntrepreneurStorySection['type'];
    const field = (name: string) => row.querySelector<HTMLTextAreaElement>(`[data-story-field="${name}"]`)?.value.trim() || '';
    const imageInput = row.querySelector<HTMLInputElement>('[data-story-image]');
    const imageFile = row.querySelector<HTMLInputElement>('[data-story-image-file]')?.files?.[0];
    let image = imageInput?.value.trim() || null;
    if (imageFile) image = (await api.uploadImage(imageFile)).url;
    const isVisible = form.querySelector<HTMLInputElement>(`input[name="story_visible_${CSS.escape(id)}"]`)?.checked !== false;
    const menuImageInput = row.querySelector<HTMLInputElement>('[data-story-menu-image]');
    const menuImageFile = row.querySelector<HTMLInputElement>('[data-story-menu-image-file]')?.files?.[0];
    let menuImage = menuImageInput?.value.trim() || null;
    if (menuImageFile) menuImage = (await api.uploadImage(menuImageFile)).url;
    const base = {
      id,
      isVisible,
      menuLabel: field('menuLabel'),
      menuDescription: field('menuDescription'),
      menuImage,
    };

    if (type === 'BIOGRAPHY') {
      sections.push({
        ...base,
        type,
        eyebrow: field('eyebrow'),
        title: field('title'),
        textOne: field('textOne'),
        textTwo: field('textTwo'),
        textThree: field('textThree'),
        image,
      });
    } else if (type === 'ACCENT') {
      sections.push({ ...base, type, title: field('title'), textOne: field('textOne'), textTwo: field('textTwo') });
    } else if (type === 'PORTRAIT') {
      sections.push({ ...base, type, title: field('title'), text: field('text'), asideText: field('asideText'), image });
    } else if (type === 'WIDE') {
      sections.push({ ...base, type, title: field('title'), text: field('text'), bottomText: field('bottomText'), image });
    }
  }

  return sections;
}

async function collectFormData(form: HTMLFormElement, bioHtml: string): Promise<Partial<Entrepreneur>> {
  const fd = new FormData(form);
  const cityIds = fd.getAll('cityIds').map(String).filter(Boolean);
  if (!cityIds.length) throw new Error('Выберите хотя бы один город присутствия');

  const photoFile = fd.get('photoFile') as File | null;
  let photo = (fd.get('photo') as string) || null;
  if (photoFile && photoFile.size > 0) {
    const uploaded = await api.uploadImage(photoFile);
    photo = uploaded.url;
  }

  const hoverPhotoFile = fd.get('hoverPhotoFile') as File | null;
  let hoverPhoto = (fd.get('hoverPhoto') as string) || null;
  if (hoverPhotoFile && hoverPhotoFile.size > 0) {
    const uploaded = await api.uploadImage(hoverPhotoFile);
    hoverPhoto = uploaded.url;
  }

  const morePhotoFile = fd.get('morePhotoFile') as File | null;
  let morePhoto = (fd.get('morePhoto') as string) || null;
  if (morePhotoFile && morePhotoFile.size > 0) {
    const uploaded = await api.uploadImage(morePhotoFile);
    morePhoto = uploaded.url;
  }

  const featuredInterviewVideoType = (fd.get('featuredInterviewVideoType') as 'EMBED' | 'SELF_HOSTED') || 'EMBED';
  const featuredInterviewVideoFileUpload = fd.get('featuredInterviewVideoFileUpload') as File | null;
  let featuredInterviewVideoFile = (fd.get('featuredInterviewVideoFile') as string) || null;
  if (featuredInterviewVideoType === 'SELF_HOSTED' && featuredInterviewVideoFileUpload && featuredInterviewVideoFileUpload.size > 0) {
    const uploaded = await api.uploadVideo(featuredInterviewVideoFileUpload);
    featuredInterviewVideoFile = uploaded.url;
  }

  const storySections = await collectStorySections(form);

  return {
    cityIds,
    name: fd.get('name') as string,
    slug: fd.get('slug') as string,
    title: fd.get('title') as string,
    heroLeftTeaser: (fd.get('heroLeftTeaser') as string) || null,
    heroRightTeaser: (fd.get('heroRightTeaser') as string) || null,
    heroBottomRightTeaser: (fd.get('heroBottomRightTeaser') as string) || null,
    heroMarquee: (fd.get('heroMarquee') as string) || null,
    aboutIntroDescription: (fd.get('aboutIntroDescription') as string) || null,
    aboutMenuLabels: (fd.get('aboutMenuLabels') as string) || null,
    aboutMenuDescriptions: (fd.get('aboutMenuDescriptions') as string) || null,
    storySections,
    moreCardTitles: (fd.get('moreCardTitles') as string) || null,
    moreCardLinks: (fd.get('moreCardLinks') as string) || null,
    morePhoto,
    featuredInterviewVideoType,
    featuredInterviewVideoUrl: featuredInterviewVideoType === 'EMBED' ? (fd.get('featuredInterviewVideoUrl') as string) || null : null,
    featuredInterviewVideoFile: featuredInterviewVideoType === 'SELF_HOSTED' ? featuredInterviewVideoFile : null,
    photo,
    aboutGalleryPhotos: (fd.get('aboutGalleryPhotos') as string) || null,
    galleryPhotos: (fd.get('galleryPhotos') as string) || null,
    hoverPhoto,
    bio: bioHtml || null,
    quote: (fd.get('quote') as string) || null,
    sectionVisibility: JSON.stringify(Object.fromEntries(
      entrepreneurSectionOptions.map(([key]) => [key, fd.has(`section_${key}`)])
    )),
    sectionOrder: (fd.get('sectionOrder') as string) || JSON.stringify(entrepreneurSectionOptions.map(([key]) => key)),
    isPublished: fd.has('isPublished'),
  };
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

function attachSectionOrderEditor(formId: string) {
  const form = document.getElementById(formId) as HTMLFormElement | null;
  const list = form?.querySelector<HTMLElement>('[data-section-order-list]');
  const value = form?.querySelector<HTMLInputElement>('[data-section-order-value]');
  if (!list || !value) return;

  const sync = () => {
    value.value = JSON.stringify(Array.from(list.querySelectorAll<HTMLElement>('[data-section-order-item]')).map((item) => item.dataset.sectionKey || ''));
  };
  syncSectionOrderEditor = sync;
  attachSortableList({
    list,
    itemSelector: '[data-section-order-item]',
    onChange: sync,
  });
}

function setContent(html: string) {
  const pageContent = document.getElementById('page-content');
  if (pageContent) pageContent.innerHTML = html;
}

function renderLoading(): string {
  return `<div class="text-gray-500">Загрузка…</div>`;
}

function emptyRow(): string {
  return `<tr><td colspan="5" class="px-4 py-8 text-center text-gray-500">Нет записей</td></tr>`;
}

function statusBadge(published: boolean): string {
  return published
    ? '<span class="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Опубликовано</span>'
    : '<span class="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Черновик</span>';
}
