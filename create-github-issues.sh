#!/bin/bash

# Script to create GitHub issues from github-issues.json
# Usage: ./create-github-issues.sh <github-token>
#
# You can get a GitHub token from: https://github.com/settings/tokens
# Required scopes: repo (full control of private repositories)

set -e

if [ -z "$1" ]; then
    echo "Error: GitHub token required"
    echo "Usage: ./create-github-issues.sh <github-token>"
    echo ""
    echo "Get a token from: https://github.com/settings/tokens"
    echo "Required scopes: repo"
    exit 1
fi

GITHUB_TOKEN="$1"
REPO_OWNER="akonan"
REPO_NAME="wiremd"
ISSUES_FILE="github-issues.json"

if [ ! -f "$ISSUES_FILE" ]; then
    echo "Error: $ISSUES_FILE not found"
    exit 1
fi

echo "Creating GitHub issues for $REPO_OWNER/$REPO_NAME..."
echo ""

# Read the JSON file and create issues
jq -c '.[]' "$ISSUES_FILE" | while read -r issue; do
    title=$(echo "$issue" | jq -r '.title')
    body=$(echo "$issue" | jq -r '.body')
    labels=$(echo "$issue" | jq -r '.labels | join(",")')
    milestone=$(echo "$issue" | jq -r '.milestone // empty')

    echo "Creating issue: $title"

    # Prepare the JSON payload
    json_payload=$(jq -n \
        --arg title "$title" \
        --arg body "$body" \
        --argjson labels "$(echo "$issue" | jq '.labels')" \
        '{title: $title, body: $body, labels: $labels}')

    # Create the issue
    response=$(curl -s -X POST \
        -H "Authorization: token $GITHUB_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        -H "Content-Type: application/json" \
        "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/issues" \
        -d "$json_payload")

    issue_number=$(echo "$response" | jq -r '.number // empty')

    if [ -z "$issue_number" ]; then
        echo "  ❌ Failed to create issue"
        echo "  Response: $(echo "$response" | jq -r '.message // empty')"
    else
        echo "  ✅ Created issue #$issue_number"

        # If milestone is specified, we would need to get milestone number first
        # and then update the issue. For now, we'll skip milestone assignment
        # as it requires an additional API call to get milestone numbers
    fi

    # Rate limiting: wait 1 second between requests
    sleep 1
    echo ""
done

echo "Done! All issues created."
echo "View them at: https://github.com/$REPO_OWNER/$REPO_NAME/issues"
