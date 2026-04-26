#!/usr/bin/env node
// CragLog Railway Setup
// Usage: node scripts/railway-setup.mjs <RAILWAY_TOKEN>
// Get token from: https://railway.app/account/tokens

import { execSync } from 'child_process';

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

function cli(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['pipe','pipe','pipe'] }).trim();
  } catch (e) {
    return e.stdout?.trim() || '';
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── 1. Create project ─────────────────────────────────────────────────────────
info(`Creating project '${PROJECT_NAME}'…`);
let projectId, envId;

try {
  const data = await gql(`
    mutation {
      projectCreate(input: { name: "${PROJECT_NAME}" }) {
        id
        environments { edges { node { id name } } }
      }
    }
  `);
  projectId = data.projectCreate.id;
  envId     = data.projectCreate.environments.edges[0]?.node.id;
  log(`Project created: ${projectId}`);
} catch (e) {
  // Project may already exist — try to find it
  try {
    const data = await gql(`query { me { projects { edges { node { id name environments { edges { node { id name } } } } } } } }`);
    const existing = data.me.projects.edges.find(({ node }) => node.name === PROJECT_NAME);
    if (!existing) fail(`Could not create or find project: ${e.message}`);
    projectId = existing.node.id;
    envId     = existing.node.environments.edges[0]?.node.id;
    warn(`Project already exists, using it: ${projectId}`);
  } catch (e2) {
    fail(`GraphQL error: ${e2.message}`);
  }
}

// ── 2. Add PostgreSQL ─────────────────────────────────────────────────────────
info('Adding PostgreSQL…');
try {
  await gql(`
    mutation {
      databaseCreate(input: {
        projectId: "${projectId}",
        type: POSTGRES_LATEST
      }) { id }
    }
  `);
  log('PostgreSQL added');
} catch (e) {
  warn(`PostgreSQL: ${e.message} (may already exist)`);
}

// ── 3. Add Redis ──────────────────────────────────────────────────────────────
info('Adding Redis…');
try {
  await gql(`
    mutation {
      databaseCreate(input: {
        projectId: "${projectId}",
        type: REDIS_LATEST
      }) { id }
    }
  `);
  log('Redis added');
} catch (e) {
  warn(`Redis: ${e.message} (may already exist)`);
}

// ── 4. Wait for DB provisioning ───────────────────────────────────────────────
info('Waiting for databases to provision…');
await sleep(10000);

// ── 5. Create backend service ─────────────────────────────────────────────────
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
    }
  `);
  backendId = data.serviceCreate.id;
  log(`Backend service: ${backendId}`);
} catch (e) {
  warn(`Backend service: ${e.message}`);
}

// ── 6. Create frontend service ────────────────────────────────────────────────
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
    }
  `);
  frontendId = data.serviceCreate.id;
  log(`Frontend service: ${frontendId}`);
} catch (e) {
  warn(`Frontend service: ${e.message}`);
}

// ── 7. Set root directories ───────────────────────────────────────────────────
info('Setting root directories…');
for (const [id, dir] of [[backendId, 'backend'], [frontendId, 'frontend']]) {
  if (!id) continue;
  try {
    await gql(`
      mutation {
        serviceUpdate(id: "${id}", input: {
          source: { repo: "${GITHUB_REPO}", branch: "master", rootDirectory: "${dir}" }
        }) { id }
      }
    `);
    log(`Root dir set: ${dir}`);
  } catch (e) {
    warn(`Could not set ${dir} root dir (${e.message}) — set it manually: service Settings → Source → Root Directory → '${dir}'`);
  }
}

// ── 8. Fetch database URLs ────────────────────────────────────────────────────
info('Reading database variables…');
await sleep(5000);

let dbUrl = '', redisUrl = '';
try {
  const data = await gql(`
    query {
      project(id: "${projectId}") {
        services {
          edges {
            node {
              id name
              serviceInstances {
                edges {
                  node {
                    environmentVariables {
                      edges { node { name value } }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `);

  for (const { node: svc } of data.project.services.edges) {
    for (const { node: inst } of svc.serviceInstances.edges) {
      for (const { node: v } of inst.environmentVariables.edges) {
        if (v.name === 'DATABASE_URL' || v.name === 'POSTGRES_URL') dbUrl = v.value;
        if (v.name === 'REDIS_URL' || v.name === 'REDIS_PRIVATE_URL') redisUrl = v.value;
      }
    }
  }
} catch (e) {
  warn(`Could not read DB vars: ${e.message}`);
}

