# Hizou Panel - Firebase Admin Dashboard

A modern admin panel built with React, TypeScript, and Firebase for managing dynamic content for the Hizou Projects page.

## Features

- **Firebase Authentication** - Email/Password login
- **Firestore Database** - Real-time data management
- **Protected Routes** - Secure admin access
- **CRUD Operations** - Full content management for:
  - Creative video categories and videos
  - Design sections and galleries
  - Dev theme categories and themes
  - Sponsoring images and videos
  - Social media videos
  - Text/translation overrides

## Tech Stack

- **Vite** - Fast build tool
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router v6** - Navigation
- **Firebase v10** - Backend (Auth + Firestore + Storage)
- **Lucide React** - Icons

## Setup Instructions

### 1. Install Dependencies

```bash
cd hizoupanel
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Authentication** > Email/Password sign-in method
4. Enable **Firestore Database** (Start in production mode)
5. Enable **Storage** (if you plan to upload media later)
6. Go to Project Settings > General > Your apps
7. Create a Web App and copy the Firebase config

### 3. Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Fill in your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Create First Admin User

In Firebase Console > Authentication > Users:
- Click "Add user"
- Enter email and password
- This will be your admin login

### 5. Firestore Security Rules

Go to Firestore Database > Rules and update:

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

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Firestore Data Model

### Collections Structure

```
creativeCategories/
  - id (auto)
  - labelKey: string
  - order: number

creativeVideos/
  - id (auto)
  - categoryId: string
  - url: string
  - title?: string
  - description?: string
  - order: number

designSections/
  - id (auto)
  - iconType: 'Brush' | 'Layout' | 'Camera'
  - titleKey: string
  - order: number

designItems/
  - id (auto)
  - sectionId: string
  - labelKey: string
  - galleryKey: string
  - order: number

designImages/
  - id (auto)
  - galleryKey: string
  - imageUrl: string
  - order: number

devThemeCategories/
  - id (auto)
  - titleFr: string
  - titleAr: string
  - order: number

devThemes/
  - id (auto)
  - categoryId: string
  - title: string
  - previewUrl: string
  - thumbnail: string
  - order: number

sponsorImages/
  - id (auto)
  - imageUrl: string
  - name?: string
  - order: number

sponsoringVideos/
  - id (auto)
  - url: string
  - title?: string
  - order: number

socialVideos/
  - id (auto)
  - url: string
  - title?: string
  - order: number

settings/
  - projects_page (doc)
    - [translationKey]: { fr?: string, ar?: string }
```

## Usage

### Login
1. Navigate to `/login`
2. Enter your Firebase Auth email/password
3. You'll be redirected to the dashboard

### Managing Content

#### Creative Videos
1. Go to **Creatives** section
2. Add categories with translation keys
3. Click "Manage Videos" to add videos to each category
4. Videos support URLs, titles, descriptions, and ordering

#### Design Portfolio
1. Go to **Design** section
2. Create design sections (with icon types)
3. Click "Manage Items" to add design items
4. Each item can have multiple gallery images

#### Dev Themes
1. Go to **Dev Themes** section
2. Add theme categories (bilingual: FR/AR)
3. Click "Manage Themes" to add individual themes
4. Themes include preview URLs and thumbnails

#### Sponsoring
1. Go to **Sponsoring** section
2. Switch between "Sponsors" and "Videos" tabs
3. Add sponsor images or sponsoring videos

#### Social Videos
1. Go to **Social** section
2. Add social media video URLs

#### Text Overrides
1. Go to **Settings** section
2. Override any translation key with custom FR/AR text
3. Leave empty to use default translations

## Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## Deploy

You can deploy to:
- **Firebase Hosting**
- **Vercel**
- **Netlify**
- Any static hosting service

### Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## Project Structure

```
hizoupanel/
├── src/
│   ├── components/        # Reusable components
│   │   └── ProtectedRoute.tsx
│   ├── context/          # React context providers
│   │   └── AuthContext.tsx
│   ├── layouts/          # Page layouts
│   │   └── DashboardLayout.tsx
│   ├── pages/            # Route pages
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Creatives.tsx
│   │   ├── CreativeVideos.tsx
│   │   ├── Design.tsx
│   │   ├── DevThemes.tsx
│   │   ├── Sponsoring.tsx
│   │   ├── Social.tsx
│   │   └── Settings.tsx
│   ├── services/         # External services
│   │   └── firebase.ts
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── .env.example          # Environment template
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## License

Private project - All rights reserved

## Support

For questions or issues, contact the Hizou team.
