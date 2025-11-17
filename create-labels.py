#!/usr/bin/env python3
"""
Script to create GitHub labels from github-issues.json

Usage: python3 create-labels.py
"""

import json
import subprocess
import sys

ISSUES_FILE = "github-issues.json"

# Label colors (GitHub uses hex colors)
LABEL_COLORS = {
    # Type labels
    "enhancement": "a2eeef",
    "bug": "d73a4a",
    "documentation": "0075ca",
    "testing": "fef2c0",

    # Component labels
    "parser": "d4c5f9",
    "renderer": "c5def5",
    "cli": "bfdadc",
    "vscode-extension": "1d76db",
    "figma-plugin": "f9d0c4",

    # Area labels
    "validation": "e99695",
    "watch-mode": "bfdadc",
    "configuration": "d4c5f9",
    "npm": "fbca04",
    "packaging": "fbca04",
    "api": "0e8a16",
    "vitepress": "5319e7",
    "website": "0075ca",
    "demo": "1d76db",
    "vue": "42b883",
    "svelte": "ff3e00",
    "angular": "dd0031",
    "syntax-highlighting": "c5def5",
    "intellisense": "c5def5",
    "export": "fef2c0",
    "import": "fef2c0",
    "images": "f9d0c4",
    "components": "a2eeef",
    "release": "0e8a16",
    "marketplace": "0075ca",
    "figma-community": "f9d0c4",
    "quality": "fef2c0",
    "coverage": "fef2c0",
    "performance": "d93f0b",
    "benchmarks": "fef2c0",
    "ci-cd": "0e8a16",
    "github-actions": "0e8a16",
    "automation": "0e8a16",
    "examples": "0075ca",
    "showcase": "0075ca",
    "pdf": "d4c5f9",
    "beta": "fbca04",
    "community": "7057ff",
    "discord": "7289da",
    "support": "d4c5f9",
    "marketing": "d876e3",
    "product-hunt": "da3633",
    "launch": "0e8a16",
    "content": "0075ca",
    "blog": "0075ca",
    "video": "1d76db",
    "tutorials": "0075ca",
    "styling": "c5def5",
    "dark-mode": "0d1117",
    "accessibility": "fef2c0",
    "a11y": "fef2c0",
    "i18n": "bfdadc",
    "internationalization": "bfdadc",
    "responsive": "c5def5",
    "syntax": "d4c5f9",
    "states": "a2eeef",
    "annotations": "d4c5f9",
    "placeholders": "fbca04",
    "data": "bfdadc",
    "migration": "fbca04",
    "versioning": "0e8a16",
    "linting": "fef2c0",
    "plugins": "a2eeef",
    "reusability": "a2eeef",
    "telemetry": "d4c5f9",
    "analytics": "d4c5f9",
    "education": "0075ca",
    "theming": "c5def5",
}


def create_label(name, color, description=""):
    """Create a GitHub label using gh CLI"""
    cmd = [
        "gh", "label", "create",
        name,
        "--color", color
    ]

    if description:
        cmd.extend(["--description", description])

    # Add --force to update if exists
    cmd.append("--force")

    try:
        subprocess.run(cmd, capture_output=True, text=True, check=True)
        return True, None
    except subprocess.CalledProcessError as e:
        # Ignore "already exists" errors
        if "already exists" in e.stderr:
            return True, None
        return False, e.stderr.strip()
    except Exception as e:
        return False, str(e)


def main():
    # Load issues to extract unique labels
    try:
        with open(ISSUES_FILE, 'r') as f:
            issues = json.load(f)
    except FileNotFoundError:
        print(f"Error: {ISSUES_FILE} not found")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in {ISSUES_FILE}: {e}")
        sys.exit(1)

    # Extract all unique labels
    all_labels = set()
    for issue in issues:
        labels = issue.get('labels', [])
        all_labels.update(labels)

    print(f"Creating {len(all_labels)} GitHub labels...")
    print()

    created_count = 0
    failed_count = 0

    for label in sorted(all_labels):
        color = LABEL_COLORS.get(label, "ededed")  # Default gray
        print(f"Creating label: {label}")

        success, error = create_label(label, color)

        if success:
            print(f"  ✅ Created/updated")
            created_count += 1
        else:
            print(f"  ❌ Failed: {error}")
            failed_count += 1

    print()
    print(f"Done! Created/updated {created_count} labels, {failed_count} failed.")


if __name__ == "__main__":
    main()