if (!dbUrl)    warn('DATABASE_URL not found yet — add it as a variable reference in Railway dashboard after setup');
if (!redisUrl) warn('REDIS_URL not found yet — add it as a variable reference in Railway dashboard after setup');

// ── 9. Generate domains ───────────────────────────────────────────────────────
info('Generating public domains…');
let backendDomain = '', frontendDomain = '';

for (const [id, name] of [[backendId, 'backend'], [frontendId, 'frontend']]) {
  if (!id) continue;
  try {
    const data = await gql(`
      mutation {
        serviceDomainCreate(input: {
          serviceId: "${id}",
          environmentId: "${envId}"
        }) { domain }
      }
    `);
    const domain = data.serviceDomainCreate.domain;
    if (name === 'backend')  backendDomain  = domain;
    if (name === 'frontend') frontendDomain = domain;
    log(`${name} domain: ${domain}`);
  } catch (e) {
    warn(`Could not generate ${name} domain: ${e.message}`);
  }
}

// ── 10. Generate JWT secret ───────────────────────────────────────────────────
const { randomBytes } = await import('crypto');
const jwtSecret = randomBytes(40).toString('hex');

// ── 11. Set backend variables ─────────────────────────────────────────────────
info('Setting backend environment variables…');

const backendVars = {
  NODE_ENV: 'production',
  PORT: '3001',
  JWT_SECRET: jwtSecret,
  JWT_EXPIRES_IN: '30d',
  ...(dbUrl    && { DATABASE_URL: dbUrl }),
  ...(redisUrl && { REDIS_URL: redisUrl }),
  ...(frontendDomain && { CORS_ORIGIN: `https://${frontendDomain}` }),
};

for (const [name, value] of Object.entries(backendVars)) {
  try {
    await gql(`
      mutation {
        variableUpsert(input: {
          projectId: "${projectId}",
          serviceId: "${backendId}",
          environmentId: "${envId}",
          name: "${name}",
          value: ${JSON.stringify(value)}
        })
      }
    `);
  } catch (e) {
    warn(`Could not set ${name}: ${e.message}`);
  }
}
log('Backend variables set');

// ── 12. Set frontend variables ────────────────────────────────────────────────
info('Setting frontend environment variables…');

const frontendVars = {
  NODE_ENV: 'production',
  ...(backendDomain && {
    NEXT_PUBLIC_API_URL: `https://${backendDomain}`,
    BACKEND_URL: `https://${backendDomain}`,
  }),
};

for (const [name, value] of Object.entries(frontendVars)) {
  try {
    await gql(`
      mutation {
        variableUpsert(input: {
          projectId: "${projectId}",
          serviceId: "${frontendId}",
          environmentId: "${envId}",
          name: "${name}",
          value: ${JSON.stringify(value)}
        })
      }
    `);
  } catch (e) {
    warn(`Could not set ${name}: ${e.message}`);
  }
}
log('Frontend variables set');

// ── Done ──────────────────────────────────────────────────────────────────────
console.log('\n\x1b[32m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m');
console.log('\x1b[32m  CragLog Railway project provisioned!\x1b[0m');
console.log('\x1b[32m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m');
if (backendDomain)  console.log(`  Backend:  \x1b[36mhttps://${backendDomain}\x1b[0m`);
if (frontendDomain) console.log(`  Frontend: \x1b[36mhttps://${frontendDomain}\x1b[0m`);
console.log(`\n  JWT_SECRET saved to Railway (not shown for security)`);
if (dbUrl) {
  console.log(`\n  Seed the database (run from backend/ folder):`);
  console.log(`  \x1b[33mDATABASE_URL="${dbUrl}" npm run seed:demo\x1b[0m`);
}
console.log('\n  Every git push now auto-deploys both services.\n');
