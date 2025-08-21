// web/scripts/write-env.mjs
import { mkdirSync, writeFileSync } from 'node:fs';

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.supabaseUrl;
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ?? process.env.supabaseAnonKey;

const MEMBER_PHOTOS_BUCKET =
  process.env.MEMBER_PHOTOS_BUCKET ?? process.env.memberPhotosBucket ?? 'member-photos';
const LEAGUE_MEMBERS_TABLE =
  process.env.LEAGUE_MEMBERS_TABLE ?? process.env.leagueMembersTable ?? 'league_members';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing SUPABASE_URL or SUPABASE_ANON_KEY (set in Netlify env vars).'
  );
}

mkdirSync('src/environments', { recursive: true });

const makeEnv = (production) => `
export const environment = {
  production: ${production},
  supabaseUrl: '${SUPABASE_URL}',
  supabaseAnonKey: '${SUPABASE_ANON_KEY}',
  memberPhotosBucket: '${MEMBER_PHOTOS_BUCKET}',
  leagueMembersTable: '${LEAGUE_MEMBERS_TABLE}'
};
`;

writeFileSync('src/environments/environment.ts', makeEnv(false));
writeFileSync('src/environments/environment.prod.ts', makeEnv(true));
console.log('✓ wrote Angular environment files');
