import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Member } from '../lib/members';

interface SearchableSelectProps {
  members: Member[];
  value: string | null;
  onChange: (id: string | null) => void;
  placeholder?: string;
  genderFilter?: 'male' | 'female';
  label?: string;
  required?: boolean;
}

export default function SearchableSelect({
  members,
  value,
  onChange,
  placeholder = 'Cari nama...',
  genderFilter,
  label,
  required = false,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = members.filter(m => {
    if (genderFilter && m.gender !== genderFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return m.name.toLowerCase().includes(q) || (m.nickname && m.nickname.toLowerCase().includes(q));
    }
    return true;
  });

  const selectedMember = value ? members.find(m => m.id === value) : null;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required"> *</span>}
        </label>
      )}
      <div className="searchable-select" ref={containerRef}>
        <button
          type="button"
          className="searchable-select-trigger"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span style={{ color: selectedMember ? 'var(--color-text)' : 'var(--color-text-subtle)' }}>
            {selectedMember ? selectedMember.name : placeholder}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {selectedMember && (
              <X
                size={14}
                onClick={(e) => { e.stopPropagation(); onChange(null); }}
                style={{ cursor: 'pointer', color: 'var(--color-text-subtle)' }}
              />
            )}
            <ChevronDown size={16} />
          </span>
        </button>

        {isOpen && (
          <div className="searchable-select-dropdown">
            <div style={{ padding: '8px', borderBottom: '1px solid var(--color-border-light)' }}>
              <input
                ref={inputRef}
                type="text"
                className="input-field"
                placeholder="Ketik untuk mencari..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ minHeight: 40, fontSize: 14 }}
              />
            </div>
            <div style={{ maxHeight: 180, overflowY: 'auto' }}>
              {filtered.length === 0 ? (
                <div style={{ padding: '12px 14px', color: 'var(--color-text-subtle)', fontSize: 13, fontStyle: 'italic' }}>
                  Tidak ditemukan
                </div>
              ) : (
                filtered.map(m => (
                  <div
                    key={m.id}
                    className={`searchable-select-option ${value === m.id ? 'selected' : ''}`}
                    onClick={() => { onChange(m.id); setIsOpen(false); setSearch(''); }}
                  >
                    <span>{m.name}</span>
                    {m.nickname && <span style={{ color: 'var(--color-text-subtle)', marginLeft: 8, fontStyle: 'italic', fontSize: 12 }}>&ldquo;{m.nickname}&rdquo;</span>}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
