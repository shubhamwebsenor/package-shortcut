import { useEffect, useState } from 'react';
import { useKeyboardShortcuts } from '../packages/react-keyboard-shortcuts/src';

export default function FormDemo() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [logs, setLogs] = useState<string[]>([]);
  const [saveCount, setSaveCount] = useState(0);

  const { register } = useKeyboardShortcuts('form-demo');

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-5), `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  useEffect(() => {
    register([
      {
        keys: 'Ctrl+S',
        callback: (e) => {
          e.preventDefault();
          setSaveCount(c => c + 1);
          addLog(`Form saved! (Name: ${formData.name || 'empty'})`);
        },
        options: { description: 'Save form' }
      },
      {
        keys: 'Escape',
        callback: () => {
          setFormData({ name: '', email: '', message: '' });
          addLog('Form cleared');
        },
        options: { description: 'Clear form' }
      },
      {
        keys: 'Ctrl+Enter',
        callback: (e) => {
          e.preventDefault();
          addLog('Form submitted!');
          alert('Form submitted successfully!');
        },
        options: { description: 'Submit form' }
      },
    ]);
  }, [register, formData.name]);

  return (
    <div style={styles.container}>
      <div style={styles.formSection}>
        <h3 style={styles.heading}>Contact Form</h3>

        <div style={styles.field}>
          <label>Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter your name"
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            placeholder="Enter your email"
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label>Message:</label>
          <textarea
            value={formData.message}
            onChange={e => setFormData({ ...formData, message: e.target.value })}
            placeholder="Enter your message"
            style={{ ...styles.input, minHeight: 80 }}
          />
        </div>

        <div style={styles.stats}>
          Save count: <strong>{saveCount}</strong>
        </div>
      </div>

      <div style={styles.logSection}>
        <h4>Activity Log</h4>
        <div style={styles.logBox}>
          {logs.length === 0 ? (
            <em style={{ color: '#999' }}>Try pressing Ctrl+S, Escape, or Ctrl+Enter...</em>
          ) : (
            logs.map((log, i) => <div key={i} style={styles.logEntry}>{log}</div>)
          )}
        </div>
      </div>

      <div style={styles.codeSection}>
        <h4>Code Example</h4>
        <pre style={styles.code}>{`const { register } = useKeyboardShortcuts('form-demo');

useEffect(() => {
  register([
    {
      keys: 'Ctrl+S',
      callback: (e) => {
        e.preventDefault();
        saveForm();
      },
      options: { description: 'Save form' }
    },
    {
      keys: 'Escape',
      callback: () => clearForm(),
      options: { description: 'Clear form' }
    }
  ]);
}, [register]);`}</pre>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  formSection: { backgroundColor: '#e3f2fd', padding: 20, borderRadius: 12 },
  heading: { margin: '0 0 16px', color: '#1565c0' },
  field: { marginBottom: 12 },
  input: { width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc', marginTop: 4, boxSizing: 'border-box' },
  stats: { marginTop: 16, padding: 10, backgroundColor: '#fff', borderRadius: 6 },
  logSection: { backgroundColor: '#f5f5f5', padding: 20, borderRadius: 12 },
  logBox: { backgroundColor: '#fff', padding: 12, borderRadius: 6, minHeight: 120, fontFamily: 'monospace', fontSize: 12 },
  logEntry: { padding: '4px 0', borderBottom: '1px solid #eee' },
  codeSection: { gridColumn: '1 / -1', backgroundColor: '#263238', padding: 20, borderRadius: 12 },
  code: { color: '#80cbc4', margin: 0, fontSize: 13, overflow: 'auto' },
};
