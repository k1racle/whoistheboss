import Sortable from 'sortablejs';

interface SortableListOptions {
  list: HTMLElement;
  itemSelector: string;
  onChange: () => void;
  handleSelector?: string;
}

const DEFAULT_HANDLE_SELECTOR = '[data-sortable-handle]';

export function renderSortableHandle(label = 'Изменить порядок'): string {
  return `
    <button
      type="button"
      class="editor-sortable-handle"
      data-sortable-handle
      aria-label="${label}"
      title="${label}"
    ><span aria-hidden="true">⠿</span></button>
  `;
}

export function attachSortableList({
  list,
  itemSelector,
  onChange,
  handleSelector = DEFAULT_HANDLE_SELECTOR,
}: SortableListOptions): Sortable {
  const sync = () => {
    onChange();
    list.dispatchEvent(new Event('input', { bubbles: true }));
  };

  const sortable = Sortable.create(list, {
    animation: 160,
    draggable: itemSelector,
    handle: handleSelector,
    ghostClass: 'is-sortable-ghost',
    chosenClass: 'is-sortable-chosen',
    dragClass: 'is-sortable-dragging',
    forceFallback: true,
    fallbackTolerance: 4,
    onChoose: ({ item }) => item.setAttribute('aria-grabbed', 'true'),
    onUnchoose: ({ item }) => item.removeAttribute('aria-grabbed'),
    onEnd: sync,
  });

  list.addEventListener('keydown', (event) => {
    const target = event.target as HTMLElement;
    const handle = target.closest<HTMLElement>(handleSelector);
    const item = handle?.closest<HTMLElement>(itemSelector);
    if (!handle || !item || (event.key !== 'ArrowUp' && event.key !== 'ArrowDown')) return;

    const sibling = event.key === 'ArrowUp'
      ? item.previousElementSibling
      : item.nextElementSibling;
    if (!sibling) return;

    event.preventDefault();
    if (event.key === 'ArrowUp') list.insertBefore(item, sibling);
    else list.insertBefore(sibling, item);
    sync();
    handle.focus();
  });

  onChange();
  return sortable;
}
