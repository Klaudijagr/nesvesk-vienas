/**
 * Entry point for the React app.
 * Sets up Convex, Clerk Auth, and Router providers.
 */

import { ClerkProvider, useAuth } from '@clerk/clerk-react';
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { LocaleProvider } from './contexts/locale-context';
import './index.css';

const convex = new ConvexReactClient(process.env.BUN_PUBLIC_CONVEX_URL as string);
const clerkPubKey = process.env.BUN_PUBLIC_CLERK_PUBLISHABLE_KEY as string;

if (!clerkPubKey) {
  throw new Error('Missing BUN_PUBLIC_CLERK_PUBLISHABLE_KEY');
}

const elem = document.getElementById('root')!;
const app = (
  <StrictMode>
    <ClerkProvider afterSignOutUrl="/" publishableKey={clerkPubKey}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <LocaleProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </LocaleProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  </StrictMode>
);

if (import.meta.hot) {
  if (!import.meta.hot.data.root) {
    import.meta.hot.data.root = createRoot(elem);
  }
  import.meta.hot.data.root.render(app);
} else {
  createRoot(elem).render(app);
}
