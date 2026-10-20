import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { Entity } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function Top1000Page() {
  const { data, error } = await supabase
    .from('entities')
    .select('node_uid,name,rank_hits_hub,hits_hub')
    .order('hits_hub', { ascending: false, nullsFirst: false })
    .limit(1000);

  if (error) return <><h1>Top 1,000 entities</h1><p className="error">Could not load entities: {error.message}</p></>;
  const entities = (data ?? []) as Pick<Entity, 'node_uid'|'name'|'rank_hits_hub'|'hits_hub'>[];

  return <>
    <p className="breadcrumb"><Link href="/">Home</Link> / Top 1,000</p>
    <h1>1,000 entities with highest hub scores</h1>
    <p className="muted">Showing {entities.length} entities, sorted by descending HITS hub score. The displayed rank is the supplied <code>rank_hits_hub</code> value.</p>
    <div className="table-wrap"><table>
      <thead><tr><th>Rank by hub score</th><th>Entity name</th><th>Hub score</th></tr></thead>
      <tbody>{entities.map((entity) => <tr key={entity.node_uid}>
        <td className="number">{entity.rank_hits_hub ?? '—'}</td>
        <td><Link href={`/entity/${encodeURIComponent(entity.node_uid)}`}>{entity.name || '(Unnamed entity)'}</Link></td>
        <td className="number">{entity.hits_hub == null ? '—' : String(entity.hits_hub)}</td>
      </tr>)}</tbody>
    </table></div>
  </>;
}
