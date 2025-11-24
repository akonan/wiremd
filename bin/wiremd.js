#!/usr/bin/env node

/**
 * wiremd CLI entry point
 *
 * This wrapper ensures the CLI works when installed via npm by properly
 * loading the ES module CLI and explicitly calling main().
 */

// Use dynamic import to load the ES module and call main()
(async () => {
  try {
    const cli = await import('../dist/cli/index.js');
    cli.main();
  } catch (err) {
    console.error('Failed to load wiremd CLI:', err);
    process.exit(1);
  }
})();
