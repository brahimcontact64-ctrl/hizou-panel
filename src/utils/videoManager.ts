// ===================================================
//  videoManager.ts — FINAL IMPROVED VERSION
// ===================================================

import { storage } from "../services/firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from "firebase/storage";

// ===================================================
// 🔥 رفع فيديو لمسار ثابت   videos/creatives/{category}/
// ===================================================
export function uploadVideo(
  category: string,
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("video/")) {
      return reject(new Error("Invalid file type: only videos allowed."));
    }

    const safeCategory = category.trim().toLowerCase();
    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "")}`;
    const videoRef = ref(storage, `videos/creatives/${safeCategory}/${fileName}`);

    const uploadTask = uploadBytesResumable(videoRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        onProgress && onProgress(progress);
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(url);
      }
    );
  });
}

// ===================================================
// 🔥 حذف فيديو من Firebase Storage باستعمال URL
// ===================================================
export async function deleteVideoByUrl(url: string): Promise<void> {
  try {
    // استخراج fullPath الصحيح
    // Example:
    // https://firebasestorage.googleapis.com/v0/b/xxx/o/videos%2Fcreatives%2Ffashion%2F1234.mp4?alt=media
    const clean = decodeURIComponent(url.split("?")[0]);
    const fullPath = clean.split("/o/")[1]; // videos/creatives/.../file.mp4

    const videoRef = ref(storage, fullPath);
    await deleteObject(videoRef);
  } catch (err) {
    console.error("Delete error:", err);
    throw err;
  }
}