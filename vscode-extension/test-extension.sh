#!/bin/bash

# Wiremd VS Code Extension - Quick Test Script

set -e

echo "🧪 Wiremd VS Code Extension Test Setup"
echo "======================================"
echo ""

# Check if in correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the vscode-extension directory"
    exit 1
fi

# Build parent wiremd package first
echo "📦 Building wiremd package..."
cd ..
if [ ! -d "dist" ] || [ ! -f "dist/index.js" ]; then
    npm run build
    echo "✅ Wiremd built"
else
    echo "✅ Wiremd already built"
fi
cd vscode-extension
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ] || [ ! -L "node_modules/wiremd" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed (wiremd linked)"
    echo ""
fi

# Compile extension
echo "🔨 Compiling extension..."
npm run compile
echo "✅ Extension compiled"
echo ""

# Check if VS Code is installed
if ! command -v code &> /dev/null; then
    echo "⚠️  VS Code 'code' command not found"
    echo "   Install it from: https://code.visualstudio.com/"
    echo ""
    echo "📖 Manual testing steps:"
    echo "   1. Open VS Code"
    echo "   2. Go to: Run → Start Debugging (F5)"
    echo "   3. In Extension Development Host, open test-wireframe.md"
    echo "   4. Press Ctrl+K V to open preview"
    exit 0
fi

# Launch VS Code extension development host
echo "🚀 Launching VS Code Extension Development Host..."
echo ""
echo "📋 Next steps in Extension Development Host window:"
echo "   1. Open the test-wireframe.md file"
echo "   2. Press Ctrl+K V (or Cmd+K V on Mac)"
echo "   3. Or right-click → 'Open Wiremd Preview to the Side'"
echo "   4. Edit the markdown and watch live updates!"
echo ""
echo "🎨 Test these features:"
echo "   • Live preview updates as you type"
echo "   • Style switcher (7 styles available)"
echo "   • Viewport switcher (Desktop/Laptop/Tablet/Mobile)"
echo "   • Error overlay (try breaking the syntax)"
echo ""

# Launch VS Code
code --extensionDevelopmentPath="$(pwd)"

echo ""
echo "✅ Extension Development Host launched!"
echo "   Check the new VS Code window that opened"
