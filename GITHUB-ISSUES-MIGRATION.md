# GitHub Issues Migration

This document explains the migration from markdown-based planning to GitHub Issues for tracking wiremd development.

## Overview

All future plans, roadmap items, and remaining tasks have been extracted from markdown files and organized into structured GitHub issues. This provides:

- ✅ Better tracking and progress visibility
- ✅ Community involvement and discussion
- ✅ Issue assignment and milestones
- ✅ Labels for categorization
- ✅ Integration with project boards

## Migrated Content

### Source Files
The following markdown files contained plans and todos that have been migrated:

- `markdown-mockup-project-plan.md` - Main project roadmap
- `README.md` - Feature requests and coming soon items
- `vscode-extension/README.md` - VS Code extension roadmap
- `figma-plugin/README.md` - Figma plugin roadmap
- `CONTRIBUTING.md` - Development guidelines

### Issue Categories

**45+ issues have been created across these categories:**

1. **Core Library** (10 issues)
   - Validation layer
   - Performance improvements
   - Plugin system
   - Component composition

2. **CLI Tool** (5 issues)
   - Config file support
   - Watch mode improvements
   - Linting and validation commands
   - Export formats (PDF, PNG/SVG)

3. **Documentation** (8 issues)
   - Demo website
   - VitePress site
   - API documentation
   - Examples gallery
   - Educational content

4. **Framework Renderers** (4 issues)
   - Vue component renderer
   - Svelte component renderer
   - Angular component renderer
   - Custom plugin API

5. **VS Code Extension** (3 issues)
   - Marketplace publication
   - Syntax highlighting
   - IntelliSense/autocomplete

6. **Figma Plugin** (5 issues)
   - Community publication
   - Bi-directional sync
   - Component variants
   - Custom themes
   - Image loading

7. **Testing & Quality** (4 issues)
   - Increase test coverage to 80%+
   - Performance benchmarks
   - CI/CD setup
   - Accessibility validation

8. **Marketing & Launch** (4 issues)
   - Beta testing program
   - Product Hunt launch
   - Blog post series
   - Video tutorials

9. **Community** (2 issues)
   - Discord/Slack community
   - Component marketplace

## Creating the Issues

### Prerequisites

1. **GitHub Personal Access Token**
   - Go to https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select scope: `repo` (Full control of private repositories)
   - Copy the generated token

2. **Choose Your Method**
   - **Python script** (recommended - no dependencies)
   - **Bash script** (requires `jq` and `curl`)

### Method 1: Python Script (Recommended)

```bash
# Run the Python script with your GitHub token
python3 create-github-issues.py YOUR_GITHUB_TOKEN
```

### Method 2: Bash Script

```bash
# Requires jq to be installed
# macOS: brew install jq
# Ubuntu/Debian: sudo apt-get install jq
# Fedora: sudo dnf install jq

# Run the bash script with your GitHub token
./create-github-issues.sh YOUR_GITHUB_TOKEN
```

### What Happens

The script will:
1. Read all issues from `github-issues.json`
2. Create each issue via GitHub API
3. Apply labels to each issue
4. Respect rate limiting (1 second between requests)
5. Show progress for each issue
6. Display a summary at the end

Expected runtime: ~2-3 minutes for all issues

## Issue Structure

Each issue includes:

- **Title** - Clear, actionable title
- **Description** - Detailed explanation with context
- **Acceptance Criteria** - Checklist of requirements (where applicable)
- **Related Files** - Code files affected
- **Priority** - High/Medium/Low
- **Labels** - For categorization and filtering
- **Milestone** - Target release version

### Example Issue

```markdown
## Description
Implement the validation layer for the parsed AST...

## Current Status
- Skeleton validation code exists...

## Acceptance Criteria
- [ ] Validate component types...
- [ ] Validate required properties...
- [ ] Provide clear error messages...

## Related Files
- `src/parser/index.ts`
- `src/types.ts`

## Priority
High
```

