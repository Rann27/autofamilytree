import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Plus, LogOut } from 'lucide-react';
import { Member } from '../../lib/members';
import OrnamentalDivider from '../../components/OrnamentalDivider';
import AdminTable from '../../components/AdminTable';

export default function AdminPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [pwError, setPwError] = useState('');
  const [config, setConfig] = useState({ familyName: 'Keluarga Besar', subtitle: '' });

  useEffect(() => {
    fetch('/config.json').then(r => r.json()).then(setConfig).catch(() => {});
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('admin_auth');
    if (stored === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthed(true);
    }
  }, []);

  useEffect(() => {
    if (authed) {
      fetch('/api/members/')
        .then(r => r.json())
        .then(data => setMembers(data.members || []))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [authed]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      localStorage.setItem('admin_auth', password);
      setAuthed(true);
      setPwError('');
    } else {
      setPwError('Kata sandi salah');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    setAuthed(false);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/members/${id}/`, { method: 'DELETE' });
      if (res.ok) {
        setMembers(prev => prev.filter(m => m.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/edit/${id}/`);
  };

  if (!authed) {
    return (
      <>
        <Head>
          <title>Admin — Silsilah Keluarga</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }}>
          <div className="card" style={{ width: '100%', maxWidth: 400 }}>
            <OrnamentalDivider />
            <h2 style={{
              textAlign: 'center',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 20,
              marginBottom: 4,
              color: 'var(--color-text)',
            }}>
              PANEL ADMIN
            </h2>
            <OrnamentalDivider />
            <form onSubmit={handleLogin} style={{ marginTop: 20 }}>
              <div className="form-group">
                <label className="form-label">Kata Sandi</label>
                <input
                  type="password"
                  className="input-field"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  autoFocus
                />
              </div>
              {pwError && <div className="form-error" style={{ marginBottom: 12 }}>{pwError}</div>}
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                Masuk
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{`Admin — Silsilah ${config.familyName}`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Header */}
      <header className="site-header" style={{ position: 'relative' }}>
        <OrnamentalDivider />
        <h1>SILSILAH KELUARGA BESAR</h1>
        <div className="subtitle">{config.familyName}</div>
        <OrnamentalDivider />
      </header>

      {/* Admin Sub-header */}
      <div style={{ marginTop: 'var(--header-height)' }}>
        <div className="admin-subheader">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: 14,
              color: 'var(--color-text-muted)',
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}>
              Panel Admin
            </span>
            <OrnamentalDivider style={{ display: 'inline-flex', width: 'auto', flex: 'unset' }} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-primary" onClick={() => router.push('/admin/add/')} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Plus size={16} />
              <span>Tambah Anggota</span>
            </button>
            <button className="btn-secondary" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <LogOut size={16} />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main style={{ padding: '20px', maxWidth: 1200, margin: '0 auto' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
            <div className="loading-spinner" />
          </div>
        ) : (
          <AdminTable
            members={members}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </main>
    </>
  );
}
