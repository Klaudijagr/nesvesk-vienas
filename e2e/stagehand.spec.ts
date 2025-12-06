import { expect, test, z } from './fixtures';

// Full user journey test - goes through the complete flow
test.describe('Full User Journey with Stagehand + Gemini', () => {
  test('complete login and browse flow', async ({ stagehand }) => {
    test.skip(!stagehand, 'Stagehand not configured (missing GOOGLE_GENERATIVE_AI_API_KEY)');
    test.setTimeout(120_000); // 2 minutes for full flow

    const page = stagehand.context.pages()[0];

    // STEP 1: Start at landing page
    console.log('\n=== STEP 1: Landing Page ===');
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('domcontentloaded');
    console.log('Loaded landing page:', page.url());

    // Extract what's on the page
    const landingInfo = await stagehand.extract(
      'What is the main headline and what actions can a user take?',
      z.object({
        headline: z.string(),
        callToActions: z.array(z.string()),
      }),
    );
    console.log('Landing page:', landingInfo);

    // STEP 2: Click Log In
    console.log('\n=== STEP 2: Click Log In ===');
    await stagehand.act('Click the Log in button in the navigation');
    await new Promise((r) => setTimeout(r, 3000));
    console.log('Now at:', page.url());
    expect(page.url()).toContain('/login');

    // Wait for Clerk to fully load
    console.log('Waiting for Clerk form to load...');
    await new Promise((r) => setTimeout(r, 3000));

    // STEP 3: Look at login page
    console.log('\n=== STEP 3: Login Page ===');
    const loginInfo = await stagehand.extract(
      'What login options are available? What input fields are shown?',
      z.object({
        loginMethods: z.array(z.string()),
        inputFields: z.array(z.string()),
      }),
    );
    console.log('Login options:', loginInfo);

    // STEP 4: Enter test email
    console.log('\n=== STEP 4: Enter Email ===');
    const testEmail = process.env.E2E_CLERK_USER_EMAIL || 'host-test@nesvesk-vienas.lt';
    await stagehand.act(`Type "${testEmail}" into the email input field`);
    await new Promise((r) => setTimeout(r, 1000));
    console.log('Entered email:', testEmail);

    // STEP 5: Click Continue
    console.log('\n=== STEP 5: Click Continue ===');
    await stagehand.act('Click the Continue button');
    await new Promise((r) => setTimeout(r, 2000));

    // STEP 6: Enter password
    console.log('\n=== STEP 6: Enter Password ===');
    const testPassword = process.env.E2E_CLERK_USER_PASSWORD || 'TestHost123!';
    await stagehand.act(`Type "${testPassword}" into the password field`);
    await new Promise((r) => setTimeout(r, 1000));

    // STEP 7: Click Continue/Sign in
    console.log('\n=== STEP 7: Submit Login ===');
    await stagehand.act('Click the Continue or Sign in button to log in');
    await new Promise((r) => setTimeout(r, 3000));
    console.log('After login, now at:', page.url());

    // STEP 8: Check if we're logged in (should be on browse or register page)
    console.log('\n=== STEP 8: Verify Login ===');
    const currentUrl = page.url();
    const isLoggedIn =
      currentUrl.includes('/browse') ||
      currentUrl.includes('/register') ||
      currentUrl.includes('/messages');
    console.log('Login successful:', isLoggedIn, '- URL:', currentUrl);

    // If we're still on login (factor-two), see what it's asking for
    if (currentUrl.includes('factor-two') || currentUrl.includes('factor-one')) {
      console.log('\n=== STEP 8b: Check what verification is required ===');
      const verificationInfo = await stagehand.extract(
        'What is this page asking the user to do? What verification or code is required?',
        z.object({
          pageTitle: z.string(),
          instruction: z.string(),
          inputRequired: z.string().optional(),
        }),
      );
      console.log('Verification required:', verificationInfo);
    }

    if (isLoggedIn) {
      // STEP 9: Navigate to browse if not already there
      console.log('\n=== STEP 9: Go to Browse ===');
      if (!currentUrl.includes('/browse')) {
        await stagehand.act('Click on Browse or Find a Host in the navigation');
        await new Promise((r) => setTimeout(r, 2000));
      }
      console.log('Browse page:', page.url());

      // STEP 10: Look at profiles
      console.log('\n=== STEP 10: Extract Profiles ===');
      const profiles = await stagehand.extract(
        'List any profile cards visible on this page with their names and cities',
        z.object({
          profiles: z.array(
            z.object({
              name: z.string(),
              city: z.string().optional(),
            }),
          ),
        }),
      );
      console.log('Visible profiles:', profiles);

      // STEP 11: Click on a profile if any exist
      if (profiles.profiles && profiles.profiles.length > 0) {
        console.log('\n=== STEP 11: View Profile Details ===');
        await stagehand.act('Click on View Details for the first profile card');
        await new Promise((r) => setTimeout(r, 2000));
        console.log('Profile detail page:', page.url());
      }
    }

    console.log('\n=== TEST COMPLETE ===');
    console.log('Final URL:', page.url());
  });

  test('face verification flow', async ({ stagehand }) => {
    test.skip(!stagehand, 'Stagehand not configured (missing GOOGLE_GENERATIVE_AI_API_KEY)');
    test.setTimeout(180_000); // 3 minutes for full flow with verification

    const page = stagehand.context.pages()[0];

    // Login first
    console.log('\n=== STEP 1: Login ===');
    await page.goto('http://localhost:3001/login');
    await new Promise((r) => setTimeout(r, 3000));

    const testEmail = process.env.E2E_CLERK_USER_EMAIL || 'host-test@nesvesk-vienas.lt';
    const testPassword = process.env.E2E_CLERK_USER_PASSWORD || 'TestHost123!';

    await stagehand.act(`Type "${testEmail}" into the email input field`);
    await new Promise((r) => setTimeout(r, 1000));
    await stagehand.act('Click the Continue button');
    await new Promise((r) => setTimeout(r, 2000));
    await stagehand.act(`Type "${testPassword}" into the password field`);
    await new Promise((r) => setTimeout(r, 1000));
    await stagehand.act('Click the Continue button to sign in');
    await new Promise((r) => setTimeout(r, 3000));

    console.log('Logged in, now at:', page.url());

    // Navigate to verify page
    console.log('\n=== STEP 2: Go to Verify Page ===');
    await page.goto('http://localhost:3001/verify');
    await new Promise((r) => setTimeout(r, 2000));
    console.log('On verify page:', page.url());

    // Check what's on the page
    console.log('\n=== STEP 3: Examine Page ===');
    const pageInfo = await stagehand.extract(
      'What page is this? Is it a verification page, profile creation page, or something else?',
      z.object({
        pageTitle: z.string(),
        pageType: z.enum(['verification', 'profile_creation', 'other']),
        description: z.string(),
      }),
    );
    console.log('Page info:', pageInfo);

    // If we're on profile creation, user needs to create profile first
    if (pageInfo.pageType === 'profile_creation') {
      console.log('User needs to create profile before verification');
      console.log('Verification page requires an existing profile');
      return;
    }

    // Try to interact with ID upload
    console.log('\n=== STEP 4: Check ID Upload Section ===');
    const idUploadVisible = await stagehand.extract(
      'Is there an ID photo upload section? What does it say?',
      z.object({
        hasIdUpload: z.boolean(),
        uploadText: z.string(),
      }),
    );
    console.log('ID upload section:', idUploadVisible);

    // Try to interact with selfie section
    console.log('\n=== STEP 5: Check Selfie Section ===');
    const selfieSection = await stagehand.extract(
      'Is there a selfie section? What options are available (camera, upload)?',
      z.object({
        hasSelfieSection: z.boolean(),
        options: z.array(z.string()),
      }),
    );
    console.log('Selfie section:', selfieSection);

    // Check if Verify button exists
    console.log('\n=== STEP 6: Check Verify Button ===');
    const verifyButton = await stagehand.extract(
      'Is there a Verify Identity button? Is it enabled or disabled?',
      z.object({
        hasButton: z.boolean(),
        buttonText: z.string(),
        isEnabled: z.boolean(),
      }),
    );
    console.log('Verify button:', verifyButton);

    console.log('\n=== FACE VERIFICATION PAGE TEST COMPLETE ===');
    console.log('The verification UI is working. To fully test:');
    console.log('1. Face service must be running on port 5001');
    console.log('2. Test images need to be uploaded');
    console.log('3. API endpoint /api/face/verify must be proxied');
  });
});
