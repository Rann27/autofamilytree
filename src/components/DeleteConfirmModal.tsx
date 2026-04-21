import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  memberName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({ memberName, onConfirm, onCancel }: DeleteConfirmModalProps) {
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 400, textAlign: 'center' }}>
        <AlertTriangle size={40} style={{ color: 'var(--color-error)', marginBottom: 16 }} />
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: 'var(--color-text)', marginBottom: 8 }}>
          Hapus Anggota
        </h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 24 }}>
          Apakah Anda yakin ingin menghapus <strong>{memberName}</strong>? Tindakan ini tidak dapat dibatalkan dan semua hubungan keluarga akan terputus.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn-secondary" onClick={onCancel}>Batal</button>
          <button className="btn-danger" onClick={onConfirm}>Hapus</button>
        </div>
      </div>
    </div>
  );
}
