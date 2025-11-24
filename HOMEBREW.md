# Homebrew Package Guide

This guide explains how to distribute wiremd via Homebrew.

## Option 1: Homebrew Tap (Recommended)

A Homebrew tap is a custom repository of formulas.

### Setup Your Tap

1. **Create a tap repository**
   ```bash
   # Repository must be named: homebrew-<tap-name>
   # For example: homebrew-wiremd
   gh repo create homebrew-wiremd --public --description "Homebrew tap for wiremd"
   ```

2. **Clone the tap repository**
   ```bash
   git clone https://github.com/akonan/homebrew-wiremd.git
   cd homebrew-wiremd
   ```

3. **Copy the formula**
   ```bash
   mkdir -p Formula
   cp ../wiremd/Formula/wiremd.rb Formula/
   ```

4. **Commit and push**
   ```bash
   git add Formula/wiremd.rb
   git commit -m "Add wiremd formula"
   git push origin main
   ```

### Users Install From Your Tap

```bash
# Add your tap
brew tap akonan/wiremd

# Install wiremd
brew install wiremd

# Or install directly
brew install akonan/wiremd/wiremd
```

## Option 2: Submit to Homebrew Core

To get wiremd into the official Homebrew repository:

### Requirements

- Package must be notable (good GitHub stars, downloads)
- Stable releases (no frequent breaking changes)
- Active maintenance
- No dependencies on head-only formulas

### Submission Process

1. **Test the formula locally**
   ```bash
   brew install --build-from-source ./Formula/wiremd.rb
   brew test wiremd
   brew audit --new-formula wiremd
   ```

2. **Create a pull request**
   - Fork https://github.com/Homebrew/homebrew-core
   - Add your formula to `Formula/wiremd.rb`
   - Submit PR following Homebrew guidelines
   - Wait for review and approval

## Option 3: Install Directly (For Testing)

Users can install directly from the formula URL:

```bash
brew install https://raw.githubusercontent.com/akonan/wiremd/main/Formula/wiremd.rb
```

## Updating the Formula

When you release a new version:

### 1. Update version and checksum

```bash
# Download new version
curl -sL https://registry.npmjs.org/wiremd/-/wiremd-0.2.0.tgz -o wiremd.tgz

# Get SHA256
shasum -a 256 wiremd.tgz

# Update Formula/wiremd.rb:
# - Change version in URL
# - Update sha256 checksum
```

### 2. Test the update

```bash
brew uninstall wiremd
brew install --build-from-source ./Formula/wiremd.rb
wiremd --version
```

### 3. Push to tap

```bash
git add Formula/wiremd.rb
git commit -m "Update wiremd to v0.2.0"
git push
```

### 4. Users upgrade

```bash
brew update
brew upgrade wiremd
```

## Automated Updates with GitHub Actions

Create `.github/workflows/update-formula.yml` in your tap repo:

```yaml
name: Update Formula

on:
  repository_dispatch:
    types: [new-release]
  workflow_dispatch:
    inputs:
      version:
        description: 'Version to update to'
        required: true

jobs:
  update:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4

      - name: Update formula
        env:
          VERSION: ${{ github.event.inputs.version }}
        run: |
          # Download tarball
          curl -sL "https://registry.npmjs.org/wiremd/-/wiremd-${VERSION}.tgz" -o wiremd.tgz

          # Get checksum
          CHECKSUM=$(shasum -a 256 wiremd.tgz | cut -d' ' -f1)

          # Update formula
          sed -i '' "s|wiremd-.*\.tgz|wiremd-${VERSION}.tgz|g" Formula/wiremd.rb
          sed -i '' "s|sha256 \".*\"|sha256 \"${CHECKSUM}\"|g" Formula/wiremd.rb

      - name: Test formula
        run: |
          brew install --build-from-source ./Formula/wiremd.rb
          brew test wiremd

      - name: Commit changes
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add Formula/wiremd.rb
          git commit -m "Update wiremd to ${VERSION}"
          git push
```

## Testing

### Local Testing

```bash
# Install from local formula
brew install --build-from-source ./Formula/wiremd.rb

# Test
wiremd --version
wiremd --help

# Run formula tests
brew test wiremd

# Audit formula
brew audit --new-formula wiremd

# Uninstall
brew uninstall wiremd
```

### Common Issues

**Issue: Node version conflicts**
```ruby
# In formula, specify Node version if needed
depends_on "node@20"
```

**Issue: Binary not found**
```ruby
# Make sure bin symlink is correct
bin.install_symlink Dir["#{libexec}/bin/*"]
```

**Issue: Permissions**
```bash
# Homebrew handles permissions automatically
# Just ensure files are readable
```

## Distribution Strategy

### Recommended Approach

1. **Start with your own tap** (`homebrew-wiremd`)
   - Easy to maintain
   - Quick updates
   - Full control

2. **Promote your tap**
   - Add to README
   - Mention in docs
   - Include in releases

3. **Consider Homebrew Core later**
   - After package is stable
   - When you have good adoption
   - If you want wider reach

## Installation Commands Summary

```bash
# From your tap
brew tap akonan/wiremd
brew install wiremd

# Direct install
brew install akonan/wiremd/wiremd

# From formula URL (testing)
brew install https://raw.githubusercontent.com/akonan/wiremd/main/Formula/wiremd.rb

# Upgrade
brew upgrade wiremd

# Uninstall
brew uninstall wiremd
```

## Resources

- [Homebrew Formula Cookbook](https://docs.brew.sh/Formula-Cookbook)
- [Node for Formula Authors](https://docs.brew.sh/Node-for-Formula-Authors)
- [Acceptable Formulae](https://docs.brew.sh/Acceptable-Formulae)
- [Formula Pull Request Guide](https://docs.brew.sh/How-To-Open-a-Homebrew-Pull-Request)
