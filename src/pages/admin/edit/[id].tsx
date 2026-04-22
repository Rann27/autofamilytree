import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react';
import { Member } from '../../../lib/members';
import OrnamentalDivider from '../../../components/OrnamentalDivider';
import MemberForm from '../../../components/MemberForm';

export default function EditPage() {
  const router = useRouter();
  const { id } = router.query;
  const [members, setMembers] = useState<Member[]>([]);
  const [editMember, setEditMember] = useState<Member | null>(null);
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
    if (!id || typeof id !== 'string') return;

    fetch('/api/config/').then(r => r.json()).then(setConfig).catch(() => {});

    Promise.all([
      fetch('/api/members/').then(r => r.json()),
      fetch(`/api/members/${id}/`).then(r => r.json()),
    ])
      .then(([allData, oneData]) => {
        setMembers(allData.members || []);
        setEditMember(oneData.member || null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <>
      <Head>
        <title>Edit Anggota — Admin</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header className="site-header" style={{ position: 'relative' }}>
        <OrnamentalDivider />
        <h1>SILSILAH {config.familyName.toUpperCase()}</h1>
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
            Edit Anggota
          </h2>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
              <div className="loading-spinner" />
            </div>
          ) : editMember ? (
            <MemberForm members={members} editMember={editMember} />
          ) : (
            <div className="empty-state">
              <div className="empty-state-text">Anggota tidak ditemukan</div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
