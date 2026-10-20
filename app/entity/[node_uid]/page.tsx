
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Entity } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function EntityPage({
  params,
}: {
  params: Promise<{ node_uid: string }>;
}) {
  const { node_uid: raw_node_uid } = await params;
  const node_uid = decodeURIComponent(raw_node_uid);

  const { data, error } = await supabase
    .from('entities')
    .select('*')
    .eq('node_uid', node_uid)
    .maybeSingle();

  if (error) {
    return (
      <>
        <h1>Entity profile</h1>
        <p className="error">
          Could not load entity: {error.message}
        </p>
      </>
    );
  }

  if (!data) notFound();

  const entity = data as Entity;

  return (
    <>
      <p className="breadcrumb">
        <Link href="/">Home</Link> /{' '}
        <Link href="/search">Search</Link> / Entity profile
      </p>

      <h1>{entity.name || '(Unnamed entity)'}</h1>

      <dl className="entity-grid">
        <dt>
          <details>
            <summary>firm ID</summary>
            <code>{entity.node_uid}</code>
          </details>
        </dt>
        <dd></dd>

        <dt>Entity Type</dt>
        <dd>{entity.node_type_2 || '—'}</dd>

        <dt>Is Semiconductor Firm?</dt>
        <dd>{entity.is_semi_2 || '—'}</dd>

        <dt>Hub Score</dt>
        <dd className="number">
          {entity.hits_hub == null ? '—' : String(entity.hits_hub)}
        </dd>

        <dt>Rank by Hub Score</dt>
        <dd className="number">
          {entity.rank_hits_hub ?? '—'}
        </dd>

        <dt>Percentile by Hub Score</dt>
        <dd className="number">
          {entity.percentile_hits_hub == null
            ? '—'
            : Number(entity.percentile_hits_hub).toFixed(2)}
        </dd>
      </dl>

      <div className="action-links">
        <Link
          className="button-link"
          href={`/entity/${encodeURIComponent(entity.node_uid)}/suppliers`}
        >
          Supplier
        </Link>

        <Link
          className="button-link"
          href={`/entity/${encodeURIComponent(entity.node_uid)}/customers`}
        >
          Customer
        </Link>
      </div>
    </>
  );
}
