# Changelog

All notable changes to Retain AI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-05-17

### Added
- **Telemetry Capability Detection System** - Automatically detects 8 telemetry categories from CSV headers
- **Achievement Analytics System** - Comprehensive achievement tracking and insight generation
- **LiveOps Recommendation Engine** - AI-generated event suggestions with timing and targeting
- **DatasetCapabilityPanel Component** - Visual display of dataset completeness and quality
- **LiveOpsEventCard Component** - Individual event recommendation cards with details
- **LiveOpsRecommendations Component** - Full LiveOps recommendations panel
- **Heuristic Intelligence Layer** - PM-grade insights without requiring LLM calls
- **Achievement Heuristics** - Rule-based achievement insight generation
- **Framer Motion Integration** - Smooth animations and transitions throughout UI
- **Badge Component** - Severity and status indicators (High/Medium/Low)
- **Alert Component** - User notifications and warnings
- **Alert Dialog Component** - Confirmation dialogs with Radix UI

### Changed
- **Updated to Next.js 16** - Latest framework version with improved performance
- **Updated to React 19** - Latest React version with new features
- **Updated to Tailwind CSS v4** - Modern styling system with better DX
- **Enhanced Analytics Engine** - Now capability-aware with null-safe metric calculations
- **Improved InsightsDashboard** - Better organization, visual hierarchy, and loading states
- **Refactored AI Orchestrator** - More modular, extensible, and maintainable
- **Updated All Documentation** - Comprehensive guides, references, and examples
- **Enhanced Type Safety** - Nullable metrics enforce capability checks throughout

### Fixed
- Null-safety issues in analytics calculations
- Dataset quality assessment accuracy
- Theme toggle functionality and persistence
- Responsive design issues on mobile devices
- Import path consistency across codebase

## [Unreleased]

### Planned
- TypeScript error resolution (~40 remaining null-safety warnings)
- IBM Granite LLM integration (watsonx.ai, HuggingFace, Ollama)
- Real-time telemetry streaming support
- Advanced churn prediction models
- Multi-game portfolio support
- REST API for programmatic access
- Webhook support for real-time events

## [0.1.0] - 2026-05-16

### Added
- Initial release
- CSV telemetry upload functionality
- Analytics engine with 15+ metrics
- Mock AI insights generation
- Interactive insights dashboard
- Dark mode support
- Responsive design
- shadcn/ui component library integration

### Features
- **Smart Telemetry Upload**: Drag-and-drop CSV with validation
- **AI-Powered Analytics**: Comprehensive metrics computation
- **Insights Dashboard**: 6 insight categories with visualizations
- **Production-Ready UI**: Dark mode optimized, fully responsive

---

**Note**: This project is under active development. Features and APIs may change.