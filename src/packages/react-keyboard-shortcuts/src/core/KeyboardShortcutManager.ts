import {
  KeyCombination,
  RegisteredShortcut,
  ComponentShortcutsMap,
  ShortcutDefinition,
  SUPPORTED_KEYS,
  ManagerEvent,
  ManagerEventListener,
} from '../types';

// Generate unique ID
const generateId = (): string => {
  return `shortcut_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Parse key string to KeyCombination
export const parseKeyString = (keyString: string): KeyCombination => {
  const parts = keyString.toLowerCase().split('+').map(p => p.trim());
  const result: KeyCombination = { key: '' };

  for (const part of parts) {
    switch (part) {
      case 'ctrl':
      case 'control':
        result.ctrl = true;
        break;
      case 'alt':
      case 'option':
        result.alt = true;
        break;
      case 'shift':
        result.shift = true;
        break;
      case 'meta':
      case 'cmd':
      case 'command':
      case 'win':
      case 'windows':
        result.meta = true;
        break;
      default:
        // Map common key names to their event.key values
        result.key = normalizeKeyName(part);
    }
  }

  return result;
};

// Normalize key names to match KeyboardEvent.key
const normalizeKeyName = (key: string): string => {
  const keyMap: Record<string, string> = {
    'esc': 'Escape',
    'escape': 'Escape',
    'enter': 'Enter',
    'return': 'Enter',
    'space': ' ',
    'spacebar': ' ',
    'tab': 'Tab',
    'backspace': 'Backspace',
    'delete': 'Delete',
    'del': 'Delete',
    'up': 'ArrowUp',
    'down': 'ArrowDown',
    'left': 'ArrowLeft',
    'right': 'ArrowRight',
    'arrowup': 'ArrowUp',
    'arrowdown': 'ArrowDown',
    'arrowleft': 'ArrowLeft',
    'arrowright': 'ArrowRight',
    'home': 'Home',
    'end': 'End',
    'pageup': 'PageUp',
    'pagedown': 'PageDown',
    'pgup': 'PageUp',
    'pgdn': 'PageDown',
    'f1': 'F1', 'f2': 'F2', 'f3': 'F3', 'f4': 'F4',
    'f5': 'F5', 'f6': 'F6', 'f7': 'F7', 'f8': 'F8',
    'f9': 'F9', 'f10': 'F10', 'f11': 'F11', 'f12': 'F12',
  };

  const lowerKey = key.toLowerCase();
  return keyMap[lowerKey] || key;
};

// Convert KeyCombination back to display string
export const keyCombinationToString = (combo: KeyCombination): string => {
  const parts: string[] = [];
  if (combo.ctrl) parts.push('Ctrl');
  if (combo.alt) parts.push('Alt');
  if (combo.shift) parts.push('Shift');
  if (combo.meta) parts.push('Meta');

  // Normalize the key for display
  let displayKey = combo.key;
  if (combo.key === ' ') displayKey = 'Space';
  else if (combo.key.length === 1) displayKey = combo.key.toUpperCase();

  parts.push(displayKey);
  return parts.join('+');
};

// Check if keyboard event matches key combination
const matchesKeyCombination = (event: KeyboardEvent, combo: KeyCombination): boolean => {
  const eventKey = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  const comboKey = combo.key.length === 1 ? combo.key.toLowerCase() : combo.key;

  // Handle space key specially
  const keyMatches =
    eventKey === comboKey ||
    (comboKey === ' ' && event.code === 'Space');

  const ctrlMatches = !!combo.ctrl === (event.ctrlKey || event.metaKey);
  const altMatches = !!combo.alt === event.altKey;
  const shiftMatches = !!combo.shift === event.shiftKey;
  const metaMatches = combo.meta ? event.metaKey : true;

  return keyMatches && ctrlMatches && altMatches && shiftMatches && (combo.meta ? metaMatches : true);
};

class KeyboardShortcutManager {
  private static instance: KeyboardShortcutManager | null = null;
  private shortcuts: ComponentShortcutsMap = new Map();
  private isListening: boolean = false;
  private eventListeners: Set<ManagerEventListener> = new Set();

  private constructor() {
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  // Singleton pattern
  static getInstance(): KeyboardShortcutManager {
    if (!KeyboardShortcutManager.instance) {
      KeyboardShortcutManager.instance = new KeyboardShortcutManager();
    }
    return KeyboardShortcutManager.instance;
  }

  // Reset instance (useful for testing)
  static resetInstance(): void {
    if (KeyboardShortcutManager.instance) {
      KeyboardShortcutManager.instance.destroy();
      KeyboardShortcutManager.instance = null;
    }
  }

  // Start listening for keyboard events
  private startListening(): void {
    if (!this.isListening && typeof window !== 'undefined') {
      window.addEventListener('keydown', this.handleKeyDown);
      this.isListening = true;
    }
  }

  // Stop listening for keyboard events
  private stopListening(): void {
    if (this.isListening && typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.handleKeyDown);
      this.isListening = false;
    }
  }

  // Handle keydown events
  private handleKeyDown(event: KeyboardEvent): void {
    // Don't handle events in input fields unless explicitly configured
    const target = event.target as HTMLElement;
    const isInputField =
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable;

    // Iterate through all registered shortcuts
    for (const [, shortcuts] of Array.from(this.shortcuts)) {
      for (const shortcut of shortcuts) {
        if (!shortcut.enabled) continue;

        if (matchesKeyCombination(event, shortcut.keys)) {
          // Skip if in input field and no modifiers
          if (isInputField && !shortcut.keys.ctrl && !shortcut.keys.alt && !shortcut.keys.meta) {
            continue;
          }

          if (shortcut.preventDefault !== false) {
            event.preventDefault();
          }
          if (shortcut.stopPropagation) {
            event.stopPropagation();
          }

          shortcut.callback(event);
        }
      }
    }
  }

  // Emit events to listeners
  private emit(event: ManagerEvent): void {
    this.eventListeners.forEach(listener => listener(event));
  }

  // Subscribe to manager events
  subscribe(listener: ManagerEventListener): () => void {
    this.eventListeners.add(listener);
    return () => {
      this.eventListeners.delete(listener);
    };
  }

  // Register shortcuts for a component
  register(componentId: string, definitions: ShortcutDefinition[]): string[] {
    if (!this.shortcuts.has(componentId)) {
      this.shortcuts.set(componentId, []);
    }

    const componentShortcuts = this.shortcuts.get(componentId)!;
    const registeredIds: string[] = [];

    for (const def of definitions) {
      const keys = typeof def.keys === 'string'
        ? parseKeyString(def.keys)
        : def.keys;

      const shortcut: RegisteredShortcut = {
        id: generateId(),
        componentId,
        keys,
        callback: def.callback,
        description: def.options?.description || '',
        enabled: def.options?.enabled !== false,
        preventDefault: def.options?.preventDefault !== false,
        stopPropagation: def.options?.stopPropagation || false,
        registeredAt: Date.now(),
      };

      componentShortcuts.push(shortcut);
      registeredIds.push(shortcut.id);
    }

    this.startListening();
    this.emit({ type: 'register', componentId, keys: registeredIds });

    return registeredIds;
  }

  // Deregister specific shortcuts from a component
  deregister(componentId: string, keyStrings: string[]): void {
    const componentShortcuts = this.shortcuts.get(componentId);
    if (!componentShortcuts) return;

    const keyCombinations = keyStrings.map(parseKeyString);

    const remaining = componentShortcuts.filter(shortcut => {
      return !keyCombinations.some(combo =>
        keyCombinationToString(combo) === keyCombinationToString(shortcut.keys)
      );
    });

    if (remaining.length === 0) {
      this.shortcuts.delete(componentId);
    } else {
      this.shortcuts.set(componentId, remaining);
    }

    // Stop listening if no shortcuts remain
    if (this.shortcuts.size === 0) {
      this.stopListening();
    }

    this.emit({ type: 'deregister', componentId, keys: keyStrings });
  }

  // Enable specific shortcuts for a component
  enable(componentId: string, keyStrings: string[]): void {
    const componentShortcuts = this.shortcuts.get(componentId);
    if (!componentShortcuts) return;

    const keyCombinations = keyStrings.map(parseKeyString);

    componentShortcuts.forEach(shortcut => {
      if (keyCombinations.some(combo =>
        keyCombinationToString(combo) === keyCombinationToString(shortcut.keys)
      )) {
        shortcut.enabled = true;
      }
    });

    this.emit({ type: 'enable', componentId, keys: keyStrings });
  }

  // Disable specific shortcuts for a component (keep registered)
  disable(componentId: string, keyStrings: string[]): void {
    const componentShortcuts = this.shortcuts.get(componentId);
    if (!componentShortcuts) return;

    const keyCombinations = keyStrings.map(parseKeyString);

    componentShortcuts.forEach(shortcut => {
      if (keyCombinations.some(combo =>
        keyCombinationToString(combo) === keyCombinationToString(shortcut.keys)
      )) {
        shortcut.enabled = false;
      }
    });

    this.emit({ type: 'disable', componentId, keys: keyStrings });
  }

  // Clear all shortcuts for a component
  clearComponent(componentId: string): void {
    this.shortcuts.delete(componentId);

    if (this.shortcuts.size === 0) {
      this.stopListening();
    }

    this.emit({ type: 'clear', componentId });
  }

  // Get all registered keys for a component
  getComponentKeys(componentId: string): RegisteredShortcut[] {
    return this.shortcuts.get(componentId) || [];
  }

  // Get all registered shortcuts across all components
  getAllShortcuts(): Map<string, RegisteredShortcut[]> {
    return new Map(this.shortcuts);
  }

  // Get list of all supported keys
  getAllAvailableKeys(): readonly string[] {
    return SUPPORTED_KEYS;
  }

  // Get all component IDs
  getComponentIds(): string[] {
    return Array.from(this.shortcuts.keys());
  }

  // Check if a component has registered shortcuts
  hasComponent(componentId: string): boolean {
    return this.shortcuts.has(componentId);
  }

  // Destroy the manager
  destroy(): void {
    this.stopListening();
    this.shortcuts.clear();
    this.eventListeners.clear();
  }
}

// Export singleton instance getter
export const getShortcutManager = KeyboardShortcutManager.getInstance.bind(KeyboardShortcutManager);
export const resetShortcutManager = KeyboardShortcutManager.resetInstance.bind(KeyboardShortcutManager);

export default KeyboardShortcutManager;
