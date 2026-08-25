const AUTOSAVE_PREFERENCE_KEY = 'guessboss:admin:autosave-interval';

const intervals = [
  { value: 'off', label: 'Выкл', milliseconds: 0 },
  { value: '1m', label: '1 мин', milliseconds: 60_000 },
  { value: '2m', label: '2 мин', milliseconds: 120_000 },
  { value: '5m', label: '5 мин', milliseconds: 300_000 },
  { value: '10m', label: '10 мин', milliseconds: 600_000 },
] as const;

type AutosaveOptions = {
  form: HTMLFormElement;
  save: () => Promise<unknown>;
  available?: boolean | (() => boolean);
  canAutosave?: () => boolean;
  blockedMessage?: string;
};

export type FormAutosaveController = {
  saveNow: () => Promise<void>;
  isDirty: () => boolean;
  dispose: () => void;
};

let activeController: FormAutosaveController | null = null;
let beforeUnloadAttached = false;

export function attachFormAutosave(options: AutosaveOptions): FormAutosaveController {
  const {
    form,
    save,
    available = true,
    canAutosave = () => true,
    blockedMessage = 'Автосохранение ждёт заполнения обязательных полей',
  } = options;
  const isAvailable = () => typeof available === 'function' ? available() : available;
  const actions = form.querySelector<HTMLElement>('.entrepreneur-editor__actions, .standalone-editor__actions');
  const message = form.querySelector<HTMLElement>('#form-message, #shooting-page-message');
  let baseline = getFormSnapshot(form);
  let timer: number | null = null;
  let disposed = false;
  let inFlight: Promise<void> | null = null;
  let lastResult: 'idle' | 'saved' | 'error' = 'idle';

  const control = document.createElement('label');
  control.className = 'autosave-control';
  control.dataset.autosaveIgnore = 'true';
  control.innerHTML = `
    <span class="autosave-control__label">Автосохранение</span>
    <select class="autosave-control__select" aria-label="Интервал автосохранения" ${isAvailable() ? '' : 'disabled'}>
      ${intervals.map((item) => `<option value="${item.value}">${item.label}</option>`).join('')}
    </select>
    <span class="autosave-control__status" aria-live="polite"></span>
  `;

  if (actions) {
    const firstAction = actions.querySelector<HTMLElement>('a, button');
    actions.insertBefore(control, firstAction);
  }

  const select = control.querySelector<HTMLSelectElement>('select')!;
  const status = control.querySelector<HTMLElement>('.autosave-control__status')!;
  select.value = readPreference();

  function isDirty(): boolean {
    return !disposed && getFormSnapshot(form) !== baseline;
  }

  function clearAutosaveError(): void {
    message?.querySelector<HTMLElement>('[data-autosave-error]')?.remove();
  }

  function showAutosaveError(error: unknown): void {
    if (!message) return;
    const reason = error instanceof Error && error.message.trim()
      ? ` Причина: ${error.message.trim()}`
      : '';
    const alert = document.createElement('div');
    alert.className = 'admin-alert admin-alert--error';
    alert.dataset.autosaveError = 'true';
    alert.setAttribute('role', 'alert');
    alert.textContent = `Не удалось выполнить автосохранение. Изменения остались в форме — сохраните их вручную.${reason}`;
    message.replaceChildren(alert);
  }

  function updateStatus(): void {
    select.disabled = !isAvailable();
    if (!isAvailable()) {
      status.textContent = 'Доступно после первого сохранения';
      return;
    }
    if (inFlight) {
      status.textContent = 'Сохраняем…';
      return;
    }
    if (isDirty()) {
      if (lastResult === 'error') {
        status.textContent = 'Ошибка сохранения — изменения не потеряны';
        return;
      }
      const intervalLabel = select.options[select.selectedIndex]?.text || '';
      status.textContent = timer !== null
        ? `Есть изменения · сохранение через ${intervalLabel}`
        : 'Есть несохранённые изменения';
      return;
    }
    if (lastResult === 'saved') return;
    status.textContent = select.value === 'off' ? '' : `Интервал: ${select.options[select.selectedIndex]?.text || ''}`;
  }

  async function performSave(mode: 'auto' | 'manual'): Promise<void> {
    if (disposed) return;
    if (inFlight) {
      if (mode === 'auto') return;
      await inFlight;
      if (!isDirty()) return;
    }
    if (mode === 'auto') {
      if (!isAvailable() || !isDirty()) return;
      if (!form.checkValidity() || !canAutosave()) {
        status.textContent = blockedMessage;
        return;
      }
    }

    const savedSnapshot = getFormSnapshot(form);
    const task = (async () => {
      status.textContent = 'Сохраняем…';
      lastResult = 'idle';
      try {
        await save();
        select.disabled = !isAvailable();
        baseline = savedSnapshot;
        lastResult = 'saved';
        clearAutosaveError();
        status.textContent = isDirty()
          ? 'Сохранено, но появились новые изменения'
          : `${mode === 'auto' ? 'Автосохранено' : 'Сохранено'} · ${formatTime(new Date())}`;
      } catch (error) {
        lastResult = 'error';
        status.textContent = 'Ошибка сохранения — изменения не потеряны';
        if (mode === 'auto') showAutosaveError(error);
        throw error;
      }
    })();

    inFlight = task;
    try {
      await task;
    } finally {
      inFlight = null;
    }
  }

  function clearTimer(): void {
    if (timer !== null) window.clearTimeout(timer);
    timer = null;
  }

  function scheduleAutosave(update = true): void {
    if (timer !== null || !isAvailable() || !isDirty()) return;
    const interval = intervals.find((item) => item.value === select.value)?.milliseconds || 0;
    if (interval === 0) return;
    timer = window.setTimeout(() => {
      timer = null;
      void performSave('auto')
        .catch(() => undefined)
        .finally(() => {
          if (isDirty()) scheduleAutosave(false);
        });
    }, interval);
    if (update) updateStatus();
  }

  function handleChange(): void {
    queueMicrotask(() => {
      if (isDirty()) scheduleAutosave();
      updateStatus();
    });
  }

  select.addEventListener('change', () => {
    writePreference(select.value);
    lastResult = 'idle';
    clearTimer();
    if (isDirty()) scheduleAutosave();
    updateStatus();
  });
  form.addEventListener('input', handleChange);
  form.addEventListener('change', handleChange);
  form.addEventListener('click', handleChange);

  const controller: FormAutosaveController = {
    async saveNow() {
      await performSave('manual');
      clearTimer();
      if (isDirty()) scheduleAutosave(false);
    },
    isDirty,
    dispose() {
      if (disposed) return;
      disposed = true;
      clearTimer();
      form.removeEventListener('input', handleChange);
      form.removeEventListener('change', handleChange);
      form.removeEventListener('click', handleChange);
      if (activeController === controller) activeController = null;
    },
  };

  activeController?.dispose();
  activeController = controller;
  attachBeforeUnload();
  updateStatus();
  return controller;
}

