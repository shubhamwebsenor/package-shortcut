# react-keyboard-shortcuts

> Keyboard shortcut management for React applications

## Installation

```bash
npm install react-keyboard-shortcuts
```

## Summary

This package provides keyboard shortcut management utilities for React applications.

### Exports

| Export | Type | Description |
|--------|------|-------------|
| `useShortcut` | Hook | Simple hook for single shortcut |
| `useKeyboardShortcuts` | Hook | Advanced hook for multiple shortcuts |
| `FloatingShortcutsButton` | Component | UI panel showing all shortcuts |
| `getShortcutManager` | Function | Get singleton manager instance |
| `resetShortcutManager` | Function | Reset manager state |
| `parseKeyString` | Function | Parse key string to object |
| `keyCombinationToString` | Function | Convert key object to string |

### Types

| Type | Description |
|------|-------------|
| `KeyCombination` | Key combination with modifiers |
| `ShortcutDefinition` | Shortcut registration config |
| `ShortcutConfig` | Shortcut options |
| `RegisteredShortcut` | Internal shortcut representation |
| `UseKeyboardShortcutsReturn` | Hook return type |
| `FloatingShortcutsButtonProps` | Component props |

## Usage

### Basic

```tsx
import { useShortcut } from 'react-keyboard-shortcuts';

function App() {
  useShortcut('Ctrl+S', () => console.log('Saved!'), {
    description: 'Save document'
  });

  return <div>Press Ctrl+S</div>;
}
```

### Advanced

```tsx
import { useKeyboardShortcuts } from 'react-keyboard-shortcuts';

function Editor() {
  const { register, disable, enable } = useKeyboardShortcuts('editor');

  useEffect(() => {
    register([
      { keys: 'Ctrl+S', callback: save, options: { description: 'Save' } },
      { keys: 'Ctrl+Z', callback: undo, options: { description: 'Undo' } },
    ]);
  }, []);

  return <div>Editor</div>;
}
```

### Floating Panel

```tsx
import { FloatingShortcutsButton } from 'react-keyboard-shortcuts';

function App() {
  return (
    <>
      <Editor />
      <FloatingShortcutsButton position="bottom-right" theme="dark" />
    </>
  );
}
```

## Supported Keys

**Modifiers:** `Ctrl` `Alt` `Shift` `Meta`

**Special Keys:** `Enter` `Escape` `Space` `Tab` `Backspace` `Delete` `ArrowUp` `ArrowDown` `ArrowLeft` `ArrowRight` `Home` `End` `PageUp` `PageDown` `F1`-`F12`

**Format:** `Ctrl+S` `Alt+Shift+P` `Meta+K`

## Details

- **Version:** 1.0.0
- **License:** MIT
- **TypeScript:** Included
- **React:** 18+
- **Dependencies:** None

## Links

- [GitHub Repository](#)
- [Documentation](./README.md)
- [Changelog](./CHANGELOG.md)
- [Issues](#)

## Keywords

`react` `keyboard` `shortcuts` `hotkeys` `keybindings` `accessibility` `a11y` `typescript`
