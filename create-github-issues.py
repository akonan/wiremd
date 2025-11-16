#!/usr/bin/env python3
"""
Script to create GitHub issues from github-issues.json

Usage: python3 create-github-issues.py <github-token>

You can get a GitHub token from: https://github.com/settings/tokens
Required scopes: repo (full control of private repositories)
"""

import json
import sys
import time
import urllib.request
import urllib.error

REPO_OWNER = "akonan"
REPO_NAME = "wiremd"
ISSUES_FILE = "github-issues.json"
API_BASE = "https://api.github.com"


def create_issue(token, title, body, labels):
    """Create a GitHub issue"""
    url = f"{API_BASE}/repos/{REPO_OWNER}/{REPO_NAME}/issues"

    data = {
        "title": title,
        "body": body,
        "labels": labels
    }

    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json"
    }

    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode('utf-8'),
        headers=headers,
        method='POST'
    )

    try:
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            return result.get('number'), None
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        try:
            error_data = json.loads(error_body)
            return None, error_data.get('message', 'Unknown error')
        except json.JSONDecodeError:
            return None, f"HTTP {e.code}: {error_body}"
    except Exception as e:
        return None, str(e)


def main():
    if len(sys.argv) < 2:
        print("Error: GitHub token required", file=sys.stderr)
        print("Usage: python3 create-github-issues.py <github-token>", file=sys.stderr)
        print("", file=sys.stderr)
        print("Get a token from: https://github.com/settings/tokens", file=sys.stderr)
        print("Required scopes: repo", file=sys.stderr)
        sys.exit(1)

    token = sys.argv[1]

    try:
        with open(ISSUES_FILE, 'r') as f:
            issues = json.load(f)
    except FileNotFoundError:
        print(f"Error: {ISSUES_FILE} not found", file=sys.stderr)
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in {ISSUES_FILE}: {e}", file=sys.stderr)
        sys.exit(1)

    print(f"Creating GitHub issues for {REPO_OWNER}/{REPO_NAME}...")
    print()

    created_count = 0
    failed_count = 0

    for issue in issues:
        title = issue.get('title')
        body = issue.get('body')
        labels = issue.get('labels', [])

        print(f"Creating issue: {title}")

        issue_number, error = create_issue(token, title, body, labels)

        if error:
            print(f"  ❌ Failed to create issue")
            print(f"  Error: {error}")
            failed_count += 1
        else:
            print(f"  ✅ Created issue #{issue_number}")
            created_count += 1

        # Rate limiting: wait 1 second between requests
        time.sleep(1)
        print()

    print(f"Done! Created {created_count} issues, {failed_count} failed.")
    print(f"View them at: https://github.com/{REPO_OWNER}/{REPO_NAME}/issues")


if __name__ == "__main__":
    main()
