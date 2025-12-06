/**
 * Create test users in Clerk for e2e testing.
 *
 * Usage:
 *   bun scripts/create-test-users.ts
 *
 * Requires CLERK_SECRET_KEY in .env.local
 * Get it from: Clerk Dashboard → Configure → API Keys → Secret keys
 */

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

if (!CLERK_SECRET_KEY) {
  console.error('Missing CLERK_SECRET_KEY in environment');
  console.error('Add it to .env.local:');
  console.error('  CLERK_SECRET_KEY=sk_test_xxxxx');
  console.error('');
  console.error('Get it from: Clerk Dashboard → Configure → API Keys → Secret keys');
  process.exit(1);
}

const TEST_USERS = [
  {
    email: 'host-test@nesvesk-vienas.lt',
    password: 'TestHost123!',
    firstName: 'Marius',
    lastName: 'TestHost',
  },
  {
    email: 'guest-test@nesvesk-vienas.lt',
    password: 'TestGuest123!',
    firstName: 'Egle',
    lastName: 'TestGuest',
  },
  {
    email: 'guest2-test@nesvesk-vienas.lt',
    password: 'TestGuest2123!',
    firstName: 'Jonas',
    lastName: 'TestGuest2',
  },
];

interface ClerkUser {
  id: string;
  email_addresses: Array<{ email_address: string }>;
  first_name: string;
  last_name: string;
}

interface ClerkError {
  errors?: Array<{ message: string; code: string }>;
}

async function createUser(user: (typeof TEST_USERS)[0]): Promise<ClerkUser | null> {
  const response = await fetch('https://api.clerk.com/v1/users', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CLERK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email_address: [user.email],
      password: user.password,
      first_name: user.firstName,
      last_name: user.lastName,
      skip_password_checks: true,
      skip_password_requirement: false,
    }),
  });

  const data = (await response.json()) as ClerkUser | ClerkError;

  if (!response.ok) {
    const error = data as ClerkError;
    // Check if user already exists
    if (error.errors?.some((e) => e.code === 'form_identifier_exists')) {
      console.log(`  User ${user.email} already exists, skipping...`);
      return null;
    }
    console.error(`  Failed to create ${user.email}:`, error.errors);
    return null;
  }

  return data as ClerkUser;
}

async function listExistingTestUsers(): Promise<ClerkUser[]> {
  const response = await fetch('https://api.clerk.com/v1/users?limit=100', {
    headers: {
      Authorization: `Bearer ${CLERK_SECRET_KEY}`,
    },
  });

  const users = (await response.json()) as ClerkUser[];
  return users.filter((u) =>
    u.email_addresses?.some((e) => e.email_address.includes('test@nesvesk')),
  );
}

async function main() {
  console.log('Creating test users in Clerk...\n');

  // Check for existing test users
  console.log('Checking for existing test users...');
  const existing = await listExistingTestUsers();
  if (existing.length > 0) {
    console.log(`Found ${existing.length} existing test user(s):`);
    for (const user of existing) {
      console.log(`  - ${user.email_addresses[0]?.email_address} (${user.id})`);
    }
    console.log('');
  }

  // Create new test users
  console.log('Creating test users...');
  const created: ClerkUser[] = [];

  for (const user of TEST_USERS) {
    console.log(`Creating ${user.email}...`);
    const result = await createUser(user);
    if (result) {
      created.push(result);
      console.log(`  Created: ${result.id}`);
    }
  }

  console.log('\n--- Summary ---');
  console.log(`Created: ${created.length} users`);
  console.log(`Skipped: ${TEST_USERS.length - created.length} users (already exist)`);

  if (created.length > 0) {
    console.log('\nTest user credentials:');
    for (const user of TEST_USERS) {
      console.log(`  ${user.email} / ${user.password}`);
    }
  }

  console.log('\nNext steps:');
  console.log('1. Add these to your .env.local for e2e tests:');
  console.log('   E2E_CLERK_USER_EMAIL=host-test@nesvesk-vienas.lt');
  console.log('   E2E_CLERK_USER_PASSWORD=TestHost123!');
  console.log('');
  console.log('2. Run e2e tests:');
  console.log('   bun run test:e2e');
}

main().catch(console.error);
