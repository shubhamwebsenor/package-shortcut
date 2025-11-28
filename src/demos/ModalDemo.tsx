import { useCallback, useEffect, useState } from 'react';
import { useKeyboardShortcuts } from '../packages/react-keyboard-shortcuts/src';

export default function ModalDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'confirm' | 'alert' | 'prompt'>('confirm');
  const [logs, setLogs] = useState<string[]>([]);
  const [promptValue, setPromptValue] = useState('');

  const { register, clear } = useKeyboardShortcuts('modal-demo');

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-5), `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  const handleConfirm = useCallback(() => {
    if (modalType === 'prompt') {
      addLog(`Confirmed with value: "${promptValue}"`);
    } else {
      addLog(`Confirmed ${modalType} modal`);
    }
    setIsModalOpen(false);
  }, [modalType, promptValue]);

  // Register shortcuts only when modal is open
  useEffect(() => {
    if (isModalOpen) {
      register([
        {
          keys: 'Escape',
          callback: () => {
            setIsModalOpen(false);
            addLog('Modal closed (Escape)');
          },
          options: { description: 'Close modal' }
        },
        {
          keys: 'Enter',
          callback: (e) => {
            e.preventDefault();
            handleConfirm();
          },
          options: { description: 'Confirm action' }
        },
      ]);
    } else {
      clear(); // Remove shortcuts when modal is closed
    }
  }, [isModalOpen, register, clear, handleConfirm]);

  const openModal = (type: 'confirm' | 'alert' | 'prompt') => {
    setModalType(type);
    setIsModalOpen(true);
    setPromptValue('');
    addLog(`Opened ${type} modal`);
  };

  const handleCancel = () => {
    addLog('Modal cancelled');
    setIsModalOpen(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.mainSection}>
        <h3 style={styles.heading}>Modal Dialog Demo</h3>
        <p style={styles.desc}>
          Shortcuts are registered only when the modal is open.
          This shows how to conditionally register shortcuts.
        </p>

        <div style={styles.buttonGroup}>
          <button onClick={() => openModal('confirm')} style={styles.btn}>
            Open Confirm Modal
          </button>
          <button onClick={() => openModal('alert')} style={{ ...styles.btn, backgroundColor: '#ff9800' }}>
            Open Alert Modal
          </button>
          <button onClick={() => openModal('prompt')} style={{ ...styles.btn, backgroundColor: '#9c27b0' }}>
            Open Prompt Modal
          </button>
        </div>

        <div style={styles.status}>
          Modal Status: <strong>{isModalOpen ? 'OPEN' : 'CLOSED'}</strong>
          <br />
          <small>Shortcuts active: {isModalOpen ? 'Yes (Escape, Enter)' : 'No'}</small>
        </div>
      </div>

      <div style={styles.logSection}>
        <h4>Activity Log</h4>
        <div style={styles.logBox}>
          {logs.length === 0 ? (
            <em style={{ color: '#999' }}>Open a modal and try Escape or Enter...</em>
          ) : (
            logs.map((log, i) => <div key={i} style={styles.logEntry}>{log}</div>)
          )}
        </div>
      </div>

      <div style={styles.codeSection}>
        <h4>Code Example - Conditional Registration</h4>
        <pre style={styles.code}>{`const { register, clear } = useKeyboardShortcuts('modal');

useEffect(() => {
  if (isModalOpen) {
    register([
      { keys: 'Escape', callback: closeModal },
      { keys: 'Enter', callback: confirm },
    ]);
  } else {
    clear(); // Remove shortcuts when closed
  }
}, [isModalOpen]);`}</pre>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div style={styles.overlay} onClick={handleCancel}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>
              {modalType === 'confirm' && 'Confirm Action'}
              {modalType === 'alert' && 'Alert!'}
              {modalType === 'prompt' && 'Enter Value'}
            </h3>

            <div style={styles.modalBody}>
              {modalType === 'confirm' && <p>Are you sure you want to proceed?</p>}
              {modalType === 'alert' && <p>This is an important message!</p>}
              {modalType === 'prompt' && (
                <input
                  type="text"
                  value={promptValue}
                  onChange={e => setPromptValue(e.target.value)}
                  placeholder="Enter something..."
                  style={styles.promptInput}
                  autoFocus
                />
              )}
            </div>

            <div style={styles.modalFooter}>
              <span style={styles.shortcutHint}>
                Press <kbd>Enter</kbd> to confirm, <kbd>Escape</kbd> to close
              </span>
              <div style={styles.modalButtons}>
                <button onClick={handleCancel} style={styles.cancelBtn}>Cancel</button>
                <button onClick={handleConfirm} style={styles.confirmBtn}>
                  {modalType === 'alert' ? 'OK' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  mainSection: { backgroundColor: '#fff3e0', padding: 20, borderRadius: 12 },
  heading: { margin: '0 0 8px', color: '#e65100' },
  desc: { color: '#666', marginBottom: 20, fontSize: 14 },
  buttonGroup: { display: 'flex', flexDirection: 'column', gap: 10 },
  btn: { padding: '12px 20px', backgroundColor: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14 },
  status: { marginTop: 20, padding: 12, backgroundColor: '#fff', borderRadius: 8 },
  logSection: { backgroundColor: '#f5f5f5', padding: 20, borderRadius: 12 },
  logBox: { backgroundColor: '#fff', padding: 12, borderRadius: 6, minHeight: 120, fontFamily: 'monospace', fontSize: 12 },
  logEntry: { padding: '4px 0', borderBottom: '1px solid #eee' },
  codeSection: { gridColumn: '1 / -1', backgroundColor: '#263238', padding: 20, borderRadius: 12 },
  code: { color: '#80cbc4', margin: 0, fontSize: 13, overflow: 'auto' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { backgroundColor: '#fff', borderRadius: 12, padding: 24, minWidth: 350, maxWidth: 450, boxShadow: '0 10px 40px rgba(0,0,0,0.2)' },
  modalTitle: { margin: '0 0 16px', color: '#333' },
  modalBody: { marginBottom: 20 },
  promptInput: { width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 14, boxSizing: 'border-box' },
  modalFooter: { display: 'flex', flexDirection: 'column', gap: 12 },
  shortcutHint: { fontSize: 12, color: '#666', textAlign: 'center' },
  modalButtons: { display: 'flex', gap: 10, justifyContent: 'flex-end' },
  cancelBtn: { padding: '8px 16px', backgroundColor: '#e0e0e0', border: 'none', borderRadius: 6, cursor: 'pointer' },
  confirmBtn: { padding: '8px 16px', backgroundColor: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' },
};
