import { storage } from "../services/firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";

export async function fetchVideosFromFolder(folderPath: string): Promise<string[]> {
  try {
    const folderRef = ref(storage, folderPath);
    const res = await listAll(folderRef);

    const videoUrls = await Promise.all(
      res.items.map((itemRef) => getDownloadURL(itemRef))
    );

    return videoUrls;
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
}