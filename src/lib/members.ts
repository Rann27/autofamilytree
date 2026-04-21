import fs from 'fs';
import path from 'path';

export interface Member {
  id: string;
  name: string;
  nickname?: string;
  photo?: string;
  gender: 'male' | 'female';
  birthYear?: number;
  isAlive?: boolean;
  spouseIds?: string[];
  parentIds?: string[];
  childIds?: string[];
  createdAt?: string;
}

interface MembersData {
  members: Member[];
}

const DATA_PATH = path.join(process.cwd(), 'data', 'members.json');

function ensureFile(): void {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_PATH)) {
    fs.writeFileSync(DATA_PATH, JSON.stringify({ members: [] }, null, 2), 'utf-8');
  }
}

export function readMembers(): Member[] {
  ensureFile();
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  const data: MembersData = JSON.parse(raw);
  return data.members;
}

function writeMembers(members: Member[]): void {
  ensureFile();
  const data: MembersData = { members };
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export function getMemberById(id: string): Member | undefined {
  return readMembers().find(m => m.id === id);
}

export function addMember(member: Member): Member {
  const members = readMembers();
  const newMember: Member = {
    ...member,
    spouseIds: member.spouseIds || [],
    parentIds: member.parentIds || [],
    childIds: member.childIds || [],
    createdAt: new Date().toISOString(),
  };
  members.push(newMember);
  writeMembers(members);
  return newMember;
}

export function addChild(
  newMember: Member,
  fatherId?: string,
  motherId?: string
): Member {
  const parentIds = [fatherId, motherId].filter(Boolean) as string[];
  const member: Member = {
    ...newMember,
    parentIds,
    spouseIds: newMember.spouseIds || [],
    childIds: newMember.childIds || [],
    createdAt: new Date().toISOString(),
  };

  const members = readMembers();
  members.push(member);

  if (fatherId) {
    const father = members.find(m => m.id === fatherId);
    if (father) {
      father.childIds = father.childIds || [];
      if (!father.childIds.includes(member.id)) {
        father.childIds.push(member.id);
      }
    }
  }

  if (motherId) {
    const mother = members.find(m => m.id === motherId);
    if (mother) {
      mother.childIds = mother.childIds || [];
      if (!mother.childIds.includes(member.id)) {
        mother.childIds.push(member.id);
      }
    }
  }

  writeMembers(members);
  return member;
}

export function addSpouse(
  newMember: Member,
  partnerId: string
): Member {
  const member: Member = {
    ...newMember,
    spouseIds: [partnerId],
    parentIds: newMember.parentIds || [],
    childIds: newMember.childIds || [],
    createdAt: new Date().toISOString(),
  };

  const members = readMembers();
  members.push(member);

  const partner = members.find(m => m.id === partnerId);
  if (partner) {
    partner.spouseIds = partner.spouseIds || [];
    if (!partner.spouseIds.includes(member.id)) {
      partner.spouseIds.push(member.id);
    }
  }

  writeMembers(members);
  return member;
}

export function updateMember(id: string, updates: Partial<Member>): Member | null {
  const members = readMembers();
  const idx = members.findIndex(m => m.id === id);
  if (idx === -1) return null;

  members[idx] = { ...members[idx], ...updates, id };
  writeMembers(members);
  return members[idx];
}

export function deleteMember(id: string): boolean {
  const members = readMembers();
  const idx = members.findIndex(m => m.id === id);
  if (idx === -1) return false;

  members.forEach(m => {
    m.spouseIds = (m.spouseIds || []).filter(sid => sid !== id);
    m.parentIds = (m.parentIds || []).filter(pid => pid !== id);
    m.childIds = (m.childIds || []).filter(cid => cid !== id);
  });

  members.splice(idx, 1);
  writeMembers(members);
  return true;
}
