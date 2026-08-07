import { api, type Business, type Entrepreneur } from '../api.js';
import { layout, escapeHtml, pageAlert, type UserInfo } from './layout.js';
import { initQuill, getHtml, setHtml } from '../lib/editor.js';
import { attachFormAutosave } from '../lib/formAutosave.js';
import { bindAutoSlug } from '../lib/slug.js';

const businessSectionOptions = [
  ['hero', 'Херо'],
  ['manifest', 'Эксперимент'],
  ['titleBand', 'Красный блок «О компании»'],
  ['about', 'О компании'],
  ['founder', 'Основатель'],
  ['ownerBiography', 'Биография предпринимателя'],
  ['specs', 'Характеристики'],
  ['addresses', 'Адреса'],
  ['awards', 'Достижения'],
  ['facts', 'Интересные факты'],
  ['gallery', 'Галерея'],
  ['more', 'Больше'],
  ['related', 'Читайте также'],
  ['cta', 'Стать участником'],
  ['banner', 'Баннер'],
] as const;

export function businessesView(user?: UserInfo | null) {
  const html = layout('Компании', renderLoading(), user);

  async function init() {
    try {
      const items = await api.businesses.list();
      const rows = items.map((item) => renderRow(item)).join('');
      setContent(`
        <div class="mb-4 flex justify-end">
          <a href="/admin/businesses/new" class="inline-flex items-center px-4 py-2 bg-terracotta text-white text-sm font-medium rounded-sm hover:bg-terracotta-600" data-link>Добавить</a>
        </div>
        <div class="bg-white border border-gray-200 rounded-sm overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Название</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Подпись карточки</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Предприниматель</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Город</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
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

  function renderRow(item: Business): string {
    return `
      <tr data-id="${item.id}">
        <td class="px-4 py-3 text-sm font-medium text-gray-900">${escapeHtml(item.name)}</td>
        <td class="px-4 py-3 text-sm text-gray-600">${escapeHtml(item.type)}</td>
        <td class="px-4 py-3 text-sm text-gray-600">${escapeHtml(item.entrepreneur?.name || '—')}</td>
        <td class="px-4 py-3 text-sm text-gray-600">${escapeHtml(item.city || '—')}</td>
        <td class="px-4 py-3 text-sm">${statusBadge(item.isPublished)}</td>
        <td class="px-4 py-3 text-sm text-right space-x-2">
          <a href="/admin/businesses/${item.id}/edit" class="text-terracotta hover:underline" data-link>Изменить</a>
          <button class="text-[#DB2A00] hover:underline delete-btn" data-id="${item.id}">Удалить</button>
        </td>
      </tr>
    `;
  }

  function attachActions(items: Business[]) {
    document.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const id = (e.currentTarget as HTMLButtonElement).dataset.id;
        const item = items.find((i) => i.id === id);
        if (!id || !item) return;
        if (!confirm(`Удалить «${item.name}»?`)) return;
        try {
          await api.businesses.delete(id);
          init();
        } catch (err) {
          alert(err instanceof Error ? err.message : 'Ошибка удаления');
        }
      });
    });
  }

  return { html, init };
}

export function businessFormView(id: string | null, user?: UserInfo | null) {
  const isEdit = id !== null;
  const html = layout(isEdit ? 'Редактировать компанию' : 'Новая компания', renderForm({}, []), user);

  async function init() {
    try {
      const entrepreneurs = await api.entrepreneurs.list();
      setContent(renderForm({}, entrepreneurs));
      initQuill('description');
      if (isEdit && id) {
        const item = await api.businesses.get(id);
        fillForm(item);
      }
      bindAutoSlug('business-form', 'name');
      attachSubmit(id);
      attachSectionOrderEditor('business-form');
    } catch (err) {
      setContent(pageAlert(err instanceof Error ? err.message : 'Ошибка загрузки', 'error'));
    }
  }

  return { html, init };
}

function renderForm(item: Partial<Business>, entrepreneurs: Entrepreneur[]): string {
  const specItems = parseBusinessSpecs(item.specsItems);
  const awardItems = parseBusinessAwards(item.awardsItems);
  const galleryImages = parseBusinessGallery(item.galleryImages);
  const sectionVisibility = parseBusinessVisibility(item.sectionVisibility);
  const sectionOrder = parseSectionOrder(item.sectionOrder, businessSectionOptions.map(([key]) => key));
  const orderedSectionOptions = sectionOrder.map((key) => businessSectionOptions.find(([optionKey]) => optionKey === key)!);
  const field = (
    label: string,
    name: string,
    value: string | null | undefined,
    options: { textarea?: boolean; rows?: number; help?: string; required?: boolean; wide?: boolean; placeholder?: string; type?: string } = {}
  ) => `
    <div class="editor-field${options.wide ? ' editor-field--wide' : ''}">
      <label for="${name}" class="editor-field__label">${label}${options.required ? ' <span class="text-[#DB2A00]">*</span>' : ''}</label>
      ${options.textarea
        ? `<textarea id="${name}" name="${name}" rows="${options.rows || 4}" placeholder="${escapeHtml(options.placeholder || '')}" class="editor-control">${escapeHtml(value || '')}</textarea>`
        : `<input id="${name}" type="${options.type || 'text'}" name="${name}" value="${escapeHtml(value || '')}" placeholder="${escapeHtml(options.placeholder || '')}" ${options.required ? 'required' : ''} class="editor-control">`
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
    <div class="editor-field editor-field--wide media-field" data-business-media-field>
      <div class="media-field__heading">
        <div>
          <span class="editor-field__label">${label}</span>
          <p class="editor-field__help">${help}</p>
        </div>
        <span class="media-field__status" data-business-media-status>${value ? 'Изображение выбрано' : 'Не выбрано'}</span>
      </div>
      <div class="media-field__body">
        <div class="media-field__preview" data-business-media-preview>
          ${value
            ? `<img src="${escapeHtml(value)}" alt=""><span>Текущее изображение</span>`
            : '<div class="media-field__empty"><strong>Нет изображения</strong><span>Загрузите файл или укажите URL</span></div>'}
        </div>
        <div class="media-field__controls">
          <input type="text" name="${name}" value="${escapeHtml(value || '')}" placeholder="/uploads/photo.jpg или https://…" class="editor-control" data-business-media-url>
          <input type="file" name="${fileName}" accept="image/*" class="editor-file-input" data-business-media-file>
          <button type="button" class="editor-button editor-button--danger" data-business-media-clear>Убрать</button>
        </div>
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
    <form id="business-form" class="entrepreneur-editor">
      <div id="form-message" class="entrepreneur-editor__message"></div>
      <div class="entrepreneur-editor__layout">
        <aside class="entrepreneur-editor__nav">
          <p class="entrepreneur-editor__nav-title">Разделы страницы</p>
          <a href="#business-editor-visibility">00. Видимость блоков</a>
          <a href="#business-editor-main">01. Основное</a>
          <a href="#business-editor-hero">02. Херо</a>
          <a href="#business-editor-manifest">03. Эксперимент</a>
          <a href="#business-editor-about">04. О компании</a>
          <a href="#business-editor-about-layout">05. Блок «О компании»</a>
          <a href="#business-editor-founder">06. Основатель</a>
          <a href="#business-editor-specs">07. Характеристики</a>
          <a href="#business-editor-addresses">08. Адреса</a>
          <a href="#business-editor-awards">09. Достижения</a>
          <a href="#business-editor-facts">10. Команда и факты</a>
          <a href="#business-editor-gallery">11. Галерея</a>
          <a href="#business-editor-more">12. Больше</a>
          <a href="#business-editor-related">13. Читайте также</a>
        </aside>
        <div class="entrepreneur-editor__sections">
          ${section('business-editor-visibility', '00', 'Видимость блоков', 'Включайте только те разделы, которые нужны на публичной странице компании.', `
            <div class="editor-field editor-field--wide">
              <input type="hidden" name="sectionOrder" value="${escapeHtml(JSON.stringify(sectionOrder))}" data-section-order-value>
              <div class="editor-visibility-grid editor-order-list" data-section-order-list>
                ${orderedSectionOptions.map(([key, label]) => `
                  <div class="editor-order-item" data-section-order-item data-section-key="${key}">
                    <label class="editor-switch">
                      <input type="checkbox" name="section_${key}" ${(key === 'awards' && sectionVisibility[key] === undefined ? item.awardsEnabled !== false : sectionVisibility[key] !== false) ? 'checked' : ''}>
                      <span class="editor-switch__track"></span>
                      <span><strong>${label}</strong><small>Показывать блок на публичной странице</small></span>
                    </label>
                    <div class="editor-order-controls">
                      <button type="button" class="editor-order-button" data-order-direction="up" aria-label="Поднять блок">↑</button>
                      <button type="button" class="editor-order-button" data-order-direction="down" aria-label="Опустить блок">↓</button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `, true)}

          ${section('business-editor-main', '01', 'Основное', 'Название, адрес страницы, подпись карточки и связанный предприниматель.', `
            ${field('Название компании', 'name', item.name, { required: true, help: 'Формирует большой заголовок херо и название карточки.' })}
            ${field('Адрес страницы (формируется автоматически)', 'slug', item.slug, { required: true, help: 'Создаётся из названия латиницей. При совпадении адресов система добавит номер.' })}
            ${field('Подпись карточки', 'type', item.type, { required: true, help: 'Короткий текст внизу карточки на странице «Компании».' })}
            <div class="editor-field">
              <label for="entrepreneurId" class="editor-field__label">Предприниматель <span class="text-[#DB2A00]">*</span></label>
              <select id="entrepreneurId" name="entrepreneurId" required class="editor-control">
                <option value="">Выберите предпринимателя</option>
                ${entrepreneurs.map((e) => `<option value="${e.id}">${escapeHtml(e.name)}</option>`).join('')}
              </select>
              <p class="editor-field__help">Связывает компанию со страницей основателя.</p>
            </div>
          `, true)}

          ${section('business-editor-hero', '02', 'Херо', 'Первый полноэкранный блок страницы компании. Заголовок берётся из названия.', `
            ${field('Мелкий текст в херо', 'heroTeaser', item.heroTeaser, {
              textarea: true,
              rows: 4,
              help: 'Выводится рядом со второй строкой большого названия. Можно использовать переносы строк.'
            })}
            ${field('Бегущая строка', 'heroMarquee', item.heroMarquee, {
              textarea: true,
              rows: 4,
              help: 'Текст на красной полосе внизу херо. Если поле пустое, строка соберётся автоматически из названия и подписи.',
              wide: true
            })}
          `)}

          ${section('business-editor-manifest', '03', 'Эксперимент', 'Блок сразу после херо: фоновое изображение, квадратное фото и четыре текстовых элемента.', `
            ${field('Заголовок блока', 'manifestTitle', item.manifestTitle, {
              textarea: true,
              rows: 3,
              help: 'Крупный заголовок под изображениями.',
              wide: true
            })}
            ${field('Первый текст', 'manifestTextOne', item.manifestTextOne, {
              textarea: true,
              rows: 5,
              help: 'Центральный текст сразу под заголовком.'
            })}
            ${field('Второй текст', 'manifestTextTwo', item.manifestTextTwo, {
              textarea: true,
              rows: 5,
              help: 'Нижний текст слева от логотипа.'
            })}
            ${field('Третий текст', 'manifestTextThree', item.manifestTextThree, {
              textarea: true,
              rows: 5,
              help: 'Нижний текст справа от логотипа.'
            })}
            ${mediaField('Фоновое изображение', 'manifestBackgroundImage', 'manifestBackgroundImageFile', item.manifestBackgroundImage, 'Широкий фон верхней части блока. Если не выбран, используется светло-серый фон.')}
            ${mediaField('Квадратное изображение', 'manifestSquareImage', 'manifestSquareImageFile', item.manifestSquareImage, 'Квадрат по центру нижней границы фона, выступает вниз на 120 px.')}
          `)}

          ${section('business-editor-about', '04', 'О компании', 'Описание, контакты и основное изображение компании.', `
            <div class="editor-field editor-field--wide">
              <label class="editor-field__label">Описание компании</label>
              <p class="editor-field__help">Основной текст для блока «О компании» и метаописания страницы.</p>
              <input type="hidden" name="description">
              <div id="editor-description" class="bg-white">${item.description || ''}</div>
            </div>
            ${field('Город', 'city', item.city)}
            ${field('Адрес', 'address', item.address)}
            ${field('Телефон', 'phone', item.phone)}
            ${field('Email', 'email', item.email, { type: 'email' })}
            ${field('Сайт', 'website', item.website, { type: 'url', wide: true })}
            <div class="editor-field editor-field--wide">
              <span class="editor-field__label">Основное изображение</span>
              <p class="editor-field__help">Используется в карточке компании и текущих фотоблоках страницы. Рекомендуется горизонтальный кадр.</p>
              <div id="company-cover-preview" class="mb-3 aspect-video overflow-hidden border border-gray-200 bg-gray-100">
                <img src="${escapeHtml(item.coverImage || '')}" alt="" class="${item.coverImage ? 'block' : 'hidden'} h-full w-full object-cover">
                <span class="${item.coverImage ? 'hidden' : 'flex'} h-full items-center justify-center text-sm text-gray-400">Изображение не выбрано</span>
              </div>
              <input type="text" name="coverImage" value="${escapeHtml(item.coverImage || '')}" class="editor-control mb-2">
              <input type="file" name="coverImageFile" accept="image/*" class="editor-file-input">
            </div>
          `)}

          ${section('business-editor-about-layout', '05', 'Блок «О компании»', 'По структуре и внешнему виду совпадает с блоком «Образование и опыт» на странице предпринимателя.', `
            ${field('Заголовок', 'aboutTitle', item.aboutTitle, {
              textarea: true,
              rows: 4,
              help: 'Каждая строка выводится отдельно. Третья строка получает дизайнерский отступ.',
              wide: true
            })}
            ${field('Основной текст', 'aboutText', item.aboutText, {
              textarea: true,
              rows: 8,
              help: 'Текст под крупным заголовком.'
            })}
            ${field('Текст рядом с кнопкой', 'aboutAsideText', item.aboutAsideText, {
              textarea: true,
              rows: 5,
              help: 'Нижний текст справа от кнопки «Смотреть интервью».'
            })}
            ${mediaField('Фото блока', 'aboutPhoto', 'aboutPhotoFile', item.aboutPhoto, 'Фотография в правой колонке блока «О компании».')}
          `)}

          ${section('business-editor-founder', '06', 'Основатель', 'Центральное фото и имя связанного предпринимателя. Тексты берутся из его настроек hero.', `
            ${mediaField('Фото основателя', 'founderPhoto', 'founderPhotoFile', item.founderPhoto, 'Вертикальная фотография по центру блока. Если поле пустое, используется основное фото связанного предпринимателя.')}
          `)}

          ${section('business-editor-specs', '07', 'Характеристики', 'Заголовок, пояснение и управляемый список плашек на странице компании.', `
            ${field('Заголовок блока', 'specsTitle', item.specsTitle, {
              textarea: true,
              rows: 3,
              help: 'Крупный заголовок блока. Переносы строк сохраняются.',
              wide: true
            })}
            ${field('Текст под заголовком', 'specsDescription', item.specsDescription, {
              textarea: true,
              rows: 4,
              help: 'Короткое пояснение перед списком характеристик.',
              wide: true
            })}
            <div class="editor-field editor-field--wide business-specs-editor">
              <div class="business-specs-editor__heading">
                <div>
                  <span class="editor-field__label">Плашки характеристик</span>
                  <p class="editor-field__help">Добавляйте и удаляйте строки. Иконка слева принимает SVG или PNG; заголовок и описание выводятся рядом.</p>
                </div>
                <button type="button" class="editor-button editor-button--primary" data-business-spec-add>Добавить плашку</button>
              </div>
              <div class="business-specs-editor__list" data-business-spec-list>
                ${specItems.map((spec, index) => renderBusinessSpecRow(spec, index)).join('')}
              </div>
              <p class="business-specs-editor__empty${specItems.length ? ' hidden' : ''}" data-business-spec-empty>Плашек пока нет. Нажмите «Добавить плашку».</p>
            </div>
          `)}

          ${section('business-editor-addresses', '08', 'Адреса', 'Карта расположения компании на публичной странице.', `
            ${field('Координаты Яндекс Карт', 'mapEmbed', item.mapEmbed, {
              help: 'Укажите широту и долготу через запятую. Старые iframe и прямые ссылки Яндекс Карт с параметром ll продолжат работать.',
              wide: true,
              placeholder: '55.755864, 37.617698'
            })}
          `)}

          ${section('business-editor-awards', '09', 'Достижения', 'Отключаемый блок с наградами и номинациями компании.', `
            ${field('Заголовок блока', 'awardsTitle', item.awardsTitle, {
              textarea: true,
              rows: 3,
              help: 'Крупный заголовок над карточками. Переносы строк сохраняются.',
              wide: true
            })}
            ${field('Текст под заголовком', 'awardsDescription', item.awardsDescription, {
              textarea: true,
              rows: 4,
              help: 'Короткое вступление перед списком наград.',
              wide: true
            })}
            <div class="editor-field editor-field--wide business-specs-editor">
              <div class="business-specs-editor__heading">
                <div>
                  <span class="editor-field__label">Карточки достижений</span>
                  <p class="editor-field__help">Укажите список номинаций в верхнем левом углу, место внизу и загрузите иконку SVG или PNG для верхнего правого угла.</p>
                </div>
                <button type="button" class="editor-button editor-button--primary" data-business-award-add>Добавить карточку</button>
              </div>
              <div class="business-specs-editor__list" data-business-award-list>
                ${awardItems.map((award, index) => renderBusinessAwardRow(award, index)).join('')}
              </div>
              <p class="business-specs-editor__empty${awardItems.length ? ' hidden' : ''}" data-business-award-empty>Достижений пока нет. Нажмите «Добавить карточку».</p>
            </div>
          `)}

          ${section('business-editor-facts', '10', 'Команда и факты', 'Широкий блок с фотографией слева и двумя независимыми текстами справа.', `
            ${field('Заголовок блока', 'factsTitle', item.factsTitle, {
              textarea: true,
              rows: 3,
              help: 'Крупный заголовок над фотографией. Переносы строк сохраняются.',
              wide: true
            })}
            ${field('Подзаголовок', 'factsSubtitle', item.factsSubtitle, {
              textarea: true,
              rows: 3,
              help: 'Короткий текст под заголовком и над фотографией.',
              wide: true
            })}
            ${field('Первый текст справа', 'factsTextOne', item.factsTextOne, {
              textarea: true,
              rows: 6,
              help: 'Верхний текст правой колонки.'
            })}
            ${field('Второй текст справа', 'factsTextTwo', item.factsTextTwo, {
              textarea: true,
              rows: 6,
              help: 'Нижний текст правой колонки, прижатый к низу блока.'
            })}
            ${mediaField('Фотография команды', 'factsPhoto', 'factsPhotoFile', item.factsPhoto, 'Горизонтальная фотография в левой колонке. Рекомендуемое соотношение сторон 16:9.')}
          `)}

          ${section('business-editor-gallery', '11', 'Галерея', 'Горизонтальная прокрутка фотографий в интерфейсе блока «Этапы» с главной страницы.', `
            <div class="editor-field editor-field--wide">
              <div class="business-gallery-editor">
                <div class="business-specs-editor__heading">
                  <div>
                    <span class="editor-field__label">Фотографии галереи</span>
                    <p class="editor-field__help">Добавляйте изображения, меняйте их порядок стрелками и проверяйте кадрирование по миниатюре. На странице каждая фотография занимает отдельную карточку горизонтального скролла.</p>
                  </div>
                  <button type="button" class="editor-button editor-button--primary" data-business-gallery-add>Добавить фотографию</button>
                </div>
                <div class="business-gallery-editor__list" data-business-gallery-list>
                  ${galleryImages.map((image, index) => renderBusinessGalleryRow(image, index)).join('')}
                </div>
                <p class="business-specs-editor__empty${galleryImages.length ? ' hidden' : ''}" data-business-gallery-empty>Фотографий пока нет. Нажмите «Добавить фотографию».</p>
              </div>
            </div>
          `)}

          ${section('business-editor-more', '12', 'Больше', 'Четыре карточки ссылок, широкая фотография и вертикальный заголовок — как в блоке предпринимателя.', `
            ${field('Тексты четырёх карточек', 'moreCardTitles', item.moreCardTitles, {
              textarea: true,
              rows: 6,
              help: 'Ровно четыре строки: одна строка — одна карточка. Эти значения относятся только к данной компании.'
            })}
            ${field('Ссылки четырёх карточек', 'moreCardLinks', item.moreCardLinks, {
              textarea: true,
              rows: 6,
              help: 'Ровно четыре ссылки в том же порядке. Допустимы относительные и полные URL.'
            })}
            ${mediaField('Широкая фотография', 'morePhoto', 'morePhotoFile', item.morePhoto, 'Фото во втором ряду, занимает ширину двух карточек. Настройка не связана с фотографией блока предпринимателя.')}
          `)}

          ${section('business-editor-related', '13', 'Читайте также', 'Три карточки компаний подбираются автоматически: сначала компании этого же предпринимателя, затем остальные опубликованные компании.', `
            ${field('Заголовок блока', 'relatedTitle', item.relatedTitle, {
              help: 'Показывается над карточками. Если оставить пустым, будет использовано «Читайте также».',
              wide: true
            })}
          `)}

          <div class="entrepreneur-editor__publish">
            <label class="editor-switch">
              <input type="checkbox" name="isPublished" id="isPublished" ${item.isPublished ? 'checked' : ''}>
              <span class="editor-switch__track"></span>
              <span><strong>Опубликовать страницу</strong><small>Если выключено, компания останется черновиком.</small></span>
            </label>
          </div>
        </div>
      </div>
      <div class="entrepreneur-editor__actions">
        <span class="entrepreneur-editor__save-note">Изменения появятся на странице после сохранения</span>
        <a href="/admin/businesses" class="editor-button" data-link>Отмена</a>
        <button type="submit" class="editor-button editor-button--primary editor-button--save">Сохранить</button>
      </div>
    </form>
  `;
}

function fillForm(item: Business) {
  const form = document.getElementById('business-form') as HTMLFormElement | null;
  if (!form) return;
  form.querySelector<HTMLInputElement>('input[name="name"]')!.value = item.name;
  form.querySelector<HTMLInputElement>('input[name="slug"]')!.value = item.slug;
  form.querySelector<HTMLInputElement>('input[name="type"]')!.value = item.type;
  form.querySelector<HTMLTextAreaElement>('textarea[name="heroTeaser"]')!.value = item.heroTeaser || '';
  form.querySelector<HTMLTextAreaElement>('textarea[name="heroMarquee"]')!.value = item.heroMarquee || '';
  form.querySelector<HTMLTextAreaElement>('textarea[name="manifestTitle"]')!.value = item.manifestTitle || '';
  form.querySelector<HTMLTextAreaElement>('textarea[name="manifestTextOne"]')!.value = item.manifestTextOne || '';
  form.querySelector<HTMLTextAreaElement>('textarea[name="manifestTextTwo"]')!.value = item.manifestTextTwo || '';
  form.querySelector<HTMLTextAreaElement>('textarea[name="manifestTextThree"]')!.value = item.manifestTextThree || '';
  form.querySelector<HTMLInputElement>('input[name="manifestBackgroundImage"]')!.value = item.manifestBackgroundImage || '';
  form.querySelector<HTMLInputElement>('input[name="manifestSquareImage"]')!.value = item.manifestSquareImage || '';
  updateBusinessMediaPreview('manifestBackgroundImage', item.manifestBackgroundImage || '');
  updateBusinessMediaPreview('manifestSquareImage', item.manifestSquareImage || '');
  form.querySelector<HTMLTextAreaElement>('textarea[name="aboutTitle"]')!.value = item.aboutTitle || '';
  form.querySelector<HTMLTextAreaElement>('textarea[name="aboutText"]')!.value = item.aboutText || '';
  form.querySelector<HTMLTextAreaElement>('textarea[name="aboutAsideText"]')!.value = item.aboutAsideText || '';
  form.querySelector<HTMLInputElement>('input[name="aboutPhoto"]')!.value = item.aboutPhoto || '';
  updateBusinessMediaPreview('aboutPhoto', item.aboutPhoto || '');
  form.querySelector<HTMLInputElement>('input[name="founderPhoto"]')!.value = item.founderPhoto || '';
  updateBusinessMediaPreview('founderPhoto', item.founderPhoto || '');
  form.querySelector<HTMLTextAreaElement>('textarea[name="specsTitle"]')!.value = item.specsTitle || '';
  form.querySelector<HTMLTextAreaElement>('textarea[name="specsDescription"]')!.value = item.specsDescription || '';
  renderBusinessSpecs(parseBusinessSpecs(item.specsItems));
  form.querySelector<HTMLInputElement>('input[name="mapEmbed"]')!.value = item.mapEmbed || '';
  form.querySelector<HTMLTextAreaElement>('textarea[name="awardsTitle"]')!.value = item.awardsTitle || '';
  form.querySelector<HTMLTextAreaElement>('textarea[name="awardsDescription"]')!.value = item.awardsDescription || '';
  renderBusinessAwards(parseBusinessAwards(item.awardsItems));
  form.querySelector<HTMLTextAreaElement>('textarea[name="factsTitle"]')!.value = item.factsTitle || '';
  form.querySelector<HTMLTextAreaElement>('textarea[name="factsSubtitle"]')!.value = item.factsSubtitle || '';
  form.querySelector<HTMLTextAreaElement>('textarea[name="factsTextOne"]')!.value = item.factsTextOne || '';
  form.querySelector<HTMLTextAreaElement>('textarea[name="factsTextTwo"]')!.value = item.factsTextTwo || '';
  form.querySelector<HTMLInputElement>('input[name="factsPhoto"]')!.value = item.factsPhoto || '';
  updateBusinessMediaPreview('factsPhoto', item.factsPhoto || '');
  renderBusinessGallery(parseBusinessGallery(item.galleryImages));
  form.querySelector<HTMLTextAreaElement>('textarea[name="moreCardTitles"]')!.value = item.moreCardTitles || '';
  form.querySelector<HTMLTextAreaElement>('textarea[name="moreCardLinks"]')!.value = item.moreCardLinks || '';
  form.querySelector<HTMLInputElement>('input[name="morePhoto"]')!.value = item.morePhoto || '';
  updateBusinessMediaPreview('morePhoto', item.morePhoto || '');
  form.querySelector<HTMLInputElement>('input[name="relatedTitle"]')!.value = item.relatedTitle || '';
  const visibility = parseBusinessVisibility(item.sectionVisibility);
  businessSectionOptions.forEach(([key]) => {
    const input = form.querySelector<HTMLInputElement>(`input[name="section_${key}"]`);
    if (input) input.checked = key === 'awards' && visibility[key] === undefined
      ? item.awardsEnabled !== false
      : visibility[key] !== false;
  });
  const orderInput = form.querySelector<HTMLInputElement>('[data-section-order-value]');
  if (orderInput) orderInput.value = JSON.stringify(parseSectionOrder(item.sectionOrder, businessSectionOptions.map(([key]) => key)));
  form.querySelector<HTMLSelectElement>('select[name="entrepreneurId"]')!.value = item.entrepreneurId;
  setHtml('description', item.description || '');
  form.querySelector<HTMLInputElement>('input[name="city"]')!.value = item.city || '';
  form.querySelector<HTMLInputElement>('input[name="address"]')!.value = item.address || '';
  form.querySelector<HTMLInputElement>('input[name="phone"]')!.value = item.phone || '';
  form.querySelector<HTMLInputElement>('input[name="email"]')!.value = item.email || '';
  form.querySelector<HTMLInputElement>('input[name="website"]')!.value = item.website || '';
  form.querySelector<HTMLInputElement>('input[name="coverImage"]')!.value = item.coverImage || '';
  updateCoverPreview(item.coverImage || '');
  form.querySelector<HTMLInputElement>('input[name="isPublished"]')!.checked = item.isPublished;
}

function attachSubmit(id: string | null) {
  const form = document.getElementById('business-form') as HTMLFormElement | null;
  if (!form) return;
  attachCoverPreview(form);
  attachBusinessMediaFields(form);
  attachBusinessSpecs(form);
  attachBusinessAwards(form);
  attachBusinessGallery(form);
  const autosave = attachFormAutosave({
    form,
    available: Boolean(id),
    canAutosave: () => !hasSelectedFiles(form),
    blockedMessage: 'Сначала сохраните выбранные файлы вручную',
    save: async () => {
      const descriptionHtml = getHtml('description');
      const data = await collectFormData(form, descriptionHtml);
      if (id) await api.businesses.update(id, data);
      else await api.businesses.create(data);
    },
  });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById('form-message');
    if (msg) msg.innerHTML = '';

    try {
      await autosave.saveNow();
      location.href = '/admin/businesses';
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

function attachCoverPreview(form: HTMLFormElement) {
  const urlInput = form.querySelector<HTMLInputElement>('input[name="coverImage"]');
  const fileInput = form.querySelector<HTMLInputElement>('input[name="coverImageFile"]');

  urlInput?.addEventListener('input', () => updateCoverPreview(urlInput.value.trim()));
  fileInput?.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (!file) {
      updateCoverPreview(urlInput?.value.trim() || '');
      return;
    }
    updateCoverPreview(URL.createObjectURL(file));
  });
}

function updateCoverPreview(src: string) {
  const preview = document.getElementById('company-cover-preview');
  const image = preview?.querySelector<HTMLImageElement>('img');
  const placeholder = preview?.querySelector<HTMLSpanElement>('span');
  if (!image || !placeholder) return;

  image.src = src;
  image.classList.toggle('hidden', !src);
  image.classList.toggle('block', Boolean(src));
  placeholder.classList.toggle('hidden', Boolean(src));
  placeholder.classList.toggle('flex', !src);
}

function attachBusinessMediaFields(form: HTMLFormElement) {
  form.querySelectorAll<HTMLElement>('[data-business-media-field]').forEach((field) => {
    const urlInput = field.querySelector<HTMLInputElement>('[data-business-media-url]');
    const fileInput = field.querySelector<HTMLInputElement>('[data-business-media-file]');
    const clearButton = field.querySelector<HTMLButtonElement>('[data-business-media-clear]');
    const name = urlInput?.name;
    if (!urlInput || !fileInput || !name) return;

    urlInput.addEventListener('input', () => updateBusinessMediaPreview(name, urlInput.value.trim()));
    fileInput.addEventListener('change', () => {
      const file = fileInput.files?.[0];
      updateBusinessMediaPreview(name, file ? URL.createObjectURL(file) : urlInput.value.trim());
    });
    clearButton?.addEventListener('click', () => {
      urlInput.value = '';
      fileInput.value = '';
      updateBusinessMediaPreview(name, '');
    });
  });
}

function updateBusinessMediaPreview(name: string, src: string) {
  const input = document.querySelector<HTMLInputElement>(`input[name="${name}"]`);
  const field = input?.closest<HTMLElement>('[data-business-media-field]');
  const preview = field?.querySelector<HTMLElement>('[data-business-media-preview]');
  const status = field?.querySelector<HTMLElement>('[data-business-media-status]');
  if (!preview || !status) return;

  status.textContent = src ? 'Изображение выбрано' : 'Не выбрано';
  preview.innerHTML = src
    ? `<img src="${escapeHtml(src)}" alt=""><span>Предпросмотр</span>`
    : '<div class="media-field__empty"><strong>Нет изображения</strong><span>Загрузите файл или укажите URL</span></div>';
}

async function collectFormData(form: HTMLFormElement, descriptionHtml: string): Promise<Partial<Business>> {
  const fd = new FormData(form);
  const coverFile = fd.get('coverImageFile') as File | null;
  let coverImage = (fd.get('coverImage') as string) || null;
  if (coverFile && coverFile.size > 0) {
    const uploaded = await api.uploadImage(coverFile);
    coverImage = uploaded.url;
  }
  const manifestBackgroundFile = fd.get('manifestBackgroundImageFile') as File | null;
  let manifestBackgroundImage = (fd.get('manifestBackgroundImage') as string) || null;
  if (manifestBackgroundFile && manifestBackgroundFile.size > 0) {
    const uploaded = await api.uploadImage(manifestBackgroundFile);
    manifestBackgroundImage = uploaded.url;
  }
  const manifestSquareFile = fd.get('manifestSquareImageFile') as File | null;
  let manifestSquareImage = (fd.get('manifestSquareImage') as string) || null;
  if (manifestSquareFile && manifestSquareFile.size > 0) {
    const uploaded = await api.uploadImage(manifestSquareFile);
    manifestSquareImage = uploaded.url;
  }
  const aboutPhotoFile = fd.get('aboutPhotoFile') as File | null;
  let aboutPhoto = (fd.get('aboutPhoto') as string) || null;
  if (aboutPhotoFile && aboutPhotoFile.size > 0) {
    const uploaded = await api.uploadImage(aboutPhotoFile);
    aboutPhoto = uploaded.url;
  }
  const founderPhotoFile = fd.get('founderPhotoFile') as File | null;
  let founderPhoto = (fd.get('founderPhoto') as string) || null;
  if (founderPhotoFile && founderPhotoFile.size > 0) {
    const uploaded = await api.uploadImage(founderPhotoFile);
    founderPhoto = uploaded.url;
  }
  const factsPhotoFile = fd.get('factsPhotoFile') as File | null;
  let factsPhoto = (fd.get('factsPhoto') as string) || null;
  if (factsPhotoFile && factsPhotoFile.size > 0) {
    const uploaded = await api.uploadImage(factsPhotoFile);
    factsPhoto = uploaded.url;
  }
  const morePhotoFile = fd.get('morePhotoFile') as File | null;
  let morePhoto = (fd.get('morePhoto') as string) || null;
  if (morePhotoFile && morePhotoFile.size > 0) {
    const uploaded = await api.uploadImage(morePhotoFile);
    morePhoto = uploaded.url;
  }
  const specsItems = await collectBusinessSpecs(form);
  const awardsItems = await collectBusinessAwards(form);
  const galleryImages = await collectBusinessGallery(form);

  return {
    name: fd.get('name') as string,
    slug: fd.get('slug') as string,
    type: fd.get('type') as string,
    heroTeaser: (fd.get('heroTeaser') as string) || '',
    heroMarquee: (fd.get('heroMarquee') as string) || '',
    manifestTitle: (fd.get('manifestTitle') as string) || '',
    manifestTextOne: (fd.get('manifestTextOne') as string) || '',
    manifestTextTwo: (fd.get('manifestTextTwo') as string) || '',
    manifestTextThree: (fd.get('manifestTextThree') as string) || '',
    manifestBackgroundImage: manifestBackgroundImage || '',
    manifestSquareImage: manifestSquareImage || '',
    aboutTitle: (fd.get('aboutTitle') as string) || '',
    aboutText: (fd.get('aboutText') as string) || '',
    aboutAsideText: (fd.get('aboutAsideText') as string) || '',
    aboutPhoto: aboutPhoto || '',
    founderPhoto: founderPhoto || '',
    specsTitle: (fd.get('specsTitle') as string) || '',
    specsDescription: (fd.get('specsDescription') as string) || '',
    specsItems: JSON.stringify(specsItems),
    mapEmbed: (fd.get('mapEmbed') as string) || '',
    awardsEnabled: fd.has('section_awards'),
    awardsTitle: (fd.get('awardsTitle') as string) || '',
    awardsDescription: (fd.get('awardsDescription') as string) || '',
    awardsItems: JSON.stringify(awardsItems),
    factsTitle: (fd.get('factsTitle') as string) || '',
    factsSubtitle: (fd.get('factsSubtitle') as string) || '',
    factsTextOne: (fd.get('factsTextOne') as string) || '',
    factsTextTwo: (fd.get('factsTextTwo') as string) || '',
    factsPhoto: factsPhoto || '',
    galleryImages: JSON.stringify(galleryImages),
    moreCardTitles: (fd.get('moreCardTitles') as string) || '',
    moreCardLinks: (fd.get('moreCardLinks') as string) || '',
    morePhoto: morePhoto || '',
    relatedTitle: (fd.get('relatedTitle') as string) || '',
    sectionVisibility: JSON.stringify(Object.fromEntries(
      businessSectionOptions.map(([key]) => [key, fd.has(`section_${key}`)])
    )),
    sectionOrder: (fd.get('sectionOrder') as string) || JSON.stringify(businessSectionOptions.map(([key]) => key)),
    entrepreneurId: fd.get('entrepreneurId') as string,
    description: descriptionHtml || '',
    city: (fd.get('city') as string) || '',
    address: (fd.get('address') as string) || '',
    phone: (fd.get('phone') as string) || '',
    email: (fd.get('email') as string) || '',
    website: (fd.get('website') as string) || '',
    coverImage: coverImage || '',
    isPublished: fd.has('isPublished'),
  };
}

type BusinessSpecItem = {
  title: string;
  note: string;
  icon: string;
};

function parseBusinessSpecs(value: string | null | undefined): BusinessSpecItem[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => ({
      title: String(item?.title || ''),
      note: String(item?.note || ''),
      icon: String(item?.icon || ''),
    }));
  } catch {
    return [];
  }
}

function renderBusinessSpecRow(item: BusinessSpecItem, index: number): string {
  return `
    <article class="business-spec-row" data-business-spec-row>
      <div class="business-spec-row__number" data-business-spec-number>${String(index + 1).padStart(2, '0')}</div>
      <div class="business-spec-row__icon">
        <div class="business-spec-row__preview" data-business-spec-preview>
          ${item.icon
            ? `<img src="${escapeHtml(item.icon)}" alt="">`
            : '<span>SVG<br>PNG</span>'}
        </div>
        <input type="text" value="${escapeHtml(item.icon)}" placeholder="/uploads/icon.svg" class="editor-control" data-business-spec-icon>
        <input type="file" accept=".svg,.png,image/svg+xml,image/png" class="editor-file-input" data-business-spec-file>
      </div>
      <div class="business-spec-row__fields">
        <label>
          <span class="editor-field__label">Заголовок</span>
          <textarea rows="2" class="editor-control" data-business-spec-title>${escapeHtml(item.title)}</textarea>
        </label>
        <label>
          <span class="editor-field__label">Описание</span>
          <textarea rows="3" class="editor-control" data-business-spec-note>${escapeHtml(item.note)}</textarea>
        </label>
      </div>
      <button type="button" class="editor-button editor-button--danger business-spec-row__remove" data-business-spec-remove>Удалить</button>
    </article>
  `;
}

function renderBusinessSpecs(items: BusinessSpecItem[]) {
  const list = document.querySelector<HTMLElement>('[data-business-spec-list]');
  if (!list) return;
  list.innerHTML = items.map((item, index) => renderBusinessSpecRow(item, index)).join('');
  updateBusinessSpecsEmptyState();
}

function attachBusinessSpecs(form: HTMLFormElement) {
  const list = form.querySelector<HTMLElement>('[data-business-spec-list]');
  const addButton = form.querySelector<HTMLButtonElement>('[data-business-spec-add]');
  if (!list || !addButton) return;

  const refreshRows = () => {
    list.querySelectorAll<HTMLElement>('[data-business-spec-row]').forEach((row, index) => {
      const number = row.querySelector<HTMLElement>('[data-business-spec-number]');
      if (number) number.textContent = String(index + 1).padStart(2, '0');
    });
    updateBusinessSpecsEmptyState();
  };

  addButton.addEventListener('click', () => {
    list.insertAdjacentHTML('beforeend', renderBusinessSpecRow({ title: '', note: '', icon: '' }, list.children.length));
    refreshRows();
  });

  list.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLElement>('[data-business-spec-remove]');
    if (!button) return;
    button.closest<HTMLElement>('[data-business-spec-row]')?.remove();
    refreshRows();
  });

  list.addEventListener('input', (event) => {
    const input = (event.target as HTMLElement).closest<HTMLInputElement>('[data-business-spec-icon]');
    if (!input) return;
    updateBusinessSpecPreview(input.closest<HTMLElement>('[data-business-spec-row]'), input.value.trim());
  });

  list.addEventListener('change', (event) => {
    const input = (event.target as HTMLElement).closest<HTMLInputElement>('[data-business-spec-file]');
    const file = input?.files?.[0];
    if (!input || !file) return;
    updateBusinessSpecPreview(input.closest<HTMLElement>('[data-business-spec-row]'), URL.createObjectURL(file));
  });
}

function updateBusinessSpecPreview(row: HTMLElement | null, src: string) {
  const preview = row?.querySelector<HTMLElement>('[data-business-spec-preview]');
  if (!preview) return;
  preview.innerHTML = src ? `<img src="${escapeHtml(src)}" alt="">` : '<span>SVG<br>PNG</span>';
}

function updateBusinessSpecsEmptyState() {
  const list = document.querySelector<HTMLElement>('[data-business-spec-list]');
  const empty = document.querySelector<HTMLElement>('[data-business-spec-empty]');
  empty?.classList.toggle('hidden', Boolean(list?.children.length));
}

async function collectBusinessSpecs(form: HTMLFormElement): Promise<BusinessSpecItem[]> {
  const rows = Array.from(form.querySelectorAll<HTMLElement>('[data-business-spec-row]'));
  const items: BusinessSpecItem[] = [];

  for (const row of rows) {
    const title = row.querySelector<HTMLTextAreaElement>('[data-business-spec-title]')?.value.trim() || '';
    const note = row.querySelector<HTMLTextAreaElement>('[data-business-spec-note]')?.value.trim() || '';
    const iconInput = row.querySelector<HTMLInputElement>('[data-business-spec-icon]');
    const iconFile = row.querySelector<HTMLInputElement>('[data-business-spec-file]')?.files?.[0];
    let icon = iconInput?.value.trim() || '';
    if (iconFile) icon = (await api.uploadImage(iconFile)).url;
    if (title || note || icon) items.push({ title, note, icon });
  }

  return items;
}

type BusinessAwardItem = {
  nominations: string;
  place: string;
  icon: string;
};

function parseBusinessAwards(value: string | null | undefined): BusinessAwardItem[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => ({
      nominations: String(item?.nominations || ''),
      place: String(item?.place || ''),
      icon: String(item?.icon || ''),
    }));
  } catch {
    return [];
  }
}

