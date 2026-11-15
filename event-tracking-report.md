# Event tracking report

This document lists all PostHog events that have been automatically added to your Next.js application.

## Events by File

### app/(dashboard)/settings/edit-profile/page.tsx

- **profile_edit_step_completed**: Fired when a user clicks the 'Next' button to move to the next step in the profile editing flow.
- **profile_updated**: Fired when a user successfully saves their profile changes on the edit profile page.

### app/(dashboard)/browse/page.tsx

- **browse_tab_switched**: Fires when a user switches between the 'Find a Host' and 'Find Guests' tabs.
- **invitation_sent**: Fires when a user successfully sends an invitation to another user, either from the list view or the profile modal.

### app/verify/page.tsx

- **verification_attempted**: Fired when a user submits their ID photo and selfie for verification. Includes properties for success, confidence score, and any errors.
- **verification_reset**: Fired when a user clicks the 'Try Again' button after a failed verification attempt.

### components/PhotoUpload.tsx

- **profile-photo-uploaded**: Fired when a user successfully uploads and saves a new profile photo.
- **profile-photo-removed**: Fired when a user clicks the button to remove their current or previewed profile photo.

### components/face-verification.tsx

- **face-verification-completed**: Fired when the face verification process is completed, including the result.
- **face-verification-reset**: Fired when the user clicks the reset button to clear the selected images.

### components/app-sidebar.tsx

- **sidebar_logo_clicked**: Fired when a user clicks the application logo in the sidebar to navigate to the homepage.
- **sidebar_nav_item_clicked**: Fired when a user clicks a navigation item in the sidebar.

## Events still awaiting implementation

- (human: you can fill these in)

---

## Next Steps

1. Review the changes made to your files
2. Test that events are being captured correctly
3. Create insights and dashboards in PostHog
4. Make a list of events we missed above. Knock them out yourself, or give this file to an agent.

Learn more about what to measure with PostHog and why: https://posthog.com/docs/new-to-posthog/getting-hogpilled
