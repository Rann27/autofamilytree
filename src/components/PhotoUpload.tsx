import React, { useCallback, useRef, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface PhotoUploadProps {
  value?: string;
  onChange: (photoPath: string) => void;
  onFileSelect: (file: File) => void;
}

export default function PhotoUpload({ value, onChange, onFileSelect }: PhotoUploadProps) {
  const [dragover, setDragover] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragover(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  return (
    <div className="form-group">
      <label className="form-label">Foto</label>
      <div
        className={`photo-upload-zone ${dragover ? 'dragover' : ''}`}
        onDragOver={e => { e.preventDefault(); setDragover(true); }}
        onDragLeave={() => setDragover(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        {value ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src={value} alt="Preview" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-sepia-light)' }} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-muted)' }}>
              Klik untuk ganti foto
            </span>
          </div>
        ) : (
          <>
            <Upload size={24} style={{ color: 'var(--color-text-subtle)' }} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-subtle)' }}>
              Seret foto atau klik untuk memilih
            </span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--color-text-subtle)', fontStyle: 'italic' }}>
              Maks 2MB, JPG/PNG
            </span>
          </>
        )}
      </div>
    </div>
  );
}
