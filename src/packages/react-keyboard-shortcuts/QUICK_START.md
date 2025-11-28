# Quick Start - 5 Minutes to Keyboard Shortcuts

## Step 1: Import

```tsx
import { useKeyboardShortcuts } from './packages/react-keyboard-shortcuts/src';
```

## Step 2: Use the Hook

```tsx
function MyComponent() {
  const { register } = useKeyboardShortcuts('my-component');

  useEffect(() => {
    register([
      {
        keys: 'Ctrl+S',
        callback: (e) => {
          e.preventDefault();
          alert('Saved!');
        }
      }
    ]);
  }, [register]);

  return <div>Press Ctrl+S</div>;
}
```

## That's It!

---

## Common Shortcuts Cheatsheet

| Keys | Example Use |
|------|-------------|
| `Ctrl+S` | Save |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Escape` | Cancel/Close |
| `Enter` | Submit/Confirm |
| `Delete` | Remove item |
| `ArrowUp/Down` | Navigate list |
| `F1` | Help |
| `Ctrl+F` | Search |

## Full Example

```tsx
import { useEffect, useState } from 'react';
import { useKeyboardShortcuts, FloatingShortcutsButton } from './packages/react-keyboard-shortcuts/src';

function App() {
  const [message, setMessage] = useState('');
  const { register, disable, enable } = useKeyboardShortcuts('app');

  useEffect(() => {
    register([
      {
        keys: 'Ctrl+S',
        callback: (e) => { e.preventDefault(); setMessage('Saved!'); },
        options: { description: 'Save' }
      },
      {
        keys: 'Ctrl+Z',
        callback: (e) => { e.preventDefault(); setMessage('Undo!'); },
        options: { description: 'Undo' }
      },
      {
        keys: 'Escape',
        callback: () => setMessage(''),
        options: { description: 'Clear message' }
      }
    ]);
  }, [register]);

  return (
    <div>
      <h1>Keyboard Shortcuts Demo</h1>
      <p>Try: Ctrl+S, Ctrl+Z, Escape</p>
      {message && <div style={{ color: 'green', fontSize: 24 }}>{message}</div>}

      <FloatingShortcutsButton position="bottom-right" />
    </div>
  );
}
```

## API Quick Reference

| Function | Purpose |
|----------|---------|
| `register([...])` | Add shortcuts |
| `deregister(['Ctrl+S'])` | Remove shortcuts |
| `enable(['Ctrl+S'])` | Turn on |
| `disable(['Ctrl+S'])` | Turn off |
| `clear()` | Remove all |
| `getRegisteredKeys()` | List shortcuts |
