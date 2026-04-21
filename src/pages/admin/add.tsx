import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react';
import { Member } from '../../lib/members';
import OrnamentalDivider from '../../components/OrnamentalDivider';
import MemberForm from '../../components/MemberForm';

export default function AddPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState({ familyName: 'Keluarga Besar', subtitle: '' });

  useEffect(() => {
    const stored = localStorage.getItem('admin_auth');
    if (stored !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      router.replace('/admin/');
      return;
    }
  }, [router]);

  useEffect(() => {
    fetch('/config.json').then(r => r.json()).then(setConfig).catch(() => {});
    fetch('/api/members/')
      .then(r => r.json())
      .then(data => setMembers(data.members || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Head>
        <title>Tambah Anggota — Admin</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header className="site-header" style={{ position: 'relative' }}>
        <OrnamentalDivider />
        <h1>SILSILAH KELUARGA BESAR</h1>
        <div className="subtitle">{config.familyName}</div>
        <OrnamentalDivider />
      </header>

      <main style={{ marginTop: 'var(--header-height)', padding: '24px 20px', maxWidth: 640, marginLeft: 'auto', marginRight: 'auto' }}>
        <button
          className="btn-secondary"
          onClick={() => router.push('/admin/')}
          style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <ArrowLeft size={16} />
          Kembali
        </button>

        <div className="card-simple">
          <OrnamentalDivider />
          <h2 style={{
            textAlign: 'center',
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: 18,
            color: 'var(--color-text)',
            marginBottom: 20,
          }}>
            {members.length === 0 ? 'Inisialisasi Pohon Keluarga' : 'Tambah Anggota Baru'}
          </h2>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
              <div className="loading-spinner" />
            </div>
          ) : (
            <MemberForm members={members} isPunjer={members.length === 0} />
          )}
        </div>
      </main>
    </>
  );
}
