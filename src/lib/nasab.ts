import { Member } from './members';

export function getNasabChain(memberId: string, members: Member[]): Member[] {
  const member = members.find(m => m.id === memberId);
  if (!member) return [];
  const pids = member.parentIds || [];
  if (pids.length === 0) return [member];

  const father = members.find(
    m => pids.includes(m.id) && m.gender === 'male'
  );

  if (father) {
    return [...getNasabChain(father.id, members), member];
  }

  const mother = members.find(m => pids.includes(m.id));
  if (mother) {
    return [...getNasabChain(mother.id, members), member];
  }

  return [member];
}
