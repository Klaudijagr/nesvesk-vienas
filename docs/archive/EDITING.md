# Editing Guide for Nešvęsk vienas

This guide explains how to make changes to the website content, translations, and UI.

---

## 1. Getting Started

### Download the Project

1. Go to [GitHub](https://github.com) and log in
2. Navigate to the repository
3. Click the green **Code** button
4. Select **Open with GitHub Desktop**
5. In GitHub Desktop, click **Clone**

### Open in Cursor

1. Open **Cursor** (the code editor)
2. Go to **File → Open Folder** and select the cloned project folder
3. Make the window fullscreen for easier editing

---

## 2. Using AI to Edit

### Open the AI Terminal

- Press **Command + J** (Mac) or **Ctrl + J** (Windows)
- Or click the second icon from the right in the top-right corner (opens the bottom panel)

### Update Gemini CLI (First Time Setup)

In the terminal, type:
```
update gemini cli
```

This ensures you have the latest version.

### Start Gemini

Type `gemini` in the terminal and press Enter. You're now ready to give editing instructions.

---

## 3. Common Editing Tasks

### Edit Landing Page Text

Tell Gemini or Cursor:
```
Change the hero headline on the landing page to say "Celebrate Together This Season"
```

Or point to the file directly:
```
In src/pages/LandingPage.tsx, update the hero title to say "..."
```

### Edit with a Reference Image

You can share images for reference:
```
I want the landing page to look similar to this design [paste screenshot or describe]
Make it have a warmer color scheme and add more holiday imagery
```

### Update Translations

All translations are in a single file: `src/lib/i18n.ts`

Tell the AI:
```
Update the Lithuanian translation for "heroTitle" to say "Šventės kartu"
```

Or:
```
Add a new translation key called "welcomeMessage" with text in all 4 languages:
- Lithuanian: "Sveiki atvykę"
- English: "Welcome"
- Ukrainian: "Ласкаво просимо"
- Russian: "Добро пожаловать"
```

### Change Colors or Styling

```
Make the primary button color more red (like #DC2626)
Change the footer background to dark green
```

---

## 4. Edit Text Directly (Without AI)

### Translation File

Open `src/lib/i18n.ts` to edit text directly:

```typescript
heroTitle: 'This holiday season,',     // English
heroTitle: 'Šį švenčių sezoną,',        // Lithuanian
```

Just change the text inside the quotes and save.

### Landing Page

Open `src/pages/LandingPage.tsx` to edit layout and content directly.

---

## 5. Save Your Changes to GitHub

After making edits, tell Gemini:

```
Commit my changes and push to GitHub with the message "Updated landing page text"
```

Or use these commands separately:

1. **Stage changes:**
   ```
   git add .
   ```

2. **Commit:**
   ```
   git commit -m "Updated landing page text"
   ```

3. **Push to GitHub:**
   ```
   git push origin main
   ```

If there are any errors, tell Gemini:
```
Fix the errors and try pushing again
```

---

## 6. Key Files Reference

| What to Edit | File Location |
|--------------|---------------|
| Landing page content | `src/pages/LandingPage.tsx` |
| All translations (4 languages) | `src/lib/i18n.ts` |
| Navigation/Sidebar | `src/components/AppSidebar.tsx` |
| Top navigation bar | `src/components/Navbar.tsx` |
| Global styles | `src/index.css` |
| Settings page | `src/pages/SettingsPage.tsx` |
| Browse page | `src/pages/BrowsePage.tsx` |

---

## 7. Language Selector

The language selector component is at `src/components/LanguageSelector.tsx`

It supports:
- **LT** - Lithuanian (default)
- **EN** - English
- **UA** - Ukrainian
- **RU** - Russian

To add it to a page, use:
```jsx
import { LanguageSelector } from '@/components/LanguageSelector';

// In your component:
<LanguageSelector />
```

---

## 8. Tips

- **Preview changes:** The app updates automatically when you save files (hot reload)
- **Undo mistakes:** Press **Command + Z** to undo, or tell Gemini "undo that change"
- **Ask for help:** You can always ask Gemini "What file should I edit to change X?"
- **See changes:** After pushing, changes go live once the site rebuilds (usually 1-2 minutes)

---

## 9. Troubleshooting

### "Command not found: gemini"

Run in terminal:
```
update gemini cli
```

### Changes not showing

1. Make sure you saved the file (Command + S)
2. Check the terminal for any errors
3. Try refreshing the browser

### Push failed

Tell Gemini:
```
There was an error pushing. Please fix it and try again.
```

---

## Need Help?

- Ask Gemini: Just describe what you want to do in plain language
- Check this guide for common commands
- The AI can help fix most issues if you describe the problem
