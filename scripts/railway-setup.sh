#!/usr/bin/env bash
# ─── CragLog Railway Setup ────────────────────────────────────────────────────
# Run once to provision a fresh Railway project.
# Requires: railway CLI logged in  →  railway login
#           RAILWAY_TOKEN env var  →  export RAILWAY_TOKEN=<token from railway.app/account/tokens>
# Usage: bash scripts/railway-setup.sh
# ─────────────────────────────────────────────────────────────────────────────
set -e

GITHUB_REPO="daintelligence/craglog"
PROJECT_NAME="craglog"
RAILWAY_API="https://backboard.railway.app/graphql/v2"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
log()  { echo -e "${GREEN}✓${NC} $1"; }
info() { echo -e "${CYAN}→${NC} $1"; }
warn() { echo -e "${YELLOW}!${NC} $1"; }
fail() { echo -e "${RED}✖${NC} $1"; exit 1; }

# ── 0. Pre-flight ─────────────────────────────────────────────────────────────
command -v railway >/dev/null 2>&1 || fail "railway CLI not found. Run: npm i -g @railway/cli"
[[ -z "$RAILWAY_TOKEN" ]] && fail "Set RAILWAY_TOKEN first:\n  export RAILWAY_TOKEN=<token from railway.app/account/tokens>"

gql() {
  local query="$1" vars="${2:-{}}"
  curl -sf "$RAILWAY_API" \
    -H "Authorization: Bearer $RAILWAY_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"query\": $(echo "$query" | jq -Rs .), \"variables\": $vars}"
}

# ── 1. Create project ─────────────────────────────────────────────────────────
info "Creating Railway project '$PROJECT_NAME'…"
PROJECT_JSON=$(railway init --name "$PROJECT_NAME" --json 2>/dev/null || true)

