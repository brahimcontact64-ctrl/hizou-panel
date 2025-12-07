import { useEffect, useState } from "react";
import {
  ref,
  listAll,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { storage } from "../services/firebase";
import { Plus, Trash2, X } from "lucide-react";

export default function Sponsoring() {
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  // 👇 لتكبير الصورة
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const folderPath = "images/sponsor";

  const loadImages = async () => {
    const folderRef = ref(storage, folderPath);
    const list = await listAll(folderRef);

    const urls = await Promise.all(list.items.map((item) => getDownloadURL(item)));
    setImages(urls);
  };

  useEffect(() => {
    loadImages();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploading(true);

    const file = e.target.files[0];
    const fileRef = ref(storage, `${folderPath}/${file.name}`);

    await uploadBytes(fileRef, file);
    await loadImages();
    setUploading(false);
  };

  const handleDelete = async (url: string) => {
    if (!confirm("Delete this image?")) return;

    const path = url.split("?")[0];
    const fullPath = decodeURIComponent(path.split("/o/")[1]); 
    const cleanPath = fullPath.replace(/%2F/g, "/");

    const fileRef = ref(storage, cleanPath);

    await deleteObject(fileRef);
    loadImages();
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Sponsor Images</h1>

        <label className="bg-primary text-white px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer">
          <Plus size={18} />
          Add Image
          <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
        </label>
      </div>

      {uploading && <p className="text-blue-600 mb-4">Uploading...</p>}

      {/* IMAGES GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((src, index) => (
          <div
            key={index}
            className="relative border rounded-2xl overflow-hidden bg-white shadow group cursor-pointer"
            onClick={() => setPreviewImage(src)} // 👈 فتح الصورة
          >
            <img
              src={src}
              alt="Sponsor"
              className="w-full h-48 object-contain bg-white transition-transform group-hover:scale-105"
            />

            {/* DELETE BUTTON */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // 👈 منع فتح الصورة عند الضغط على delete
                handleDelete(src);
              }}
              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full shadow"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <p className="text-center text-gray-500 mt-6">No images found.</p>
      )}

      {/* ============================
          IMAGE PREVIEW MODAL (ZOOM)
      ============================ */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-3xl w-full px-4" onClick={(e) => e.stopPropagation()}>
            
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 bg-white text-black p-2 rounded-full shadow"
            >
              <X size={20} />
            </button>

            <img
              src={previewImage}
              className="w-full max-h-[90vh] object-contain rounded-xl shadow-xl"
              alt="Preview"
            />
          </div>
        </div>
      )}
    </div>
  );
}