#!/usr/bin/env node
// CragLog Railway Setup
// Usage: node scripts/railway-setup.mjs <RAILWAY_TOKEN>
// Get token from: https://railway.app/account/tokens

import { randomBytes } from 'crypto';

const RAILWAY_API  = 'https://backboard.railway.app/graphql/v2';
const GITHUB_REPO  = 'daintelligence/craglog';
const PROJECT_NAME = 'craglog';

const TOKEN = process.argv[2] || process.env.RAILWAY_TOKEN;
if (!TOKEN) {
  console.error('Usage: node scripts/railway-setup.mjs <RAILWAY_TOKEN>');
  console.error('Get a token at: https://railway.app/account/tokens');
  process.exit(1);
}

const log  = (m) => console.log(`\x1b[32m✓\x1b[0m ${m}`);
const info = (m) => console.log(`\x1b[36m→\x1b[0m ${m}`);
const warn = (m) => console.log(`\x1b[33m!\x1b[0m ${m}`);
const fail = (m) => { console.error(`\x1b[31m✖\x1b[0m ${m}`); process.exit(1); };

async function gql(query, variables = {}) {
  const res = await fetch(RAILWAY_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── 1. Create project ─────────────────────────────────────────────────────────
info(`Creating project '${PROJECT_NAME}'…`);
let projectId, envId;

try {
  const data = await gql(`
    mutation CreateProject($name: String!) {
      projectCreate(input: { name: $name }) {
        id
        environments { edges { node { id name } } }
      }
    }`, { name: PROJECT_NAME });
  projectId = data.projectCreate.id;
  envId     = data.projectCreate.environments.edges[0]?.node.id;
  log(`Project created: ${projectId}`);
} catch (e) {
  // Project may already exist — find it
  try {
    const data = await gql(`query { me { projects { edges { node { id name environments { edges { node { id name } } } } } } } }`);
    const existing = data.me.projects.edges.find(({ node }) => node.name === PROJECT_NAME);
    if (!existing) fail(`Could not create or find project: ${e.message}`);
    projectId = existing.node.id;
    envId     = existing.node.environments.edges[0]?.node.id;
    warn(`Using existing project: ${projectId}`);
  } catch (e2) { fail(`Project error: ${e2.message}`); }
}

// ── 2. Add PostgreSQL ─────────────────────────────────────────────────────────
info('Adding PostgreSQL…');
let pgPluginId;
try {
  const data = await gql(`
    mutation {
      pluginCreate(input: {
        projectId: "${projectId}",
        name: "postgresql"
      }) { id name }
    }`);
  pgPluginId = data.pluginCreate.id;
  log(`PostgreSQL plugin: ${pgPluginId}`);
} catch (e) { warn(`PostgreSQL: ${e.message}`); }

// ── 3. Add Redis ──────────────────────────────────────────────────────────────
info('Adding Redis…');
let redisPluginId;
try {
  const data = await gql(`
    mutation {
      pluginCreate(input: {
        projectId: "${projectId}",
        name: "redis"
      }) { id name }
    }`);
  redisPluginId = data.pluginCreate.id;
  log(`Redis plugin: ${redisPluginId}`);
} catch (e) { warn(`Redis: ${e.message}`); }

// Wait for plugins to provision
info('Waiting for databases to provision…');
await sleep(12000);

// ── 4. Create backend service ─────────────────────────────────────────────────
info('Creating backend service…');
let backendId;
try {
  const data = await gql(`
    mutation {
      serviceCreate(input: {
        projectId: "${projectId}",
        name: "backend",
        source: { repo: "${GITHUB_REPO}" }
      }) { id }
    }`);
  backendId = data.serviceCreate.id;
  log(`Backend service: ${backendId}`);
} catch (e) { warn(`Backend: ${e.message}`); }

// ── 5. Create frontend service ────────────────────────────────────────────────
info('Creating frontend service…');
let frontendId;
try {
  const data = await gql(`
    mutation {
      serviceCreate(input: {
        projectId: "${projectId}",
        name: "frontend",
        source: { repo: "${GITHUB_REPO}" }
      }) { id }
    }`);
  frontendId = data.serviceCreate.id;
  log(`Frontend service: ${frontendId}`);
} catch (e) { warn(`Frontend: ${e.message}`); }

// ── 6. Set root directories via serviceInstanceUpdate ─────────────────────────
info('Setting root directories…');
for (const [serviceId, rootDirectory] of [[backendId, 'backend'], [frontendId, 'frontend']]) {
  if (!serviceId) continue;
  try {
    await gql(`
      mutation SetRootDir($serviceId: String!, $envId: String, $input: ServiceInstanceUpdateInput!) {
        serviceInstanceUpdate(serviceId: $serviceId, environmentId: $envId, input: $input)
      }`, { serviceId, envId, input: { rootDirectory } });
    log(`Root dir '${rootDirectory}' set`);
  } catch (e) {
    warn(`Root dir '${rootDirectory}': ${e.message} — set manually: service Settings → Source → Root Directory → '${rootDirectory}'`);
  }
}

// ── 7. Fetch plugin connection strings ────────────────────────────────────────
info('Reading database connection strings…');
await sleep(5000);

let dbUrl = '', redisUrl = '';
try {
  const data = await gql(`
    query {
      project(id: "${projectId}") {
        plugins {
          edges {
            node {
              id name
              variables {
                edges { node { name value } }
              }
            }
          }
        }
      }
    }`);

  for (const { node: plugin } of data.project.plugins.edges) {
    for (const { node: v } of plugin.variables.edges) {
      if (v.name === 'DATABASE_URL' || v.name === 'POSTGRES_URL') dbUrl = v.value;
      if (v.name === 'REDIS_URL' || v.name === 'REDIS_PRIVATE_URL') redisUrl = v.value;
    }
  }
  if (dbUrl)    log(`DATABASE_URL found`);
  if (redisUrl) log(`REDIS_URL found`);
} catch (e) {
  warn(`Could not read plugin vars: ${e.message}`);
}

if (!dbUrl)    warn('DATABASE_URL not found — link it manually: backend Variables → Add Reference → PostgreSQL → DATABASE_URL');
if (!redisUrl) warn('REDIS_URL not found — link it manually: backend Variables → Add Reference → Redis → REDIS_URL');

// ── 8. Generate domains ───────────────────────────────────────────────────────
info('Generating public domains…');
let backendDomain = '', frontendDomain = '';

for (const [serviceId, label] of [[backendId, 'backend'], [frontendId, 'frontend']]) {
  if (!serviceId) continue;
  try {
    const data = await gql(`
      mutation {
        serviceDomainCreate(input: {
          serviceId: "${serviceId}",
          environmentId: "${envId}"
        }) { domain }
      }`);
    const domain = data.serviceDomainCreate.domain;
    if (label === 'backend')  backendDomain  = domain;
    if (label === 'frontend') frontendDomain = domain;
    log(`${label}: https://${domain}`);
  } catch (e) {
    warn(`${label} domain: ${e.message}`);
  }
}

// ── 9. Set backend environment variables ──────────────────────────────────────
info('Setting backend environment variables…');
const jwtSecret = randomBytes(40).toString('hex');

const backendVars = {
  NODE_ENV:        'production',
  PORT:            '3001',
  JWT_SECRET:      jwtSecret,
  JWT_EXPIRES_IN:  '30d',
  ...(dbUrl          && { DATABASE_URL: dbUrl }),
  ...(redisUrl       && { REDIS_URL: redisUrl }),
  ...(frontendDomain && { CORS_ORIGIN: `https://${frontendDomain}` }),
};

for (const [name, value] of Object.entries(backendVars)) {
  try {
    await gql(`
      mutation UpsertVar($input: VariableUpsertInput!) { variableUpsert(input: $input) }`,
      { input: { projectId, serviceId: backendId, environmentId: envId, name, value } });
  } catch (e) { warn(`backend ${name}: ${e.message}`); }
}
log('Backend variables set');

// ── 10. Set frontend environment variables ─────────────────────────────────────
info('Setting frontend environment variables…');
const frontendVars = {
  NODE_ENV: 'production',
  ...(backendDomain && {
    NEXT_PUBLIC_API_URL: `https://${backendDomain}`,
    BACKEND_URL:         `https://${backendDomain}`,
  }),
};

for (const [name, value] of Object.entries(frontendVars)) {
  try {
    await gql(`
      mutation UpsertVar($input: VariableUpsertInput!) { variableUpsert(input: $input) }`,
      { input: { projectId, serviceId: frontendId, environmentId: envId, name, value } });
  } catch (e) { warn(`frontend ${name}: ${e.message}`); }
}
log('Frontend variables set');

// ── Done ──────────────────────────────────────────────────────────────────────
console.log('\n\x1b[32m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m');
console.log('\x1b[32m  CragLog Railway project provisioned!\x1b[0m');
console.log('\x1b[32m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m');
if (backendDomain)  console.log(`  Backend:  \x1b[36mhttps://${backendDomain}\x1b[0m`);
if (frontendDomain) console.log(`  Frontend: \x1b[36mhttps://${frontendDomain}\x1b[0m`);
console.log('\n  Seed the database once services are green:');
console.log(`  cd backend`);
console.log(`  \x1b[33mDATABASE_URL="<from Railway Postgres vars>" npm run seed:demo\x1b[0m`);
console.log('\n  Every git push now auto-deploys both services.\n');