function renderBusinessAwardRow(item: BusinessAwardItem, index: number): string {
  return `
    <article class="business-spec-row" data-business-award-row>
      <div class="business-spec-row__number" data-business-award-number>${String(index + 1).padStart(2, '0')}</div>
      <div class="business-spec-row__icon">
        <div class="business-spec-row__preview" data-business-award-preview>
          ${item.icon ? `<img src="${escapeHtml(item.icon)}" alt="">` : '<span>SVG<br>PNG</span>'}
        </div>
        <input type="text" value="${escapeHtml(item.icon)}" placeholder="/uploads/award.svg" class="editor-control" data-business-award-icon>
        <input type="file" accept=".svg,.png,image/svg+xml,image/png" class="editor-file-input" data-business-award-file>
      </div>
      <div class="business-spec-row__fields">
        <label>
          <span class="editor-field__label">Номинации</span>
          <textarea rows="4" class="editor-control" data-business-award-nominations>${escapeHtml(item.nominations)}</textarea>
          <span class="editor-field__help">Каждая номинация может быть с новой строки.</span>
        </label>
        <label>
          <span class="editor-field__label">Место</span>
          <textarea rows="3" class="editor-control" data-business-award-place>${escapeHtml(item.place)}</textarea>
        </label>
      </div>
      <button type="button" class="editor-button editor-button--danger business-spec-row__remove" data-business-award-remove>Удалить</button>
    </article>
  `;
}

