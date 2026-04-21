import React from 'react';
import { Member } from '../lib/members';

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface NasabChainProps {
  chain: Member[];
  currentId: string;
  onSelect: (member: Member) => void;
}

export default function NasabChain({ chain, currentId, onSelect }: NasabChainProps) {
  if (chain.length === 0) return null;

  return (
    <div className="nasab-chain">
      {chain.map((member, idx) => (
        <React.Fragment key={member.id}>
          {idx > 0 && (
            <span className="nasab-arrow">→</span>
          )}
          <div
            className={`nasab-card ${member.id === currentId ? 'current' : ''}`}
            onClick={() => onSelect(member)}
          >
            <div className="nasab-photo">
              {member.photo ? (
                <img src={member.photo} alt={member.name} />
              ) : (
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '12px', color: 'var(--color-sepia)' }}>
                  {getInitials(member.name)}
                </span>
              )}
            </div>
            <div className="nasab-name">{member.name}</div>
            {member.birthYear && <div className="nasab-year">{member.birthYear}</div>}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
