import React, { useState, useMemo } from 'react';
import { Search, Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { Member } from '../lib/members';
import DeleteConfirmModal from './DeleteConfirmModal';

interface AdminTableProps {
  members: Member[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function AdminTable({ members, onEdit, onDelete }: AdminTableProps) {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'name' | 'birthYear'>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null);

  const filtered = useMemo(() => {
    let list = [...members];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(m =>
        m.name.toLowerCase().includes(q) ||
        (m.nickname && m.nickname.toLowerCase().includes(q))
      );
    }
    list.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortField === 'birthYear') cmp = (a.birthYear || 0) - (b.birthYear || 0);
      return sortAsc ? cmp : -cmp;
    });
    return list;
  }, [members, search, sortField, sortAsc]);

  const toggleSort = (field: 'name' | 'birthYear') => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(true); }
  };

  const handleDelete = () => {
    if (deleteTarget) {
      onDelete(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      {/* Search */}
      <div style={{ marginBottom: 16, position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
        <input
          type="text"
          className="input-field"
          placeholder="Cari nama anggota..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft: 38 }}
        />
      </div>

      {/* Desktop/Tablet Table */}
      <div className="table-wrapper admin-table-desktop" style={{ display: 'none' }}>
        <style>{`@media(min-width:641px){.admin-table-desktop{display:block!important}}`}</style>
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-text">Belum ada anggota</div>
            <div className="empty-state-hint">Tambahkan anggota pertama melalui tombol di atas</div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th style={{ width: 50 }}>Foto</th>
                <th onClick={() => toggleSort('name')}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    Nama Lengkap <ArrowUpDown size={12} />
                  </span>
                </th>
                <th>Panggilan</th>
                <th className="hide-mobile" onClick={() => toggleSort('birthYear')}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    Lahir <ArrowUpDown size={12} />
                  </span>
                </th>
                <th style={{ width: 120 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id}>
                  <td>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      border: '1.5px solid var(--color-sepia-light)',
                      overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'var(--color-bg-dark)',
                    }}>
                      {m.photo ? (
                        <img src={m.photo} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 12, color: 'var(--color-sepia)' }}>
                          {getInitials(m.name)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>{m.name}</td>
                  <td style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                    {m.nickname || '-'}
                  </td>
                  <td className="hide-mobile">{m.birthYear || '-'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn-icon" onClick={() => onEdit(m.id)} title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-icon" onClick={() => setDeleteTarget(m)} title="Hapus" style={{ color: 'var(--color-error)', borderColor: 'var(--color-error)' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Mobile Card List */}
      <div className="admin-table-mobile">
        <style>{`@media(min-width:641px){.admin-table-mobile{display:none!important}}`}</style>
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-text">Belum ada anggota</div>
            <div className="empty-state-hint">Tambahkan anggota pertama</div>
          </div>
        ) : (
          filtered.map(m => (
            <div key={m.id} className="mobile-member-card">
              <div style={{
                width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                border: '1.5px solid var(--color-sepia-light)', overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--color-bg-dark)',
              }}>
                {m.photo ? (
                  <img src={m.photo} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 12, color: 'var(--color-sepia)' }}>
                    {getInitials(m.name)}
                  </span>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {m.name}
                </div>
                {m.nickname && (
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                    &ldquo;{m.nickname}&rdquo;
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button className="btn-icon" onClick={() => onEdit(m.id)} style={{ minWidth: 36, minHeight: 36, padding: 6 }}>
                  <Edit2 size={14} />
                </button>
                <button className="btn-icon" onClick={() => setDeleteTarget(m)} style={{ minWidth: 36, minHeight: 36, padding: 6, color: 'var(--color-error)', borderColor: 'var(--color-error)' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {deleteTarget && (
        <DeleteConfirmModal
          memberName={deleteTarget.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
