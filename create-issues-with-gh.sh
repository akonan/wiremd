#!/bin/bash

# Script to create GitHub issues using gh CLI
# Usage: ./create-issues-with-gh.sh

set -e

ISSUES_FILE="github-issues.json"

if [ ! -f "$ISSUES_FILE" ]; then
    echo "Error: $ISSUES_FILE not found"
    exit 1
fi

# Check if gh is authenticated
if ! gh auth status > /dev/null 2>&1; then
    echo "Error: GitHub CLI not authenticated"
    echo "Run: gh auth login"
    exit 1
fi

echo "Creating GitHub issues using gh CLI..."
echo ""

created_count=0
failed_count=0

# Read the JSON file and create issues
jq -c '.[]' "$ISSUES_FILE" | while read -r issue; do
    title=$(echo "$issue" | jq -r '.title')
    body=$(echo "$issue" | jq -r '.body')
    labels=$(echo "$issue" | jq -r '.labels | join(",")')
    milestone=$(echo "$issue" | jq -r '.milestone // empty')

    echo "Creating issue: $title"

    # Build gh command
    gh_cmd="gh issue create --title \"$title\" --body \"$body\""

    if [ -n "$labels" ]; then
        gh_cmd="$gh_cmd --label \"$labels\""
    fi

    # Note: Milestone assignment requires the milestone to exist first
    # We'll add that in a separate step if needed

    if eval "$gh_cmd"; then
        echo "  ✅ Created successfully"
        created_count=$((created_count + 1))
    else
        echo "  ❌ Failed to create"
        failed_count=$((failed_count + 1))
    fi

    # Rate limiting: small delay between requests
    sleep 0.5
    echo ""
done

echo "Done! Created $created_count issues, $failed_count failed."
echo "View them at: https://github.com/akonan/wiremd/issues"
