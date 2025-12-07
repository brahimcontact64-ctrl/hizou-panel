# Integration Guide: Dynamic Projects Page

This guide explains how to refactor your existing Projects page to read from Firebase Firestore.

## Overview

The admin panel (hizoupanel) manages all content in Firestore. Your main website's Projects page needs to be updated to fetch this data instead of using hard-coded arrays.

## Step 1: Add Firebase to Your Main Website

### Install Firebase

```bash
npm install firebase
```

### Create Firebase Config

Create `src/services/firebase.ts` in your main website:

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

Add the same environment variables to your main website's `.env` file.

## Step 2: Create Firestore Service Functions

Create `src/services/firestoreService.ts`:

```typescript
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from './firebase';

export const fetchCreativeCategories = async () => {
  const q = query(collection(db, 'creativeCategories'), orderBy('order'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const fetchCreativeVideos = async (categoryId: string) => {
  const q = query(
    collection(db, 'creativeVideos'),
    where('categoryId', '==', categoryId),
    orderBy('order')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data().url);
};

export const fetchAllCreativeVideos = async () => {
  const categories = await fetchCreativeCategories();
  const result: Record<string, string[]> = {};

  for (const cat of categories) {
    const videos = await fetchCreativeVideos(cat.id);
    result[cat.id] = videos;
  }

  return result;
};

export const fetchDesignSections = async () => {
  const q = query(collection(db, 'designSections'), orderBy('order'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const fetchDesignItems = async (sectionId: string) => {
  const q = query(
    collection(db, 'designItems'),
    where('sectionId', '==', sectionId),
    orderBy('order')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const fetchDesignImages = async (galleryKey: string) => {
  const q = query(
    collection(db, 'designImages'),
    where('galleryKey', '==', galleryKey),
    orderBy('order')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data().imageUrl);
};

export const fetchDevThemeCategories = async () => {
  const q = query(collection(db, 'devThemeCategories'), orderBy('order'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const fetchDevThemes = async (categoryId: string) => {
  const q = query(
    collection(db, 'devThemes'),
    where('categoryId', '==', categoryId),
    orderBy('order')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const fetchSponsorImages = async () => {
  const q = query(collection(db, 'sponsorImages'), orderBy('order'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data().imageUrl);
};

export const fetchSponsoringVideos = async () => {
  const q = query(collection(db, 'sponsoringVideos'), orderBy('order'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data().url);
};

export const fetchSocialVideos = async () => {
  const q = query(collection(db, 'socialVideos'), orderBy('order'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data().url);
};

export const fetchTextSettings = async () => {
  const docRef = doc(db, 'settings', 'projects_page');
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : {};
};
```

## Step 3: Update Your Projects Page

Replace the hard-coded data in your Projects.tsx:

### Before (Hard-coded):
```typescript
const creativeItems = [
  { id: 'deplacements', key: 'deplacements', labelKey: 'creatives.item1' },
  // ... more items
];
```

### After (Dynamic):
```typescript
const [creativeCategories, setCreativeCategories] = useState([]);

useEffect(() => {
  const loadData = async () => {
    const categories = await fetchCreativeCategories();
    setCreativeCategories(categories);

    const videos = await fetchAllCreativeVideos();
    setCreativeVideosState(videos);
  };

  loadData();
}, []);
```

## Step 4: Update Rendering Logic

### Creative Items Mapping

Replace:
```typescript
{creativeItems.map((item) => {
  const videos = creativeVideosState[item.key] || [];
  // ...
})}
```

With:
```typescript
{creativeCategories.map((category) => {
  const videos = creativeVideosState[category.id] || [];
  // ...
})}
```

### Design Sections

Fetch design sections dynamically and render them with their items.

### Dev Themes

Fetch dev theme categories and their themes from Firestore.

## Step 5: Handle Translation Overrides

In your translation function, check for overrides:

```typescript
const [textOverrides, setTextOverrides] = useState({});

useEffect(() => {
  const loadOverrides = async () => {
    const overrides = await fetchTextSettings();
    setTextOverrides(overrides);
  };
  loadOverrides();
}, []);

const t = (key: string) => {
  const override = textOverrides[key]?.[language];
  if (override) return override;
  return originalTranslationFunction(key);
};
```

## Example: Complete Refactored useEffect

```typescript
useEffect(() => {
  const loadAllData = async () => {
    try {
      // Load creative content
      const categories = await fetchCreativeCategories();
      setCreativeCategories(categories);

      const videos = await fetchAllCreativeVideos();
      setCreativeVideosState(videos);

      // Load design content
      const designSections = await fetchDesignSections();
      setDesignSections(designSections);

      // Load dev themes
      const themeCategories = await fetchDevThemeCategories();
      setDevThemeCategories(themeCategories);

      // Load sponsoring
      const sponsors = await fetchSponsorImages();
      setSponsorImages(sponsors);

      const sponsoringVids = await fetchSponsoringVideos();
      setSponsoringVideos(sponsoringVids);

      // Load social
      const socialVids = await fetchSocialVideos();
      setSocialVideos(socialVids);

      // Load text overrides
      const overrides = await fetchTextSettings();
      setTextOverrides(overrides);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  loadAllData();
}, []);
```

## Firestore Security Rules

For public read access (website visitors can see content):

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

This allows:
- Anyone can READ content (for your public website)
- Only authenticated users can WRITE (admin panel only)

## Testing

1. Add some content via the admin panel
2. Verify it appears in Firestore Console
3. Test your Projects page to confirm dynamic loading
4. Check that videos, images, and text display correctly

## Migration Checklist

- [ ] Firebase installed in main website
- [ ] Environment variables configured
- [ ] `firebase.ts` service created
- [ ] `firestoreService.ts` helper functions created
- [ ] Projects page updated to use Firestore
- [ ] All sections loading dynamically (creatives, design, dev themes, etc.)
- [ ] Translation overrides working
- [ ] Firestore security rules configured
- [ ] Content added via admin panel
- [ ] Website tested with live data

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify Firebase config is correct
3. Check Firestore security rules
4. Ensure collections exist in Firestore
5. Test with sample data first
