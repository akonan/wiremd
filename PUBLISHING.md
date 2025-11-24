# Publishing Guide

This document describes the process for publishing new versions of wiremd to npm.

## Prerequisites

Before publishing, ensure you have:

1. **npm Account**: You need an npm account with publish rights for the `wiremd` package
2. **NPM_TOKEN**: A valid npm access token stored as a GitHub secret
   - Create token at: https://www.npmjs.com/settings/YOUR_USERNAME/tokens
   - Token type: "Automation" (for CI/CD) or "Publish"
   - Add as GitHub secret: Settings → Secrets and variables → Actions → New repository secret
   - Secret name: `NPM_TOKEN`

## Pre-Publication Checklist

Before creating a release, verify:

- [ ] All tests pass: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] Type checking passes: `npm run typecheck`
- [ ] Linting passes: `npm run lint`
- [ ] Documentation is up to date
- [ ] CHANGELOG.md is updated with release notes
- [ ] Version number follows [Semantic Versioning](https://semver.org/)

## Release Process

### 1. Update Version

Update the version in `package.json`:

```bash
# For patch releases (bug fixes)
npm version patch

# For minor releases (new features, backward compatible)
npm version minor

# For major releases (breaking changes)
npm version major
```

This will:
- Update version in `package.json`
- Create a git commit with the version change
- Create a git tag (e.g., `v0.1.1`)

### 2. Push Changes and Tag

```bash
git push origin main
git push origin --tags
```

### 3. Create GitHub Release

1. Go to https://github.com/akonan/wiremd/releases/new
2. Select the tag you just pushed (e.g., `v0.1.1`)
3. Set release title (e.g., `v0.1.1`)
4. Add release notes describing:
   - New features
   - Bug fixes
   - Breaking changes (if any)
   - Upgrade instructions (if needed)
5. Click "Publish release"

### 4. Automated Publishing

Once you publish the GitHub release:
- The `.github/workflows/publish.yml` workflow automatically triggers
- It will:
  1. Checkout the code
  2. Install dependencies
  3. Run tests
  4. Build the project
  5. Publish to npm with provenance

You can monitor the progress at: https://github.com/akonan/wiremd/actions

### 5. Verify Publication

After the workflow completes:

1. Check npm: https://www.npmjs.com/package/wiremd
2. Verify the new version is listed
3. Test installation: `npm install wiremd@latest`

## Manual Publishing (Not Recommended)

If you need to publish manually (use only in emergencies):

```bash
# Login to npm
npm login

# Verify you're logged in as the correct user
npm whoami

# Ensure you're on the correct git tag
git checkout v0.1.1

# Build the project
npm run build

# Publish with provenance
npm publish --provenance --access public
```

## Troubleshooting

### Publishing Fails

If the GitHub Action fails:

1. Check the action logs: https://github.com/akonan/wiremd/actions
2. Common issues:
   - Tests failing: Fix tests and create a new release
   - Build errors: Fix build issues and create a new release
   - NPM_TOKEN expired: Generate new token and update GitHub secret
   - Version already exists: Update version number

### Version Conflicts

If you accidentally published the wrong version:

1. You cannot unpublish versions less than 72 hours old
2. Instead, publish a new patch version with fixes
3. If absolutely necessary, contact npm support

### Permission Issues

If you get permission errors:

1. Verify you're a maintainer: https://www.npmjs.com/package/wiremd
2. Check your npm token has publish rights
3. Ensure `publishConfig.access` is set to `"public"` in package.json

## Package Information

- **Package name**: `wiremd`
- **npm page**: https://www.npmjs.com/package/wiremd
- **Repository**: https://github.com/akonan/wiremd
- **Registry**: npm (public)
- **Author**: Antti Akonniemi <antti@kiskolabs.com>
- **License**: MIT

## Post-Publication

After successful publication:

1. Announce the release (if significant):
   - Update documentation site
   - Post on social media/blog (optional)
   - Notify users of breaking changes
2. Monitor for issues:
   - Watch GitHub issues
   - Check npm download stats
3. Update dependent projects if needed

## Version Strategy

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (x.0.0): Breaking changes
- **MINOR** (0.x.0): New features, backward compatible
- **PATCH** (0.0.x): Bug fixes, backward compatible

For pre-1.0.0 releases, minor version bumps may include breaking changes.

## Security

- Never commit npm tokens to the repository
- Use GitHub secrets for CI/CD tokens
- Use automation tokens for GitHub Actions
- Rotate tokens periodically
- Enable 2FA on your npm account
