# react-keyboard-shortcuts

A comprehensive keyboard shortcut management library for React applications with TypeScript support.

[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-61dafb.svg)](https://reactjs.org/)

## Features

- **Global Shortcut Manager** - Singleton-based centralized shortcut coordination
- **Flexible Key Combinations** - Support for all modifiers (Ctrl, Alt, Shift, Meta) and special keys
- **Component-Scoped Registration** - Automatic cleanup on component unmount
- **Dynamic Enable/Disable** - Toggle shortcuts without unregistering
- **Floating UI Component** - Built-in panel to display registered shortcuts
- **Input Field Awareness** - Automatically skips shortcuts in input fields (unless modifiers are used)
- **Full TypeScript Support** - Complete type definitions included
- **Zero Dependencies** - No external runtime dependencies

## Installation

```bash
npm install react-keyboard-shortcuts
```

or

```bash
yarn add react-keyboard-shortcuts
```

## Quick Start

### Basic Usage with `useShortcut`

```tsx
import { useShortcut } from 'react-keyboard-shortcuts';

function MyComponent() {
  useShortcut('Ctrl+S', (e) => {
    console.log('Save triggered!');
  }, { description: 'Save document' });

  return <div>Press Ctrl+S to save</div>;
}
```

### Advanced Usage with `useKeyboardShortcuts`

```tsx
import { useKeyboardShortcuts } from 'react-keyboard-shortcuts';

function EditorComponent() {
  const { register, enable, disable, clear } = useKeyboardShortcuts('editor');

  useEffect(() => {
    register([
      {
        keys: 'Ctrl+S',
        callback: () => saveDocument(),
        options: { description: 'Save document' }
      },
      {
        keys: 'Ctrl+Z',
        callback: () => undo(),
        options: { description: 'Undo' }
      },
      {
        keys: 'Ctrl+Y',
        callback: () => redo(),
        options: { description: 'Redo' }
      }
    ]);

    return () => clear();
  }, []);

  return <div>Editor with shortcuts</div>;
}
```

### Display Registered Shortcuts

```tsx
import { FloatingShortcutsButton } from 'react-keyboard-shortcuts';

function App() {
  return (
    <div>
      <YourComponents />
      <FloatingShortcutsButton
        position="bottom-right"
        theme="dark"
      />
    </div>
  );
}
```

## API Reference

### Hooks

#### `useShortcut(keyString, callback, options?)`

Simple hook for registering a single shortcut.

```tsx
useShortcut('Ctrl+K', handleSearch, {
  description: 'Open search',
  preventDefault: true
});
```

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `keyString` | `string` | Key combination (e.g., `'Ctrl+S'`, `'Alt+Shift+P'`) |
| `callback` | `(e: KeyboardEvent) => void` | Function to execute |
| `options` | `object` | Optional configuration |

#### `useKeyboardShortcuts(componentId?, options?)`

Advanced hook for managing multiple shortcuts.

```tsx
const {
  register,      // Register new shortcuts
  deregister,    // Remove specific shortcuts
  enable,        // Enable disabled shortcuts
  disable,       // Disable shortcuts (keep registered)
  clear,         // Remove all shortcuts for this component
  getRegisteredKeys,  // Get list of registered shortcuts
  componentId    // Unique component identifier
} = useKeyboardShortcuts('my-component');
```

**Return Type:**
```typescript
interface UseKeyboardShortcutsReturn {
  register: (definitions: ShortcutDefinition[]) => string[]
  deregister: (keys: string[]) => void
  enable: (keys: string[]) => void
  disable: (keys: string[]) => void
  clear: () => void
  getRegisteredKeys: () => ShortcutInfo[]
  componentId: string
}
```

### Components

#### `<FloatingShortcutsButton />`

A floating button that displays all registered shortcuts in a panel.

```tsx
<FloatingShortcutsButton
  position="bottom-right"  // 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  buttonText="Shortcuts"   // Custom button text
  showKeyboardIcon={true}  // Show keyboard icon
  theme="dark"             // 'light' | 'dark'
  filterComponents={['editor']}  // Only show shortcuts from specific components
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `string` | `'bottom-right'` | Button position |
| `buttonText` | `string` | `'Keyboard Shortcuts'` | Button label |
| `showKeyboardIcon` | `boolean` | `true` | Show keyboard icon |
| `theme` | `string` | `'light'` | Color theme |
| `filterComponents` | `string[]` | `undefined` | Filter by component IDs |

### Types

```typescript
interface ShortcutDefinition {
  keys: string | KeyCombination
  callback: (event: KeyboardEvent) => void
  options?: {
    description?: string
    preventDefault?: boolean  // default: true
    stopPropagation?: boolean
    enabled?: boolean         // default: true
  }
}

interface KeyCombination {
  key: string
  ctrl?: boolean
  alt?: boolean
  shift?: boolean
  meta?: boolean
}
```

### Core Functions

```typescript
import {
  getShortcutManager,    // Get the singleton manager instance
  resetShortcutManager,  // Reset manager (useful for testing)
  parseKeyString,        // Parse 'Ctrl+S' to KeyCombination
  keyCombinationToString // Convert KeyCombination to display string
} from 'react-keyboard-shortcuts';
```

## Supported Keys

### Modifiers
`Ctrl`, `Alt`, `Shift`, `Meta` (Cmd on Mac)

### Special Keys
| Category | Keys |
|----------|------|
| Navigation | `Enter`, `Escape`, `Space`, `Tab`, `Backspace`, `Delete` |
| Arrows | `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight` |
| Page | `Home`, `End`, `PageUp`, `PageDown` |
| Function | `F1` - `F12` |

### Standard Keys
- Letters: `a` - `z`
- Numbers: `0` - `9`
- Symbols: `+`, `-`, `=`, `[`, `]`, `\`, `;`, `'`, `,`, `.`, `/`

## Key String Format

Key combinations use `+` as separator:

```
Ctrl+S          // Ctrl and S
Alt+Shift+P     // Alt, Shift, and P
Meta+K          // Cmd+K on Mac, Win+K on Windows
Ctrl+Alt+Delete // Multiple modifiers
```

## Examples

### List Navigation

```tsx
function ListComponent({ items }) {
  const [focusIndex, setFocusIndex] = useState(0);
  const { register } = useKeyboardShortcuts('list');

  useEffect(() => {
    register([
      {
        keys: 'ArrowUp',
        callback: () => setFocusIndex(i => Math.max(0, i - 1)),
        options: { description: 'Move up' }
      },
      {
        keys: 'ArrowDown',
        callback: () => setFocusIndex(i => Math.min(items.length - 1, i + 1)),
        options: { description: 'Move down' }
      },
      {
        keys: 'Enter',
        callback: () => selectItem(focusIndex),
        options: { description: 'Select item' }
      }
    ]);
  }, [items.length, focusIndex]);

  return (/* ... */);
}
```

### Modal with Conditional Shortcuts

```tsx
function ModalComponent({ isOpen, onClose, onConfirm }) {
  const { register, clear } = useKeyboardShortcuts('modal');

  useEffect(() => {
    if (isOpen) {
      register([
        {
          keys: 'Escape',
          callback: onClose,
          options: { description: 'Close modal' }
        },
        {
          keys: 'Enter',
          callback: onConfirm,
          options: { description: 'Confirm' }
        }
      ]);
    } else {
      clear();
    }
  }, [isOpen]);

  if (!isOpen) return null;
  return (/* ... */);
}
```

### Enable/Disable Shortcuts

```tsx
function EditorComponent() {
  const [isEditing, setIsEditing] = useState(true);
  const { register, enable, disable } = useKeyboardShortcuts('editor');

  useEffect(() => {
    register([
      { keys: 'Ctrl+B', callback: toggleBold, options: { description: 'Bold' } },
      { keys: 'Ctrl+I', callback: toggleItalic, options: { description: 'Italic' } }
    ]);
  }, []);

  useEffect(() => {
    if (isEditing) {
      enable(['Ctrl+B', 'Ctrl+I']);
    } else {
      disable(['Ctrl+B', 'Ctrl+I']);
    }
  }, [isEditing]);

  return (/* ... */);
}
```

## Input Field Behavior

By default, shortcuts without modifiers are ignored when focus is on input fields to prevent interference with typing:

- `S` - **Ignored** in input fields
- `Ctrl+S` - **Works** in input fields (has modifier)
- `Enter` - **Ignored** in input fields
- `Ctrl+Enter` - **Works** in input fields (has modifier)

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## TypeScript

Full TypeScript support with exported types:

```typescript
import type {
  KeyCombination,
  ShortcutConfig,
  ShortcutDefinition,
  RegisteredShortcut,
  UseKeyboardShortcutsReturn,
  FloatingShortcutsButtonProps
} from 'react-keyboard-shortcuts';
```

## License

MIT

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

## Changelog

### 1.0.0
- Initial release
- Core shortcut management functionality
- `useShortcut` and `useKeyboardShortcuts` hooks
- `FloatingShortcutsButton` component
- Full TypeScript support
