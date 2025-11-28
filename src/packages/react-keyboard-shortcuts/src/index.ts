// Core exports
export {
  KeyboardShortcutManager,
  getShortcutManager,
  resetShortcutManager,
  parseKeyString,
  keyCombinationToString,
} from './core';

// Hook exports
export {
  useKeyboardShortcuts,
  useShortcut,
  type UseKeyboardShortcutsReturn,
} from './hooks';

// Component exports
export {
  FloatingShortcutsButton,
  type FloatingShortcutsButtonProps,
} from './components';

// Type exports
export type {
  SupportedKey,
  ModifierKey,
  KeyCombination,
  ShortcutConfig,
  RegisteredShortcut,
  RegisterOptions,
  ShortcutDefinition,
  UseKeyboardShortcutsOptions,
  ComponentShortcutInfo,
  ManagerEvent,
  ManagerEventType,
  ManagerEventListener,
} from './types';

export { SUPPORTED_KEYS } from './types';