function renderBusinessAwards(items: BusinessAwardItem[]) {
  const list = document.querySelector<HTMLElement>('[data-business-award-list]');
  if (!list) return;
  list.innerHTML = items.map((item, index) => renderBusinessAwardRow(item, index)).join('');
  updateBusinessAwardsEmptyState();
}

function attachBusinessAwards(form: HTMLFormElement) {
  const list = form.querySelector<HTMLElement>('[data-business-award-list]');
  const addButton = form.querySelector<HTMLButtonElement>('[data-business-award-add]');
  if (!list || !addButton) return;

  const refreshRows = () => {
    list.querySelectorAll<HTMLElement>('[data-business-award-row]').forEach((row, index) => {
      const number = row.querySelector<HTMLElement>('[data-business-award-number]');
      if (number) number.textContent = String(index + 1).padStart(2, '0');
    });
    updateBusinessAwardsEmptyState();
  };

  addButton.addEventListener('click', () => {
    list.insertAdjacentHTML('beforeend', renderBusinessAwardRow(
      { nominations: '', place: '', icon: '' },
      list.children.length
    ));
    refreshRows();
  });

  list.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLElement>('[data-business-award-remove]');
    if (!button) return;
    button.closest<HTMLElement>('[data-business-award-row]')?.remove();
    refreshRows();
  });

  list.addEventListener('input', (event) => {
    const input = (event.target as HTMLElement).closest<HTMLInputElement>('[data-business-award-icon]');
    if (!input) return;
    updateBusinessAwardPreview(input.closest<HTMLElement>('[data-business-award-row]'), input.value.trim());
  });

  list.addEventListener('change', (event) => {
    const input = (event.target as HTMLElement).closest<HTMLInputElement>('[data-business-award-file]');
    const file = input?.files?.[0];
    if (!input || !file) return;
    updateBusinessAwardPreview(input.closest<HTMLElement>('[data-business-award-row]'), URL.createObjectURL(file));
  });
}

