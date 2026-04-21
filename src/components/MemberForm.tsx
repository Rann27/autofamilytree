import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Member } from '../lib/members';
import SearchableSelect from './SearchableSelect';
import PhotoUpload from './PhotoUpload';

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

type AddType = 'punjer' | 'child' | 'spouse';

interface MemberFormProps {
  members: Member[];
  editMember?: Member;
  isPunjer?: boolean;
}

export default function MemberForm({ members, editMember, isPunjer }: MemberFormProps) {
  const router = useRouter();
  const isEdit = !!editMember;

  const [addType, setAddType] = useState<AddType>(isPunjer ? 'punjer' : 'child');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [birthYear, setBirthYear] = useState('');
  const [isAlive, setIsAlive] = useState(true);
  const [fatherId, setFatherId] = useState<string | null>(null);
  const [motherId, setMotherId] = useState<string | null>(null);
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editMember) {
      setName(editMember.name);
      setNickname(editMember.nickname || '');
      setGender(editMember.gender);
      setBirthYear(editMember.birthYear?.toString() || '');
      setIsAlive(editMember.isAlive !== false);
      setPhoto(editMember.photo);
      const pIds = editMember.parentIds || [];
      const f = members.find(m => pIds.includes(m.id) && m.gender === 'male');
      const m2 = members.find(m => pIds.includes(m.id) && m.gender === 'female');
      setFatherId(f?.id || null);
      setMotherId(m2?.id || null);
      const sIds = editMember.spouseIds || [];
      if (sIds.length > 0) setPartnerId(sIds[0]);
    }
  }, [editMember, members]);

  const handlePhotoSelect = (file: File) => {
    setPhotoFile(file);
    const url = URL.createObjectURL(file);
    setPhoto(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Nama lengkap wajib diisi');
      return;
    }

    if (!isEdit && addType === 'punjer') {
      // Punjer needs no validation beyond name
    } else if (!isEdit && addType === 'child' && !fatherId && !motherId) {
      setError('Minimal salah satu orang tua harus dipilih');
      return;
    } else if (!isEdit && addType === 'spouse' && !partnerId) {
      setError('Pasangan wajib dipilih');
      return;
    }

    setSaving(true);

    try {
      let uploadedPhoto = photo;
      if (photoFile) {
        const base64 = await fileToBase64(photoFile);
        const uploadRes = await fetch('/api/upload/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ photo: base64 }),
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          uploadedPhoto = uploadData.path;
        }
      }

      const memberData: Record<string, unknown> = {
        name: name.trim(),
        nickname: nickname.trim() || undefined,
        gender,
        birthYear: birthYear ? parseInt(birthYear) : undefined,
        isAlive,
        photo: uploadedPhoto,
      };

      if (isEdit && editMember) {
        memberData.parentIds = [fatherId, motherId].filter(Boolean);
        if (partnerId) memberData.spouseIds = [partnerId];
        const res = await fetch(`/api/members/${editMember.id}/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(memberData),
        });
        if (!res.ok) throw new Error('Gagal menyimpan');
      } else {
        let res: Response;
        if (addType === 'punjer') {
          res = await fetch('/api/members/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...memberData,
              addType: 'punjer',
            }),
          });
        } else if (addType === 'child') {
          res = await fetch('/api/members/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...memberData,
              addType: 'child',
              fatherId,
              motherId,
            }),
          });
        } else {
          res = await fetch('/api/members/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...memberData,
              addType: 'spouse',
              partnerId,
            }),
          });
        }
        if (!res.ok) throw new Error('Gagal menyimpan');
      }

      router.push('/admin/');
    } catch (err) {
      setError('Terjadi kesalahan saat menyimpan. Silakan coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  const maxYear = new Date().getFullYear();

  return (
    <form onSubmit={handleSubmit}>
      {!isEdit && isPunjer && (
        <div className="form-group">
          <div style={{
            background: 'var(--color-bg-dark)',
            border: '1.5px solid var(--color-sepia)',
            borderRadius: 2,
            padding: '12px 16px',
            textAlign: 'center',
          }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--color-sepia)', letterSpacing: 1 }}>
              ✦ PUNJER — Pendiri Moyang ✦
            </span>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-text-muted)', margin: '6px 0 0', fontStyle: 'italic' }}>
              Ini adalah anggota pertama yang menjadi pangkal pohon keluarga. Dari sinilah silsilah dimulai.
            </p>
          </div>
        </div>
      )}

      {!isEdit && !isPunjer && (
        <div className="form-group">
          <label className="form-label">Tambahkan sebagai</label>
          <div className="radio-group">
            <label className="radio-label">
              <input type="radio" name="addType" checked={addType === 'child'} onChange={() => setAddType('child')} />
              Anak
            </label>
            <label className="radio-label">
              <input type="radio" name="addType" checked={addType === 'spouse'} onChange={() => setAddType('spouse')} />
              Suami / Istri
            </label>
          </div>
        </div>
      )}

      <PhotoUpload value={photo} onChange={setPhoto} onFileSelect={handlePhotoSelect} />

      <div className="form-group">
        <label className="form-label">Nama Lengkap <span className="required">*</span></label>
        <input type="text" className="input-field" value={name} onChange={e => setName(e.target.value)} placeholder="Nama lengkap" />
      </div>

      <div className="form-group">
        <label className="form-label">Nama Panggilan</label>
        <input type="text" className="input-field" value={nickname} onChange={e => setNickname(e.target.value)} placeholder="Nama panggilan" />
      </div>

      <div className="form-group">
        <label className="form-label">Jenis Kelamin <span className="required">*</span></label>
        <div className="radio-group">
          <label className="radio-label">
            <input type="radio" name="gender" checked={gender === 'male'} onChange={() => setGender('male')} />
            Laki-laki
          </label>
          <label className="radio-label">
            <input type="radio" name="gender" checked={gender === 'female'} onChange={() => setGender('female')} />
            Perempuan
          </label>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Tahun Lahir</label>
        <input
          type="number"
          className="input-field"
          value={birthYear}
          onChange={e => setBirthYear(e.target.value)}
          placeholder="Contoh: 1990"
          min={1800}
          max={maxYear}
        />
      </div>

      {(addType === 'child' || (isEdit && !isPunjer)) && (
        <div className="form-two-col">
          <SearchableSelect
            members={members}
            value={fatherId}
            onChange={setFatherId}
            placeholder="Pilih ayah..."
            genderFilter="male"
            label="Ayah"
          />
          <SearchableSelect
            members={members}
            value={motherId}
            onChange={setMotherId}
            placeholder="Pilih ibu..."
            genderFilter="female"
            label="Ibu"
          />
        </div>
      )}

      {(addType === 'child' || (isEdit && !isPunjer)) && !isEdit && (
        <p className="form-hint">
          Minimal salah satu orang tua harus dipilih. Orang tua yang dipilih akan otomatis terhubung ke pohon.
        </p>
      )}

      {(addType === 'spouse' || (isEdit && !isPunjer && partnerId)) && (
        <SearchableSelect
          members={members}
          value={partnerId}
          onChange={setPartnerId}
          placeholder="Cari nama pasangan..."
          label="Pasangan"
          required={!isEdit}
        />
      )}

      {error && <div className="form-error" style={{ marginBottom: 16 }}>{error}</div>}

      <div className="form-actions-sticky" style={{ borderTop: '1.5px solid var(--color-border-light)', paddingTop: 16, display: 'flex', gap: 12 }}>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Menyimpan...' : 'Simpan'}
        </button>
        <button type="button" className="btn-secondary" onClick={() => router.push('/admin/')}>
          Batal
        </button>
      </div>
    </form>
  );
}
