
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Entity } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function SuppliersPage({
  params,
}: {
  params: Promise<{ node_uid: string }>;
}) {
  const { node_uid: raw_node_uid } = await params;
  const node_uid = decodeURIComponent(raw_node_uid);

  const { data: target, error: targetError } = await supabase
    .from('entities')
    .select('node_uid, name')
    .eq('node_uid', node_uid)
    .maybeSingle();

  if (targetError) {
    return (
      <p className="error">
        Could not load entity: {targetError.message}
      </p>
    );
  }

  if (!target) notFound();

  const { data: edgeRows, error: edgeError } = await supabase
    .from('edges')
    .select('src_uid_corrected')
    .eq('dst_uid_corrected', node_uid)
    .limit(1000);

  if (edgeError) {
    return (
      <p className="error">
        Could not load suppliers: {edgeError.message}
      </p>
    );
  }

  const ids = [
    ...new Set(
      (edgeRows ?? [])
        .map((r) => r.src_uid_corrected)
        .filter((id): id is string => Boolean(id))
    ),
  ];

  const { data: suppliers, error: entityError } = ids.length
    ? await supabase
        .from('entities')
        .select('node_uid, name, node_type_2')
        .in('node_uid', ids)
        .order('name')
        .limit(1000)
    : { data: [], error: null };

  if (entityError) {
    return (
      <p className="error">
        Could not load supplier names: {entityError.message}
      </p>
    );
  }

  return (
    <>
      <p className="breadcrumb">
        <Link href={`/entity/${encodeURIComponent(node_uid)}`}>
          {target.name || node_uid}
        </Link>{' '}
        / Suppliers
      </p>

      <h1>Suppliers</h1>
      <p className="lead">
        Suppliers of {target.name || 'this entity'}.
      </p>

      <p className="muted">
        Based on edges where <code>dst_uid_corrected</code> is this
        entity&apos;s ID. Showing up to 1,000 relationships.
      </p>

      {!suppliers?.length ? (
        <p>No suppliers found.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Supplier name</th>
                <th>Entity type</th>
              </tr>
            </thead>
            <tbody>
              {(suppliers as Pick<
                Entity,
                'node_uid' | 'name' | 'node_type_2'
              >[]).map((s) => (
                <tr key={s.node_uid}>
                  <td>
                    <Link
                      href={`/entity/${encodeURIComponent(s.node_uid)}`}
                    >
                      {s.name || '(Unnamed entity)'}
                    </Link>
                  </td>
                  <td>{s.node_type_2 || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