function updateBusinessAwardPreview(row: HTMLElement | null, src: string) {
  const preview = row?.querySelector<HTMLElement>('[data-business-award-preview]');
  if (!preview) return;
  preview.innerHTML = src ? `<img src="${escapeHtml(src)}" alt="">` : '<span>SVG<br>PNG</span>';
}

function updateBusinessAwardsEmptyState() {
  const list = document.querySelector<HTMLElement>('[data-business-award-list]');
  const empty = document.querySelector<HTMLElement>('[data-business-award-empty]');
  empty?.classList.toggle('hidden', Boolean(list?.children.length));
}

async function collectBusinessAwards(form: HTMLFormElement): Promise<BusinessAwardItem[]> {
  const rows = Array.from(form.querySelectorAll<HTMLElement>('[data-business-award-row]'));
  const items: BusinessAwardItem[] = [];

  for (const row of rows) {
    const nominations = row.querySelector<HTMLTextAreaElement>('[data-business-award-nominations]')?.value.trim() || '';
    const place = row.querySelector<HTMLTextAreaElement>('[data-business-award-place]')?.value.trim() || '';
    const iconInput = row.querySelector<HTMLInputElement>('[data-business-award-icon]');
    const iconFile = row.querySelector<HTMLInputElement>('[data-business-award-file]')?.files?.[0];
    let icon = iconInput?.value.trim() || '';
    if (iconFile) icon = (await api.uploadImage(iconFile)).url;
    if (nominations || place || icon) items.push({ nominations, place, icon });
  }

  return items;
}

