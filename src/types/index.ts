export interface CreativeCategory {
  id: string;
  labelKey: string;
  order: number;
}

export interface CreativeVideo {
  id: string;
  categoryId: string;
  url: string;
  title?: string;
  description?: string;
  order: number;
}

export interface DesignSection {
  id: string;
  iconType: 'Brush' | 'Layout' | 'Camera';
  titleKey: string;
  order: number;
}

export interface DesignItem {
  id: string;
  sectionId: string;
  labelKey: string;
  galleryKey: string;
  order: number;
}

export interface DesignImage {
  id: string;
  galleryKey: string;
  imageUrl: string;
  order: number;
}

export interface DevThemeCategory {
  id: string;
  titleFr: string;
  titleAr: string;
  order: number;
}

export interface DevTheme {
  id: string;
  categoryId: string;
  title: string;
  previewUrl: string;
  thumbnail: string;
  order: number;
}

export interface SponsorImage {
  id: string;
  imageUrl: string;
  name?: string;
  order: number;
}

export interface SponsoringVideo {
  id: string;
  url: string;
  title?: string;
  order: number;
}

export interface SocialVideo {
  id: string;
  url: string;
  title?: string;
  order: number;
}

export interface TextSettings {
  id: string;
  key: string;
  fr?: string;
  ar?: string;
}
