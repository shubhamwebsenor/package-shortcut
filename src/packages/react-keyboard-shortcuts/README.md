<div align="center">

# react-keyboard-shortcuts

### Powerful keyboard shortcut management for React applications

[![npm version](https://img.shields.io/npm/v/react-keyboard-shortcuts.svg?style=flat-square)](https://www.npmjs.com/package/react-keyboard-shortcuts)
[![npm downloads](https://img.shields.io/npm/dm/react-keyboard-shortcuts.svg?style=flat-square)](https://www.npmjs.com/package/react-keyboard-shortcuts)
[![bundle size](https://img.shields.io/bundlephobia/minzip/react-keyboard-shortcuts?style=flat-square)](https://bundlephobia.com/package/react-keyboard-shortcuts)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-61dafb?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

[Features](#-features) · [Installation](#-installation) · [Quick Start](#-quick-start) · [API](#-api-reference) · [Examples](#-examples) · [NPM](./NPM_PACKAGE.md)

</div>

---

## Why react-keyboard-shortcuts?

Building keyboard-accessible applications shouldn't be complicated. This library provides a **simple, declarative API** to add keyboard shortcuts to your React components with automatic cleanup, TypeScript support, and a beautiful floating panel to display shortcuts to your users.

```tsx
// It's this simple!
useShortcut('Ctrl+S', () => saveDocument(), { description: 'Save' });
```

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎯 Simple & Intuitive
Register shortcuts with a single line of code. No boilerplate, no complexity.

### 🧹 Auto Cleanup
Shortcuts are automatically removed when components unmount. No memory leaks.

### ⌨️ All Keys Supported
Full support for modifiers (Ctrl, Alt, Shift, Meta) and special keys (F1-F12, arrows, etc.)

### 🎨 Floating UI Panel
Built-in component to display all registered shortcuts to users.

</td>
<td width="50%">

### 🔄 Dynamic Control
Enable/disable shortcuts on the fly without re-registering.

### 📝 Input Aware
Automatically ignores shortcuts in input fields (unless modifiers are used).

### 📦 Zero Dependencies
No external runtime dependencies. Just React.

### 💪 TypeScript First
Complete type definitions for the best developer experience.

</td>
</tr>
</table>

---

## 📦 Installation

```bash
# npm
npm install react-keyboard-shortcuts

# yarn
yarn add react-keyboard-shortcuts

# pnpm
pnpm add react-keyboard-shortcuts
```

---

## 🚀 Quick Start

### The Simple Way

```tsx
import { useShortcut } from 'react-keyboard-shortcuts';

function SaveButton() {
  useShortcut('Ctrl+S', (e) => {
    e.preventDefault();
    console.log('Document saved!');
  }, { description: 'Save document' });

  return <button>Save (Ctrl+S)</button>;
}
```

### Multiple Shortcuts

```tsx
import { useKeyboardShortcuts } from 'react-keyboard-shortcuts';

function Editor() {
  const { register } = useKeyboardShortcuts('editor');

  useEffect(() => {
    register([
      { keys: 'Ctrl+S', callback: save, options: { description: 'Save' } },
      { keys: 'Ctrl+Z', callback: undo, options: { description: 'Undo' } },
      { keys: 'Ctrl+Y', callback: redo, options: { description: 'Redo' } },
    ]);
  }, []);

  return <div>Your editor here</div>;
}
```

### Show Shortcuts to Users

```tsx
import { FloatingShortcutsButton } from 'react-keyboard-shortcuts';

function App() {
  return (
    <>
      <YourApp />
      <FloatingShortcutsButton position="bottom-right" theme="dark" />
    </>
  );
}
```

---

## 📖 API Reference

### Hooks

#### `useShortcut(keys, callback, options?)`

The simplest way to add a keyboard shortcut.

```tsx
useShortcut('Ctrl+K', openSearch, { description: 'Open search' });
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `keys` | `string` | ✅ | Key combination (e.g., `'Ctrl+S'`) |
| `callback` | `(e: KeyboardEvent) => void` | ✅ | Handler function |
| `options` | `ShortcutOptions` | ❌ | Configuration object |

<details>
<summary><strong>Options</strong></summary>

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `description` | `string` | `undefined` | Shown in FloatingShortcutsButton |
| `preventDefault` | `boolean` | `true` | Prevent default browser action |
| `stopPropagation` | `boolean` | `false` | Stop event bubbling |
| `enabled` | `boolean` | `true` | Whether shortcut is active |

</details>

---

#### `useKeyboardShortcuts(componentId?, options?)`

Advanced hook for full control over shortcuts.

```tsx
const {
  register,           // Add shortcuts
  deregister,         // Remove specific shortcuts
  enable,             // Enable shortcuts
  disable,            // Disable shortcuts
  clear,              // Remove all shortcuts
  getRegisteredKeys,  // Get current shortcuts
  componentId,        // Component identifier
} = useKeyboardShortcuts('my-component');
```

<details>
<summary><strong>Full Return Type</strong></summary>

```typescript
interface UseKeyboardShortcutsReturn {
  register: (definitions: ShortcutDefinition[]) => string[]
  deregister: (keys: string[]) => void
  enable: (keys: string[]) => void
  disable: (keys: string[]) => void
  clear: () => void
  getRegisteredKeys: () => { keyString: string; description: string; enabled: boolean }[]
  componentId: string
}
```

</details>

---

### Components

#### `<FloatingShortcutsButton />`

A floating button that displays all registered shortcuts.

```tsx
<FloatingShortcutsButton
  position="bottom-right"
  theme="dark"
  buttonText="Shortcuts"
  showKeyboardIcon={true}
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `'top-left'` \| `'top-right'` \| `'bottom-left'` \| `'bottom-right'` | `'bottom-right'` | Button position |
| `theme` | `'light'` \| `'dark'` | `'light'` | Color theme |
| `buttonText` | `string` | `'Keyboard Shortcuts'` | Button label |
| `showKeyboardIcon` | `boolean` | `true` | Show ⌨️ icon |
| `filterComponents` | `string[]` | `undefined` | Only show specific components |

---

### Utility Functions

```tsx
import {
  getShortcutManager,     // Access the singleton manager
  resetShortcutManager,   // Reset (useful for testing)
  parseKeyString,         // 'Ctrl+S' → { key: 's', ctrl: true }
  keyCombinationToString, // { key: 's', ctrl: true } → 'Ctrl+S'
} from 'react-keyboard-shortcuts';
```

---

## ⌨️ Supported Keys

<table>
<tr>
<td>

### Modifiers
| Key | Windows/Linux | macOS |
|-----|---------------|-------|
| `Ctrl` | Ctrl | ⌃ Control |
| `Alt` | Alt | ⌥ Option |
| `Shift` | Shift | ⇧ Shift |
| `Meta` | Win | ⌘ Command |

</td>
<td>

### Special Keys
| Category | Keys |
|----------|------|
| Navigation | `Enter` `Escape` `Space` `Tab` `Backspace` `Delete` |
| Arrows | `ArrowUp` `ArrowDown` `ArrowLeft` `ArrowRight` |
| Page | `Home` `End` `PageUp` `PageDown` |
| Function | `F1` through `F12` |

</td>
</tr>
</table>

### Key Format Examples

```
Ctrl+S              → Ctrl and S
Ctrl+Shift+Z        → Ctrl, Shift and Z
Alt+ArrowUp         → Alt and Arrow Up
Meta+K              → Cmd+K (Mac) / Win+K (Windows)
Ctrl+Alt+Delete     → All three modifiers
```

---

## 💡 Examples

### 📋 List Navigation

```tsx
function ItemList({ items }) {
  const [selected, setSelected] = useState(0);
  const { register } = useKeyboardShortcuts('list');

  useEffect(() => {
    register([
      {
        keys: 'ArrowUp',
        callback: () => setSelected(i => Math.max(0, i - 1)),
        options: { description: 'Previous item' }
      },
      {
        keys: 'ArrowDown',
        callback: () => setSelected(i => Math.min(items.length - 1, i + 1)),
        options: { description: 'Next item' }
      },
      {
        keys: 'Enter',
        callback: () => openItem(items[selected]),
        options: { description: 'Open item' }
      },
      {
        keys: 'Delete',
        callback: () => deleteItem(items[selected]),
        options: { description: 'Delete item' }
      }
    ]);
  }, [items, selected]);

  return (
    <ul>
      {items.map((item, i) => (
        <li key={item.id} className={i === selected ? 'selected' : ''}>
          {item.name}
        </li>
      ))}
    </ul>
  );
}
```

---

### 🔲 Modal Dialog

```tsx
function Modal({ isOpen, onClose, onConfirm }) {
  const { register, clear } = useKeyboardShortcuts('modal');

  useEffect(() => {
    if (isOpen) {
      register([
        { keys: 'Escape', callback: onClose, options: { description: 'Close' } },
        { keys: 'Enter', callback: onConfirm, options: { description: 'Confirm' } }
      ]);
    } else {
      clear();
    }
  }, [isOpen, onClose, onConfirm]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Confirm Action</h2>
        <p>Are you sure you want to proceed?</p>
        <div className="modal-actions">
          <button onClick={onClose}>Cancel (Esc)</button>
          <button onClick={onConfirm}>Confirm (Enter)</button>
        </div>
      </div>
    </div>
  );
}
```

---

### ✏️ Rich Text Editor

```tsx
function RichTextEditor() {
  const [isEditing, setIsEditing] = useState(true);
  const { register, enable, disable } = useKeyboardShortcuts('editor');

  useEffect(() => {
    register([
      { keys: 'Ctrl+B', callback: toggleBold, options: { description: 'Bold' } },
      { keys: 'Ctrl+I', callback: toggleItalic, options: { description: 'Italic' } },
      { keys: 'Ctrl+U', callback: toggleUnderline, options: { description: 'Underline' } },
      { keys: 'Ctrl+S', callback: saveDocument, options: { description: 'Save' } },
      { keys: 'Ctrl+Z', callback: undo, options: { description: 'Undo' } },
      { keys: 'Ctrl+Y', callback: redo, options: { description: 'Redo' } },
    ]);
  }, []);

  // Enable/disable formatting shortcuts based on edit mode
  useEffect(() => {
    const formattingKeys = ['Ctrl+B', 'Ctrl+I', 'Ctrl+U'];
    isEditing ? enable(formattingKeys) : disable(formattingKeys);
  }, [isEditing]);

  return (
    <div className="editor">
      <div className="toolbar">
        <button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Preview' : 'Edit'}
        </button>
      </div>
      <div className="content" contentEditable={isEditing}>
        {/* Editor content */}
      </div>
    </div>
  );
}
```

---

## 🔧 Advanced Usage

### Direct Manager Access

```tsx
import { getShortcutManager } from 'react-keyboard-shortcuts';

// Get all registered shortcuts
const manager = getShortcutManager();
const allShortcuts = manager.getAllShortcuts();

// Subscribe to shortcut changes
manager.on('shortcut:registered', (shortcut) => {
  console.log('New shortcut:', shortcut);
});
```

### Testing

```tsx
import { resetShortcutManager } from 'react-keyboard-shortcuts';

beforeEach(() => {
  // Reset state between tests
  resetShortcutManager();
});
```

---

## 📝 Input Field Behavior

Shortcuts behave intelligently around input fields:

| Shortcut | In Input Field | Reason |
|----------|----------------|--------|
| `S` | ❌ Ignored | Would interfere with typing |
| `Ctrl+S` | ✅ Works | Has modifier key |
| `Enter` | ❌ Ignored | Form submission |
| `Ctrl+Enter` | ✅ Works | Has modifier key |
| `Escape` | ✅ Works | Common to exit inputs |

---

## 🌐 Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 60+ |
| Firefox | 55+ |
| Safari | 12+ |
| Edge | 79+ |

---

## 📄 TypeScript

Full TypeScript support with exported types:

```typescript
import type {
  KeyCombination,
  ShortcutDefinition,
  ShortcutConfig,
  RegisteredShortcut,
  UseKeyboardShortcutsReturn,
  FloatingShortcutsButtonProps,
} from 'react-keyboard-shortcuts';
```

---

## 📜 License

MIT © [Your Name]

---

<div align="center">

**[⬆ Back to Top](#react-keyboard-shortcuts)**

Made with ❤️ for the React community

</div>