function parseBusinessGallery(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => typeof item === 'string' ? item : String(item?.image || ''))
      .filter(Boolean);
  } catch {
    return value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
  }
}

function renderBusinessGalleryRow(image: string, index: number): string {
  return `
    <article class="business-gallery-row" data-business-gallery-row>
      <div class="business-gallery-row__heading">
        <span class="business-spec-row__number" data-business-gallery-number>${String(index + 1).padStart(2, '0')}</span>
        <div class="business-gallery-row__actions">
          <button type="button" class="editor-button" data-business-gallery-up aria-label="Поднять фотографию">↑</button>
          <button type="button" class="editor-button" data-business-gallery-down aria-label="Опустить фотографию">↓</button>
          <button type="button" class="editor-button editor-button--danger" data-business-gallery-remove>Удалить</button>
        </div>
      </div>
      <div class="business-gallery-row__preview" data-business-gallery-preview>
        ${image
          ? `<img src="${escapeHtml(image)}" alt="">`
          : '<span><strong>Нет фотографии</strong><small>Загрузите файл или укажите URL</small></span>'}
      </div>
      <label>
        <span class="editor-field__label">URL изображения</span>
        <input type="text" value="${escapeHtml(image)}" placeholder="/uploads/gallery-photo.jpg" class="editor-control" data-business-gallery-url>
      </label>
      <label>
        <span class="editor-field__label">Загрузить файл</span>
        <input type="file" accept="image/*" class="editor-file-input" data-business-gallery-file>
      </label>
    </article>
  `;
}