export async function confirmFormNavigation(): Promise<boolean> {
  const controller = activeController;
  if (!controller?.isDirty()) return true;
  const choice = await showLeaveDialog();
  if (choice === 'cancel') return false;
  if (choice === 'discard') return true;
  try {
    await controller.saveNow();
    return !controller.isDirty();
  } catch {
    return false;
  }
}

export function deactivateFormAutosave(): void {
  activeController?.dispose();
  activeController = null;
}

function getFormSnapshot(form: HTMLFormElement): string {
  const controls = Array.from(form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea'))
    .filter((control) => !control.closest('[data-autosave-ignore]'))
    .map((control) => {
      if (control instanceof HTMLInputElement && control.type === 'file') {
        return {
          tag: 'input',
          type: 'file',
          name: control.name,
          files: Array.from(control.files || []).map((file) => [file.name, file.size, file.lastModified]),
        };
      }
      if (control instanceof HTMLInputElement && (control.type === 'checkbox' || control.type === 'radio')) {
        return { tag: 'input', type: control.type, name: control.name, value: control.value, checked: control.checked };
      }
      if (control instanceof HTMLSelectElement && control.multiple) {
        return { tag: 'select', name: control.name, value: Array.from(control.selectedOptions).map((option) => option.value) };
      }
      return { tag: control.tagName.toLowerCase(), name: control.getAttribute('name') || '', value: control.value };
    });
  const editors = Array.from(form.querySelectorAll<HTMLElement>('.ql-editor, [contenteditable="true"]'))
    .map((editor) => editor.innerHTML);
  return JSON.stringify({ controls, editors });
}

function attachBeforeUnload(): void {
  if (beforeUnloadAttached) return;
  beforeUnloadAttached = true;
  window.addEventListener('beforeunload', (event) => {
    if (!activeController?.isDirty()) return;
    event.preventDefault();
    event.returnValue = '';
  });
}

function readPreference(): string {
  try {
    const saved = localStorage.getItem(AUTOSAVE_PREFERENCE_KEY) || 'off';
    return intervals.some((item) => item.value === saved) ? saved : 'off';
  } catch {
    return 'off';
  }
}

function writePreference(value: string): void {
  try {
    localStorage.setItem(AUTOSAVE_PREFERENCE_KEY, value);
  } catch {
    // Autosave still works for the current page when storage is unavailable.
  }
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' }).format(date);
}

type LeaveChoice = 'save' | 'discard' | 'cancel';

function showLeaveDialog(): Promise<LeaveChoice> {
  const overlay = document.createElement('div');
  overlay.className = 'autosave-leave-dialog';
  overlay.innerHTML = `
    <div class="autosave-leave-dialog__backdrop"></div>
    <section class="autosave-leave-dialog__panel" role="dialog" aria-modal="true" aria-labelledby="autosave-leave-title">
      <h2 id="autosave-leave-title">Есть несохранённые изменения</h2>
      <p>Сохранить их перед переходом?</p>
      <div class="autosave-leave-dialog__actions">
        <button type="button" class="editor-button editor-button--primary" data-leave-choice="save">Сохранить и выйти</button>
        <button type="button" class="editor-button editor-button--danger" data-leave-choice="discard">Выйти без сохранения</button>
        <button type="button" class="editor-button" data-leave-choice="cancel">Остаться</button>
      </div>
    </section>
  `;
  document.body.appendChild(overlay);
  const previousFocus = document.activeElement as HTMLElement | null;
  const saveButton = overlay.querySelector<HTMLButtonElement>('[data-leave-choice="save"]');
  saveButton?.focus();

  return new Promise((resolve) => {
    const finish = (choice: LeaveChoice) => {
      document.removeEventListener('keydown', onKeydown);
      overlay.remove();
      previousFocus?.focus();
      resolve(choice);
    };
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') finish('cancel');
    };
    document.addEventListener('keydown', onKeydown);
    overlay.addEventListener('click', (event) => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-leave-choice]');
      if (button) finish(button.dataset.leaveChoice as LeaveChoice);
    });
  });
}
