import { useEffect, useCallback, useRef, useMemo } from 'react';
import { getShortcutManager, keyCombinationToString } from '../core';
import { ShortcutDefinition, RegisterOptions, UseKeyboardShortcutsOptions } from '../types';

// Generate a stable component ID
const generateComponentId = (): string => {
  return `component_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export interface UseKeyboardShortcutsReturn {
  register: (definitions: ShortcutDefinition[]) => string[];
  deregister: (keys: string[]) => void;
  enable: (keys: string[]) => void;
  disable: (keys: string[]) => void;
  clear: () => void;
  getRegisteredKeys: () => { keyString: string; description: string; enabled: boolean }[];
  componentId: string;
}

export function useKeyboardShortcuts(
  componentId?: string,
  options: UseKeyboardShortcutsOptions = {}
): UseKeyboardShortcutsReturn {
  // Use provided componentId or generate a stable one
  const generatedIdRef = useRef<string>(componentId || generateComponentId());
  const actualComponentId = componentId || generatedIdRef.current;

  const managerRef = useRef(getShortcutManager());
  const optionsRef = useRef(options);

  // Keep options ref updated
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  // Register new shortcuts
  const register = useCallback((definitions: ShortcutDefinition[]): string[] => {
    const manager = managerRef.current;
    const defaultOptions = optionsRef.current;

    // Apply default options
    const processedDefinitions = definitions.map(def => ({
      ...def,
      options: {
        ...defaultOptions,
        ...def.options,
      },
    }));

    return manager.register(actualComponentId, processedDefinitions);
  }, [actualComponentId]);

  // Deregister specific shortcuts
  const deregister = useCallback((keys: string[]): void => {
    managerRef.current.deregister(actualComponentId, keys);
  }, [actualComponentId]);

  // Enable specific shortcuts
  const enable = useCallback((keys: string[]): void => {
    managerRef.current.enable(actualComponentId, keys);
  }, [actualComponentId]);

  // Disable specific shortcuts
  const disable = useCallback((keys: string[]): void => {
    managerRef.current.disable(actualComponentId, keys);
  }, [actualComponentId]);

  // Clear all shortcuts for this component
  const clear = useCallback((): void => {
    managerRef.current.clearComponent(actualComponentId);
  }, [actualComponentId]);

  // Get registered keys for this component
  const getRegisteredKeys = useCallback(() => {
    const shortcuts = managerRef.current.getComponentKeys(actualComponentId);
    return shortcuts.map(s => ({
      keyString: keyCombinationToString(s.keys),
      description: s.description || '',
      enabled: s.enabled,
    }));
  }, [actualComponentId]);

  // Cleanup on unmount
  useEffect(() => {
    const manager = managerRef.current;
    return () => {
      manager.clearComponent(actualComponentId);
    };
  }, [actualComponentId]);

  return useMemo(() => ({
    register,
    deregister,
    enable,
    disable,
    clear,
    getRegisteredKeys,
    componentId: actualComponentId,
  }), [register, deregister, enable, disable, clear, getRegisteredKeys, actualComponentId]);
}

// Simplified hook for one-time registration
export function useShortcut(
  keyString: string,
  callback: (event: KeyboardEvent) => void,
  options: RegisterOptions & { componentId?: string; enabled?: boolean } = {}
): void {
  const { componentId, enabled = true, ...registerOptions } = options;
  const { register, enable: enableShortcut, disable: disableShortcut } = useKeyboardShortcuts(componentId);

  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    register([{
      keys: keyString,
      callback: (e) => callbackRef.current(e),
      options: { ...registerOptions, enabled },
    }]);
  }, [keyString, register, enabled, registerOptions]);

  useEffect(() => {
    if (enabled) {
      enableShortcut([keyString]);
    } else {
      disableShortcut([keyString]);
    }
  }, [enabled, keyString, enableShortcut, disableShortcut]);
}

export default useKeyboardShortcuts;
