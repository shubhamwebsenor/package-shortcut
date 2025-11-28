// Supported key codes
export const SUPPORTED_KEYS = [
  // Navigation keys
  'Enter', 'Escape', 'Space', 'Tab', 'Backspace', 'Delete',
  // Arrow keys
  'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
  // Page navigation
  'Home', 'End', 'PageUp', 'PageDown',
  // Function keys
  'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
  // Alphanumeric keys (commonly used with modifiers)
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  // Special characters
  '+', '-', '=', '[', ']', '\\', ';', "'", ',', '.', '/',
] as const;

export type SupportedKey = typeof SUPPORTED_KEYS[number];

// Modifier keys
export type ModifierKey = 'ctrl' | 'alt' | 'shift' | 'meta';

// Key combination representation
export interface KeyCombination {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
}

// Shortcut configuration
export interface ShortcutConfig {
  keys: KeyCombination;
  callback: (event: KeyboardEvent) => void;
  description?: string;
  enabled: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
}

// Registered shortcut with metadata
export interface RegisteredShortcut extends ShortcutConfig {
  id: string;
  componentId: string;
  registeredAt: number;
}

// Component shortcuts map
export type ComponentShortcutsMap = Map<string, RegisteredShortcut[]>;

// Registration options
export interface RegisterOptions {
  description?: string;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  enabled?: boolean;
}

// Shortcut definition for registration
export interface ShortcutDefinition {
  keys: string | KeyCombination;
  callback: (event: KeyboardEvent) => void;
  options?: RegisterOptions;
}

// Hook options
export interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
}

// Component shortcut info for display
export interface ComponentShortcutInfo {
  componentId: string;
  shortcuts: {
    keyString: string;
    description: string;
    enabled: boolean;
  }[];
}

// Manager event types
export type ManagerEventType =
  | 'register'
  | 'deregister'
  | 'enable'
  | 'disable'
  | 'clear';

export interface ManagerEvent {
  type: ManagerEventType;
  componentId: string;
  keys?: string[];
}

export type ManagerEventListener = (event: ManagerEvent) => void;
