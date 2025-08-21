import { writeFileSync, mkdirSync } from 'node:fs';
import 'dotenv/config'; // lets local dev use a .env file too

const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
}

mkdirSync('src/environments', { recursive: true });

const makeFile = (production) => `
export const environment = {
  production: ${production},
  supabaseUrl: '${SUPABASE_URL}',
  supabaseAnonKey: '${SUPABASE_ANON_KEY}'
};
`;

writeFileSync('src/environments/environment.ts', makeFile(false));
writeFileSync('src/environments/environment.prod.ts', makeFile(true));
console.log('✓ wrote Angular environment files');
