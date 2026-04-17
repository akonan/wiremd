#!/bin/bash
# wiremd v0.2 migration: adds 'card' modifier to {.grid-N} headings
#
# Before: ## Features {.grid-3}   (used to render with card chrome)
# After:  ## Features {.grid-3 card}   (explicit card chrome)
#         ## Features {.grid-3}        (now pure layout grid)
#
# Usage:
#   ./scripts/migrate-v0.2.sh           # migrate all .md files in current dir
#   ./scripts/migrate-v0.2.sh src/      # migrate a specific directory
#   ./scripts/migrate-v0.2.sh file.md   # migrate a single file
#
# After running, review any {.grid-N card} that are pure layout grids
# (e.g. form field columns) and remove 'card' from those manually.

TARGET=${1:-.}
COUNT=0

while IFS= read -r -d '' file; do
  if grep -q '\.grid-[0-9]' "$file"; then
    perl -pi -e 's/(\{[^}]*\.grid-\d+[^}]*?)(\})/
      my ($inner, $close) = ($1, $2);
      $inner =~ m|\bcard\b| ? "$inner$close" : "$inner card$close"
    /gex' "$file"
    echo "migrated: $file"
    COUNT=$((COUNT + 1))
  fi
done < <(find "$TARGET" -name "*.md" -not -path "*/node_modules/*" -print0)

echo ""
echo "$COUNT file(s) updated."
echo ""
echo "Next: review any {.grid-N card} that should be pure layout (e.g. form columns)"
echo "and remove the 'card' modifier from those manually."
