import { api, type User } from '../api.js';
import { layout, formatDate, escapeHtml, pageAlert, type UserInfo } from './layout.js';

export function usersView(user?: UserInfo | null) {
  const html = layout('Пользователи', renderLoading(), user);

  async function init() {
    try {
      const items = await api.users.list();
      const rows = items.map((item) => renderRow(item)).join('');
      setContent(`
        <div class="mb-4 flex justify-end">
          <a href="/admin/users/new" class="inline-flex items-center px-4 py-2 bg-terracotta text-white text-sm font-medium rounded-sm hover:bg-terracotta-600" data-link>Добавить</a>
        </div>
        <div class="bg-white border border-gray-200 rounded-sm overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Имя</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Роль</th>
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

  function renderRow(item: User): string {
    return `
      <tr data-id="${item.id}">
        <td class="px-4 py-3 text-sm font-medium text-gray-900">${escapeHtml(item.name)}</td>
        <td class="px-4 py-3 text-sm text-gray-600">${escapeHtml(item.email)}</td>
        <td class="px-4 py-3 text-sm text-gray-600">${roleLabel(item.role)}</td>
        <td class="px-4 py-3 text-sm">${item.isActive ? 'Активен' : 'Отключён'}</td>
        <td class="px-4 py-3 text-sm text-gray-500">${formatDate(item.createdAt)}</td>
        <td class="px-4 py-3 text-sm text-right space-x-2">
          <a href="/admin/users/${item.id}/edit" class="text-terracotta hover:underline" data-link>Изменить</a>
          <button class="text-red-600 hover:underline delete-btn" data-id="${item.id}">Удалить</button>
        </td>
      </tr>
    `;
  }

  function attachActions(items: User[]) {
    document.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const id = (e.currentTarget as HTMLButtonElement).dataset.id;
        const item = items.find((i) => i.id === id);
        if (!id || !item) return;
        if (!confirm(`Удалить пользователя ${item.name}?`)) return;
        try {
          await api.users.delete(id);
          init();
        } catch (err) {
          alert(err instanceof Error ? err.message : 'Ошибка удаления');
        }
      });
    });
  }

  return { html, init };
}

export function userFormView(id: string | null, user?: UserInfo | null) {
  const isEdit = id !== null;
  const html = layout(isEdit ? 'Редактировать пользователя' : 'Новый пользователь', renderForm({ role: 'EDITOR', isActive: true }), user);

  async function init() {
    if (isEdit && id) {
      try {
        const item = await api.users.get(id);
        fillForm(item);
      } catch (err) {
        setContent(pageAlert(err instanceof Error ? err.message : 'Ошибка загрузки', 'error'));
      }
    }
    attachSubmit(id);
  }

  return { html, init };
}

function renderForm(item: Partial<User>): string {
  return `
    <form id="user-form" class="bg-white border border-gray-200 rounded-sm p-6 max-w-xl">
      <div id="form-message"></div>
      <div class="grid grid-cols-1 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Имя <span class="text-red-500">*</span></label>
          <input type="text" name="name" value="${escapeHtml(item.name || '')}" required class="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-terracotta">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email <span class="text-red-500">*</span></label>
          <input type="email" name="email" value="${escapeHtml(item.email || '')}" required class="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-terracotta">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Пароль ${!item.id ? '<span class="text-red-500">*</span>' : '<span class="text-xs text-gray-500">(оставьте пустым, чтобы не менять)</span>'}</label>
          <input type="password" name="password" ${!item.id ? 'required' : ''} minlength="6" class="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-terracotta">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Роль <span class="text-red-500">*</span></label>
          <select name="role" required class="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-terracotta">
            <option value="ADMIN" ${item.role === 'ADMIN' ? 'selected' : ''}>Администратор</option>
            <option value="EDITOR" ${item.role === 'EDITOR' ? 'selected' : ''}>Редактор</option>
            <option value="SUBSCRIBER" ${item.role === 'SUBSCRIBER' ? 'selected' : ''}>Подписчик</option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <input type="checkbox" name="isActive" id="isActive" ${item.isActive ? 'checked' : ''} class="h-4 w-4 text-terracotta border-gray-300 rounded">
          <label for="isActive" class="text-sm text-gray-700">Активен</label>
        </div>
        <div class="pt-4 flex gap-3">
          <button type="submit" class="px-4 py-2 bg-terracotta text-white text-sm font-medium rounded-sm hover:bg-terracotta-600">Сохранить</button>
          <a href="/admin/users" class="px-4 py-2 border border-gray-300 text-sm font-medium rounded-sm hover:bg-gray-50" data-link>Отмена</a>
        </div>
      </div>
    </form>
  `;
}

function fillForm(item: User) {
  const form = document.getElementById('user-form') as HTMLFormElement | null;
  if (!form) return;
  form.querySelector<HTMLInputElement>('input[name="name"]')!.value = item.name;
  form.querySelector<HTMLInputElement>('input[name="email"]')!.value = item.email;
  form.querySelector<HTMLSelectElement>('select[name="role"]')!.value = item.role;
  form.querySelector<HTMLInputElement>('input[name="isActive"]')!.checked = item.isActive;
}

function attachSubmit(id: string | null) {
  const form = document.getElementById('user-form') as HTMLFormElement | null;
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById('form-message');
    if (msg) msg.innerHTML = '';

    try {
      const fd = new FormData(form);
      const data: Partial<User> & { password?: string } = {
        name: fd.get('name') as string,
        email: fd.get('email') as string,
        role: fd.get('role') as User['role'],
        isActive: fd.has('isActive'),
      };
      const password = fd.get('password') as string;
      if (password) data.password = password;

      if (id) {
        await api.users.update(id, data);
      } else {
        if (!password) throw new Error('Пароль обязателен');
        await api.users.create(data as Partial<User> & { password: string });
      }
      location.href = '/admin/users';
    } catch (err) {
      if (msg) {
        msg.innerHTML = pageAlert(err instanceof Error ? err.message : 'Ошибка сохранения', 'error');
      }
    }
  });
}

function roleLabel(role: User['role']): string {
  const labels: Record<string, string> = { ADMIN: 'Админ', EDITOR: 'Редактор', SUBSCRIBER: 'Подписчик' };
  return labels[role] || role;
}

function setContent(html: string) {
  const pageContent = document.getElementById('page-content');
  if (pageContent) pageContent.innerHTML = html;
}

function renderLoading(): string {
  return `<div class="text-gray-500">Загрузка…</div>`;
}

function emptyRow(): string {
  return `<tr><td colspan="6" class="px-4 py-8 text-center text-gray-500">Нет пользователей</td></tr>`;
}
