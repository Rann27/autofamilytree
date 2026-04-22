import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { Member } from '../lib/members';
import OrnamentalDivider from '../components/OrnamentalDivider';

const FamilyTree = dynamic(() => import('../components/FamilyTree'), { ssr: false });

interface Config {
  familyName: string;
  subtitle: string;
}

export default function Home() {
  const [members, setMembers] = useState<Member[]>([]);
  const [config, setConfig] = useState<Config>({ familyName: 'Keluarga Besar', subtitle: 'Silsilah & Nasab' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/config/').then(r => r.json()),
      fetch('/api/members/').then(r => r.json()),
    ])
      .then(([cfg, data]) => {
        setConfig(cfg);
        setMembers(data.members || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Head>
        <title>{`Silsilah ${config.familyName}`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={`Pohon keluarga ${config.familyName} — ${config.subtitle}`} />
      </Head>

      {/* Header */}
      <header className="site-header">
        <OrnamentalDivider />
        <h1>{`SILSILAH ${config.familyName.toUpperCase()}`}</h1>
        <div className="subtitle">{config.subtitle}</div>
        <OrnamentalDivider />
        <div className="member-count" style={{ marginTop: 4 }}>
          {`${members.length} Anggota Keluarga`}
        </div>
      </header>

      {/* Canvas */}
      {loading ? (
        <div style={{
          marginTop: 'var(--header-height)',
          height: `calc(100vh - var(--header-height))`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div className="loading-spinner" />
        </div>
      ) : members.length === 0 ? (
        <div style={{
          marginTop: 'var(--header-height)',
          height: `calc(100vh - var(--header-height))`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div className="empty-state">
            <div className="empty-state-text">Pohon keluarga masih kosong</div>
            <div className="empty-state-hint">Tambahkan anggota melalui halaman admin</div>
          </div>
        </div>
      ) : (
        <FamilyTree members={members} />
      )}
    </>
  );
}
