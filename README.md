# AI Code Extractor Pro

A production-grade browser extension for extracting AI-generated code into complete, downloadable projects.

## Features

- 🤖 **Multi-Platform Support**: ChatGPT, Claude, Gemini, DeepSeek, Devin, Grok, Perplexity, Microsoft Copilot
- 📦 **Smart Extraction**: Detects filenames, folder structures, and reconstructs projects
- 🔗 **Split File Merging**: Automatically merges fragmented code across multiple responses
- 📋 **Preview & Edit**: Review extracted files before export
- 💾 **ZIP Export**: Download everything as a ready-to-build ZIP archive
- ✨ **Modern Stack**: Manifest V3, React, TypeScript, Tailwind CSS

## Project Structure

```
ai-code-extractor-pro/
├── entrypoints/          # Extension entry points (popup, background, content)
├── src/
│   ├── types/           # TypeScript types and interfaces
│   ├── parser/          # Code extraction engine
│   ├── adapters/        # Platform-specific adapters
│   ├── shared/          # Shared utilities and messaging
│   ├── storage/         # Storage layer
│   └── exporter/        # ZIP export logic
├── public/              # Extension icons and assets
├── tests/               # Vitest test suite
└── docs/                # Documentation
```

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The extension will be automatically loaded in Chrome. Changes will hot-reload.

### Build for Production

```bash
npm run build
```

### Create ZIP for Store Submission

```bash
npm run zip
```

### Linting & Formatting

```bash
npm run lint
npm run format
```

### Testing

```bash
npm run test
```

### Type Checking

```bash
npm run typecheck
```

## Loading the Extension

1. Run `npm run build`
2. Go to `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked**
5. Select the `dist/` directory

## Architecture

### Messaging Flow

```
Content Script
    ↓
    ├→ Detect code blocks
    ├→ Extract metadata
    └→ Send to Background
        ↓
    Background Service Worker
        ├→ Parse extracted data
        ├→ Merge split files
        ├→ Store project
        └→ Notify Popup
            ↓
        Popup UI
            ├→ Display extracted files
            ├→ Allow preview & edits
            └→ Export as ZIP
```

## Configuration Files

- `wxt.config.ts` - WXT (Vite-based) build configuration
- `tsconfig.json` - TypeScript configuration with path aliases
- `.prettierrc` - Code formatting rules
- `eslint.config.js` - Linting rules
- `package.json` - Dependencies and scripts

## Tech Stack

- **Build**: [WXT](https://wxt.dev/) (Manifest V3, Vite)
- **UI**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Testing**: Vitest
- **ZIP Generation**: JSZip
- **Validation**: Zod
- **Quality**: ESLint, Prettier

## Roadmap

- [x] Commit 1: Foundation (WXT + React + TypeScript)
- [ ] Commit 2: Messaging & Storage
- [ ] Commit 3: Extraction Engine
- [ ] Commit 4: Platform Adapters
- [ ] Commit 5: Project Reconstruction
- [ ] Commit 6: ZIP Export
- [ ] Commit 7: Tests & Polish
- [ ] Commit 8: Documentation & Release

## License

MIT