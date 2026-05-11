#!/usr/bin/env bash
# Package skills/wireframe/ into wireframe-skill.zip for upload to
# Claude Desktop, Claude.ai, or Claude Cowork (Settings → Skills → Upload).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/wireframe-skill.zip"

rm -f "$OUT"
cd "$ROOT/skills"
zip -rq "$OUT" wireframe -x '*.DS_Store'

echo "✓ $OUT"
