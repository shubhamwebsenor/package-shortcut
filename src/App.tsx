import { useState } from 'react';
import { FloatingShortcutsButton } from './packages/react-keyboard-shortcuts/src';

// Demo Components
import FormDemo from './demos/FormDemo';
import ListDemo from './demos/ListDemo';
import EditorDemo from './demos/EditorDemo';
import ModalDemo from './demos/ModalDemo';

const styles = {
  app: { fontFamily: 'system-ui, sans-serif', padding: 20, maxWidth: 1000, margin: '0 auto' },
  header: { textAlign: 'center' as const, marginBottom: 30 },
  title: { fontSize: 28, margin: 0, color: '#1976d2' },
  subtitle: { color: '#666', marginTop: 8 },
  tabs: { display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' as const },
  tab: { padding: '10px 20px', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 500 },
  activeTab: { backgroundColor: '#1976d2', color: 'white' },
  inactiveTab: { backgroundColor: '#e0e0e0', color: '#333' },
  content: { minHeight: 400 },
  instructions: { backgroundColor: '#fff3e0', padding: 16, borderRadius: 8, marginBottom: 20 },
};

type DemoType = 'form' | 'list' | 'editor' | 'modal';

export default function App() {
  const [activeDemo, setActiveDemo] = useState<DemoType>('form');

  const demos: { id: DemoType; label: string; desc: string }[] = [
    { id: 'form', label: 'Form Shortcuts', desc: 'Ctrl+S to save, Escape to cancel, Enter to submit' },
    { id: 'list', label: 'List Navigation', desc: 'Arrow keys to navigate, Delete to remove, Ctrl+A to select all' },
    { id: 'editor', label: 'Text Editor', desc: 'Ctrl+Z/Y for undo/redo, Ctrl+B/I for bold/italic' },
    { id: 'modal', label: 'Modal Dialog', desc: 'Escape to close modal, Enter to confirm' },
  ];

  const currentDemo = demos.find(d => d.id === activeDemo);

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1 style={styles.title}>React Keyboard Shortcuts Demo</h1>
        <p style={styles.subtitle}>Interactive examples showing all package features</p>
      </header>

      {/* Tab Navigation */}
      <div style={styles.tabs}>
        {demos.map(demo => (
          <button
            key={demo.id}
            onClick={() => setActiveDemo(demo.id)}
            style={{
              ...styles.tab,
              ...(activeDemo === demo.id ? styles.activeTab : styles.inactiveTab),
            }}
          >
            {demo.label}
          </button>
        ))}
      </div>

      {/* Instructions */}
      <div style={styles.instructions}>
        <strong>Try it:</strong> {currentDemo?.desc}
      </div>

      {/* Demo Content */}
      <div style={styles.content}>
        {activeDemo === 'form' && <FormDemo />}
        {activeDemo === 'list' && <ListDemo />}
        {activeDemo === 'editor' && <EditorDemo />}
        {activeDemo === 'modal' && <ModalDemo />}
      </div>

      {/* Floating Button - Shows all registered shortcuts */}
      <FloatingShortcutsButton position="bottom-right" theme="dark" />
    </div>
  );
}
