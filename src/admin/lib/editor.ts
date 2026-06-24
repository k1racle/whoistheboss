import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const toolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ align: [] }],
  ['link'],
  ['clean'],
];

const editors = new Map<string, { editor: Quill; container: HTMLElement }>();

export function initQuill(name: string, content?: string): Quill {
  const container = document.getElementById(`editor-${name}`);
  if (!container) {
    throw new Error(`Editor container #editor-${name} not found`);
  }

  const initialContent = content !== undefined ? content : container.innerHTML;

  const existing = editors.get(name);
  if (existing && existing.container.isConnected && existing.container === container) {
    existing.editor.setContents(existing.editor.clipboard.convert(initialContent));
    return existing.editor;
  }

  // Reset container to plain HTML so Quill can initialize cleanly.
  container.innerHTML = initialContent;

  const editor = new Quill(container, {
    theme: 'snow',
    placeholder: 'Введите текст...',
    modules: {
      toolbar: toolbarOptions,
    },
  });

  editor.setContents(editor.clipboard.convert(initialContent));
  editors.set(name, { editor, container });
  return editor;
}

export function getHtml(name: string): string {
  const entry = editors.get(name);
  if (!entry || !entry.container.isConnected) return '';
  return entry.editor.root.innerHTML;
}

export function setHtml(name: string, content: string) {
  const entry = editors.get(name);
  if (entry && entry.container.isConnected) {
    entry.editor.setContents(entry.editor.clipboard.convert(content));
  }
}
