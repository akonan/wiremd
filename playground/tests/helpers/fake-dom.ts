type EventListener = (event: Record<string, unknown>) => void;

function createEventTarget() {
  const listeners = new Map<string, EventListener[]>();

  return {
    addEventListener(type: string, listener: EventListener) {
      const existing = listeners.get(type) ?? [];
      existing.push(listener);
      listeners.set(type, existing);
    },
    dispatchEvent(type: string, event: Record<string, unknown> = {}) {
      const listenersForType = listeners.get(type) ?? [];
      const enrichedEvent = {
        stopPropagation() {},
        preventDefault() {},
        ...event,
      };

      for (const listener of listenersForType) {
        listener(enrichedEvent);
      }
    },
  };
}

export class FakeClassList {
  private tokens: Set<string>;

  constructor(initial = '') {
    this.tokens = new Set(initial.split(/\s+/).filter(Boolean));
  }

  add(...tokens: string[]) {
    for (const token of tokens) {
      this.tokens.add(token);
    }
  }

  remove(...tokens: string[]) {
    for (const token of tokens) {
      this.tokens.delete(token);
    }
  }

  toggle(token: string) {
    if (this.tokens.has(token)) {
      this.tokens.delete(token);
      return false;
    }

    this.tokens.add(token);
    return true;
  }

  contains(token: string) {
    return this.tokens.has(token);
  }

  toString() {
    return Array.from(this.tokens).join(' ');
  }
}

export class FakeElement {
  readonly tagName: string;
  readonly style: Record<string, string> = {};
  readonly dataset: Record<string, string> = {};
  readonly children: FakeElement[] = [];
  readonly classList = new FakeClassList();
  readonly eventTarget = createEventTarget();

  id = '';
  innerHTML = '';
  textContent: string | null = '';
  value = '';
  disabled = false;
  srcdoc = '';
  parentElement: FakeElement | null = null;
  ownerDocument: FakeDocument | null = null;

  private capturedPointerIds = new Set<number>();
  private rect = { left: 0, top: 0, width: 0, height: 0 };

  constructor(tagName = 'div') {
    this.tagName = tagName.toUpperCase();
  }

  get className() {
    return this.classList.toString();
  }

  set className(value: string) {
    this.classList.remove(...this.classList.toString().split(/\s+/).filter(Boolean));
    this.classList.add(...value.split(/\s+/).filter(Boolean));
  }

  appendChild<T extends FakeElement>(child: T) {
    child.parentElement = this;
    child.ownerDocument = this.ownerDocument;
    this.children.push(child);
    return child;
  }

  removeChild<T extends FakeElement>(child: T) {
    const index = this.children.indexOf(child);
    if (index >= 0) {
      this.children.splice(index, 1);
      child.parentElement = null;
    }
    return child;
  }

  replaceChildren(...children: FakeElement[]) {
    this.children.length = 0;
    for (const child of children) {
      this.appendChild(child);
    }
  }

  addEventListener(type: string, listener: EventListener) {
    this.eventTarget.addEventListener(type, listener);
  }

  dispatchEvent(type: string, event: Record<string, unknown> = {}) {
    this.eventTarget.dispatchEvent(type, {
      currentTarget: this,
      target: this,
      ...event,
    });
  }

  click() {
    this.dispatchEvent('click');
  }

  setAttribute(name: string, value: string) {
    if (name === 'id') {
      this.id = value;
      this.ownerDocument?.registerElement(value, this);
      return;
    }

    if (name.startsWith('data-')) {
      const key = name
        .slice(5)
        .replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
      this.dataset[key] = value;
    }
  }

  setBoundingClientRect(rect: { left: number; top: number; width: number; height: number }) {
    this.rect = rect;
  }

  getBoundingClientRect() {
    return {
      ...this.rect,
      x: this.rect.left,
      y: this.rect.top,
      right: this.rect.left + this.rect.width,
      bottom: this.rect.top + this.rect.height,
      toJSON() {
        return this;
      },
    } as DOMRect;
  }

  querySelectorAll<T extends FakeElement = FakeElement>(selector: string): T[] {
    const matches: FakeElement[] = [];
    const className = selector.startsWith('.') ? selector.slice(1) : null;

    const visit = (element: FakeElement) => {
      if (className && element.classList.contains(className)) {
        matches.push(element);
      }

      for (const child of element.children) {
        visit(child);
      }
    };

    for (const child of this.children) {
      visit(child);
    }

    return matches as T[];
  }

  setPointerCapture(pointerId: number) {
    this.capturedPointerIds.add(pointerId);
  }

  hasPointerCapture(pointerId: number) {
    return this.capturedPointerIds.has(pointerId);
  }

  releasePointerCapture(pointerId: number) {
    this.capturedPointerIds.delete(pointerId);
  }

  select() {}
}

export class FakeDocument {
  readonly body = new FakeElement('body');
  readonly eventTarget = createEventTarget();
  readonly elementsById = new Map<string, FakeElement>();

  execCommand = (_command: string) => false;

  constructor() {
    this.body.ownerDocument = this;
  }

  createElement(tagName: string) {
    const element = new FakeElement(tagName);
    element.ownerDocument = this;
    return element;
  }

  registerElement(id: string, element: FakeElement) {
    element.id = id;
    element.ownerDocument = this;
    this.elementsById.set(id, element);
    return element;
  }

  getElementById(id: string) {
    return this.elementsById.get(id) ?? null;
  }

  addEventListener(type: string, listener: EventListener) {
    this.eventTarget.addEventListener(type, listener);
  }

  dispatchEvent(type: string, event: Record<string, unknown> = {}) {
    this.eventTarget.dispatchEvent(type, event);
  }
}

export class FakeWindow {
  readonly eventTarget = createEventTarget();
  innerWidth = 1024;

  addEventListener(type: string, listener: EventListener) {
    this.eventTarget.addEventListener(type, listener);
  }

  dispatchEvent(type: string, event: Record<string, unknown> = {}) {
    this.eventTarget.dispatchEvent(type, event);
  }
}

export function createElementTree(ids: string[]) {
  const document = new FakeDocument();
  const elements = Object.fromEntries(
    ids.map((id) => [id, document.registerElement(id, document.createElement('div'))]),
  ) as Record<string, FakeElement>;

  return { document, elements };
}