## Milestones

Issues are organized into these milestones:

- **v0.1.0** - Initial public release (critical items)
- **v0.2.0** - Documentation and tooling
- **v0.3.0** - Advanced features and renderers
- **v0.4.0** - Plugin system and extensibility
- **Future** - Long-term enhancements

## Labels

Issues use these labels for categorization:

### Type
- `enhancement` - New features
- `bug` - Bug fixes
- `documentation` - Documentation improvements
- `testing` - Testing and quality

### Component
- `parser` - Parser-related
- `renderer` - Renderer-related
- `cli` - CLI tool
- `vscode-extension` - VS Code extension
- `figma-plugin` - Figma plugin

### Area
- `a11y` / `accessibility` - Accessibility
- `performance` - Performance
- `i18n` - Internationalization
- `ci-cd` - CI/CD and automation

### Priority (to be added manually)
- `priority:high` - Critical for next release
- `priority:medium` - Important but not blocking
- `priority:low` - Nice to have

### Status (to be added manually)
- `good first issue` - Good for new contributors
- `help wanted` - Community help needed
- `blocked` - Blocked by other work
- `in progress` - Currently being worked on

## After Migration

### Markdown Files

The following files will be updated to reference GitHub issues instead of maintaining duplicate plans:

- `markdown-mockup-project-plan.md` - Add link to GitHub Projects
- `README.md` - Reference issues and project board
- `CONTRIBUTING.md` - Update to mention issue tracking

### Project Board

Consider creating a GitHub Project board to organize issues:

1. Go to https://github.com/akonan/wiremd/projects
2. Create new project: "wiremd Development"
3. Add columns: Backlog, To Do, In Progress, In Review, Done
4. Add all created issues to the board
5. Link milestones to releases

### Next Steps

1. **Create the issues** using the scripts above
2. **Create GitHub Project board** for visual tracking
3. **Set up milestones** (v0.1.0, v0.2.0, v0.3.0)
4. **Add additional labels** as needed
5. **Triage issues** - review and adjust priorities
6. **Update markdown files** to reference GitHub issues
7. **Announce** - Let community know about the new issue tracker

## Maintaining Issues

Going forward:

- **New features** - Create GitHub issues instead of markdown entries
- **Bug reports** - Use GitHub issue templates
- **Discussions** - Use GitHub Discussions for questions
- **Roadmap** - Keep GitHub Projects updated
- **Changelog** - Update from closed issues before releases

## Issue Templates

Consider adding these GitHub issue templates:

- `.github/ISSUE_TEMPLATE/bug_report.md`
- `.github/ISSUE_TEMPLATE/feature_request.md`
- `.github/ISSUE_TEMPLATE/documentation.md`

## Queries and Filters

Useful GitHub issue filters:

```
# High priority issues
is:issue is:open label:priority:high

# Good first issues for contributors
is:issue is:open label:"good first issue"

# v0.2.0 milestone
is:issue milestone:v0.2.0

# VS Code extension work
is:issue is:open label:vscode-extension

# Documentation improvements
is:issue is:open label:documentation
```

## Benefits

### For Maintainers
- Clear backlog and priorities
- Track progress with milestones
- Assign work to contributors
- Link PRs to issues
- Generate release notes from closed issues

### For Contributors
- See what needs to be done
- Find "good first issues"
- Discuss implementation before coding
- Get credit for contributions
- Track status of requests

### For Users
- Visibility into roadmap
- Vote on features (👍 reactions)
- Request new features
- Report bugs
- See what's coming next

## Questions?

If you have questions about the migration or GitHub issues:

1. Check the [GitHub Issues documentation](https://docs.github.com/en/issues)
2. Ask in [GitHub Discussions](https://github.com/akonan/wiremd/discussions)
3. Open a meta issue about issue tracking

---

**Migration Date:** 2025-01-16
**Total Issues Created:** 45+
**Script Version:** 1.0
