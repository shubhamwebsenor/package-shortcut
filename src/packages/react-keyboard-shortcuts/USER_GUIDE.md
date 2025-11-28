# React Keyboard Shortcuts - Complete User Guide

## Table of Contents
1. [Introduction](#introduction)
2. [How It Works](#how-it-works)
3. [Installation & Setup](#installation--setup)
4. [Core Concepts](#core-concepts)
5. [API Reference](#api-reference)
6. [Usage Examples](#usage-examples)
7. [Advanced Patterns](#advanced-patterns)
8. [Troubleshooting](#troubleshooting)

---

## Introduction

This package helps you manage keyboard shortcuts in React applications. Instead of manually adding `addEventListener('keydown', ...)` everywhere, you use a clean hook-based API.

### What You'll Learn
- How keyboard events work in browsers
- How to register/deregister shortcuts
- How to enable/disable shortcuts dynamically
- How to show users what shortcuts are available

---

## How It Works

### The Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     Your React App                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Component A                    Component B                │
│   ┌─────────────┐               ┌─────────────┐            │
│   │ register()  │               │ register()  │            │
│   │ - Ctrl+S    │               │ - Ctrl+Z    │            │
│   │ - Escape    │               │ - Delete    │            │
│   └──────┬──────┘               └──────┬──────┘            │
│          │                              │                   │
│          └──────────────┬───────────────┘                   │
│                         ▼                                   │
│          ┌──────────────────────────┐                       │
│          │  KeyboardShortcutManager │ ◄── Singleton         │
│          │  (Central Registry)      │                       │
│          └────────────┬─────────────┘                       │
│                       │                                     │
│                       ▼                                     │
│          ┌──────────────────────────┐                       │
│          │  window.addEventListener │                       │
│          │  ('keydown', handler)    │                       │
│          └──────────────────────────┘                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘

When user presses Ctrl+S:
1. Browser fires 'keydown' event
2. Manager checks all registered shortcuts
3. Finds matching shortcut in Component A
4. Executes the callback function
```

### Key Concepts

| Concept | Description |
|---------|-------------|
| **Component ID** | Unique string to identify which component owns shortcuts |
| **Key Combination** | String like `"Ctrl+S"` or `"Alt+Shift+Delete"` |
| **Callback** | Function that runs when shortcut is pressed |
| **Enabled/Disabled** | Shortcuts can be temporarily disabled without removing |

---

## Installation & Setup

### Step 1: Import the Hook

```tsx
import { useKeyboardShortcuts } from './packages/react-keyboard-shortcuts/src';
```

### Step 2: Use in Your Component

```tsx
function MyComponent() {
  const { register } = useKeyboardShortcuts('my-component-id');

  useEffect(() => {
    register([
      {
        keys: 'Ctrl+S',
        callback: (e) => {
          e.preventDefault(); // Stop browser's default save dialog
          console.log('Save!');
        },
        options: { description: 'Save document' }
      }
    ]);
  }, [register]);

  return <div>Press Ctrl+S to save</div>;
}
```

---

## Core Concepts

### 1. The Hook: `useKeyboardShortcuts`

This is your main interface. It returns several functions:

```tsx
const {
  register,          // Add new shortcuts
  deregister,        // Remove specific shortcuts
  enable,            // Turn on disabled shortcuts
  disable,           // Turn off shortcuts (keep registered)
  clear,             // Remove ALL shortcuts for this component
  getRegisteredKeys, // Get list of current shortcuts
  componentId        // The ID being used
} = useKeyboardShortcuts('my-component');
```

### 2. Key String Format

Keys are written as strings with `+` between modifiers:

```
Simple keys:      "Enter", "Escape", "Space", "Tab", "F1"
With Ctrl:        "Ctrl+S", "Ctrl+Z", "Ctrl+Shift+Z"
With Alt:         "Alt+Tab", "Alt+F4"
With Shift:       "Shift+Delete"
Arrow keys:       "ArrowUp", "ArrowDown", "Ctrl+ArrowUp"
```

### 3. The Callback Function

Your callback receives the native `KeyboardEvent`:

```tsx
callback: (event: KeyboardEvent) => {
  // event.key        - The key pressed ("s", "Enter", etc.)
  // event.ctrlKey    - Was Ctrl held?
  // event.altKey     - Was Alt held?
  // event.shiftKey   - Was Shift held?

  event.preventDefault();  // Stop default browser behavior
  event.stopPropagation(); // Stop event bubbling

  // Your logic here
}
```

---

## API Reference

### `register(definitions[])`

Add shortcuts to this component.

```tsx
register([
  {
    keys: 'Ctrl+S',                    // Required: the key combination
    callback: (e) => { ... },          // Required: function to run
    options: {                         // Optional settings
      description: 'Save document',    // For display in UI
      preventDefault: true,            // Block default behavior (default: true)
      stopPropagation: false,          // Stop event bubbling (default: false)
      enabled: true                    // Start enabled? (default: true)
    }
  }
]);
```

### `deregister(keys[])`

Remove specific shortcuts by their key string.

```tsx
// Remove single shortcut
deregister(['Ctrl+S']);

// Remove multiple
deregister(['Ctrl+S', 'Ctrl+Z', 'Escape']);
```

### `enable(keys[])`

Re-enable disabled shortcuts.

```tsx
enable(['Ctrl+S']);
```

### `disable(keys[])`

Temporarily disable shortcuts (they stay registered).

```tsx
disable(['Ctrl+S']);
```

### `clear()`

Remove ALL shortcuts for this component.

```tsx
clear();
```

### `getRegisteredKeys()`

Get info about current shortcuts.

```tsx
const shortcuts = getRegisteredKeys();
// Returns: [
//   { keyString: 'Ctrl+S', description: 'Save', enabled: true },
//   { keyString: 'Escape', description: 'Cancel', enabled: false }
// ]
```

---

## Usage Examples

### Example 1: Basic Form Component

```tsx
import { useEffect } from 'react';
import { useKeyboardShortcuts } from './packages/react-keyboard-shortcuts/src';

function ContactForm() {
  const { register } = useKeyboardShortcuts('contact-form');

  const handleSave = () => {
    console.log('Saving form...');
    // Your save logic
  };

  const handleCancel = () => {
    console.log('Cancelled');
    // Your cancel logic
  };

  useEffect(() => {
    register([
      {
        keys: 'Ctrl+S',
        callback: (e) => {
          e.preventDefault();
          handleSave();
        },
        options: { description: 'Save form' }
      },
      {
        keys: 'Escape',
        callback: handleCancel,
        options: { description: 'Cancel' }
      }
    ]);
  }, [register]);

  return (
    <form>
      <input type="text" placeholder="Name" />
      <input type="email" placeholder="Email" />
      <p>Press Ctrl+S to save, Escape to cancel</p>
    </form>
  );
}
```

### Example 2: List with Navigation

```tsx
import { useState, useEffect } from 'react';
import { useKeyboardShortcuts } from './packages/react-keyboard-shortcuts/src';

function ItemList() {
  const [items] = useState(['Apple', 'Banana', 'Cherry', 'Date']);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { register } = useKeyboardShortcuts('item-list');

  useEffect(() => {
    register([
      {
        keys: 'ArrowUp',
        callback: () => {
          setSelectedIndex(i => Math.max(0, i - 1));
        },
        options: { description: 'Move up' }
      },
      {
        keys: 'ArrowDown',
        callback: () => {
          setSelectedIndex(i => Math.min(items.length - 1, i + 1));
        },
        options: { description: 'Move down' }
      },
      {
        keys: 'Enter',
        callback: () => {
          alert(`Selected: ${items[selectedIndex]}`);
        },
        options: { description: 'Select item' }
      },
      {
        keys: 'Delete',
        callback: () => {
          console.log(`Delete: ${items[selectedIndex]}`);
        },
        options: { description: 'Delete item' }
      }
    ]);
  }, [register, items.length]);

  return (
    <ul>
      {items.map((item, i) => (
        <li
          key={item}
          style={{
            background: i === selectedIndex ? '#e3f2fd' : 'transparent',
            padding: '8px'
          }}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
```

### Example 3: Toggle Shortcuts On/Off

```tsx
import { useState, useEffect } from 'react';
import { useKeyboardShortcuts } from './packages/react-keyboard-shortcuts/src';

function Editor() {
  const [isEditing, setIsEditing] = useState(false);
  const { register, enable, disable } = useKeyboardShortcuts('editor');

  useEffect(() => {
    register([
      {
        keys: 'Ctrl+S',
        callback: (e) => {
          e.preventDefault();
          console.log('Saved!');
        },
        options: { description: 'Save', enabled: false } // Start disabled
      },
      {
        keys: 'Ctrl+Z',
        callback: (e) => {
          e.preventDefault();
          console.log('Undo!');
        },
        options: { description: 'Undo', enabled: false }
      }
    ]);
  }, [register]);

  // Enable/disable shortcuts based on editing state
  useEffect(() => {
    if (isEditing) {
      enable(['Ctrl+S', 'Ctrl+Z']);
    } else {
      disable(['Ctrl+S', 'Ctrl+Z']);
    }
  }, [isEditing, enable, disable]);

  return (
    <div>
      <button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? 'Stop Editing' : 'Start Editing'}
      </button>
      <p>Shortcuts are: {isEditing ? 'ENABLED' : 'DISABLED'}</p>
      <textarea placeholder="Type here..." disabled={!isEditing} />
    </div>
  );
}
```

### Example 4: Modal with Escape to Close

```tsx
import { useEffect } from 'react';
import { useKeyboardShortcuts } from './packages/react-keyboard-shortcuts/src';

function Modal({ isOpen, onClose, children }) {
  const { register, clear } = useKeyboardShortcuts('modal');

  useEffect(() => {
    if (isOpen) {
      register([
        {
          keys: 'Escape',
          callback: onClose,
          options: { description: 'Close modal' }
        }
      ]);
    } else {
      clear(); // Remove shortcuts when modal closes
    }
  }, [isOpen, register, clear, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
        <button onClick={onClose}>Close</button>
        <p><small>Press Escape to close</small></p>
      </div>
    </div>
  );
}

// Usage:
function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>Open Modal</button>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2>Hello!</h2>
        <p>This is a modal</p>
      </Modal>
    </>
  );
}
```

### Example 5: Display Available Shortcuts

```tsx
import { FloatingShortcutsButton } from './packages/react-keyboard-shortcuts/src';

function App() {
  return (
    <div>
      {/* Your components with shortcuts */}
      <Editor />
      <ItemList />

      {/* Floating button shows all registered shortcuts */}
      <FloatingShortcutsButton
        position="bottom-right"  // or: top-left, top-right, bottom-left
        theme="dark"             // or: light
        buttonText="Shortcuts"   // Button label
      />
    </div>
  );
}
```

---

## Advanced Patterns

### Pattern 1: Conditional Registration

```tsx
function SearchComponent({ isSearchEnabled }) {
  const { register, clear } = useKeyboardShortcuts('search');

  useEffect(() => {
    if (isSearchEnabled) {
      register([
        {
          keys: 'Ctrl+F',
          callback: (e) => {
            e.preventDefault();
            document.getElementById('search-input')?.focus();
          },
          options: { description: 'Focus search' }
        }
      ]);
    }

    return () => clear(); // Cleanup when disabled or unmount
  }, [isSearchEnabled, register, clear]);

  return isSearchEnabled ? <input id="search-input" /> : null;
}
```

### Pattern 2: Multiple Shortcuts for Same Action

```tsx
useEffect(() => {
  const saveAction = (e: KeyboardEvent) => {
    e.preventDefault();
    console.log('Saving...');
  };

  register([
    { keys: 'Ctrl+S', callback: saveAction, options: { description: 'Save' } },
    { keys: 'Ctrl+Shift+S', callback: saveAction, options: { description: 'Save (Alt)' } },
  ]);
}, [register]);
```

### Pattern 3: Using with Context

```tsx
// ShortcutsContext.tsx
import { createContext, useContext } from 'react';
import { useKeyboardShortcuts } from './packages/react-keyboard-shortcuts/src';

const ShortcutsContext = createContext(null);

export function ShortcutsProvider({ children, componentId }) {
  const shortcuts = useKeyboardShortcuts(componentId);

  return (
    <ShortcutsContext.Provider value={shortcuts}>
      {children}
    </ShortcutsContext.Provider>
  );
}

export function useShortcutsContext() {
  return useContext(ShortcutsContext);
}

// Usage in nested component:
function NestedButton() {
  const { register } = useShortcutsContext();

  useEffect(() => {
    register([{ keys: 'Enter', callback: () => console.log('Click!') }]);
  }, [register]);

  return <button>Press Enter</button>;
}
```

---

## Troubleshooting

### Shortcut Not Working?

1. **Check if preventDefault is needed**
   ```tsx
   callback: (e) => {
     e.preventDefault(); // Add this!
     // your code
   }
   ```

2. **Check if shortcut is enabled**
   ```tsx
   const shortcuts = getRegisteredKeys();
   console.log(shortcuts); // Check 'enabled' field
   ```

3. **Check for conflicts**
   - Same key registered in multiple components
   - Browser/OS using the shortcut (like Ctrl+W)

4. **Check component ID uniqueness**
   ```tsx
   // Bad: same ID for different components
   useKeyboardShortcuts('my-component');

   // Good: unique IDs
   useKeyboardShortcuts('header-search');
   useKeyboardShortcuts('sidebar-menu');
   ```

### Input Fields Blocking Shortcuts?

By default, shortcuts don't fire when typing in input fields. To override:

```tsx
register([
  {
    keys: 'Ctrl+Enter', // Use modifier keys
    callback: (e) => {
      // This works even in input fields because it has Ctrl
    }
  }
]);
```

### Memory Leaks?

The hook automatically cleans up on unmount. But if you register dynamically, clean up manually:

```tsx
useEffect(() => {
  register([...]);

  return () => clear(); // Manual cleanup
}, [someCondition]);
```

---

## Quick Reference Card

```tsx
// Import
import { useKeyboardShortcuts, FloatingShortcutsButton } from './packages/react-keyboard-shortcuts/src';

// Basic usage
const { register, deregister, enable, disable, clear } = useKeyboardShortcuts('my-id');

// Register
register([
  { keys: 'Ctrl+S', callback: (e) => { e.preventDefault(); save(); } }
]);

// Remove specific
deregister(['Ctrl+S']);

// Toggle
disable(['Ctrl+S']);
enable(['Ctrl+S']);

// Remove all
clear();

// Key formats
'Enter'           // Simple key
'Ctrl+S'          // With Ctrl
'Ctrl+Shift+Z'    // Multiple modifiers
'Alt+ArrowUp'     // With arrow
'F1'              // Function key
```

---

## Next Steps

1. Try the demo components in `src/Components/c1.tsx` through `c4.tsx`
2. Run the app and click the floating "Shortcuts" button to see all registered shortcuts
3. Create your own component with custom shortcuts
4. Experiment with enable/disable for conditional shortcuts
