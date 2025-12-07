# Sample Data for Testing

Use this guide to populate your Firestore with sample data for testing.

## Method 1: Via Firebase Console

Go to Firestore Database in Firebase Console and manually add documents:

### Creative Categories

Collection: `creativeCategories`

```json
{
  "labelKey": "creatives.item1",
  "order": 1
}
```

```json
{
  "labelKey": "creatives.item2",
  "order": 2
}
```

### Creative Videos

Collection: `creativeVideos`

```json
{
  "categoryId": "CATEGORY_ID_HERE",
  "url": "https://example.com/video1.mp4",
  "title": "Sample Video",
  "description": "This is a sample video",
  "order": 1
}
```

### Design Sections

Collection: `designSections`

```json
{
  "iconType": "Brush",
  "titleKey": "design.section1.title",
  "order": 1
}
```

```json
{
  "iconType": "Layout",
  "titleKey": "design.section2.title",
  "order": 2
}
```

### Design Items

Collection: `designItems`

```json
{
  "sectionId": "SECTION_ID_HERE",
  "labelKey": "services.design.logo",
  "galleryKey": "logo",
  "order": 1
}
```

### Design Images

Collection: `designImages`

```json
{
  "galleryKey": "logo",
  "imageUrl": "https://example.com/logo1.png",
  "order": 1
}
```

### Dev Theme Categories

Collection: `devThemeCategories`

```json
{
  "titleFr": "E-commerce Fashion",
  "titleAr": "قوالب متجر الملابس",
  "order": 1
}
```

### Dev Themes

Collection: `devThemes`

```json
{
  "categoryId": "CATEGORY_ID_HERE",
  "title": "Fashion Theme 1",
  "previewUrl": "https://theme-example.vercel.app",
  "thumbnail": "https://example.com/thumbnail.png",
  "order": 1
}
```

### Sponsor Images

Collection: `sponsorImages`

```json
{
  "imageUrl": "https://example.com/sponsor1.png",
  "name": "Sponsor Name",
  "order": 1
}
```

### Sponsoring Videos

Collection: `sponsoringVideos`

```json
{
  "url": "https://example.com/video.mp4",
  "title": "Sponsoring Video",
  "order": 1
}
```

### Social Videos

Collection: `socialVideos`

```json
{
  "url": "https://example.com/social-video.mp4",
  "title": "Social Media Video",
  "order": 1
}
```

### Settings

Collection: `settings`
Document ID: `projects_page`

```json
{
  "projects.title": {
    "fr": "Nos Projets",
    "ar": "مشاريعنا"
  },
  "projects.subtitle": {
    "fr": "Découvrez notre portfolio",
    "ar": "اكتشف معرض أعمالنا"
  }
}
```

## Method 2: Using Admin Panel

The easiest way is to use the admin panel itself:

1. Login to hizoupanel
2. Navigate to each section
3. Use the "Add" buttons to create content
4. Fill in the forms with your data

## Method 3: Script-based Seeding

Create a file `seed.ts` in your hizoupanel project:

```typescript
import { collection, addDoc } from 'firebase/firestore';
import { db } from './src/services/firebase';

async function seedData() {
  try {
    // Seed Creative Categories
    const fashionCat = await addDoc(collection(db, 'creativeCategories'), {
      labelKey: 'creatives.item2',
      order: 1
    });

    // Seed Creative Videos
    await addDoc(collection(db, 'creativeVideos'), {
      categoryId: fashionCat.id,
      url: 'https://example.com/video1.mp4',
      title: 'Fashion Video 1',
      order: 1
    });

    // Seed Design Section
    const designSection = await addDoc(collection(db, 'designSections'), {
      iconType: 'Brush',
      titleKey: 'design.section1.title',
      order: 1
    });

    // Seed Design Item
    await addDoc(collection(db, 'designItems'), {
      sectionId: designSection.id,
      labelKey: 'services.design.logo',
      galleryKey: 'logo',
      order: 1
    });

    // Seed Design Images
    await addDoc(collection(db, 'designImages'), {
      galleryKey: 'logo',
      imageUrl: 'https://via.placeholder.com/300',
      order: 1
    });

    // Seed Dev Theme Category
    const themeCat = await addDoc(collection(db, 'devThemeCategories'), {
      titleFr: 'E-commerce Fashion',
      titleAr: 'قوالب متجر الملابس',
      order: 1
    });

    // Seed Dev Theme
    await addDoc(collection(db, 'devThemes'), {
      categoryId: themeCat.id,
      title: 'Fashion Theme 1',
      previewUrl: 'https://theme-hizou-1.vercel.app',
      thumbnail: 'https://via.placeholder.com/400x300',
      order: 1
    });

    // Seed Sponsor
    await addDoc(collection(db, 'sponsorImages'), {
      imageUrl: 'https://via.placeholder.com/200',
      name: 'Sponsor 1',
      order: 1
    });

    // Seed Sponsoring Video
    await addDoc(collection(db, 'sponsoringVideos'), {
      url: 'https://example.com/sponsoring-video.mp4',
      title: 'Sponsoring Video 1',
      order: 1
    });

    // Seed Social Video
    await addDoc(collection(db, 'socialVideos'), {
      url: 'https://example.com/social-video.mp4',
      title: 'Social Video 1',
      order: 1
    });

    console.log('✅ Sample data seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
}

seedData();
```

Run with: `tsx seed.ts` (after installing `tsx` package)

## Migrating Existing Data

If you want to migrate your existing hard-coded data to Firestore:

1. Copy your existing arrays from Projects.tsx
2. Use the admin panel or a script to add each item
3. Map your translation keys correctly
4. Preserve the order values
5. Test thoroughly before switching

## Recommended Order

1. Start with Creative Categories
2. Add videos to each category
3. Create Design Sections
4. Add Design Items to each section
5. Upload Design Images
6. Create Dev Theme Categories
7. Add themes to each category
8. Add Sponsoring content
9. Add Social videos
10. Configure text overrides if needed

## Validation

After adding data:

1. Check Firestore Console to verify documents exist
2. Login to admin panel and view each section
3. Test the public Projects page
4. Verify ordering is correct
5. Check that all URLs are valid and accessible
