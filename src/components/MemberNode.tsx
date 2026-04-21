import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Member } from '../lib/members';

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function MemberNodeComponent({ data }: NodeProps<Member>) {
  const member = data;
  const isFemale = member.gender === 'female';

  return (
    <div className={`node-card ${isFemale ? 'female' : ''}`}>
      <Handle type="target" position={Position.Top} style={{ visibility: 'hidden' }} />
      <div className="photo-circle">
        {member.photo ? (
          <img src={member.photo} alt={member.name} />
        ) : (
          <span className="photo-initials">{getInitials(member.name)}</span>
        )}
      </div>
      <div className="node-name">{member.name}</div>
      {member.nickname && <div className="node-nickname">&ldquo;{member.nickname}&rdquo;</div>}
      {member.birthYear && (
        <div className="node-birth">✦ {member.birthYear} ✦</div>
      )}
      <Handle type="source" position={Position.Bottom} style={{ visibility: 'hidden' }} />
    </div>
  );
}

export default memo(MemberNodeComponent);
