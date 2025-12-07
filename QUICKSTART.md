# Quick Start Guide

Get your Hizou Panel up and running in 10 minutes.

## Prerequisites

- Node.js 18+ installed
- A Google/Firebase account
- Basic knowledge of Firebase Console

## Step 1: Install Dependencies (2 min)

```bash
cd hizoupanel
npm install
```

## Step 2: Firebase Setup (5 min)

### Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project" or "Create a project"
3. Enter project name: `hizou-panel` (or your preferred name)
4. Disable Google Analytics (optional)
5. Click "Create project"

### Enable Authentication

1. In Firebase Console, click "Authentication" in left sidebar
2. Click "Get started"
3. Click "Email/Password" under Sign-in method
4. Enable the first toggle (Email/Password)
5. Click "Save"

### Enable Firestore

1. Click "Firestore Database" in left sidebar
2. Click "Create database"
3. Select "Start in production mode"
4. Choose a location (closest to your users)
5. Click "Enable"

### Update Firestore Rules

1. Go to "Firestore Database" > "Rules" tab
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Click "Publish"

### Get Firebase Credentials

1. Click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll to "Your apps" section
4. Click the web icon (`</>`) to add a web app
5. Enter app nickname: `hizou-panel-web`
6. Click "Register app"
7. Copy the `firebaseConfig` object values

## Step 3: Configure Environment (1 min)

Create `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and paste your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=AIzaSyC...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

## Step 4: Create Admin User (1 min)

1. Go to Firebase Console > Authentication > Users
2. Click "Add user"
3. Enter email: `admin@yourdomain.com`
4. Enter password: `your-secure-password`
5. Click "Add user"

## Step 5: Start Development Server (1 min)

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Step 6: Login & Test

1. Login with the email/password you created
2. You'll see the dashboard
3. Navigate to "Creatives" and click "Add Category"
4. Add a test category:
   - Label Key: `creatives.test`
   - Order: `1`
5. Click "Create"

✅ Success! Your admin panel is working.

## Next Steps

### Add Sample Data

Follow the guide in `SAMPLE_DATA.md` to populate test data.

### Integrate with Your Website

Follow the guide in `INTEGRATION.md` to connect your main website.

### Deploy to Production

Choose one:

**Option 1: Firebase Hosting**
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

**Option 2: Vercel**
```bash
npm install -g vercel
vercel
```

**Option 3: Netlify**
1. Build: `npm run build`
2. Deploy `dist/` folder

## Common Issues

### "Cannot find module 'firebase'"
```bash
npm install
```

### "No Firebase App 'DEFAULT' has been created"
- Check `.env` file exists
- Verify all variables are set
- Restart dev server

### "Permission denied" when saving
- Check Firestore rules allow authenticated writes
- Verify you're logged in
- Check Firebase Console for errors

### Login not working
- Verify email/password user exists in Firebase Auth
- Check credentials are correct
- Clear browser cache and try again

## Quick Commands

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build           # Build for production
npm run preview         # Preview production build

# Linting
npm run lint            # Check code quality

# Type checking
npm run typecheck       # Check TypeScript errors
```

## File Structure Overview

```
hizoupanel/
├── src/
│   ├── pages/           # All admin pages
│   ├── components/      # Reusable components
│   ├── layouts/         # Page layouts
│   ├── context/         # React contexts
│   ├── services/        # Firebase & API services
│   └── types/           # TypeScript types
├── .env                 # Your Firebase credentials (DO NOT COMMIT)
├── package.json         # Dependencies
└── README.md           # Full documentation
```

## Support Resources

- **README.md** - Complete setup guide
- **INTEGRATION.md** - Connect to main website
- **SAMPLE_DATA.md** - Test data examples
- **PROJECT_SUMMARY.md** - Full project overview

## Need Help?

1. Check documentation files above
2. Review Firebase Console for errors
3. Check browser console (F12) for JavaScript errors
4. Verify Firestore rules are correct
5. Ensure user is authenticated

## Production Checklist

Before going live:

- [ ] Change default admin password
- [ ] Add your real email addresses
- [ ] Update Firestore security rules for production
- [ ] Test all CRUD operations
- [ ] Add actual content (not sample data)
- [ ] Enable Firebase Storage if needed
- [ ] Set up backup strategy
- [ ] Configure custom domain
- [ ] Test on mobile devices
- [ ] Add monitoring/analytics

---

🎉 **Congratulations!** Your Hizou Panel is ready to use.

Start managing your content and integrate it with your main website using the `INTEGRATION.md` guide.