# Fall back to API if CLI returns nothing useful
if [[ -z "$PROJECT_JSON" || "$PROJECT_JSON" == "null" ]]; then
  PROJECT_JSON=$(gql '
    mutation CreateProject($name: String!) {
      projectCreate(input: { name: $name }) {
        id
        environments { edges { node { id name } } }
      }
    }' "{\"name\": \"$PROJECT_NAME\"}")
fi

PROJECT_ID=$(echo "$PROJECT_JSON" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
ENV_ID=$(echo "$PROJECT_JSON" | grep -oP '"environments".*?"id":"[^"]+' | head -1 | grep -oP '"id":"[^"]+' | tail -1 | cut -d'"' -f4)

[[ -z "$PROJECT_ID" ]] && fail "Could not create project. Check railway login status."
log "Project created: $PROJECT_ID"

# ── 2. Add PostgreSQL ─────────────────────────────────────────────────────────
info "Adding PostgreSQL…"
PG_JSON=$(railway add --database postgres --json 2>&1 || true)
log "PostgreSQL added"

# ── 3. Add Redis ──────────────────────────────────────────────────────────────
info "Adding Redis…"
railway add --database redis --json 2>&1 || true
log "Redis added"

# Give Railway a moment to provision the DB and expose variables
info "Waiting for database URLs to be available…"
sleep 8

# ── 4. Fetch connection strings ───────────────────────────────────────────────
info "Reading database connection strings…"
ALL_VARS=$(railway variables --json 2>/dev/null || echo "{}")
DB_URL=$(echo "$ALL_VARS" | grep -o '"DATABASE_URL":"[^"]*"' | cut -d'"' -f4)
REDIS_URL=$(echo "$ALL_VARS" | grep -o '"REDIS_URL":"[^"]*"' | cut -d'"' -f4)

[[ -z "$DB_URL"    ]] && warn "DATABASE_URL not found yet — you'll need to link it manually in the Railway dashboard"
[[ -z "$REDIS_URL" ]] && warn "REDIS_URL not found yet — you'll need to link it manually in the Railway dashboard"

# ── 5. Add backend service ────────────────────────────────────────────────────
info "Creating backend service…"
railway add --service backend --repo "$GITHUB_REPO" 2>&1 || true
log "Backend service created"

# ── 6. Add frontend service ───────────────────────────────────────────────────
info "Creating frontend service…"
railway add --service frontend --repo "$GITHUB_REPO" 2>&1 || true
log "Frontend service created"

# ── 7. Get service IDs via API ────────────────────────────────────────────────
SERVICES_JSON=$(gql '
  query GetServices($projectId: String!) {
    project(id: $projectId) {
      services { edges { node { id name } } }
    }
  }' "{\"projectId\": \"$PROJECT_ID\"}")

BACKEND_ID=$(echo "$SERVICES_JSON" | grep -oP '"name":"backend".*?"id":"[^"]+|"id":"[^"]+"[^}]*"name":"backend"' | grep -oP '"id":"[^"]+' | head -1 | cut -d'"' -f4)
FRONTEND_ID=$(echo "$SERVICES_JSON" | grep -oP '"name":"frontend".*?"id":"[^"]+|"id":"[^"]+"[^}]*"name":"frontend"' | grep -oP '"id":"[^"]+' | head -1 | cut -d'"' -f4)

log "Services found — backend: ${BACKEND_ID:0:8}…  frontend: ${FRONTEND_ID:0:8}…"

# ── 8. Set root directory for each service ────────────────────────────────────
info "Configuring root directories…"
gql '
  mutation SetSource($id: String!, $input: ServiceSourceInput!) {
    serviceSourceUpdate(id: $id, input: $input) { id }
  }' "{\"id\": \"$BACKEND_ID\", \"input\": {\"repo\": \"$GITHUB_REPO\", \"branch\": \"master\", \"rootDirectory\": \"backend\"}}" > /dev/null || \
  warn "Could not set backend root dir via API — set 'backend' manually in service Settings → Source"

gql '
  mutation SetSource($id: String!, $input: ServiceSourceInput!) {
    serviceSourceUpdate(id: $id, input: $input) { id }
  }' "{\"id\": \"$FRONTEND_ID\", \"input\": {\"repo\": \"$GITHUB_REPO\", \"branch\": \"master\", \"rootDirectory\": \"frontend\"}}" > /dev/null || \
  warn "Could not set frontend root dir via API — set 'frontend' manually in service Settings → Source"

log "Root directories configured"

# ── 9. Generate JWT secret ────────────────────────────────────────────────────
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(40).toString('hex'))")

# ── 10. Set backend environment variables ─────────────────────────────────────
info "Setting backend environment variables…"
railway variable set \
  --service backend \
  NODE_ENV=production \
  PORT=3001 \
  JWT_EXPIRES_IN=30d \
  "JWT_SECRET=$JWT_SECRET" \
  2>&1 | grep -v "^$" || true

[[ -n "$DB_URL"    ]] && railway variable set --service backend "DATABASE_URL=$DB_URL"    2>&1 || true
[[ -n "$REDIS_URL" ]] && railway variable set --service backend "REDIS_URL=$REDIS_URL"     2>&1 || true

log "Backend variables set"

# ── 11. Generate Railway domains (so we can wire CORS + API URL) ──────────────
info "Generating public domains…"
BACKEND_DOMAIN=$(railway domain --service backend 2>/dev/null | grep -o '[a-z0-9-]*\.up\.railway\.app' | head -1 || echo "")
FRONTEND_DOMAIN=$(railway domain --service frontend 2>/dev/null | grep -o '[a-z0-9-]*\.up\.railway\.app' | head -1 || echo "")

# ── 12. Set frontend environment variables ────────────────────────────────────
info "Setting frontend environment variables…"
railway variable set \
  --service frontend \
  NODE_ENV=production \
  2>&1 || true

[[ -n "$BACKEND_DOMAIN" ]] && railway variable set \
  --service frontend \
  "NEXT_PUBLIC_API_URL=https://$BACKEND_DOMAIN" \
  "BACKEND_URL=https://$BACKEND_DOMAIN" \
  2>&1 || true

# ── 13. Wire CORS on backend ──────────────────────────────────────────────────
[[ -n "$FRONTEND_DOMAIN" ]] && \
  railway variable set --service backend "CORS_ORIGIN=https://$FRONTEND_DOMAIN" 2>&1 || true

log "Frontend variables set"

# ── Done ──────────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  CragLog Railway project provisioned!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
[[ -n "$BACKEND_DOMAIN"  ]] && echo -e "  Backend:  ${CYAN}https://$BACKEND_DOMAIN${NC}"  || echo -e "  Backend:  (generate domain in Railway dashboard)"
[[ -n "$FRONTEND_DOMAIN" ]] && echo -e "  Frontend: ${CYAN}https://$FRONTEND_DOMAIN${NC}" || echo -e "  Frontend: (generate domain in Railway dashboard)"
echo ""
echo -e "  Next step — seed the database:"
echo -e "  ${YELLOW}DATABASE_URL=\"$DB_URL\" npm run seed:demo${NC}"
echo ""
echo -e "  If any 'warn' steps above need manual fixing, they're${NC}"
echo -e "  just root-dir or variable-reference settings in the UI.${NC}"
echo ""
