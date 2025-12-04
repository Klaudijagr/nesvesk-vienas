import { serve } from 'bun';
import index from './index.html';

const FACE_SERVICE_URL = process.env.FACE_SERVICE_URL || 'http://localhost:5001';

const server = serve({
  port: Number(process.env.PORT) || 3001,
  routes: {
    // Serve index.html for all unmatched routes.
    '/*': index,

    // Face verification endpoints
    '/api/face/health': {
      async GET() {
        const res = await fetch(`${FACE_SERVICE_URL}/health`);
        return Response.json(await res.json());
      },
    },

    '/api/face/detect': {
      async POST(req) {
        const formData = await req.formData();
        const res = await fetch(`${FACE_SERVICE_URL}/detect`, {
          method: 'POST',
          body: formData,
        });
        return Response.json(await res.json(), { status: res.status });
      },
    },

    '/api/face/verify': {
      async POST(req) {
        const formData = await req.formData();
        const res = await fetch(`${FACE_SERVICE_URL}/verify`, {
          method: 'POST',
          body: formData,
        });
        return Response.json(await res.json(), { status: res.status });
      },
    },

    '/api/hello': {
      async GET(_req) {
        return Response.json({
          message: 'Hello, world!',
          method: 'GET',
        });
      },
      async PUT(_req) {
        return Response.json({
          message: 'Hello, world!',
          method: 'PUT',
        });
      },
    },

    '/api/hello/:name': async (req) => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },
  },

  development: process.env.NODE_ENV !== 'production' && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
