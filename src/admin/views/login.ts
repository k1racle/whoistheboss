export function loginView() {
  const html = `
    <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div class="bg-white p-8 rounded-sm shadow-sm w-full max-w-md">
        <h1 class="text-2xl font-bold mb-2 text-center">Админка</h1>
        <p class="text-sm text-gray-500 text-center mb-6">Кто здесь главный?</p>
        <form id="login-form" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" required class="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-terracotta">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
            <input type="password" name="password" required class="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-terracotta">
          </div>
          <button type="submit" class="w-full bg-terracotta text-white py-2 rounded-sm hover:bg-terracotta-600 transition-colors">Войти</button>
        </form>
        <p id="login-error" class="mt-4 text-sm text-red-600 hidden"></p>
      </div>
    </div>
  `;

  function init() {
    const form = document.getElementById('login-form') as HTMLFormElement | null;
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const { api } = await import('../api.js');
      const errorEl = document.getElementById('login-error');
      try {
        await api.login((form.querySelector('input[name="email"]') as HTMLInputElement).value, (form.querySelector('input[name="password"]') as HTMLInputElement).value);
        location.href = '/admin';
      } catch (err) {
        if (errorEl) {
          errorEl.textContent = err instanceof Error ? err.message : 'Ошибка входа';
          errorEl.classList.remove('hidden');
        }
      }
    });
  }

  return { html, init };
}