function renderBusinessGallery(images: string[]) {
  const list = document.querySelector<HTMLElement>('[data-business-gallery-list]');
  if (!list) return;
  list.innerHTML = images.map((image, index) => renderBusinessGalleryRow(image, index)).join('');
  updateBusinessGalleryState(list);
}

function attachBusinessGallery(form: HTMLFormElement) {
  const list = form.querySelector<HTMLElement>('[data-business-gallery-list]');
  const addButton = form.querySelector<HTMLButtonElement>('[data-business-gallery-add]');
  if (!list || !addButton) return;

  const refresh = () => updateBusinessGalleryState(list);

  addButton.addEventListener('click', () => {
    list.insertAdjacentHTML('beforeend', renderBusinessGalleryRow('', list.children.length));
    refresh();
  });

  list.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const row = target.closest<HTMLElement>('[data-business-gallery-row]');
    if (!row) return;
    if (target.closest('[data-business-gallery-remove]')) row.remove();
    if (target.closest('[data-business-gallery-up]') && row.previousElementSibling) {
      list.insertBefore(row, row.previousElementSibling);
    }
    if (target.closest('[data-business-gallery-down]') && row.nextElementSibling) {
      list.insertBefore(row.nextElementSibling, row);
    }
    refresh();
  });

  list.addEventListener('input', (event) => {
    const input = (event.target as HTMLElement).closest<HTMLInputElement>('[data-business-gallery-url]');
    if (!input) return;
    updateBusinessGalleryPreview(input.closest<HTMLElement>('[data-business-gallery-row]'), input.value.trim());
  });

  list.addEventListener('change', (event) => {
    const input = (event.target as HTMLElement).closest<HTMLInputElement>('[data-business-gallery-file]');
    const file = input?.files?.[0];
    if (!input || !file) return;
    updateBusinessGalleryPreview(input.closest<HTMLElement>('[data-business-gallery-row]'), URL.createObjectURL(file));
  });
}

