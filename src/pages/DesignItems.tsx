// ============================================
//  DesignItems.tsx — FINAL FULLY EDITABLE VERSION
// ============================================

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";

import { db, storage } from "../services/firebase";
import { ArrowLeft, Trash2, Upload, Save } from "lucide-react";

// ---------------------
// Types
// ---------------------
interface DesignItem {
  id: string;
  labelKey: string;
  label: { fr: string; ar: string; en: string };
  galleryKey: string;
  order: number;
}

export default function DesignItems() {
  const { sectionId } = useParams();
  const [items, setItems] = useState<DesignItem[]>([]);
  const [imagesByItem, setImagesByItem] = useState<Record<string, string[]>>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const galleryOptions = [
    "logo",
    "brochure",
    "ads",
    "businessCard",
    "book",
    "rollup",
    "packaging",
  ];

  // --------------------------------
  // Load All Items
  // --------------------------------
  const loadItems = async () => {
    if (!sectionId) return;

    const q = query(
      collection(db, "designSections", sectionId, "items"),
      orderBy("order", "asc")
    );

    const snapshot = await getDocs(q);

    const arr: DesignItem[] = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as any),
    }));

    setItems(arr);
    loadAllImages(arr);
  };

  useEffect(() => {
    loadItems();
  }, [sectionId]);

  // --------------------------------
  // Load images for each item
  // --------------------------------
  const loadAllImages = async (itemsArr: DesignItem[]) => {
    const result: Record<string, string[]> = {};

    await Promise.all(
      itemsArr.map(async (item) => {
        const folderRef = ref(storage, `images/design/${item.galleryKey}`);

        try {
          const files = await listAll(folderRef);
          const urls = await Promise.all(files.items.map((i) => getDownloadURL(i)));

          result[item.id] = urls;
        } catch {
          result[item.id] = [];
        }
      })
    );

    setImagesByItem(result);
  };

  // --------------------------------
  // Save Edited Item
  // --------------------------------
  const saveItem = async (sectionId: string, item: DesignItem) => {
    setSavingId(item.id);

    const itemRef = doc(db, "designSections", sectionId, "items", item.id);

    await updateDoc(itemRef, {
      label: item.label,
      galleryKey: item.galleryKey,
      order: item.order,
    });

    setSavingId(null);
  };

  // --------------------------------
  // Upload Image
  // --------------------------------
  const uploadImage = async (item: DesignItem, file: File) => {
    const fileRef = ref(
      storage,
      `images/design/${item.galleryKey}/${Date.now()}_${file.name}`
    );

    await uploadBytes(fileRef, file);
    await loadItems();
  };

  // --------------------------------
  // Delete Image
  // --------------------------------
  const deleteImage = async (_item: DesignItem, imageUrl: string) => {
    const clean = decodeURIComponent(imageUrl.split("?")[0]);
    const fullPath = clean.split("/o/")[1].replace(/%2F/g, "/");

    await deleteObject(ref(storage, fullPath));
    await loadItems();
  };

  // --------------------------------
  // Render Page
  // --------------------------------
  return (
    <div className="p-6">
      <Link to="/design" className="text-orange-600 flex items-center mb-6 font-semibold">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Design Sections
      </Link>

      <h1 className="text-2xl font-bold mb-6">Items of {sectionId}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white p-5 shadow rounded-2xl">

            {/* Editable Label FR */}
            <div className="mb-4">
              <label className="font-semibold">Name (FR):</label>
              <input
                className="w-full border rounded p-2 mt-1"
                value={item.label.fr}
                onChange={(e) =>
                  setItems((prev) =>
                    prev.map((it) =>
                      it.id === item.id
                        ? { ...it, label: { ...it.label, fr: e.target.value } }
                        : it
                    )
                  )
                }
              />
            </div>

            {/* Editable Label AR */}
            <div className="mb-4">
              <label className="font-semibold">Name (AR):</label>
              <input
                className="w-full border rounded p-2 mt-1"
                value={item.label.ar}
                onChange={(e) =>
                  setItems((prev) =>
                    prev.map((it) =>
                      it.id === item.id
                        ? { ...it, label: { ...it.label, ar: e.target.value } }
                        : it
                    )
                  )
                }
              />
            </div>

            {/* Editable Label EN */}
            <div className="mb-4">
              <label className="font-semibold">Name (EN):</label>
              <input
                className="w-full border rounded p-2 mt-1"
                value={item.label.en}
                onChange={(e) =>
                  setItems((prev) =>
                    prev.map((it) =>
                      it.id === item.id
                        ? { ...it, label: { ...it.label, en: e.target.value } }
                        : it
                    )
                  )
                }
              />
            </div>

            {/* Gallery Key */}
            <div className="mb-4">
              <label className="font-semibold">Gallery Key:</label>
              <select
                className="w-full border rounded p-2 mt-1"
                value={item.galleryKey}
                onChange={(e) =>
                  setItems((prev) =>
                    prev.map((it) =>
                      it.id === item.id ? { ...it, galleryKey: e.target.value } : it
                    )
                  )
                }
              >
                {galleryOptions.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Order */}
            <div className="mb-4">
              <label className="font-semibold">Order:</label>
              <input
                type="number"
                className="w-full border rounded p-2 mt-1"
                value={item.order}
                onChange={(e) =>
                  setItems((prev) =>
                    prev.map((it) =>
                      it.id === item.id
                        ? { ...it, order: Number(e.target.value) }
                        : it
                    )
                  )
                }
              />
            </div>

            {/* Save Button */}
            <button
              onClick={() => saveItem(sectionId!, item)}
              className="w-full bg-orange-600 text-white py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-700"
            >
              <Save className="w-4 h-4" />
              {savingId === item.id ? "Saving…" : "Save Changes"}
            </button>

            {/* Images Grid */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              {imagesByItem[item.id]?.map((src, i) => (
                <div className="relative group" key={i}>
                  <img
                    src={src}
                    className="w-full h-24 object-cover rounded cursor-pointer"
                    onClick={() => setPreviewImage(src)}
                  />

                  <button
                    onClick={() => deleteImage(item, src)}
                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Upload Image */}
            <label className="block cursor-pointer mt-4 bg-gray-100 hover:bg-gray-200 border rounded-xl py-3 text-center">
              <Upload className="inline w-4 h-4 mr-2" /> Upload Image
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) uploadImage(item, e.target.files[0]);
                }}
              />
            </label>
          </div>
        ))}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            className="max-w-[90%] max-h-[90%] rounded-xl shadow-xl"
          />
        </div>
      )}
    </div>
  );
}