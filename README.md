# Nešvęsk Vienas

A holiday hosting/guest matching platform for Lithuania. Connect hosts with guests for Christmas and New Year celebrations.

## Features

- **Magic Link Auth** - Passwordless authentication via email
- **Profile System** - Multi-step registration wizard for hosts and guests
- **Browse & Filter** - Find hosts/guests by city, date, language, and vibes
- **Invitations** - Send and respond to holiday invitations
- **Matches** - Contact info revealed when both parties agree
- **Identity Verification** - Face verification using EdgeFace-XXS + YuNet

## Tech Stack

- **Runtime**: [Bun](https://bun.sh)
- **Frontend**: React 19, React Router, Tailwind CSS
- **Backend**: [Convex](https://convex.dev) (real-time database + functions)
- **Auth**: Convex Auth with magic links
- **Face Verification**: Python + FastAPI + ONNX Runtime
- **Linting**: Ultracite + Biome

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.3+
- [uv](https://docs.astral.sh/uv/) (Python package manager)
- Convex account

### Installation

```bash
# Install dependencies
bun install

# Set up Convex (follow prompts)
bunx convex dev
```

### Development

```bash
# Run both Bun server and face service
bun dev

# Or run separately:
bun dev:bun      # Bun server on port 3001
bun dev:face     # Face service on port 5001
bun dev:convex   # Convex dev server
```

### Testing

```bash
# Run Convex tests (vitest)
bun test

# Run once without watch
bun test:run

# With coverage
bun test:coverage
```

### Build

```bash
bun run build
```

### Production

```bash
bun start
```

## Project Structure

```
├── src/                  # Frontend React app
│   ├── components/       # UI components
│   ├── pages/            # Route pages
│   └── lib/              # Utilities and types
├── convex/               # Convex backend
│   ├── __tests__/        # Backend tests
│   └── schema.ts         # Database schema
├── face-service/         # Python face verification API
│   ├── main.py           # FastAPI server
│   └── models/           # ONNX models
├── docs/                 # Documentation
└── styles/               # Global CSS
```

## Environment Variables

Create `.env.local`:

```
CONVEX_DEPLOYMENT=your-deployment
RESEND_API_KEY=your-resend-key
```

## License

MIT
