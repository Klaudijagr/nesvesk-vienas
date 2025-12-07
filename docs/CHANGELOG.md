# Changelog

All notable changes to Nešvęsk Vienas will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

- Face verification API with EdgeFace-XXS + YuNet ONNX models
- Bun routes for `/api/face/health`, `/api/face/detect`, `/api/face/verify`
- Concurrently dev script to run Bun + Python face service together
- TODO.md for tracking features across phases
- CHANGELOG.md for release tracking
- Organized docs folder for documentation files

### Changed

- Moved documentation files to `docs/` folder
- Removed redundant `biome.jsonc` (keeping `biome.json`)
- Bun server now runs on port 3001 (configurable via PORT env)

### Technical

- EdgeFace-XXS: 5.7MB model, 512-dim embeddings, ~8ms inference
- YuNet face detection: 227KB, ~4ms inference
- Python 3.12 + FastAPI + ONNX Runtime backend

---

## [0.1.0] - 2024-12-03

### Added

- Initial project setup with Bun + React + Convex
- Magic link authentication via Convex Auth
- Multi-step profile registration wizard (3-4 steps)
- Host/Guest/Both role selection
- Browse page with grid/list views
- Filters: city, date, language
- Profile viewing with privacy protection
- Invitation system (backend)
- Convex schema: profiles, messages, invitations
- UI components: Button, Card, Input, Label, Select, Textarea
- Tailwind CSS styling
- Biome + Ultracite linting setup
- Vitest + convex-test for backend testing
- Lithuania-specific cities and holiday dates (Dec 24-26, 31)
- Multi-language support (Lithuanian, English, Ukrainian, Russian)

### Infrastructure

- Bun for runtime and bundling
- Convex for backend and real-time sync
- React Router for navigation
- Protected routes with auth guards
- HMR in development mode

---

## Version History

| Version | Date | Summary |
|---------|------|---------|
| 0.1.0 | 2024-12-03 | Initial release - auth, profiles, browse, invitations |
| Unreleased | - | Face verification, docs organization |
