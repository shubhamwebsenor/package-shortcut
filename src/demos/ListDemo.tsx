import { useEffect, useState } from 'react';
import { useKeyboardShortcuts } from '../packages/react-keyboard-shortcuts/src';

const initialItems = [
  { id: 1, name: 'Apple', selected: false },
  { id: 2, name: 'Banana', selected: false },
  { id: 3, name: 'Cherry', selected: false },
  { id: 4, name: 'Date', selected: false },
  { id: 5, name: 'Elderberry', selected: false },
];

export default function ListDemo() {
  const [items, setItems] = useState(initialItems);
  const [focusIndex, setFocusIndex] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const { register } = useKeyboardShortcuts('list-demo');

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-5), `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  useEffect(() => {
    register([
      {
        keys: 'ArrowUp',
        callback: () => {
          setFocusIndex(i => {
            const newIndex = Math.max(0, i - 1);
            addLog(`Moved to: ${items[newIndex]?.name}`);
            return newIndex;
          });
        },
        options: { description: 'Move up' }
      },
      {
        keys: 'ArrowDown',
        callback: () => {
          setFocusIndex(i => {
            const newIndex = Math.min(items.length - 1, i + 1);
            addLog(`Moved to: ${items[newIndex]?.name}`);
            return newIndex;
          });
        },
        options: { description: 'Move down' }
      },
      {
        keys: 'Space',
        callback: (e) => {
          e.preventDefault();
          setItems(prev => prev.map((item, i) =>
            i === focusIndex ? { ...item, selected: !item.selected } : item
          ));
          addLog(`Toggled: ${items[focusIndex]?.name}`);
        },
        options: { description: 'Toggle selection' }
      },
      {
        keys: 'Delete',
        callback: () => {
          const deletedName = items[focusIndex]?.name;
          setItems(prev => prev.filter((_, i) => i !== focusIndex));
          setFocusIndex(i => Math.min(i, items.length - 2));
          addLog(`Deleted: ${deletedName}`);
        },
        options: { description: 'Delete item' }
      },
      {
        keys: 'Ctrl+A',
        callback: (e) => {
          e.preventDefault();
          setItems(prev => prev.map(item => ({ ...item, selected: true })));
          addLog('Selected all items');
        },
        options: { description: 'Select all' }
      },
      {
        keys: 'Escape',
        callback: () => {
          setItems(prev => prev.map(item => ({ ...item, selected: false })));
          addLog('Deselected all');
        },
        options: { description: 'Deselect all' }
      },
    ]);
  }, [register, items, focusIndex]);

  const resetList = () => {
    setItems(initialItems);
    setFocusIndex(0);
    addLog('List reset');
  };

  return (
    <div style={styles.container}>
      <div style={styles.listSection}>
        <h3 style={styles.heading}>Fruit List</h3>

        <ul style={styles.list}>
          {items.map((item, index) => (
            <li
              key={item.id}
              style={{
                ...styles.listItem,
                backgroundColor: index === focusIndex ? '#bbdefb' : '#fff',
                borderLeft: item.selected ? '4px solid #4caf50' : '4px solid transparent',
              }}
            >
              <span>{item.selected ? '✓ ' : ''}{item.name}</span>
              {index === focusIndex && <span style={styles.cursor}>◄</span>}
            </li>
          ))}
        </ul>

        {items.length === 0 && (
          <p style={{ textAlign: 'center', color: '#999' }}>List is empty</p>
        )}

        <button onClick={resetList} style={styles.resetBtn}>Reset List</button>

        <div style={styles.hint}>
          Selected: {items.filter(i => i.selected).length} / {items.length}
        </div>
      </div>

      <div style={styles.logSection}>
        <h4>Activity Log</h4>
        <div style={styles.logBox}>
          {logs.length === 0 ? (
            <em style={{ color: '#999' }}>Use arrow keys, Space, Delete...</em>
          ) : (
            logs.map((log, i) => <div key={i} style={styles.logEntry}>{log}</div>)
          )}
        </div>
      </div>

      <div style={styles.codeSection}>
        <h4>Code Example</h4>
        <pre style={styles.code}>{`register([
  { keys: 'ArrowUp', callback: () => moveUp() },
  { keys: 'ArrowDown', callback: () => moveDown() },
  { keys: 'Space', callback: (e) => { e.preventDefault(); toggleSelect(); } },
  { keys: 'Delete', callback: () => deleteItem() },
  { keys: 'Ctrl+A', callback: (e) => { e.preventDefault(); selectAll(); } },
]);`}</pre>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  listSection: { backgroundColor: '#e8f5e9', padding: 20, borderRadius: 12 },
  heading: { margin: '0 0 16px', color: '#2e7d32' },
  list: { listStyle: 'none', padding: 0, margin: 0 },
  listItem: { padding: '12px 16px', marginBottom: 4, borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.15s' },
  cursor: { color: '#1976d2', fontWeight: 'bold' },
  resetBtn: { marginTop: 16, padding: '8px 16px', backgroundColor: '#2e7d32', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' },
  hint: { marginTop: 12, fontSize: 13, color: '#666' },
  logSection: { backgroundColor: '#f5f5f5', padding: 20, borderRadius: 12 },
  logBox: { backgroundColor: '#fff', padding: 12, borderRadius: 6, minHeight: 120, fontFamily: 'monospace', fontSize: 12 },
  logEntry: { padding: '4px 0', borderBottom: '1px solid #eee' },
  codeSection: { gridColumn: '1 / -1', backgroundColor: '#263238', padding: 20, borderRadius: 12 },
  code: { color: '#80cbc4', margin: 0, fontSize: 13, overflow: 'auto' },
};
