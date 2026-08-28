import { api, type City } from '../api.js';
import { escapeHtml, layout, pageAlert, type UserInfo } from './layout.js';

export function citiesView(user?: UserInfo | null) {
  const html = layout('Города присутствия', '<div class="text-gray-500">Загрузка...</div>', user);
  async function init() {
    try {
      const cities = await api.cities.list();
      setContent(`<div class="mb-5 flex items-start justify-between gap-6"><div><p class="font-medium text-gray-900">Города для фильтрации сайта</p><p class="mt-1 max-w-2xl text-sm text-gray-500">Короткий slug становится первым сегментом URL: /krd/companies/...</p></div><a href="/admin/cities/new" class="inline-flex items-center px-4 py-2 bg-terracotta text-white text-sm font-medium rounded-sm" data-link>Добавить город</a></div>
        <div class="bg-white border border-gray-200 rounded-sm overflow-hidden"><table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-50"><tr><th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Город</th><th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th><th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Места</th><th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Предприниматели</th><th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Действия</th></tr></thead><tbody class="divide-y divide-gray-200">${cities.map(renderRow).join('') || '<tr><td colspan="5" class="px-4 py-8 text-center text-gray-500">Городов пока нет</td></tr>'}</tbody></table></div>`);
      document.querySelectorAll<HTMLButtonElement>('[data-city-delete]').forEach((button) => button.addEventListener('click', async () => {
        const city = cities.find(item => item.id === button.dataset.cityDelete);
        if (!city || !confirm(`Удалить город «${city.name}»?`)) return;
        try { await api.cities.delete(city.id); await init(); }
        catch (error) { alert(error instanceof Error ? error.message : 'Не удалось удалить город'); }
      }));
    } catch (error) { setContent(pageAlert(error instanceof Error ? error.message : 'Ошибка загрузки', 'error')); }
  }
  return { html, init };
}

export function cityFormView(id: string | null, user?: UserInfo | null) {
  const html = layout(id ? 'Редактировать город' : 'Новый город', renderForm(), user);
  async function init() {
    const form = document.getElementById('city-form') as HTMLFormElement | null;
    if (!form) return;
    if (id) {
      try { const city = await api.cities.get(id); (form.elements.namedItem('name') as HTMLInputElement).value = city.name; (form.elements.namedItem('slug') as HTMLInputElement).value = city.slug; }
      catch (error) { setContent(pageAlert(error instanceof Error ? error.message : 'Ошибка загрузки', 'error')); return; }
    }
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = { name: (form.elements.namedItem('name') as HTMLInputElement).value.trim(), slug: (form.elements.namedItem('slug') as HTMLInputElement).value.trim().toLowerCase() };
      try { if (id) await api.cities.update(id, data); else await api.cities.create(data); location.href = '/admin/cities'; }
      catch (error) { const message = document.getElementById('form-message'); if (message) message.innerHTML = pageAlert(error instanceof Error ? error.message : 'Ошибка сохранения', 'error'); }
    });
  }
  return { html, init };
}

function renderRow(city: City): string {
  return `<tr><td class="px-4 py-3 text-sm font-medium text-gray-900">${escapeHtml(city.name)}</td><td class="px-4 py-3 text-sm text-gray-600">/${escapeHtml(city.slug)}</td><td class="px-4 py-3 text-sm text-gray-600">${city._count?.businesses ?? 0}</td><td class="px-4 py-3 text-sm text-gray-600">${city._count?.entrepreneurLinks ?? 0}</td><td class="px-4 py-3 text-right text-sm space-x-3"><a href="/admin/cities/${city.id}/edit" class="text-terracotta hover:underline" data-link>Изменить</a><button type="button" class="text-[#DB2A00] hover:underline" data-city-delete="${city.id}">Удалить</button></td></tr>`;
}

function renderForm(): string {
  return `<form id="city-form" class="bg-white border border-gray-200 rounded-sm p-6 max-w-2xl"><div id="form-message"></div><div class="grid gap-5"><label class="grid gap-1 text-sm font-medium text-gray-700">Название *<input name="name" required maxlength="500" class="w-full px-4 py-2 border border-gray-300 rounded-sm" placeholder="Краснодар"></label><label class="grid gap-1 text-sm font-medium text-gray-700">Короткий slug *<input name="slug" required minlength="2" maxlength="24" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" class="w-full px-4 py-2 border border-gray-300 rounded-sm" placeholder="krd"><span class="font-normal text-xs text-gray-500">Только латиница, цифры и дефис.</span></label><div class="flex gap-3 pt-2"><button type="submit" class="px-4 py-2 bg-terracotta text-white text-sm font-medium rounded-sm">Сохранить</button><a href="/admin/cities" class="px-4 py-2 border border-gray-300 text-sm" data-link>Отмена</a></div></div></form>`;
}

function setContent(html: string) { const content = document.getElementById('page-content'); if (content) content.innerHTML = html; }
