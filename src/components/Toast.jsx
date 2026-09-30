import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts = [], onDismiss }) {
  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast-msg ${t.type || 'info'}`}>
          {t.type === 'success' && <CheckCircle2 size={18} />}
          {t.type === 'error' && <AlertCircle size={18} />}
          {t.type === 'info' && <Info size={18} />}
          <span style={{ flexGrow: 1 }}>{t.message}</span>
          <button
            onClick={() => onDismiss(t.id)}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              opacity: 0.8,
              padding: '2px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}
