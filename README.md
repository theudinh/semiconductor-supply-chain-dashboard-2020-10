# Semiconductor Supply-Chain Explorer

Next.js dashboard backed by the existing Supabase `entities` and `edges` tables.

## Requirements
- Node.js 20.9 or newer
- Git
- A Supabase project with `public.entities` and `public.edges`

## Local setup
1. Copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_SUPABASE_URL` to your Supabase project URL.
3. Set `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to the Supabase publishable key (or legacy anon key). Do not use a service-role/secret key.
4. Install dependencies and run the app:

```powershell
npm install
npm run dev
```

Open http://localhost:3000.

## Pages
- `/` home page
- `/top-1000` top 1,000 entities by descending `hits_hub`
- `/search` substring search after 4 characters (up to 50 results)
- `/entity/[node_uid]` entity profile
- `/entity/[node_uid]/suppliers` suppliers based on edges where `dst_uid_corrected` matches the entity ID
- `/entity/[node_uid]/customers` customers based on edges where `src_uid_corrected` matches the entity ID

## Important security note
The public website uses only a publishable/anon key. Before deployment, enable RLS on `entities` and `edges`, grant public roles SELECT only, and create SELECT policies only if you intend all table data to be public. Never put a Supabase service-role key in `NEXT_PUBLIC_*` variables.