function updateBusinessGalleryPreview(row: HTMLElement | null, src: string) {
  const preview = row?.querySelector<HTMLElement>('[data-business-gallery-preview]');
  if (!preview) return;
  preview.innerHTML = src
    ? `<img src="${escapeHtml(src)}" alt="">`
    : '<span><strong>Нет фотографии</strong><small>Загрузите файл или укажите URL</small></span>';
}

function updateBusinessGalleryState(list: HTMLElement) {
  list.querySelectorAll<HTMLElement>('[data-business-gallery-row]').forEach((row, index) => {
    const number = row.querySelector<HTMLElement>('[data-business-gallery-number]');
    const up = row.querySelector<HTMLButtonElement>('[data-business-gallery-up]');
    const down = row.querySelector<HTMLButtonElement>('[data-business-gallery-down]');
    if (number) number.textContent = String(index + 1).padStart(2, '0');
    if (up) up.disabled = index === 0;
    if (down) down.disabled = index === list.children.length - 1;
  });
  document.querySelector<HTMLElement>('[data-business-gallery-empty]')
    ?.classList.toggle('hidden', Boolean(list.children.length));
}

async function collectBusinessGallery(form: HTMLFormElement): Promise<string[]> {
  const rows = Array.from(form.querySelectorAll<HTMLElement>('[data-business-gallery-row]'));
  const images: string[] = [];
  for (const row of rows) {
    const urlInput = row.querySelector<HTMLInputElement>('[data-business-gallery-url]');
    const file = row.querySelector<HTMLInputElement>('[data-business-gallery-file]')?.files?.[0];
    let image = urlInput?.value.trim() || '';
    if (file) image = (await api.uploadImage(file)).url;
    if (image) images.push(image);
  }
  return images;
}

function parseBusinessVisibility(value: string | null | undefined): Record<string, boolean> {
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
    list.querySelectorAll<HTMLElement>('[data-section-order-item]').forEach((item, index, items) => {
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

function setContent(html: string) {
  const pageContent = document.getElementById('page-content');
  if (pageContent) pageContent.innerHTML = html;
}

function renderLoading(): string {
  return `<div class="text-gray-500">Загрузка…</div>`;
}

function emptyRow(): string {
  return `<tr><td colspan="6" class="px-4 py-8 text-center text-gray-500">Нет записей</td></tr>`;
}

function statusBadge(isPublished: boolean): string {
  return isPublished
    ? `<span class="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Опубликовано</span>`
    : `<span class="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Черновик</span>`;
}
