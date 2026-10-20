'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Entity } from '@/lib/types';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Pick<Entity, 'node_uid'|'name'|'node_type_2'>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const q = query.trim();
    if (q.length < 4) {
      setResults([]); setError(''); setLoading(false); return;
    }
    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true); setError('');
      const { data, error: searchError } = await supabase
        .from('entities')
        .select('node_uid,name,node_type_2')
        .ilike('name', `%${q}%`)
        .order('name', { ascending: true })
        .limit(50);
      if (cancelled) return;
      if (searchError) { setError(searchError.message); setResults([]); }
      else setResults((data ?? []) as Pick<Entity, 'node_uid'|'name'|'node_type_2'>[]);
      setLoading(false);
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [query]);

  return <>
    <p className="breadcrumb"><Link href="/">Home</Link> / Search</p>
    <h1>Search by entity name</h1>
    <label htmlFor="entity-search">Entity name</label>
    <input id="entity-search" className="search-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Enter at least four characters" autoComplete="off" />
    <p className="muted">Search matches entity names containing your text. Up to 50 results are shown.</p>
    {query.trim().length < 4 ? <p className="muted">Enter {4 - query.trim().length} more character(s) to search.</p> : null}
    {loading ? <p>Searching…</p> : null}
    {error ? <p className="error">Search failed: {error}</p> : null}
    {!loading && query.trim().length >= 4 && !error && results.length === 0 ? <p>No matching entities found.</p> : null}
    {results.length > 0 ? <div className="table-wrap"><table>
      <thead><tr><th>Entity name</th><th>Entity type</th></tr></thead>
      <tbody>{results.map((entity) => <tr key={entity.node_uid}>
        <td><Link href={`/entity/${encodeURIComponent(entity.node_uid)}`}>{entity.name || '(Unnamed entity)'}</Link></td>
        <td>{entity.node_type_2 || '—'}</td>
      </tr>)}</tbody>
    </table></div> : null}
  </>;
}
