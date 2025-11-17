#!/usr/bin/env python3
"""
Script to create GitHub issues using gh CLI

Usage: python3 create-issues-gh.py
"""

import json
import subprocess
import sys
import time

ISSUES_FILE = "github-issues.json"


def check_gh_auth():
    """Check if gh CLI is authenticated"""
    try:
        result = subprocess.run(
            ["gh", "auth", "status"],
            capture_output=True,
            text=True
        )
        return result.returncode == 0
    except FileNotFoundError:
        print("Error: gh CLI not found. Install from https://cli.github.com/")
        return False


def create_issue(title, body, labels):
    """Create a GitHub issue using gh CLI"""
    cmd = [
        "gh", "issue", "create",
        "--title", title,
        "--body", body
    ]

    if labels:
        cmd.extend(["--label", ",".join(labels)])

    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            check=True
        )
        # Extract issue URL from output
        issue_url = result.stdout.strip()
        return issue_url, None
    except subprocess.CalledProcessError as e:
        return None, e.stderr.strip()
    except Exception as e:
        return None, str(e)


def main():
    # Check if gh is authenticated
    if not check_gh_auth():
        print("Error: GitHub CLI not authenticated")
        print("Run: gh auth login")
        sys.exit(1)

    # Load issues
    try:
        with open(ISSUES_FILE, 'r') as f:
            issues = json.load(f)
    except FileNotFoundError:
        print(f"Error: {ISSUES_FILE} not found")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in {ISSUES_FILE}: {e}")
        sys.exit(1)

    print(f"Creating {len(issues)} GitHub issues using gh CLI...")
    print()

    created_count = 0
    failed_count = 0

    for i, issue in enumerate(issues, 1):
        title = issue.get('title')
        body = issue.get('body')
        labels = issue.get('labels', [])
        milestone = issue.get('milestone')

        print(f"[{i}/{len(issues)}] Creating: {title}")

        issue_url, error = create_issue(title, body, labels)

        if error:
            print(f"  ❌ Failed: {error}")
            failed_count += 1
        else:
            print(f"  ✅ Created: {issue_url}")
            created_count += 1

        # Small delay to be nice to the API
        time.sleep(0.3)

    print()
    print(f"Done! Created {created_count} issues, {failed_count} failed.")
    print(f"View all issues at: https://github.com/akonan/wiremd/issues")


if __name__ == "__main__":
    main()
