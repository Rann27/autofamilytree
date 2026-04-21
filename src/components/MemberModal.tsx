import React from 'react';
import { X } from 'lucide-react';
import { Member } from '../lib/members';
import { calculateAge } from '../lib/age';
import { getNasabChain } from '../lib/nasab';
import NasabChain from './NasabChain';
import OrnamentalDivider from './OrnamentalDivider';

interface MemberModalProps {
  member: Member;
  allMembers: Member[];
  onClose: () => void;
  onSelectMember: (member: Member) => void;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function MemberModal({ member, allMembers, onClose, onSelectMember }: MemberModalProps) {
  const nasabChain = getNasabChain(member.id, allMembers);
  const spouses = (member.spouseIds || [])
    .map(id => allMembers.find(m => m.id === id))
    .filter(Boolean) as Member[];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <OrnamentalDivider />
        <div style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--color-text-muted)', marginBottom: 16 }}>
          Biodata
        </div>

        {/* Photo & Info */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 20 }}>
          <div style={{
            width: 120, height: 120, borderRadius: '50%',
            border: '2px solid var(--color-sepia-light)',
            overflow: 'hidden', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--color-bg-dark)',
          }}>
            {member.photo ? (
              <img src={member.photo} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 36, color: 'var(--color-sepia)' }}>
                {getInitials(member.name)}
              </span>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--color-text)', lineHeight: 1.3, marginBottom: 4, wordBreak: 'break-word' }}>
              {member.name}
            </h2>
            {member.nickname && (
              <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', color: 'var(--color-text-muted)', marginBottom: 8 }}>
                &ldquo;{member.nickname}&rdquo;
              </div>
            )}
            {member.birthYear && (
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-text-muted)' }}>
                Lahir: {member.birthYear} &bull; ± {calculateAge(member.birthYear)} tahun
              </div>
            )}
            {spouses.length > 0 && (
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-text-muted)', marginTop: 4 }}>
                Pasangan: {spouses.map(s => s.name).join(', ')}
              </div>
            )}
          </div>
        </div>

        {/* Nasab Chain */}
        {nasabChain.length > 1 && (
          <>
            <OrnamentalDivider />
            <div style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--color-text-muted)', marginBottom: 12 }}>
              Nasab
            </div>
            <NasabChain
              chain={nasabChain}
              currentId={member.id}
              onSelect={onSelectMember}
            />
          </>
        )}

        <OrnamentalDivider />
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button className="btn-secondary" onClick={onClose}>Tutup</button>
        </div>
      </div>
    </div>
  );
}
