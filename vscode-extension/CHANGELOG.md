# Change Log

All notable changes to the "wiremd-preview" extension will be documented in this file.

## [0.1.0] - 2024-01-09

### Added
- Initial release of Wiremd Live Preview extension
- Live preview panel with real-time updates
- Support for multiple visual styles (sketch, clean, wireframe, none, tailwind, material, brutal)
- Responsive viewport switcher (desktop, laptop, tablet, mobile, full)
- Error overlay with clear error messages
- Auto-refresh with configurable debouncing
- Side-by-side preview mode
- Status bar integration
- Keyboard shortcuts for common actions
- Configuration options for customizing behavior

### Features
- WebView-based preview panel
- Automatic synchronization with active markdown file
- Style switcher in preview toolbar
- Viewport size selector in preview toolbar
- Connection status indicator
- Graceful fallback when wiremd is not installed

### Commands
- Open Wiremd Preview
- Open Wiremd Preview to the Side
- Refresh Wiremd Preview
- Change Preview Style
- Change Preview Viewport

### Configuration
- `wiremd.defaultStyle` - Set default visual style
- `wiremd.autoRefresh` - Enable/disable auto-refresh
- `wiremd.refreshDelay` - Configure refresh delay
- `wiremd.showErrorOverlay` - Toggle error overlay display

## Future Releases

### Planned Features
- [ ] Export preview as PNG/PDF
- [ ] Custom style themes
- [ ] Collaborative editing indicators
- [ ] Zoom controls
- [ ] Preview history/snapshots
- [ ] Dark mode support
- [ ] Code snippets and templates
- [ ] Multi-file preview
