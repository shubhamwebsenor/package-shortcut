import { useEffect, useState } from 'react';
import { useKeyboardShortcuts } from '../packages/react-keyboard-shortcuts/src';

export default function EditorDemo() {
  const [text, setText] = useState('Type something here and try the shortcuts!');
  const [history, setHistory] = useState<string[]>(['Type something here and try the shortcuts!']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [formatting, setFormatting] = useState({ bold: false, italic: false, underline: false });
  const [logs, setLogs] = useState<string[]>([]);

  const { register, disable, enable } = useKeyboardShortcuts('editor-demo');
  const [shortcutsEnabled, setShortcutsEnabled] = useState(true);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-5), `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  const saveToHistory = (newText: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newText);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  useEffect(() => {
    register([
      {
        keys: 'Ctrl+Z',
        callback: (e) => {
          e.preventDefault();
          if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setText(history[newIndex]);
            addLog('Undo');
          } else {
            addLog('Nothing to undo');
          }
        },
        options: { description: 'Undo' }
      },
      {
        keys: 'Ctrl+Y',
        callback: (e) => {
          e.preventDefault();
          if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setText(history[newIndex]);
            addLog('Redo');
          } else {
            addLog('Nothing to redo');
          }
        },
        options: { description: 'Redo' }
      },
      {
        keys: 'Ctrl+B',
        callback: (e) => {
          e.preventDefault();
          setFormatting(f => ({ ...f, bold: !f.bold }));
          addLog(`Bold: ${!formatting.bold ? 'ON' : 'OFF'}`);
        },
        options: { description: 'Toggle Bold' }
      },
      {
        keys: 'Ctrl+I',
        callback: (e) => {
          e.preventDefault();
          setFormatting(f => ({ ...f, italic: !f.italic }));
          addLog(`Italic: ${!formatting.italic ? 'ON' : 'OFF'}`);
        },
        options: { description: 'Toggle Italic' }
      },
      {
        keys: 'Ctrl+U',
        callback: (e) => {
          e.preventDefault();
          setFormatting(f => ({ ...f, underline: !f.underline }));
          addLog(`Underline: ${!formatting.underline ? 'ON' : 'OFF'}`);
        },
        options: { description: 'Toggle Underline' }
      },
      {
        keys: 'Ctrl+S',
        callback: (e) => {
          e.preventDefault();
          addLog(`Saved! (${text.length} chars)`);
        },
        options: { description: 'Save document' }
      },
    ]);
  }, [register, historyIndex, history, formatting, text.length]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    saveToHistory(newText);
  };

  const toggleShortcuts = () => {
    const keys = ['Ctrl+Z', 'Ctrl+Y', 'Ctrl+B', 'Ctrl+I', 'Ctrl+U', 'Ctrl+S'];
    if (shortcutsEnabled) {
      disable(keys);
      addLog('All shortcuts DISABLED');
    } else {
      enable(keys);
      addLog('All shortcuts ENABLED');
    }
    setShortcutsEnabled(!shortcutsEnabled);
  };

  return (
    <div style={styles.container}>
      <div style={styles.editorSection}>
        <h3 style={styles.heading}>Text Editor</h3>

        <div style={styles.toolbar}>
          <button
            style={{ ...styles.toolBtn, fontWeight: formatting.bold ? 'bold' : 'normal', backgroundColor: formatting.bold ? '#bbdefb' : '#fff' }}
            onClick={() => setFormatting(f => ({ ...f, bold: !f.bold }))}
          >
            B
          </button>
          <button
            style={{ ...styles.toolBtn, fontStyle: formatting.italic ? 'italic' : 'normal', backgroundColor: formatting.italic ? '#bbdefb' : '#fff' }}
            onClick={() => setFormatting(f => ({ ...f, italic: !f.italic }))}
          >
            I
          </button>
          <button
            style={{ ...styles.toolBtn, textDecoration: formatting.underline ? 'underline' : 'none', backgroundColor: formatting.underline ? '#bbdefb' : '#fff' }}
            onClick={() => setFormatting(f => ({ ...f, underline: !f.underline }))}
          >
            U
          </button>
          <span style={styles.separator}>|</span>
          <button style={styles.toolBtn} onClick={() => historyIndex > 0 && setHistoryIndex(i => i - 1)}>↶ Undo</button>
          <button style={styles.toolBtn} onClick={() => historyIndex < history.length - 1 && setHistoryIndex(i => i + 1)}>↷ Redo</button>
        </div>

        <textarea
          value={text}
          onChange={handleTextChange}
          style={{
            ...styles.textarea,
            fontWeight: formatting.bold ? 'bold' : 'normal',
            fontStyle: formatting.italic ? 'italic' : 'normal',
            textDecoration: formatting.underline ? 'underline' : 'none',
          }}
        />

        <div style={styles.statusBar}>
          <span>History: {historyIndex + 1}/{history.length}</span>
          <span>Chars: {text.length}</span>
        </div>

        <button onClick={toggleShortcuts} style={{ ...styles.toggleBtn, backgroundColor: shortcutsEnabled ? '#4caf50' : '#f44336' }}>
          Shortcuts: {shortcutsEnabled ? 'ON' : 'OFF'}
        </button>
      </div>

      <div style={styles.logSection}>
        <h4>Activity Log</h4>
        <div style={styles.logBox}>
          {logs.length === 0 ? (
            <em style={{ color: '#999' }}>Try Ctrl+B, Ctrl+I, Ctrl+Z, Ctrl+S...</em>
          ) : (
            logs.map((log, i) => <div key={i} style={styles.logEntry}>{log}</div>)
          )}
        </div>
      </div>

      <div style={styles.codeSection}>
        <h4>Code Example - Enable/Disable</h4>
        <pre style={styles.code}>{`const { register, disable, enable } = useKeyboardShortcuts('editor');

// Disable specific shortcuts
disable(['Ctrl+Z', 'Ctrl+Y']);

// Re-enable them
enable(['Ctrl+Z', 'Ctrl+Y']);`}</pre>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  editorSection: { backgroundColor: '#f3e5f5', padding: 20, borderRadius: 12 },
  heading: { margin: '0 0 16px', color: '#7b1fa2' },
  toolbar: { display: 'flex', gap: 4, marginBottom: 12, alignItems: 'center' },
  toolBtn: { padding: '6px 12px', border: '1px solid #ccc', borderRadius: 4, cursor: 'pointer', backgroundColor: '#fff' },
  separator: { color: '#ccc', margin: '0 8px' },
  textarea: { width: '100%', minHeight: 150, padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 14, resize: 'vertical', boxSizing: 'border-box' },
  statusBar: { display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: '#666' },
  toggleBtn: { marginTop: 12, padding: '8px 16px', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' },
  logSection: { backgroundColor: '#f5f5f5', padding: 20, borderRadius: 12 },
  logBox: { backgroundColor: '#fff', padding: 12, borderRadius: 6, minHeight: 120, fontFamily: 'monospace', fontSize: 12 },
  logEntry: { padding: '4px 0', borderBottom: '1px solid #eee' },
  codeSection: { gridColumn: '1 / -1', backgroundColor: '#263238', padding: 20, borderRadius: 12 },
  code: { color: '#80cbc4', margin: 0, fontSize: 13, overflow: 'auto' },
};
