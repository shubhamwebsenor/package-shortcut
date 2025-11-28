# React Keyboard Shortcuts - Demo Application

Interactive demos showcasing the capabilities of the `react-keyboard-shortcuts` package.

## Overview

This demo application demonstrates various use cases and patterns for implementing keyboard shortcuts in React applications. Each demo focuses on a specific pattern commonly found in modern web applications.

## Running the Demo

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the demos in your browser.

## Demo Components

### 1. List Demo

**File:** `ListDemo.tsx`

Demonstrates keyboard navigation and selection patterns for lists and tables.

**Shortcuts:**
| Key | Action |
|-----|--------|
| `ArrowUp` | Navigate to previous item |
| `ArrowDown` | Navigate to next item |
| `Space` | Toggle selection on focused item |
| `Delete` | Delete focused item |
| `Ctrl+A` | Select all items |
| `Escape` | Deselect all items |

**Features Demonstrated:**
- Arrow key navigation with visual focus indicator
- Multi-selection with keyboard
- Bulk actions (select all, delete)
- Integration with list state management

**Use Case:** File managers, email clients, data tables

---

### 2. Form Demo

**File:** `FormDemo.tsx`

Demonstrates form-related keyboard shortcuts for improved productivity.

**Shortcuts:**
| Key | Action |
|-----|--------|
| `Ctrl+S` | Save form data |
| `Ctrl+Enter` | Submit form |
| `Escape` | Clear/reset form |

**Features Demonstrated:**
- Preventing browser default actions (e.g., browser save dialog)
- Shortcuts working alongside form inputs
- Form workflow optimization

**Use Case:** Admin panels, data entry applications, settings pages

---

### 3. Modal Demo

**File:** `ModalDemo.tsx`

Demonstrates conditional shortcut registration based on component state.

**Shortcuts (active only when modal is open):**
| Key | Action |
|-----|--------|
| `Escape` | Close modal |
| `Enter` | Confirm action |

**Features Demonstrated:**
- Dynamic shortcut registration/deregistration
- Context-sensitive shortcuts
- Proper cleanup when modal closes
- Avoiding shortcut conflicts

**Use Case:** Dialog boxes, confirmation modals, popups

---

### 4. Editor Demo

**File:** `EditorDemo.tsx`

Demonstrates advanced editor functionality with undo/redo and formatting shortcuts.

**Shortcuts:**
| Key | Action |
|-----|--------|
| `Ctrl+Z` | Undo last change |
| `Ctrl+Y` | Redo last undone change |
| `Ctrl+B` | Toggle bold formatting |
| `Ctrl+I` | Toggle italic formatting |
| `Ctrl+U` | Toggle underline formatting |
| `Ctrl+S` | Save document |

**Features Demonstrated:**
- Enable/disable shortcuts without unregistering
- Undo/redo stack management
- Text formatting controls
- Complex state management with shortcuts

**Use Case:** Rich text editors, code editors, design tools

---

## Demo Features

Each demo includes:

### Activity Log
Real-time log showing all shortcut activations with timestamps. Helps visualize when shortcuts are triggered and their effects.

### Code Examples
Inline code snippets showing the exact implementation used to register shortcuts. Copy-paste ready for your own projects.

### Status Display
Shows currently registered shortcuts and their enabled/disabled state.

### Visual Feedback
Immediate visual response when shortcuts are triggered, making it easy to understand the effect of each action.

---

## Project Structure

```
src/demos/
├── README.md           # This file
├── ListDemo.tsx        # List navigation demo
├── FormDemo.tsx        # Form shortcuts demo
├── ModalDemo.tsx       # Conditional shortcuts demo
├── EditorDemo.tsx      # Editor with undo/redo demo
└── styles/
    └── demos.css       # Shared demo styles (if applicable)
```

## Using the FloatingShortcutsButton

The demo app includes the `FloatingShortcutsButton` component in the bottom-right corner. Click it to see all currently registered shortcuts across all demos.

```tsx
import { FloatingShortcutsButton } from 'react-keyboard-shortcuts';

function App() {
  return (
    <div>
      <ListDemo />
      <FormDemo />
      <ModalDemo />
      <EditorDemo />

      {/* Shows all registered shortcuts */}
      <FloatingShortcutsButton
        position="bottom-right"
        theme="dark"
      />
    </div>
  );
}
```

## Key Patterns Demonstrated

### Pattern 1: Static Registration
Register shortcuts once when component mounts.

```tsx
useEffect(() => {
  register([...shortcuts]);
  return () => clear();
}, []);
```

### Pattern 2: Conditional Registration
Register/deregister based on state.

```tsx
useEffect(() => {
  if (isActive) {
    register([...shortcuts]);
  } else {
    clear();
  }
}, [isActive]);
```

### Pattern 3: Enable/Disable Toggle
Keep shortcuts registered but toggle their active state.

```tsx
useEffect(() => {
  if (isEnabled) {
    enable(['Ctrl+B', 'Ctrl+I']);
  } else {
    disable(['Ctrl+B', 'Ctrl+I']);
  }
}, [isEnabled]);
```

### Pattern 4: Dynamic Callbacks
Update shortcuts when dependencies change.

```tsx
useEffect(() => {
  register([
    {
      keys: 'Enter',
      callback: () => selectItem(currentIndex),
      options: { description: 'Select current item' }
    }
  ]);
}, [currentIndex]); // Re-register when index changes
```

## Tips for Building Your Own Shortcuts

1. **Use descriptive descriptions** - They appear in the FloatingShortcutsButton panel
2. **Group related shortcuts** - Register related shortcuts together for easier management
3. **Clean up on unmount** - Always call `clear()` in the cleanup function
4. **Consider input fields** - Shortcuts without modifiers are ignored in inputs by default
5. **Avoid conflicts** - Check for existing browser shortcuts before using combinations

## Learn More

- [Package README](../packages/react-keyboard-shortcuts/README.md) - Full API documentation
- [React Documentation](https://reactjs.org/) - Learn React
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - TypeScript reference
