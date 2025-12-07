import { storage } from "../services/firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from "firebase/storage";

// ===================================================
// 🔥 رفع فيديو إلى مسار معين
// ===================================================
export function uploadVideo(category: string, file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileName = `${Date.now()}-${file.name}`;
    const videoRef = ref(storage, `videos/creatives/${category}/${fileName}`);

    const uploadTask = uploadBytesResumable(videoRef, file);

    uploadTask.on(
      "state_changed",
      null,
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(url);
      }
    );
  });
}

// ===================================================
// 🔥 حذف فيديو من Firebase Storage
// ===================================================
export async function deleteVideoByUrl(url: string): Promise<void> {
  try {
    const base = "https://firebasestorage.googleapis.com/v0/b/";
    const cleanUrl = url.replace(base, "");

    const [bucketAndPath] = cleanUrl.split("?");
    const [bucket, ...pathParts] = bucketAndPath.split("/");
    const fullPath = pathParts.join("/");

    const videoRef = ref(storage, fullPath);
    await deleteObject(videoRef);
  } catch (err) {
    console.error("Delete error:", err);
    throw err;
  }
}