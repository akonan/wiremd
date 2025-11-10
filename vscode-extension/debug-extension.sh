#!/bin/bash

# Debug script to verify extension setup

echo "🔍 Wiremd VS Code Extension Debug"
echo "=================================="
echo ""

cd "$(dirname "$0")"

echo "📂 Checking files..."
echo ""

# Check main files exist
echo "✓ Checking package.json..."
if [ -f "package.json" ]; then
    echo "  ✅ package.json exists"

    # Check main entry point
    MAIN=$(grep '"main":' package.json | cut -d'"' -f4)
    echo "  📌 Main entry: $MAIN"

    if [ -f "$MAIN" ]; then
        echo "  ✅ $MAIN exists"
    else
        echo "  ❌ $MAIN NOT FOUND"
        exit 1
    fi
else
    echo "  ❌ package.json NOT FOUND"
    exit 1
fi

echo ""
echo "✓ Checking wiremd dependency..."
if [ -L "node_modules/wiremd" ]; then
    echo "  ✅ wiremd symlink exists"
    echo "  📌 Points to: $(readlink node_modules/wiremd)"

    # Check if parent wiremd is built
    if [ -f "../dist/index.js" ]; then
        echo "  ✅ Parent wiremd is built"
    else
        echo "  ❌ Parent wiremd NOT built - run: cd .. && npm run build"
        exit 1
    fi
else
    echo "  ❌ wiremd symlink NOT FOUND - run: npm install"
    exit 1
fi

echo ""
echo "✓ Checking compiled files..."
if [ -f "dist/extension.js" ]; then
    echo "  ✅ dist/extension.js exists"

    # Check if it has the activate function
    if grep -q "exports.activate" dist/extension.js; then
        echo "  ✅ activate function exported"
    else
        echo "  ❌ activate function NOT found"
        exit 1
    fi

    # Check if commands are registered
    COMMANDS=$(grep -c "registerCommand" dist/extension.js)
    echo "  ✅ $COMMANDS commands registered"

else
    echo "  ❌ dist/extension.js NOT FOUND - run: npm run compile"
    exit 1
fi

echo ""
echo "✓ Checking package.json configuration..."
# Check activation events
echo "  📌 Activation events:"
grep -A 3 '"activationEvents"' package.json | grep -v "activationEvents" | grep -v "^--$"

echo ""
echo "=================================="
echo "✅ All checks passed!"
echo ""
echo "🚀 Next steps:"
echo "   1. Open this folder in VS Code: code ."
echo "   2. Press F5 to launch Extension Development Host"
echo "   3. In new window, open a markdown file"
echo "   4. Check Output panel → Extension Host"
echo "   5. You should see: 'Wiremd extension activated'"
echo ""
echo "If extension still doesn't work:"
echo "   • Open VS Code Developer Tools (Help → Toggle Developer Tools)"
echo "   • Check Console tab for errors"
echo "   • Look in Extension Host output for activation errors"
