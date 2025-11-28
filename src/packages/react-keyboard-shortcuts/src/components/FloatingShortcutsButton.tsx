import React, { useState, useEffect, useCallback } from 'react';
import { getShortcutManager, keyCombinationToString } from '../core';
import { RegisteredShortcut, ManagerEvent } from '../types';

type TabType = 'active' | 'available';

export interface FloatingShortcutsButtonProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  buttonText?: string;
  showKeyboardIcon?: boolean;
  theme?: 'light' | 'dark';
  filterComponents?: string[];
}

interface ComponentShortcuts {
  componentId: string;
  shortcuts: RegisteredShortcut[];
}

const styles = {
  container: (position: string): React.CSSProperties => {
    const positionStyles: Record<string, React.CSSProperties> = {
      'top-left': { top: '20px', left: '20px' },
      'top-right': { top: '20px', right: '20px' },
      'bottom-left': { bottom: '20px', left: '20px' },
      'bottom-right': { bottom: '20px', right: '20px' },
    };
    return {
      position: 'fixed',
      zIndex: 9999,
      ...positionStyles[position],
    };
  },
  button: (theme: string): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.2s ease',
    backgroundColor: theme === 'dark' ? '#1a1a2e' : '#ffffff',
    color: theme === 'dark' ? '#ffffff' : '#333333',
  }),
  panel: (theme: string, position: string): React.CSSProperties => {
    const isBottom = position.startsWith('bottom');
    const isLeft = position.endsWith('left');
    return {
      position: 'absolute',
      ...(isBottom ? { bottom: '100%', marginBottom: '8px' } : { top: '100%', marginTop: '8px' }),
      ...(isLeft ? { left: 0 } : { right: 0 }),
      minWidth: '320px',
      maxHeight: '400px',
      overflowY: 'auto',
      backgroundColor: theme === 'dark' ? '#1a1a2e' : '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
      border: `1px solid ${theme === 'dark' ? '#333' : '#e0e0e0'}`,
    };
  },
  header: (theme: string): React.CSSProperties => ({
    padding: '16px',
    borderBottom: `1px solid ${theme === 'dark' ? '#333' : '#e0e0e0'}`,
    fontWeight: 600,
    fontSize: '16px',
    color: theme === 'dark' ? '#ffffff' : '#333333',
  }),
  componentSection: (theme: string): React.CSSProperties => ({
    padding: '12px 16px',
    borderBottom: `1px solid ${theme === 'dark' ? '#2a2a3e' : '#f0f0f0'}`,
  }),
  componentTitle: (theme: string): React.CSSProperties => ({
    fontSize: '13px',
    fontWeight: 600,
    color: theme === 'dark' ? '#888' : '#666',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: '8px',
  }),
  shortcutRow: (theme: string): React.CSSProperties => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 0',
  }),
  keyBadge: (theme: string, enabled: boolean): React.CSSProperties => ({
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontFamily: 'monospace',
    fontWeight: 500,
    backgroundColor: enabled
      ? (theme === 'dark' ? '#2d4a3e' : '#e8f5e9')
      : (theme === 'dark' ? '#4a2d2d' : '#ffebee'),
    color: enabled
      ? (theme === 'dark' ? '#81c784' : '#2e7d32')
      : (theme === 'dark' ? '#e57373' : '#c62828'),
    opacity: enabled ? 1 : 0.7,
  }),
  description: (theme: string): React.CSSProperties => ({
    fontSize: '13px',
    color: theme === 'dark' ? '#b0b0b0' : '#666666',
    marginLeft: '12px',
    flex: 1,
  }),
  emptyState: (theme: string): React.CSSProperties => ({
    padding: '24px',
    textAlign: 'center' as const,
    color: theme === 'dark' ? '#888' : '#999',
    fontSize: '14px',
  }),
  statusBadge: (enabled: boolean): React.CSSProperties => ({
    fontSize: '10px',
    padding: '2px 6px',
    borderRadius: '10px',
    marginLeft: '8px',
    backgroundColor: enabled ? '#4caf50' : '#f44336',
    color: '#ffffff',
  }),
  tabs: (theme: string): React.CSSProperties => ({
    display: 'flex',
    borderBottom: `1px solid ${theme === 'dark' ? '#333' : '#e0e0e0'}`,
  }),
  tab: (theme: string, isActive: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '12px 16px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 600,
    color: isActive
      ? (theme === 'dark' ? '#64b5f6' : '#1976d2')
      : (theme === 'dark' ? '#888' : '#666'),
    borderBottom: isActive
      ? `2px solid ${theme === 'dark' ? '#64b5f6' : '#1976d2'}`
      : '2px solid transparent',
    marginBottom: '-1px',
    transition: 'all 0.2s ease',
  }),
  keyGrid: (): React.CSSProperties => ({
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    padding: '12px 16px',
  }),
  keyCategory: (theme: string): React.CSSProperties => ({
    padding: '12px 16px',
    borderBottom: `1px solid ${theme === 'dark' ? '#2a2a3e' : '#f0f0f0'}`,
  }),
  categoryTitle: (theme: string): React.CSSProperties => ({
    fontSize: '11px',
    fontWeight: 600,
    color: theme === 'dark' ? '#888' : '#666',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: '10px',
  }),
  availableKey: (theme: string): React.CSSProperties => ({
    display: 'inline-block',
    padding: '6px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontFamily: 'monospace',
    fontWeight: 500,
    backgroundColor: theme === 'dark' ? '#2a2a3e' : '#f5f5f5',
    color: theme === 'dark' ? '#e0e0e0' : '#333',
    border: `1px solid ${theme === 'dark' ? '#3a3a4e' : '#ddd'}`,
  }),
  modifierInfo: (theme: string): React.CSSProperties => ({
    padding: '12px 16px',
    backgroundColor: theme === 'dark' ? '#1e1e2e' : '#f9f9f9',
    fontSize: '12px',
    color: theme === 'dark' ? '#aaa' : '#666',
    lineHeight: 1.5,
  }),
};

const KeyboardIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 18,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
    <path d="M6 8h.001" />
    <path d="M10 8h.001" />
    <path d="M14 8h.001" />
    <path d="M18 8h.001" />
    <path d="M8 12h.001" />
    <path d="M12 12h.001" />
    <path d="M16 12h.001" />
    <path d="M7 16h10" />
  </svg>
);

// Group available keys by category
const keyCategories = {
  'Navigation': ['Enter', 'Escape', 'Space', 'Tab', 'Backspace', 'Delete'],
  'Arrow Keys': ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'],
  'Page Navigation': ['Home', 'End', 'PageUp', 'PageDown'],
  'Function Keys': ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'],
  'Letters': ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
  'Numbers': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  'Special': ['+', '-', '=', '[', ']', '\\', ';', "'", ',', '.', '/'],
};

export const FloatingShortcutsButton: React.FC<FloatingShortcutsButtonProps> = ({
  position = 'bottom-right',
  buttonText = 'Shortcuts',
  showKeyboardIcon = true,
  theme = 'light',
  filterComponents,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [componentShortcuts, setComponentShortcuts] = useState<ComponentShortcuts[]>([]);

  const updateShortcuts = useCallback(() => {
    const manager = getShortcutManager();
    const allShortcuts = manager.getAllShortcuts();
    const result: ComponentShortcuts[] = [];

    allShortcuts.forEach((shortcuts, componentId) => {
      if (filterComponents && !filterComponents.includes(componentId)) {
        return;
      }
      if (shortcuts.length > 0) {
        result.push({ componentId, shortcuts });
      }
    });

    setComponentShortcuts(result);
  }, [filterComponents]);

  useEffect(() => {
    const manager = getShortcutManager();
    updateShortcuts();

    // Subscribe to changes
    const unsubscribe = manager.subscribe((event: ManagerEvent) => {
      updateShortcuts();
    });

    return () => {
      unsubscribe();
    };
  }, [updateShortcuts]);

  const togglePanel = () => {
    if (!isOpen) {
      updateShortcuts();
    }
    setIsOpen(!isOpen);
  };

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-shortcuts-panel]')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div style={styles.container(position)} data-shortcuts-panel>
      <button
        onClick={togglePanel}
        style={styles.button(theme)}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {showKeyboardIcon && <KeyboardIcon />}
        {buttonText}
      </button>

      {isOpen && (
        <div style={styles.panel(theme, position)}>
          {/* Tabs */}
          <div style={styles.tabs(theme)}>
            <button
              style={styles.tab(theme, activeTab === 'active')}
              onClick={() => setActiveTab('active')}
            >
              Active Shortcuts
            </button>
            <button
              style={styles.tab(theme, activeTab === 'available')}
              onClick={() => setActiveTab('available')}
            >
              Available Keys
            </button>
          </div>

          {/* Active Shortcuts Tab */}
          {activeTab === 'active' && (
            <>
              {componentShortcuts.length === 0 ? (
                <div style={styles.emptyState(theme)}>
                  No shortcuts registered
                </div>
              ) : (
                componentShortcuts.map(({ componentId, shortcuts }) => (
                  <div key={componentId} style={styles.componentSection(theme)}>
                    <div style={styles.componentTitle(theme)}>
                      {componentId}
                    </div>
                    {shortcuts.map((shortcut) => (
                      <div key={shortcut.id} style={styles.shortcutRow(theme)}>
                        <span style={styles.keyBadge(theme, shortcut.enabled)}>
                          {keyCombinationToString(shortcut.keys)}
                        </span>
                        <span style={styles.description(theme)}>
                          {shortcut.description || 'No description'}
                        </span>
                        <span style={styles.statusBadge(shortcut.enabled)}>
                          {shortcut.enabled ? 'ON' : 'OFF'}
                        </span>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </>
          )}

          {/* Available Keys Tab */}
          {activeTab === 'available' && (
            <>
              <div style={styles.modifierInfo(theme)}>
                <strong>Modifiers:</strong> Ctrl, Alt, Shift, Meta (Cmd/Win)<br />
                <span style={{ opacity: 0.8 }}>Combine with keys below, e.g., Ctrl+S, Alt+Enter</span>
              </div>
              {Object.entries(keyCategories).map(([category, keys]) => (
                <div key={category} style={styles.keyCategory(theme)}>
                  <div style={styles.categoryTitle(theme)}>{category}</div>
                  <div style={styles.keyGrid()}>
                    {keys.map((key) => (
                      <span key={key} style={styles.availableKey(theme)}>
                        {key}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FloatingShortcutsButton;
